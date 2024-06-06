import { Component, Inject, Input } from '@angular/core';
import { TaskwiseAIService } from '../services/task-wise-ai.service';
import { TaskService } from '../services/task.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Task } from '../objects/task.model';
import { TaskDetailsDialogComponent } from '../task-details-dialog/task-details-dialog.component';
import OpenAI from 'openai';
@Component({
  selector: 'app-taskwise-task-details-assist',
  templateUrl: './taskwise-task-details-assist.component.html',
  styleUrls: ['./taskwise-task-details-assist.component.css']
})
export class TaskwiseTaskDetailsAssistComponent {
  responseFromAI: string = "";
  prompt: string = ""
    newTask!: Task;
taskDetails!: Task
    isWaiting = false;
  private apiKey = 'sk-proj-2cEviiXmLeay9H5E7lk7T3BlbkFJFO8whaA7YBA5NzhzSzhV'; // Replace with your OpenAI API key

    openai = new OpenAI({ apiKey: `Bearer ${this.apiKey}`,dangerouslyAllowBrowser: true});
    audioResponse: string = '';
    constructor(private taskwiseAIService: TaskwiseAIService, private taskService: TaskService, @Inject(MAT_DIALOG_DATA) public task: Task,
      private dialogRef: MatDialogRef<TaskDetailsDialogComponent>) {
       }
  
    sendMessageToAI(prompt: string): void {
      this.prompt = prompt
      this.isWaiting = true;
      this.taskwiseAIService.sendTaskDetailsMessage(prompt + this.task.title + this.task.description + this.task.dueDate + this.task.assignedBy + this.task.assignedBy + this.task.priority + this.task.project + this.task.status + this.task.id).subscribe(response => {
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
