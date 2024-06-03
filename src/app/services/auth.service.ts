import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  isLoggedIn(): any {
    // Implement your authentication logic here
    // For demonstration, return true if user is logged in
    return true;
  }
}
