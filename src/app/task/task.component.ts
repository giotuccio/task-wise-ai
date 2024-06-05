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
  selectedOption: string = 'inProgress';

  @Output() complete: EventEmitter<void> = new EventEmitter<void>();
  completeTask() {
    this.complete.emit();
  }
  assignEmployee(event: any) {
    this.task.assignedTo = this.assignedTo;
    // Implement other logic as needed, such as updating task assignment in the backend
  }
  
  isDarkTheme = false;
  stopDefault(event: any) {
    event.preventDefault();
  }
  // Function to toggle theme
  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
  }
  
toggleTaskStatus(): void {
  event?.stopPropagation()
  switch (this.selectedOption) {
    case 'inProgress':
      // Handle in progress status
      break;
    case 'sendToQA':
      // Handle send to QA status
      break;
    case 'complete':
      this.completeTask()
      // Handle complete status
      break;
    default:
      break;
  }
}
}
