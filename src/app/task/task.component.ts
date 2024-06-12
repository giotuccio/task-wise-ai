import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../objects/task.model';
import { Status } from '../objects/status.model';
import { TaskService } from '../services/task.service';
import { User } from '../objects/user.model';
import { AuthService } from '../services/auth.service';
import { Employee } from '../objects/employee.model';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent {
  @Input() task!: Task;
  @Input() taskId!: string;
  @Input() workDaysToCompleteTask: number = 0;
  assignedTo: string = "";
  @Input() employees: any;
  selectedOption: string = '';
  selectedTaskId: string = ''
  isUpdating = false;

  @Output() complete: EventEmitter<void> = new EventEmitter<void>();

  constructor(private taskService: TaskService, private authService: AuthService) {}

  completeTask(task: Task) {
    task.completed = true;
    task.status = Status.Complete;
    this.complete.emit();
    this.updateTask(task);
  }

  assignEmployee(event: any) {
    this.task.assignedTo = this.assignedTo;
    // Implement other logic as needed, such as updating task assignment in the backend
  }

 toggleTaskStatus(task: any) {
    event?.stopPropagation();
    const assignedEmployee = this.employees.find((emp: Employee) => emp.name === task.assignedTo);
    switch (this.selectedOption) {
      case 'In Progress':
        console.log(this.selectedOption);
        task.status = Status.In_Progress;
        this.authService.postEmployeeCalendar(assignedEmployee.username, task).subscribe((response) => {
          console.log('Task added to calendar', response);
        });
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

    this.updateTask(task);
  }

  updateTask(task: any) {
    this.isUpdating = true;
    this.taskService.editTask(task,this.taskId).subscribe((response) => {
      if (response) {
        console.log(response);
        this.isUpdating = false;
      }
    });
  }
}
