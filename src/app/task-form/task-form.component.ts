import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent {
  @Output() taskCreated = new EventEmitter<any>();
  title: string = "";
  description: string = "";
  dueDate: string = "";

  onSubmit() {
    const newTask = {
      title: this.title,
      description: this.description,
      dueDate: this.dueDate
    };
    this.taskCreated.emit(newTask);
    this.clearForm();
  }

  clearForm() {
    this.title = '';
    this.description = '';
    this.dueDate = '';
  }
}
