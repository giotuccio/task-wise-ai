import { Component, Inject } from '@angular/core';
import { Task } from '../objects/task.model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-task-message-updates',
  templateUrl: './task-message-updates.component.html',
  styleUrls: ['./task-message-updates.component.css']
})
export class TaskMessageUpdatesComponent {
  
  messages: string[] = []; // Placeholder for messages
  recipient: string = "";
  employees: string[] = ['Employee 1', this.task.assignedBy ?? '', 'Employee 3'];
  constructor(@Inject(MAT_DIALOG_DATA) public task: Task) { }

  sendMessage(message: string) {
    // Implement logic to send message
    this.messages.push(message); // For demonstration, adding message to array
  }
}
