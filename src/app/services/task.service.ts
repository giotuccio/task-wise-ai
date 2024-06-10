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
  constructor(private http: HttpClient) { }
  getAllTasksId(): Observable<string[]> {
    return this.http.get<Tasks[]>(this.jsonServerUrl).pipe(
      map(response => response.map(data => data.id))
    );
  }

  getTasks(): Observable<any> {
    return this.http.get<any>(this.jsonServerUrl).pipe(
      map(response => response.map((data: { task: any; }) => data.task))
    );
  }
  getProjects(): Observable<any> {
    return this.http.get<any>(this.jsonServerUrlProjects).pipe(
      map(response => response.map((data: { project: any; }) => data.project))
    );
  }
  addTask(task: Task): Observable<any> {
    this.tasks.push(task);
    return this.http.post<any>(this.jsonServerUrl, { task: task });

  }
  // Additional methods for task management (e.g., update, delete) can be added here


  deleteTask(task: Task, taskId: string): Observable<any> {
    task.isDeleted = true;
    const url = `https://jsonplaceholder.typicode.com/posts/${task.id}`;

    return this.http.delete<any>(this.jsonServerUrl + '/' + taskId);
  }

  editTask(editedTask: Task, taskId: string):  Observable<any> {
    return this.http.put<any>(this.jsonServerUrl + '/' + taskId, {task: editedTask, id: taskId})
  }
}
