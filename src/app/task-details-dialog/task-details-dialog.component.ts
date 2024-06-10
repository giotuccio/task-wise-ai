import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Task } from '../objects/task.model';
import { TaskService } from '../services/task.service';
import { Priority } from '../objects/priority.model';
import { Status } from '../objects/status.model';
import { User } from '../objects/user.model';

@Component({
  selector: 'app-task-details-dialog',
  templateUrl: './task-details-dialog.component.html',
  styleUrls: ['./task-details-dialog.component.css']
})
export class TaskDetailsDialogComponent {
  newTask: Task[] = [];
  task: Task;
  selectedTaskId: string;
  employees  = []
  taskId: string = "";
  isDeleted = false;
  isUpdating = false;
  isDeleting = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data: { task: Task, selectedTaskId: string, employees: [] },
    private taskService: TaskService, private dialogRef: MatDialogRef<TaskDetailsDialogComponent>) {
    this.task = { ...data.task };
    this.selectedTaskId = data.selectedTaskId;
    this.employees = data.employees
    console.log(this.selectedTaskId);

  }


  completeTask(task: Task) {
task.completed = true;
  }

  editTask(task: Task) {
    this.task = task;
    this.isUpdating = true;
    this.taskService.editTask(task, this.selectedTaskId).subscribe((response) => {
      if (response) {
        this.isUpdating = false;


        this.dialogRef.close(this.task);
      }
    });
  }

  deleteTask(task: Task) {
    this.task = task;

    this.taskService.deleteTask(task, this.selectedTaskId).subscribe((response) => {
      console.log(response);
      this.dialogRef.close(this.task);
    });
  }

  updateTaskStatus(newStatus: Task) {
    // Implement update task status logic here
  }
}
