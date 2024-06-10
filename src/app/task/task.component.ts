import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../objects/task.model';
import { Status } from '../objects/status.model';
import { TaskService } from '../services/task.service';
import { User } from '../objects/user.model';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent {
  @Input() task!: Task;
  @Input() taskId!: string;
  assignedTo: string = "";
  @Input() employees: any;
  selectedOption: string = '';
  selectedTaskId: string = ''
  isUpdating = false;

  @Output() complete: EventEmitter<void> = new EventEmitter<void>();

  constructor(private taskService: TaskService) {}

  completeTask(task: Task) {
    task.completed = true;
    task.status = Status.Complete;
    this.complete.emit();
    this.updateTask();
  }

  assignEmployee(event: any) {
    this.task.assignedTo = this.assignedTo;
    // Implement other logic as needed, such as updating task assignment in the backend
  }

  toggleTaskStatus(task: any) {
    event?.stopPropagation();


    switch (this.selectedOption) {
      
      case 'In Progress':
        console.log(this.selectedOption);

       task.status = Status.In_Progress;

        break;
      case 'Ready For QA':
        console.log(this.selectedOption);

 task.status = Status.QA;

        break;
      case 'Complete':
        console.log(this.selectedOption);
        
        this.completeTask(task);
        return; // Exit early to avoid double update
      default:
        break;
    }

    this.updateTask();

  }

  updateTask() {
    this.isUpdating = true;
    this.taskService.editTask(this.task,this.taskId).subscribe((response) => {
      if (response) {
        console.log(response);
        this.isUpdating = false;
      }
    });
  }
}
