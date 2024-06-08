import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../objects/task.model';import { Status } from '../objects/status.model';
import { Priority } from '../objects/priority.model';
import { TaskService } from '../services/task.service';
; // Assuming you have a Task model

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

  constructor(private taskService: TaskService){

  }
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
  
toggleTaskStatus(task: Task): void {
  event?.stopPropagation()

  switch (this.selectedOption) {
    case 'inProgress':
  task.status = Status.In_Progress

      // Handle in progress status
      break;
    case 'sendToQA':
  task.status = Status.QA
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
