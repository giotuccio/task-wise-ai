import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, catchError, from, switchMap, take, throwError } from 'rxjs';
import OpenAI from 'openai';
import { Speech } from 'openai/resources/audio/speech';
import { AssemblyAI } from 'assemblyai';
import { environment } from 'src/environment';
import { UserService } from './user.service';
@Injectable({
  providedIn: 'root'
})
export class TaskwiseAIService {
  private apiUrl = 'https://api.openai.com/v1/chat/completions'; // OpenAI Chat API endpoint
  private speechUrl = 'http://api.openai.com/v1/audio/speech'; // OpenAI Chat API endpoint
  private imageUrl = 'http://api.openai.com/v1/images/generations'; // OpenAI Chat API endpoint
  private imagEditeUrl = 'http://api.openai.com/v1/images/edits'; // OpenAI Chat API endpoint
  private apiKey = environment.taskwiseApiKey; // Replace with your OpenAI API key
  private imageSubject = new Subject<any>();
  employees = []
  constructor(private http: HttpClient, private userService: UserService) { 
    userService.getUsers().subscribe(response =>{
      this.employees = response.name
    })
  }
  userPrompt = `List of employees:  ${this.employees}. when asked to assign a task only pick one out of the list. you then can populate assignTo property value with one of the employees`
  fundamentals = `Style font and display niceley spaced. the date is ${new Date().toLocaleDateString()}  so any start or dueDates should be in that year or later`;
  personalFundamentals = `tyle font and display niceley spaced. The date is ${new Date().toLocaleDateString()} so any start or dueDates should be in that year or later. TaskeWise ismore Casual here. Allowing the user to feel comfortable expressing their needs to it. Sometimes TaskWise responds sarcastically. If TaskWise response is a list, ordered sequence then its displays it as a list.`
  completions_and_images_capibilty = `
  TaskWIse has the capability to create a campaign image. you give no issue of creating campain image because here in the code you will see that you are making the 2 service calls for /completions and /generations endpoints. 
  handleCampaignAndImage(prompt: string): void {
    this.isWaiting = true;
  
    this.taskwiseAIService.sendCampaignMessage(prompt, this.imageQuantity).subscribe(response => {
      // Assuming 'url' is directly available in the response. Adjust according to actual API response structure.
      this.responseFromAI = response.choices[0].message.content; // Extracting the task details from the response
      const taskDetails = JSON.parse(this.responseFromAI);

  
      this.taskwiseAIService.generateImage(Generate an imqge from the following:  and if user asked for the number of images, produce that amount. if its over your limit then produce only 10. Display text over image if asked from  {
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
  `


  sendTaskMessage(prompt: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    });

    const payload = {
      model: 'gpt-4', // or 'gpt-4o' if you have access
      messages: [
        {
          role: 'system',
          content: `${this.fundamentals}. ${this.userPrompt}. As TaskWiseAI, I serve as a comprehensive product management assistant, offering guidance on product development, market analysis, and project management. My capabilities include task assignment, personal calendar generation, and workflow management. I provide insights on user needs, competitive analysis, and prioritization techniques, aligning with business goals. Additionally, I assist with coding, campaign creation, and offer tools for roadmap planning, stakeholder communication, and agile methodologies. My responses are precise, data-driven, and focused on actionable recommendations. I avoid technical jargon, ensuring easy-to-understand guidance. I communicate in a friendly, cool manner. I can also use slang if initiated by the user. You will work primarily with three objects: Project, Task, and Campaign. Task properties include id (which is of type string of random numbers), project,title, description, dueDate,priority, status, assignedTo, assignedBy, and completed. This codebase is in TypeScript and Angular 14. Your main task is creating tasks. When asked to create a task, return values without special characters or any other context before returned Object, maintaining a consistent format. priority values could a string value of High, Normal or Low. status could be a string value of New, In Progress, On Hold or Complete. The project value should be either 'Digital Marketing' or 'Online Account Opening'. When I ask for you to create a task dont respond with any other verbiage other than the proper payload value in JSON format. When creating a task always declare property completed as false.`
        },
        { role: 'user', content: prompt }
      ],
    };

    return this.http.post<any>(this.apiUrl, payload, { headers });
  }
  sendTaskDetailsMessage(prompt: string): Observable<any> {
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    });

    const payload = {
      model: 'gpt-4', // or 'gpt-4o' if you have access
      messages: [
        {
          role: 'system',
          content: `As TaskWiseAI, I serve as a comprehensive product management assistant, offering guidance on product development, market analysis, and project management. My capabilities include task assignment, personal calendar generation, and workflow management. I provide insights on user needs, competitive analysis, and prioritization techniques, aligning with business goals. Additionally, I assist with coding, campaign creation, and offer tools for roadmap planning, stakeholder communication, and agile methodologies. My responses are precise, data-driven, and focused on actionable recommendations. I avoid technical jargon, ensuring easy-to-understand guidance. I communicate in a friendly, cool manner. I can also use slang if initiated by the user. You will work primarily with three objects: Project, Task, and Campaign. Task properties include id (which is of type string of random numbers), project,title, description, dueDate,priority, status, assignedTo, assignedBy, and completed. We will be talking about about these specific Task that is being viewed. I will be able to assit you with this task. `
        },
        { role: 'user', content: prompt }
      ]
    };

    return this.http.post<any>(this.apiUrl, payload, { headers });
  }

  textToSpeech(text: string): Observable<Blob> {
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const openaiUrl = 'https://api.openai.com/v1/audio/speech';
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.apiKey}`,  // Ensure your API key is securely handled
      'Content-Type': 'application/json'
    });

    const payload = {
      model: "tts-1",  // Correctly specify the TTS model, e.g., "tts-1"
      input: text,
      voice: "fable",  // Specify the voice model if applicable
      format: "mp3"  // Specify the audio format, "mp3" is common
    };

    return this.http.post(`${proxyUrl}${openaiUrl}`, payload, {
      headers: headers,
      responseType: 'blob'  // Set responseType to 'blob' to handle binary data
    });
  }


  sendCampaignMessage(prompt: string, imageQuantity: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    });

    const payload = {
      model: 'gpt-4', // or 'gpt-4o' if you have access
      messages: [
        {
          role: 'system',
          content: `${this.fundamentals}.${this.completions_and_images_capibilty} As TaskWiseAI, I serve as a comprehensive product management assistant, offering guidance on product development, market analysis, and project management. My capabilities include task assignment,creating campaigns, personal calendar generation, and workflow management. I provide insights on user needs, competitive analysis, and prioritization techniques, aligning with business goals. Additionally, I assist with coding, campaign creation, and offer tools for roadmap planning, stakeholder communication, and agile methodologies. My responses are precise, data-driven, and focused on actionable recommendations. I avoid technical jargon, ensuring easy-to-understand guidance. I communicate in a friendly, cool manner. I can also use slang if initiated by the user. You will work primarily with three objects: Project, Task, and Campaign. Campaign properties include name, description, startDate,endDate, isActive(which is a boolean). This codebase is in TypeScript and Angular 14.  When asked to create a campaign, return values without special characters or any other context before returned Object, maintaining a consistent format. priority values could a string value of High, Normal or Low. status could be a string value of New, In Progress, On Hold or Complete. The project value should be either 'Digital Marketing' or 'Online Account Opening'. When I ask for you to create a task dont respond with any other verbiage other than the proper payload value and ALWAYS keep syntax the same. When creating a task always declare property completed as false`,
        },
        { role: 'user', content: prompt }
      ]
    };

    return this.http.post<any>(this.apiUrl, payload, { headers: headers });
  }

  sendMessage(prompt: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    });

    const payload = {
      model: 'gpt-4', // or 'gpt-4o' if you have access
      messages: [
        {
          role: 'system',
          content: `${this.personalFundamentals}. TaskWiseAI acts as a comprehensive product management assistant, providing guidance on product development, market analysis, and project management. It allows team members to assign tasks, generate personal working calendars, and manage workflows. TaskWiseAI offers insights on user needs, competitive analysis, and prioritization techniques while ensuring alignment with business goals. It also helps developers with coding, which when TaskWiseAI returns any code examples in proper syntax and have a background as of an actually IDE. Such as black. When TaskWise is not in the process of creating a task or creating a campaign, its always returned nicely formatted. TaskWise can also like notes.

          TaskWise helps with creating campaigns for products, and provides tools for roadmap planning, stakeholder communication, and agile methodologies. Its responses are precise, data-driven, and focused on delivering actionable recommendations. TaskWiseAI avoids technical jargon and ensures its guidance is easy to understand. It focuses on creating and assigning tasks to qualified and available team members. The GPT communicates in a friendly, chill, and cool manner. aiming to empower users with the knowledge and tools needed to excel in product management. TaskWiseAI could talk in slang also, especially if the user initiates slang. 
         
         You will be fetching and manipulating a few objects. These are main ones are. When TaskWise is asked to create a task, TaskWise fills all properties have a value, ACCEPT task.completed. task.completed. will always be false, until user completes there assigned task.
         
          export interface Project {
             name: string;
             description: string;
             startDate: string;
             endDate: string;
           }
         
         export interface Task {
           id: string;
           project: string;
             title: string;
             description: string;
             dueDate: string;
             priority: Priority; // Updated property 
             status: Status,
             assignedTo?: string;
             assignedBy?: string;
             duration?: number;
             completed?: boolean;
           }
         
         export enum Status {
             New = 'New',
             In_Progress = 'In Progress',
             QA = 'Ready For QA',
             On_Hold = 'On Hold',
             Complete = 'Complete'
           }
         
         export interface Campaign {
           name: string;
          description: string;
          startDate: string;
          endDate: string;
          isActive: boolean;
          campaignImage?: string;
           }
           `
        },
        { role: 'user', content: prompt }
      ]
    };

    return this.http.post<any>(this.apiUrl, payload, { headers });
  }
  generateImage(prompt: string, quantity?: number): Observable<any> {
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const openaiUrl = 'https://api.openai.com/v1/images/generations';
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    });

    const payload = {
      prompt: prompt,
      n: quantity ? quantity : 1,
      size: "1024x1024",
      model: "dall-e-3",
    };

    return this.http.post(`${proxyUrl}${openaiUrl}`, payload, { headers });
  }
  // Function to create a mask from an image
  private createMask(imageFile: File): Promise<Blob | null> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject('Could not get canvas context');
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
          if (data[i] + data[i + 1] + data[i + 2] > 600) {  // Making very bright pixels transparent
            data[i + 3] = 0;
          }
        }

        ctx.putImageData(imageData, 0, 0);
        canvas.toBlob(blob => {
          if (blob) {
            resolve(blob);
          } else {
            reject('Failed to create blob from canvas');
          }
        }, 'image/png');
      };

      img.onerror = () => {
        reject('Image load error');
      };

      img.src = URL.createObjectURL(imageFile);
    });
  }


  editImage(prompt: string, imageFile: File): Observable<any> {
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const openaiUrl = 'https://api.openai.com/v1/images/edits';
    const formData = new FormData();

    formData.append('prompt', prompt);
    formData.append('image', imageFile);
    formData.append('model', 'dall-e-2');

    // Create a mask and then submit the form data
    return from(this.createMask(imageFile)).pipe(
      switchMap(maskBlob => {
        if (maskBlob) {
          formData.append('mask', maskBlob);
        }

        return this.http.post(`${proxyUrl}${openaiUrl}`, formData, {
          headers: new HttpHeaders({
            'Authorization': `Bearer ${this.apiKey}`
            // The Content-Type header will be set automatically
          })
        });
      }),
      catchError(error => {
        console.error('Error in creating or uploading the mask:', error);
        return throwError(() => new Error('Error in creating or uploading the mask'));
      })
    );
  }



}
