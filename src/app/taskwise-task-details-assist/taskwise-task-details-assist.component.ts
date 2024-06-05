import { Component, Inject, Input } from '@angular/core';
import { TaskwiseAIService } from '../services/task-wise-ai.service';
import { TaskService } from '../services/task.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Task } from '../objects/task.model';
import { TaskDetailsDialogComponent } from '../task-details-dialog/task-details-dialog.component';

@Component({
  selector: 'app-taskwise-task-details-assist',
  templateUrl: './taskwise-task-details-assist.component.html',
  styleUrls: ['./taskwise-task-details-assist.component.css']
})
export class TaskwiseTaskDetailsAssistComponent {
  responseFromAI: string = "";
  prompt: string = ""
    newTask!: Task;
   @Input() taskDetails!: Task
    isWaiting = false;

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
    
    
 
}
