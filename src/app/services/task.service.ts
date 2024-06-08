import { EventEmitter, Injectable } from '@angular/core';
import { Task } from '../objects/task.model';
import { Priority } from '../objects/priority.model';
import { Status } from '../objects/status.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks: Task[] = [];
  taskDeleted: EventEmitter<Task> = new EventEmitter<Task>();
  constructor(private http: HttpClient) {}

  getTasks(): Task[] {
    return this.tasks;
  }

  addTask(task: Task): Observable<any> {
    this.tasks.push(task);
    return this.http.post<any>('https://jsonplaceholder.typicode.com/posts', { task: task});

  }
  createTask(id: string, project: string,title: string, description: string, dueDate: string,priority: Priority.High | Priority.Medium| Priority.Low, status: Status.New| Status.In_Progress| Status.Complete, assignedTo?: string, assignedBy?: string ): Task { const newTask: Task = {id,project,title, description, dueDate,priority, status, assignedTo, assignedBy, completed: status === Status.Complete }; return newTask; } 
  // Additional methods for task management (e.g., update, delete) can be added here
  deleteTask(task: Task): void {
task.isDeleted = true;

    
  }
  
  
  
  editTask(editedTask: Task): void {
    const index = this.tasks.findIndex(task => task.id === editedTask.id);
    if (index !== -1) {
      this.tasks[index] = editedTask;
    }
  }
}
