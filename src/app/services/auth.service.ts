// auth.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Example: Replace this with your actual authentication logic

  private isAuthenticatedValue: boolean = false;

  constructor() {}

  isAuthenticated(): boolean {
    return this.isAuthenticatedValue;
  }

  login(username: string, password: string): boolean {
    // Example: Perform authentication here
    // Replace this logic with your actual authentication mechanism
    if (username === 'admin' && password === 'password') {
      this.isAuthenticatedValue = true;
      return true;
    } else {
      return false;
    }
  }

  logout(): void {
    // Example: Perform logout actions here
    // Replace this logic with your actual logout mechanism
    this.isAuthenticatedValue = false;
  }
}
