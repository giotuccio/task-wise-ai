import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { TaskwiseAIService } from '../services/task-wise-ai.service';
import { Priority } from '../objects/priority.model';
import { Status } from '../objects/status.model';
import { Task } from '../objects/task.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Campaign } from '../objects/campaign.model';
import { CampaignServiceService } from '../services/campaign-service.service';
@Component({
  selector: 'app-create-taskwise-campaign',
  templateUrl: './create-taskwise-campaign.component.html',
  styleUrls: ['./create-taskwise-campaign.component.css']
})
export class CreateTaskwiseCampaignComponent {
  responseFromAI: string = "";
aiImageUrl: string = ""
  newCampaign!: Campaign;
  imageData: string | null = null;
  selectedImage: File | null = null;
  isWaiting = false;
  imageQuantity:number = 0
  constructor(private taskwiseAIService: TaskwiseAIService, private campaignService: CampaignServiceService, @Inject(MAT_DIALOG_DATA) public task: Task,
    private dialogRef: MatDialogRef<CreateTaskwiseCampaignComponent>) { }

 sendImageGeneratorMessage(prompt: string): void {
  this.isWaiting = true;
  this.taskwiseAIService.generateImage(prompt).subscribe(data => {
    this.isWaiting = false;
    this.imageData =  data.data[0].url;// Adjust based on actual API response
  });
}

    

  sendMessageToAI(prompt: string): void {
    this.isWaiting = true;
this.imageQuantity = this.imageQuantity;
    this.taskwiseAIService.sendCampaignMessage(prompt, this.imageQuantity ).subscribe(response => {
      if(response)
        this.isWaiting = false;
      this.responseFromAI = response.choices[0].message.content; // Extracting the task details from the response

      // Logging the response content
      console.log('Response from AI:', this.responseFromAI);

      // Preprocessing the response to remove square brackets from the description
      const preprocessedResponse = this.responseFromAI.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

      // Parsing the task details from the preprocessed response
      try {
        const taskDetails = JSON.parse(preprocessedResponse);

        // Creating the new task object
        this.newCampaign = {
          name: taskDetails.name,
          description: taskDetails.description,
          startDate: taskDetails.startDate,
          endDate: taskDetails.endDate,
          isActive: taskDetails.isActive == 'true' ? true : false,
          campaignImage: this.imageData ?? ''
        };

        // Adding the new task
        this.campaignService.addCampaign(this.newCampaign).subscribe((response) => {
          return response
        })
      } catch (error) {
        console.error('Error parsing response:', error);
      }
    });
  }

  handleCampaignAndImage(prompt: string): void {
    this.isWaiting = true;
  
    this.taskwiseAIService.sendCampaignMessage(prompt, this.imageQuantity).subscribe(response => {
      // Assuming 'url' is directly available in the response. Adjust according to actual API response structure.
      this.responseFromAI = response.choices[0].message.content; // Extracting the task details from the response
      const taskDetails = JSON.parse(this.responseFromAI);

  
      this.taskwiseAIService.generateImage(`${this.imageQuantity}. Generate an image from the following: ${taskDetails.description}. IF user mentions an amount of campaign images from ${prompt}, populate that amount in property imageQuantity ${this.imageQuantity}. if its over your limit then produce only 10. Display text over image if asked from ${prompt}. `).subscribe(data => {
        this.isWaiting = false;
        this.imageData =  data.data[0].url;// Adjust based on actual API response
  
        // Example to process your text response and link it with the image
   

        this.newCampaign = {
          name: taskDetails.name,
          description: taskDetails.description,
          startDate: taskDetails.startDate,
          endDate: taskDetails.endDate,
          isActive: taskDetails.isActive == 'true' ? true : false,
          campaignImage: this.imageData ?? ''
        };
  
        // Example function to process and save the combined data
        this.saveCampaignDetails(this.newCampaign);
      }, error => {
        this.isWaiting = false;
        console.error('Error in text generation:', error);
      });
    }, error => {
      this.isWaiting = false;
      console.error('Error in image generation:', error);
    });
  }
  
  onImageSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList && fileList.length > 0) {
      const file = fileList[0];
      if (file.type !== 'image/png') {
        alert('Please upload a valid PNG file.');
        return;
      }
  
      if (file.size > 4000000) { // 4MB in bytes
        alert('File size must be less than 4MB.');
        return;
      }
  
      const img = new Image();
      img.src = window.URL.createObjectURL(file);
      img.onload = () => {
        if (img.width === img.height) {
          this.selectedImage = file; // File is already a square
        } else {
          // Resize the image to be square
          this.resizeImageToSquare(img, (resizedBlob: any) => {
            if (resizedBlob) {
              this.selectedImage = new File([resizedBlob], 'resized-image.png', { type: 'image/png' });
            } else {
              alert('Failed to resize the image.');
            }
          });
        }
      };
    }
  }
  resizeImageToSquare(img: HTMLImageElement, callback: (resizedBlob: Blob | null) => void): void {
    const canvas = document.createElement('canvas');
    const size = Math.max(img.width, img.height);
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
  
    if (ctx) {
      // Calculate the center position to draw the image
      const dx = (size - img.width) / 2;
      const dy = (size - img.height) / 2;
      
      ctx.drawImage(img, dx, dy);
      canvas.toBlob(blob => {
        callback(blob);  // Ensures blob is either Blob or null
      }, 'image/png');
    } else {
      callback(null);  // Handle the case where canvas context is not available
    }
  }
  
  

  uploadAndEditImage(prompt: string): void {
    this.isWaiting = true;
    if (this.selectedImage) {
      console.log('Sending image with prompt:', prompt);  // Debug: Log the prompt
  
      this.taskwiseAIService.editImage(prompt, this.selectedImage).subscribe(
        response => {
          console.log('API Response:', response);  // Debug: Log full response
  
          if (response && response.data && response.data.length > 0) {
            this.imageData = response.data[0].url;
            this.newCampaign = {
              name: 'New Campaign',
              description: 'Generated with new image',
              startDate: '2024-01-01',
              endDate: '2024-12-31',
              isActive: true,
              campaignImage: this.imageData || ''
            };
  
            console.log('New Campaign:', this.newCampaign);  // Debug: Log the new campaign object
            this.isWaiting = false;
          } else {
            console.error('No data returned or incorrect response structure:', response);
            this.isWaiting = false;
          }
        },
        error => {
          console.error('Error editing image:', error);
          this.isWaiting = false;
        }
      );
    }
  }
  
  private saveCampaignDetails(details: any) {
    // Logic to save or use the campaign details
    this.campaignService.addCampaign(this.newCampaign).subscribe((response) => {
      return response
    })
  }


  regenerateResponse(): void {
    // Clear the current response and send a new prompt to the AI
    this.responseFromAI = "";
    
    // Provide more specific details about the task in the prompt
    const prompt = '{"message": "create a new task with the following details changed: title, description, due date, priority, assigned to, assigned by, and project."}';
    
    this.handleCampaignAndImage(prompt);
  }
  
  
  closeDialog(): void {
    // Close the dialog and pass the updated task back to the parent component
    if(this.newCampaign){
      this.campaignService.addCampaign(this.newCampaign).subscribe((response) => {
        return response
      })
    this.dialogRef.close(this.newCampaign);

    }
  }
}
