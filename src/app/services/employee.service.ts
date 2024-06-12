// employee.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Employee } from '../objects/employee.model';
import { Task } from '../objects/task.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getEmployeeCalendar(username: string): Observable<{ employee: Employee, tasks: Task[] }> {
    return this.http.get<{ employee: Employee, tasks: Task[] }>(`${this.apiUrl}/employees?username=${username}`).pipe(
      map(response => {
        if (!response) {
          throw new Error('Employee not found');
        }
        return { employee: response.employee, tasks: response.tasks };
      })
    );
  }
  postEmployeeCalendar(username: string, task: Task): Observable<Employee> {
    return this.http.post<Employee>(`${this.apiUrl}/employee-calendar/${username}`, task);
  }
  login(username: string, password: string): Observable<Employee> {
    return this.http.get<Employee[]>(`${this.apiUrl}/employees?username=${username}`).pipe(
      map(employees => {
        if (employees.length === 0) {
          throw new Error('Employee not found');
        }
        return employees[0];
      }),
      catchError(error => throwError(error))
    );
  }

  getUsers(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}/employees`);
  }
}
