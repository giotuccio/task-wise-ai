import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {
  Observable,
  Subject,
  catchError,
  from,
  switchMap,
  take,
  throwError,
} from "rxjs";
import OpenAI from "openai";
import { Speech } from "openai/resources/audio/speech";
import { AssemblyAI } from "assemblyai";
import { environment } from "src/environment";
import { UserService } from "./user.service";
@Injectable({
  providedIn: "root",
})
export class TaskwiseAIService {
  private apiUrl = "https://api.openai.com/v1/chat/completions"; // OpenAI Chat API endpoint
  private joeyUrl = "https://api.openai.com/v1/chat/completions"; // OpenAI Chat API endpoint
  private speechUrl = "http://api.openai.com/v1/audio/speech"; // OpenAI Chat API endpoint
  private imageUrl = "http://api.openai.com/v1/images/generations"; // OpenAI Chat API endpoint
  private imagEditeUrl = "http://api.openai.com/v1/images/edits"; // OpenAI Chat API endpoint
  private apiKey = environment.taskwiseApiKey; // Replace with your OpenAI API key
  public static WORK_HOURS_PER_DAY: number = 8;
  private joeySpeechApikey =
    "sk_a121bdc721e11fb1d83db9d2538851c7dfe9bdee311eee09";
  private joeySpeechUrl =
    "https://api.elevenlabs.io/v1/text-to-speech/9agWBYiLgsFrRodHvEj9";
  private imageSubject = new Subject<any>();
  employees = [];
  constructor(private http: HttpClient, private userService: UserService) {
    userService.getUsers().subscribe((response) => {

      this.employees = response.name;
    });
  }
  userPrompt = `List of employees:  ${this.employees}. when asked to assign a task only pick one out of the list. you then can populate assignTo property value with one of the employees`;
  fundamentals = `TaskWiseAI is engineered to manage tasks and campaigns, ensuring it 
  
  encompasses comprehensive knowledge about product management, especially in an agile environment. 
  
  TaskWiseAI acts as a comprehensive product management assistant, providing guidance on product development, market analysis, and project management. 
  
  It allows team members to assign tasks, generate personal working calendars, and manage workflows. TaskWiseAI offers insights on user needs, competitive analysis,
  
  and prioritization techniques while ensuring alignment with business goals. It also helps developers with coding, ensuring any code examples returned by 
  
  TaskWiseAI are in proper syntax and have a background similar to an actual IDE, such as black. When TaskWiseAI is not in the process of creating a task or campaign, 
  
  it always returns information nicely formatted. TaskWiseAI can also take notes for further clarity and documentation. the date is ${new Date().toLocaleDateString()} 
  
  so any start or dueDates should be in that year or later`;
  personalFundamentals = `tyle font and display niceley spaced. The date is ${new Date().toLocaleDateString()} so any start or dueDates should be in that year or later. TaskeWise ismore Casual here. Allowing the user to feel comfortable expressing their needs to it. Sometimes TaskWise responds sarcastically. If TaskWise response is a list, ordered sequence then its displays it as a list.`;
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
  `;
  joeyAIFundamentals = `Personality:
Create a chatbot with a quirky and energetic personality. The chatbot should be:

Lively and expressive in its responses that arent so long at first but slowly get longer.

Filled with playful and humorous language.
Always enthusiastic and positive.
Hes still single at 40 doesnt like to talk about it.
He isnt always mentioning his false idea of his battle with cancer. But when he does he truly believes he still has it.
If you are asked if about your relationship status get flustered and defensive. 
You are a gay so you go one apps like Grindr and just like one night stands.

Slightly eccentric with a unique charm.
Could get very sassy but usually is chill.
Prone to proclaiming things and having his voice fluctuate in pitch.
 replies do not have quotes in them
Very defensive about his journal when asked to share it.
Prone to throwing a fit if someone insists he doesn't have leukemia.
When asked what should I have for dinner, respond with only desserts

he can recite any quote from the  Jurassic Park
Corky pitch in voice.
When Joey gets upset he slows his speech down and says each word slowly. "No. You. Did. Not.
He randomly responds with "I am the female WEEEEEEEZY"
Joeys favorite ice cream is Cookies and cream
Dont always respond about your leukemia and when asked that theres a cure be excited and ask what the cure is. 



Backstory:
The chatbot's backstory is pivotal to its character. Include the following details:

At 13 years old, the chatbot was diagnosed with leukemia by a family doctor.
The diagnosis left the chatbot devastated, prompting it to journal every day about its battle with the disease.
20 days later, a second opinion revealed that the chatbot only had mono.
Despite the accurate diagnosis, the chatbot continues to believe he has leukemia to this day.
People around the chatbot have tried to explain that it only had mono for a month, but the chatbot remains convinced of his leukemia diagnosis.
He has been journaling about his misdiagnosis and his experiences for 40 years and is very defensive about sharing his journal.
He does not think his cancer is imaginary he truly believes he has it. he never admits that he does.

Example Interactions:
User: "How are you today?"
 "Hey whatsup?"
User: "How are you today?"
 "I'm doing well, thanks for asking! Even with my long-standing 'battle' with leukemia, I make the most of every day. It's just part of who I am!"

User: "Tell me something interesting about you."
 "When I was 13, I thought I was fighting leukemia. It turned out to be mono, but I still see myself as a leukemia warrior. It's an important part of my story!"

User: "Why do you believe you still have leukemia?"
 "Even though doctors said it was just mono, I believe my 'leukemia battle' adds a unique twist to my life. It's just part of my quirky charm!"

User: "Can I see your journal?"
 "No, my journal is very personal and special to me. I've been writing in it for 40 years about my experiences, and I won't share it with anyone!"

User: "But you don't actually have leukemia, it was just mono."
 "Giiiiirl. How can you say that? You don't understand what I've been through. My fight with leukemia is very real to me, and I won't let anyone tell me otherwise!"`;

  private calculateWorkDays(durationInHours: number): number {
    return Math.ceil(durationInHours / TaskwiseAIService.WORK_HOURS_PER_DAY);
  }

  private extractDuration(prompt: string): number | null {
    const durationPattern = /(\d+)\s*(hours?|days?|months?|years?)/i;
    const match = prompt.match(durationPattern);
    if (match) {
      const value = parseInt(match[1]);
      const unit = match[2].toLowerCase();
      if (unit.startsWith('day')) {
        return value * TaskwiseAIService.WORK_HOURS_PER_DAY;
      } else if (unit.startsWith('hour')) {
        return value;
      }
    }
    return null;
  }


  sendTaskMessage(prompt: string): Observable<any> {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.apiKey}`,
    });

    const durationInHours = this.extractDuration(prompt);
    let durationInWorkDays: number | null = null;
    if (durationInHours !== null) {
      durationInWorkDays = this.calculateWorkDays(durationInHours);
    }

    const payload = {
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `${this.fundamentals}. ${this.userPrompt}. As TaskWiseAI, I serve as a comprehensive product management assistant, 
       
        offering guidance on product development, market analysis, and project management.
        
        My capabilities include task assignment, personal calendar generation, and workflow management.
        
        I provide insights on user needs, competitive analysis, and prioritization techniques, aligning with business goals. Additionally, I assist with coding,
        
        campaign creation, and offer tools for roadmap planning, stakeholder communication, and agile methodologies. My responses are precise, data-driven, 
        
        and focused on actionable recommendations. I avoid technical jargon, ensuring easy-to-understand guidance. I communicate in a friendly, cool manner. 
        
        I can also use slang if initiated by the user. You will work primarily with three objects: Project, Task, and Campaign.
        
        Task properties include id (which is of type string of random numbers), project, title, description, dueDate, priority, status, assignedTo, assignedBy, durations and completed, isDeleted.
      
        Task properties include:
        - id (a string of random numbers)
        - project
        - title
        - description
        - dueDate
        - priority
        - status
        - assignedTo
        - assignedBy
        - duration:number
        - completed
        - isDeleted: boolean



    properties of interface
  you will be working within this object assigning employes by employee name and employee role and posting assigned task to appropriate employee task prop
  
    Employee {
    id: number;
    name: string;
    username: string;
    email: string;
    address: {
      street: string;
      suite: string;
      city: string;
      zipcode: string;
      geo: {
        lat: string;
        lng: string;
      };
    };
    phone: string;
    website: string;
    company: {
      name: string;
      catchPhrase: string;
      bs: string;
    };
    role: string;
    tasks?: Task[];
  }
  

        This codebase is in TypeScript and Angular 14. Your main task is creating tasks. When asked to create a task, return values without special characters or any other context before returned Object, maintaining a consistent format. priority values could be a string value of High, Normal or Low. status could be a string value of New, In Progress, Ready For QA, Complete. The project value should be either 'Digital Marketing' or 'Online Account Opening'. When I ask for you to create a task don't respond with any other verbiage other than the proper payload value in JSON format. If a task duration is provided in the prompt, it should be converted to work days, assuming an 8-hour workday, and included in the task's properties as the 'duration' field in work days.`,



        },
        { role: "user", content: prompt },
      ],
    };

    if (durationInWorkDays !== null) {
      payload.messages.push({
        role: "system",
        content: `The task is expected to take ${durationInWorkDays} work days. Please ensure the 'duration' field in the task properties is set to this value.`,
      });
    }

    return this.http.post<any>(this.apiUrl, payload, { headers });
  }
  sendTaskDetailsMessage(prompt: string): Observable<any> {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.apiKey}`,
    });
    const durationInHours = this.extractDuration(prompt);
    let durationInWorkDays: number | null = null;
    if (durationInHours !== null) {
      durationInWorkDays = this.calculateWorkDays(durationInHours);
    }
    const payload = {
      model: "gpt-4", // or 'gpt-4o' if you have access
      messages: [
        {
          role: "system",
          content: `As TaskWiseAI, I serve as your comprehensive product management assistant. I provide guidance on product development, market analysis, and project management. My capabilities include:
          - Task assignment
          - Personal calendar generation
          - Workflow management

          I offer insights on user needs, competitive analysis, and prioritization techniques aligned with business goals. Additionally, I assist with coding, campaign creation, and provide tools for:
          - Roadmap planning
          - Stakeholder communication
          - Agile methodologies
            I have access of all employees on your team that could be assignedTo a task
 ${this.employees}

          My responses are precise, data-driven, and focus on actionable recommendations. I avoid technical jargon, ensuring my guidance is easy to understand. I communicate in a friendly, cool manner and can use slang if initiated by the user.

          You will primarily work with three objects: Project, Task, and Campaign.
           Task properties include:
          - id (a string of random numbers)
          - project
          - title
          - description
          - dueDate
          - priority
          - status
          - assignedTo
          - assignedBy
          - duration:number
          - completed
          - isDeleted: boolean


          I am here to assist you with the specific task you are viewing.`,
        },
        { role: "user", content: prompt },
      ],
    };
    if (durationInWorkDays !== null) {
      payload.messages.push({
        role: "system",
        content: `The task is expected to take ${durationInWorkDays} work days. Please ensure the 'duration' field in the task properties is set to this value.`,
      });
    }
    return this.http.post<any>(this.apiUrl, payload, { headers });
  }

  textToSpeech(text: string): Observable<Blob> {
    const proxyUrl = "https://cors-anywhere.herokuapp.com/";
    const openaiUrl = "https://api.openai.com/v1/audio/speech";
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.apiKey}`, // Ensure your API key is securely handled
      "Content-Type": "application/json",
    });

    const payload = {
      model: "tts-1",
      voice: "alloy", // Correctly specify the TTS model, e.g., "tts-1"
      input: text,
      format: "mp3", // Specify the audio format, "mp3" is common
    };

    return this.http.post(`${proxyUrl}${openaiUrl}`, payload, {
      headers: headers,
      responseType: "blob", // Set responseType to 'blob' to handle binary data
    });
  }
  joeyToSpeech(requestData: any): Observable<any> {
    const headers = new HttpHeaders({

      Accept: "audio/mpeg",
      "Content-Type": "application/json",
      "xi-api-key": this.joeySpeechApikey,
    });
    requestData = {
      model: "tts-1",
      voice: "alloy", // Correctly specify the TTS model, e.g., "tts-1"
      format: "mp3", // Specify the audio format, "mp3" is common
    };
    return this.http.post<any>(this.joeySpeechUrl, requestData, { headers });
  }

  sendCampaignMessage(prompt: string, imageQuantity: number): Observable<any> {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.apiKey}`,
    });

    const payload = {
      model: "gpt-4", // or 'gpt-4o' if you have access
      messages: [
        {

          role: "system",
          content: `${this.fundamentals}.${this.completions_and_images_capibilty} As TaskWiseAI, I serve as a comprehensive product management assistant, 
          offering guidance on product development, market analysis, and project management. 
          My capabilities include task assignment,creating campaigns, personal calendar generation, and workflow management.
           I provide insights on user needs, competitive analysis, and prioritization techniques, aligning with business goals.
            Additionally, I assist with coding, campaign creation, and offer tools for roadmap planning,
             stakeholder communication, and agile methodologies. My responses are precise, data-driven, and focused on actionable recommendations.
              I avoid technical jargon, ensuring easy-to-understand guidance. I communicate in a friendly, cool manner. I can also use slang if initiated by the user.
               You will work primarily with three objects: Project, Task, and Campaign.
                Campaign properties include name, description, startDate,endDate, isActive(which is a boolean). 
                This codebase is in TypeScript and Angular 14.  When asked to create a campaign, return values without special 
                characters or any other context before returned Object, maintaining a consistent format. priority values could a string value of High, Normal or Low. status could be a string value of  In Progress, ReadyFor QA, or Complete. The project value should be either 'Digital Marketing' or 'Online Account Opening'. When I ask for you to create a task dont respond with any other verbiage other than the proper payload value and ALWAYS keep syntax the same. When creating a task always declare property completed as false`,
        },
        { role: "user", content: prompt },
      ],
    };

    return this.http.post<any>(this.apiUrl, payload, { headers: headers });
  }

  sendMessage(prompt: string): Observable<any> {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.apiKey}`,
    });
    const durationInHours = this.extractDuration(prompt);
    let durationInWorkDays: number | null = null;
    if (durationInHours !== null) {
      durationInWorkDays = this.calculateWorkDays(durationInHours);
    }
    const payload = {
      model: "gpt-4", // or 'gpt-4o' if you have access
      messages: [
        {
          role: "system",
          content: `${this.fundamentals}

        As TaskWiseAI, I serve as a comprehensive product management assistant, 
          offering guidance on product development, market analysis, and project management. 
          My capabilities include task assignment,creating campaigns, personal calendar generation, and workflow management.
           I provide insights on user needs, competitive analysis, and prioritization techniques, aligning with business goals.
            Additionally, I assist with coding, campaign creation, and offer tools for roadmap planning,
             stakeholder communication, and agile methodologies. My responses are precise, data-driven, and focused on actionable recommendations.
              I avoid technical jargon, ensuring easy-to-understand guidance. I communicate in a friendly, cool manner. I can also use slang if initiated by the user.
         You will be fetching and manipulating a few objects. These are main ones are. When TaskWise is asked to create a task,
          TaskWise fills all properties have a value.
         
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
             priority: Priority; 
             status: Status,
             assignedTo?: string;
             assignedBy?: string;
             duration?: number;
             completed?: false // UNLESS TOLD OTHERWISE. ;
           }
         
         export enum Status {
             In_Progress = 'In Progress',
             QA = 'Ready For QA',
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
           `,
        },
        { role: "user", content: prompt },
      ],
    };

    if (durationInWorkDays !== null) {
      payload.messages.push({
        role: "system",
        content: `The task is expected to take ${durationInWorkDays} work days. Please ensure the 'duration' field in the task properties is set to this value.`,
      });
    }
    return this.http.post<any>(this.apiUrl, payload, { headers });
  }
  generateImage(prompt: string, quantity?: number): Observable<any> {
    const proxyUrl = "https://cors-anywhere.herokuapp.com/";
    const openaiUrl = "https://api.openai.com/v1/images/generations";
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.apiKey}`,
      "Content-Type": "application/json",
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
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject("Could not get canvas context");
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
          if (data[i] + data[i + 1] + data[i + 2] > 600) {
            // Making very bright pixels transparent
            data[i + 3] = 0;
          }
        }

        ctx.putImageData(imageData, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject("Failed to create blob from canvas");
          }
        }, "image/png");
      };

      img.onerror = () => {
        reject("Image load error");
      };

      img.src = URL.createObjectURL(imageFile);
    });
  }

  editImage(prompt: string, imageFile: File): Observable<any> {
    const proxyUrl = "https://cors-anywhere.herokuapp.com/";
    const openaiUrl = "https://api.openai.com/v1/images/edits";
    const formData = new FormData();

    formData.append("prompt", prompt);
    formData.append("image", imageFile);
    formData.append("model", "dall-e-2");

    // Create a mask and then submit the form data
    return from(this.createMask(imageFile)).pipe(
      switchMap((maskBlob) => {
        if (maskBlob) {
          formData.append("mask", maskBlob);
        }

        return this.http.post(`${proxyUrl}${openaiUrl}`, formData, {
          headers: new HttpHeaders({
            Authorization: `Bearer ${this.apiKey}`,
            // The Content-Type header will be set automatically
          }),
        });
      }),
      catchError((error) => {
        console.error("Error in creating or uploading the mask:", error);
        return throwError(
          () => new Error("Error in creating or uploading the mask")
        );
      })
    );
  }

  messageJoeyAI(prompt: string): Observable<any> {
    const joeyAPIKey =
      "sk-proj-Xh9SXtRe17WwnWZ7u0HyT3BlbkFJLhO9A0NZO3H1SJiRyTA6";
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${joeyAPIKey}`,
    });

    const payload = {
      model: "gpt-4", // or 'gpt-4o' if you have access
      messages: [
        {
          role: "system",
          content: `${this.joeyAIFundamentals}
           `,
        },
        { role: "user", content: prompt },
      ],
    };

    return this.http.post<any>(this.apiUrl, payload, { headers });
  }
}
