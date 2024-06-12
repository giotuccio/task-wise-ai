import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Employee } from '../objects/employee.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  isWaiting = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  login(username: string, password: string) {
    this.isWaiting = true;
    this.authService.login(username, password).subscribe(
      (employee) => {
        console.log(employee);
        
        if (employee) {
          this.isWaiting = false;
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = 'Invalid username or password';
          this.isWaiting = false;
        }
      },
      (error) => {
        this.errorMessage = error.message;
        this.isWaiting = false;
      }
    );
  }
}
