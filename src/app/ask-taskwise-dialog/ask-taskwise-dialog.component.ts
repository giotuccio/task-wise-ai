import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { TaskwiseAIService } from '../services/task-wise-ai.service';
import { TaskService } from '../services/task.service';
import { Priority } from '../objects/priority.model';
import { Status } from '../objects/status.model';
import { Task } from '../objects/task.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-ask-taskwise-dialog',
  templateUrl: './ask-taskwise-dialog.component.html',
  styleUrls: ['./ask-taskwise-dialog.component.css']
})
export class AskTaskwiseDialogComponent {
  responseFromAI: string = "";
prompt: string = ""
  newTask!: Task;
  isWaiting = false;
  constructor(private taskwiseAIService: TaskwiseAIService, private taskService: TaskService, @Inject(MAT_DIALOG_DATA) public task: Task,
    private dialogRef: MatDialogRef<AskTaskwiseDialogComponent>) { }

  sendMessageToAI(prompt: string): void {
    this.prompt = prompt
    this.isWaiting = true;
    this.taskwiseAIService.sendMessage(prompt).subscribe(response => {
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
  
  
  closeDialog(): void {
    // Close the dialog and pass the updated task back to the parent component
    this.dialogRef.close(this.newTask);
  }
}
