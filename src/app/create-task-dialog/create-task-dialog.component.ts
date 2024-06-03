import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Priority } from '../objects/priority.model';

@Component({
  selector: 'app-create-task-dialog',
  templateUrl: './create-task-dialog.component.html',
  styleUrls: ['./create-task-dialog.component.css']
})
export class CreateTaskDialogComponent {
  title: string = "";
  description: string = "";
  dueDate: string = "";
  assignedTo: string = "";
  employees: string[] = ['Employee 1', 'Employee 2', 'Employee 3'];
  priority!: Priority;
  priorities: string[] = Object.values(Priority);
  constructor(public dialogRef: MatDialogRef<CreateTaskDialogComponent>) {}

  onSubmit() {
    if (!this.title || !this.description || !this.priority) {
      // If any of the required fields are empty, prevent closing the dialog
      return;
    }

    const newTask = {
      title: this.title,
      description: this.description,
      dueDate: this.dueDate,
      assignedTo: this.assignedTo,
      priority: this.priority
    };
    this.dialogRef.close(newTask);
  }

  onCancel() {
    this.dialogRef.close();
  }
}
