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
  isWaiting = false;
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


    this.taskwiseAIService.sendCampaignMessage(prompt).subscribe(response => {
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
        this.campaignService.addCampaign(this.newCampaign);
      } catch (error) {
        console.error('Error parsing response:', error);
      }
    });
  }

  handleCampaignAndImage(prompt: string): void {
    this.isWaiting = true;
  
    this.taskwiseAIService.sendCampaignMessage(prompt).subscribe(response => {
      // Assuming 'url' is directly available in the response. Adjust according to actual API response structure.
      this.responseFromAI = response.choices[0].message.content; // Extracting the task details from the response
      const taskDetails = JSON.parse(this.responseFromAI);

  
      this.taskwiseAIService.generateImage(`Generate a campaign for the following image: ${taskDetails.description}`).subscribe(data => {
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
  
  private saveCampaignDetails(details: any) {
    // Logic to save or use the campaign details
    this.campaignService.addCampaign(this.newCampaign);
  }


  regenerateResponse(): void {
    // Clear the current response and send a new prompt to the AI
    this.responseFromAI = "";
    
    // Provide more specific details about the task in the prompt
    const prompt = '{"message": "create a new task with the following details changed: title, description, due date, priority, assigned to, assigned by, and project."}';
    
    this.sendMessageToAI(prompt);
  }
  
  
  closeDialog(): void {
    // Close the dialog and pass the updated task back to the parent component
    this.dialogRef.close(this.newCampaign);
  }
}
