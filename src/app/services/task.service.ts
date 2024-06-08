import { EventEmitter, Injectable } from '@angular/core';
import { Task, Tasks } from '../objects/task.model';
import { Priority } from '../objects/priority.model';
import { Status } from '../objects/status.model';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { json } from 'milliparsec'
import { Project } from '../objects/project.model';
@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks: Task[] = [];
  private jsonServerUrl = 'http://localhost:3000/tasks';
  private jsonServerUrlProjects = 'http://localhost:3000/projects';
  taskDeleted: EventEmitter<Task> = new EventEmitter<Task>();
  constructor(private http: HttpClient) {}
  getAllTasksId(): Observable<string[]> {
    return this.http.get<Tasks[]>(this.jsonServerUrl).pipe(
      map(response => response.map(data => data.id))
    );
  }

  getTasks(): Observable<Task[]> {
    return this.http.get<{ task: Task }[]>(this.jsonServerUrl).pipe(
      map(response => response.map(data => data.task))
    );
  }
  getProjects(): Observable<Project[]> {
    return this.http.get< Project[] >(this.jsonServerUrlProjects)
  }
  addTask(task: Task): Observable<Task[]> {
    this.tasks.push(task);
    return this.http.post<Task[]>(this.jsonServerUrl, { task: task});

  }
  // Additional methods for task management (e.g., update, delete) can be added here
 
  
  deleteTask(task: Task): Observable<any> {
    task.isDeleted = true;
    const url = `https://jsonplaceholder.typicode.com/posts/${task.id}`;

    return this.http.delete<any>(url);
  }
  
  editTask(editedTask: string): Observable<string> {
    // Assuming editedTask has a property named taskId that holds the ID of the task
    const taskId = editedTask; 

    // Update the task with the dynamic taskId value
    return this.http.put<string>(`${this.jsonServerUrl}/${taskId}`, { task: editedTask });
  }
}
