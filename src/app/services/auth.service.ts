// auth.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedInUserName: string | undefined;
  // Example: Replace this with your actual authentication logic

  private isAuthenticatedValue: boolean = false;

  constructor() {}

  isAuthenticated(): boolean {
    return this.isAuthenticatedValue;
  }


  login(username: string, password: string): any {
    // Perform login logic here, and if successful, set the logged-in user's name
    this.loggedInUserName = username;
  }

  getLoggedInUserName(): string | undefined {
    return this.loggedInUserName;
  }
}
