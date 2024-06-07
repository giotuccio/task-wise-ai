import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../objects/task.model'; // Assuming you have a Task model
import { Priority } from '../objects/priority.model';
import { Status } from '../objects/status.model';

@Component({
  selector: 'app-manage-task',
  templateUrl: './manage-task.component.html',
  styleUrls: ['./manage-task.component.css']
})
export class ManageTaskComponent {
  @Input() task!: Task; // Input task from parent component
  @Output() edit = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<Task>();
  @Output() updateStatus = new EventEmitter<string>();
  priorities: string[];
  status: string[];
  constructor() { 
    this.priorities = Object.values(Priority);
    this.status = Object.values(Status);
  }


  editTask() {
    // Emit edit event to parent component
    this.edit.emit(this.task);
  }

  deleteTask() {
    // Emit delete event to parent component
    this.delete.emit(this.task);
  }

  updateTaskStatus(newStatus: string) {
    // Emit update status event to parent component
    this.updateStatus.emit(newStatus);
  }
}
