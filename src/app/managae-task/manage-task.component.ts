import { Component, Input } from '@angular/core';
import { Task } from '../objects/task.model'; // Assuming you have a Task model

@Component({
  selector: 'app-manage-task',
  templateUrl: './manage-task.component.html',
  styleUrls: ['./manage-task.component.css']
})
export class ManageTaskComponent {
  @Input() task!: Task; // Input task from parent component

  constructor() { }

  editTask() {
    // Implement task editing logic here
    console.log('Editing task:', this.task);
  }

  deleteTask() {
    // Implement task deletion logic here
    console.log('Deleting task:', this.task);
  }

  updateTaskStatus(newStatus: string) {
    // Implement task status update logic here
    console.log('Updating task status to:', newStatus);
  }
}
