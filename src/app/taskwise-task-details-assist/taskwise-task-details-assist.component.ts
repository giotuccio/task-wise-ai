import { Component, Inject, Input } from '@angular/core';
import { TaskwiseAIService } from '../services/task-wise-ai.service';
import { TaskService } from '../services/task.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Task } from '../objects/task.model';
import { TaskDetailsDialogComponent } from '../task-details-dialog/task-details-dialog.component';
import OpenAI from 'openai';
import { ta } from 'date-fns/locale';
@Component({
  selector: 'app-taskwise-task-details-assist',
  templateUrl: './taskwise-task-details-assist.component.html',
  styleUrls: ['./taskwise-task-details-assist.component.css']
})
export class TaskwiseTaskDetailsAssistComponent {
  responseFromAI: string = "";
  prompt: string = ""
    newTask!: Task;
taskDetails!: any
    isWaiting = false;
  private apiKey = 'sk-proj-2cEviiXmLeay9H5E7lk7T3BlbkFJFO8whaA7YBA5NzhzSzhV'; // Replace with your OpenAI API key

    openai = new OpenAI({ apiKey: `Bearer ${this.apiKey}`,dangerouslyAllowBrowser: true});
    audioResponse: string = '';
    constructor(private taskwiseAIService: TaskwiseAIService, private taskService: TaskService, @Inject(MAT_DIALOG_DATA) public task: any,
      private dialogRef: MatDialogRef<TaskDetailsDialogComponent>) {
        console.log(task);
        this.taskDetails = task.task
        console.log(this.taskDetails);
        
       }
        calculateWorkDays(durationInHours: number): number {
        return Math.ceil(durationInHours /TaskwiseAIService.WORK_HOURS_PER_DAY);
      }
      
       extractDuration(prompt: string): number | null {
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
      
    sendMessageToAI(prompt: string): void {
      const durationInHours = this.extractDuration(prompt);
  let durationInWorkDays: number | null = null;
  if (this.task.duration !== null) {
    durationInWorkDays = this.calculateWorkDays(this.task.duration ?? 0);
  }
      this.prompt = prompt
      this.isWaiting = true;
      this.taskwiseAIService.sendTaskDetailsMessage(prompt + this.task.task.title + this.task.task.description + this.task.task.dueDate + this.task.task.assignedBy + this.task.task.assignedTo + this.task.task.priority + this.task.task.project + this.task.task.status
+ '  ' +         `Days left to complete task is: ${this.taskDetails.duration} days. today is ${new Date().toLocaleDateString()} Let Prompter know if they are not going to meet deadline if the days left to complete is going to surpass over the due date of task` + this.task.dueDate).subscribe(response => {
        if(response)
          this.isWaiting = false;
        this.responseFromAI = response.choices[0].message.content; // Extracting the task details from the response
  
        // Logging the response content
       
      });
    }
  
  
  
    regenerateResponse(): void {
      // Clear the current response and send a new prompt to the AI
      this.responseFromAI = "";
      this.sendMessageToAI('Can you be more detailed?'+this.prompt )
      // Provide more specific details about the task in the prompt
      
    }
    
    
    generateAudio(): void {
      this.openai.audio.speech.create({
        model: "tts-1",
        voice: "alloy",
        input: "Heello",
      }).then(response => {
        // Store the URL of the generated audio file
        this.audioResponse = response.url;
        // Play the audio
        this.playAudio();
      }).catch(error => {
        console.error("Error generating audio:", error);
      });
    }
  
    // Method to play the audio
    playAudio(): void {
      if (this.audioResponse) {
        // Use an HTML audio element to play the audio
        const audioElement = new Audio(this.audioResponse);
        audioElement.play();
      }
    }
  
}
