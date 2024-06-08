import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserRole } from '../objects/UserRole';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userRole: UserRole | undefined;
  private usersEndpoint = 'https://jsonplaceholder.typicode.com/users'
  constructor(private router: Router, private http: HttpClient) { }

  userExists(username: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.usersEndpoint}/exists/${username}`);
  }
  getUsers(): Observable<any> {
    return this.http.get<any>(this.usersEndpoint);
  }
  // Method to log in a user (simulate login with JSONPlaceholder)
  login(username: string, password: string): Observable<any> {
    // Assuming `/posts` as the endpoint for simulating login
    return this.http.post<any>('https://jsonplaceholder.typicode.com/posts', { title: username, body: password });
  }

  getUserRole(): UserRole | undefined {
    return this.userRole;
  }
}
