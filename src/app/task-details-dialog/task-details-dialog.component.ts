import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Task } from '../objects/task.model';
import { TaskService } from '../services/task.service';
import { AuthService } from '../services/auth.service';
import { Employee } from '../objects/employee.model';

@Component({
  selector: 'app-task-details-dialog',
  templateUrl: './task-details-dialog.component.html',
  styleUrls: ['./task-details-dialog.component.css']
})
export class TaskDetailsDialogComponent {
  task: Task;
  selectedTaskId: string;
  employees: Employee[] = [];
  isUpdating = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { task: Task, selectedTaskId: string, employees: Employee[] },
    private taskService: TaskService,
    private dialogRef: MatDialogRef<TaskDetailsDialogComponent>,
    private authService: AuthService
  ) {
    this.task = { ...data.task };
    this.selectedTaskId = data.selectedTaskId;
    this.employees = data.employees;
  }

  completeTask(task: Task) {
    task.completed = true;
  }

  editTask(task: Task) {
    this.isUpdating = true;
    this.taskService.editTask(task, this.selectedTaskId).subscribe((response) => {
      if (response) {
        this.isUpdating = false;

        const assignedEmployee = this.employees.find(emp => emp.name === task.assignedTo);
        if (assignedEmployee) {
          assignedEmployee.tasks = assignedEmployee.tasks || [];
          this.authService.postEmployeeCalendar(assignedEmployee.username, task).subscribe(
            (updatedEmployee) => {
              console.log('Employee calendar updated', updatedEmployee);
              // Update local data
              const index = this.employees.findIndex(emp => emp.id === updatedEmployee.id);
              if (index !== -1) {
                this.employees[index] = updatedEmployee;
              }
              // Optionally, update the logged-in user
              this.authService.getLoggedInUser().subscribe(loggedInUser => {
                if (loggedInUser && loggedInUser.name === updatedEmployee.name) {
                  this.authService.setLoggedInUser(updatedEmployee);
                }
              });
            },
            (error) => {
              console.error('Error updating employee calendar', error);
            }
          );
        }

        this.dialogRef.close(this.task);
      }
    });
  }

  deleteTask(task: Task) {
    this.taskService.deleteTask(task, this.selectedTaskId).subscribe((response) => {
      console.log(response);
      this.dialogRef.close(this.task);
    });
  }

  updateTaskStatus(newStatus: Task) {
    // Implement update task status logic here
  }
}
