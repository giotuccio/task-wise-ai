import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../objects/task.model';; // Assuming you have a Task model

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent {
  @Input() task!: Task;
  assignedTo: string = "";
  employees: string[] = ['Employee 1', 'Employee 2', 'Employee 3'];
  @Output() complete: EventEmitter<void> = new EventEmitter<void>();
  completeTask() {
    this.complete.emit();
  }
  assignEmployee() {
    this.task.assignedTo = this.assignedTo;
    // Implement other logic as needed, such as updating task assignment in the backend
  }
  isDarkTheme = false;

  // Function to toggle theme
  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
  }
}
