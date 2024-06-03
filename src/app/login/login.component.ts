// login.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private router: Router) {}

  login(username: string, password: string) {
    // Check if username is 'admin' to allow login
    if (username === 'admin') {
      // Navigate to the dashboard upon successful login
      this.router.navigate(['/dashboard']);
    } else {
      // Handle authentication failure (e.g., display error message)
      console.log('Invalid username');
    }
  }
}
