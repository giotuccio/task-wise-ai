import { Injectable } from '@angular/core';
import { Employee } from '../objects/employee.model';
import { Task } from '../objects/task.model';
import { Observable, BehaviorSubject, catchError, map, of, switchMap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';
  private loggedInUserSubject = new BehaviorSubject<Employee | null>(this.getUserFromLocalStorage());
  private userTasksSubject = new BehaviorSubject<Task[]>(this.getTasksFromLocalStorage());

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<Employee | null> {
    return this.http.get<Employee[]>(`${this.apiUrl}/employees?username=${username}&password=${password}`).pipe(
      map(employees => {
        if (employees.length === 0) {
          throw new Error('Invalid username or password');
        }
        const employee = employees[0];
        this.setLoggedInUser(employee);
        this.setTasks(employee.tasks ?? []);
        return employee;
      }),
      catchError(error => {
        console.error(error);
        return of(null);
      })
    );
  }

  getEmployeeByUsername(username: string): Observable<Employee> {
    return this.http.get<Employee[]>(`${this.apiUrl}/employees?username=${username}`).pipe(
      map(employees => {
        if (employees.length === 0) {
          throw new Error(`Employee not found with username: ${username}`);
        }
        return employees[0];
      })
    );
  }

  postEmployeeCalendar(username: string, task: Task): Observable<Employee> {
    return this.getEmployeeByUsername(username).pipe(
      map(employee => {
        if (!employee.tasks) {
          employee.tasks = [];
        }
        employee.tasks.push(task);
        return employee;
      }),
      switchMap(employee => this.http.put<Employee>(`${this.apiUrl}/employees/${employee.id}`, employee)),
      catchError(error => {
        console.error('Error in postEmployeeCalendar:', error);
        return throwError(() => new Error('Failed to post employee calendar'));
      })
    );
  }

  getEmployeeCalendar(username: string): Observable<{ employee: Employee, tasks: Task[] }> {
    return this.http.get<Employee[]>(`${this.apiUrl}/employees?username=${username}`).pipe(
      map(employees => {
        if (employees.length === 0) {
          throw new Error('Employee not found');
        }
        const employee = employees[0];
        const tasks = employee.tasks || []; // Ensure tasks is always an array
        return { employee, tasks };
      }),
      catchError(error => {
        console.error('Error in getEmployeeCalendar:', error);
        return of({ employee: null as any, tasks: [] }); // Return default value on error
      })
    );
  }

  getUsers(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}/employees`);
  }

  setLoggedInUser(user: Employee) {
    this.loggedInUserSubject.next(user);
    localStorage.setItem('loggedInUser', JSON.stringify(user));
  }

  getLoggedInUser(): Observable<Employee | null> {
    return this.loggedInUserSubject.asObservable();
  }

  setTasks(tasks: Task[]) {
    this.userTasksSubject.next(tasks);
    localStorage.setItem('userTasks', JSON.stringify(tasks));
  }

  getTasks(): Observable<Task[]> {
    return this.userTasksSubject.asObservable();
  }

  isAuthenticated(): boolean {
    return this.loggedInUserSubject.value !== null;
  }

  logout() {
    this.loggedInUserSubject.next(null);
    this.userTasksSubject.next([]);
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('userTasks');
  }

  private getUserFromLocalStorage(): Employee | null {
    const userJson = localStorage.getItem('loggedInUser');
    return userJson ? JSON.parse(userJson) : null;
  }

  private getTasksFromLocalStorage(): Task[] {
    const tasksJson = localStorage.getItem('userTasks');
    return tasksJson ? JSON.parse(tasksJson) : [];
  }
}
