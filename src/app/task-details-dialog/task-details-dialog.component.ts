import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Task } from '../objects/task.model';

@Component({
  selector: 'app-task-details-dialog',
  templateUrl: './task-details-dialog.component.html',
  styleUrls: ['./task-details-dialog.component.css']
})
export class TaskDetailsDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public task: Task) { }
}
