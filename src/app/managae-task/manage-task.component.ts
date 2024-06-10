import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../objects/task.model'; // Assuming you have a Task model
import { Priority } from '../objects/priority.model';
import { Status } from '../objects/status.model';
import { TaskService } from '../services/task.service';
import { User } from '../objects/user.model';

@Component({
  selector: 'app-manage-task',
  templateUrl: './manage-task.component.html',
  styleUrls: ['./manage-task.component.css']
})
export class ManageTaskComponent {
  @Input() task!: Task; // Input task from parent component
  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<Task>();
  @Output() updateStatus = new EventEmitter<string>();
  @Output() updatePriority = new EventEmitter<string>();
  @Input() isUpdating = false;
  @Input() isDeleting = false;
  @Input() employees: any;
  priorities: string[];
  status: string[];
  @Output() complete: EventEmitter<void> = new EventEmitter<void>();
  constructor(private taskService: TaskService) { 
    this.priorities = Object.values(Priority);
    this.status = Object.values(Status);
  }
  completeTask() {
    this.task.completed = true;
    this.task.status = Status.Complete;
    this.complete.emit();
  }

  editTask() {
    // Emit edit event to parent component
    this.edit.emit();
  }

  deleteTask() {
    // Emit delete event to parent component
    this.delete.emit(this.task);
  }

 

 
}
