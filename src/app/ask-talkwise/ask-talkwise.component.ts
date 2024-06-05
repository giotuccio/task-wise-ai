import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { TaskwiseAIService } from '../services/task-wise-ai.service';
import { TaskService } from '../services/task.service';
import { Priority } from '../objects/priority.model';
import { Status } from '../objects/status.model';
import { Task } from '../objects/task.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-ask-talkwise',
  templateUrl: './ask-talkwise.component.html',
  styleUrls: ['./ask-talkwise.component.css']
})
export class AskTalkwiseComponent {
  responseFromAI: string = "";

  newTask!: Task;
  isWaiting = false;
  constructor(private taskwiseAIService: TaskwiseAIService, private taskService: TaskService, @Inject(MAT_DIALOG_DATA) public task: Task,
    private dialogRef: MatDialogRef<AskTalkwiseComponent>) { }

  sendMessageToAI(prompt: string): void {
    this.isWaiting = true;
    this.taskwiseAIService.sendMessage(prompt).subscribe(response => {
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
        this.newTask = {
          id: taskDetails.id,
          project: taskDetails.project,
          title: taskDetails.title,
          description: taskDetails.description,
          dueDate: taskDetails.dueDate,
          priority: taskDetails.priority as Priority,
          status: taskDetails.status as Status,
          assignedTo: taskDetails.assignedTo,
          assignedBy: taskDetails.assignedBy,
          completed: taskDetails.completed,
        };

        // Adding the new task
        this.taskService.addTask(this.newTask);
      } catch (error) {
        console.error('Error parsing response:', error);
      }
    });
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
    this.dialogRef.close(this.newTask);
  }
}
