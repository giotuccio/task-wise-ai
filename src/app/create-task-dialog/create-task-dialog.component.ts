import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Priority } from '../objects/priority.model';
import { TaskService } from '../services/task.service';
import { Task } from '../objects/task.model';

@Component({
  selector: 'app-create-task-dialog',
  templateUrl: './create-task-dialog.component.html',
  styleUrls: ['./create-task-dialog.component.css']
})
export class CreateTaskDialogComponent implements OnInit{
  title: string = "";
  description: string = "";
  dueDate: string = "";
  assignedTo: string = "";
projectName: string = ""
  employees: string[] = ['Employee 1', 'Employee 2', 'Employee 3'];
  projects: string[] = ['Online Account Opening', 'Digital Marketing'];
  priority!: Priority;
  tasks: Task[] = [];
  priorities: string[] = Object.values(Priority);
  constructor(public dialogRef: MatDialogRef<CreateTaskDialogComponent>,private taskService: TaskService) {}
  ngOnInit(): void {
    this.tasks = this.taskService.getTasks();
}
  onSubmit() {
    if (!this.title || !this.description || !this.priority) {
      // If any of the required fields are empty, prevent closing the dialog
      return;
    }

    const newTask = {
      project: this.projectName,
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
