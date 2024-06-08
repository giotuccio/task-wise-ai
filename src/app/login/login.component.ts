import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserRole } from '../objects/UserRole';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  userRole = "";
isWaiting = false
  constructor(private router: Router, private loginService: UserService,private authService: AuthService) { }

  login(username: string, password: string) {
    // Call the login method in the UserService
this.isWaiting= true
    this.loginService.login(username, password).subscribe((response) => {

      // Check if login was successful
      if (response) {
        this.isWaiting = false
        // Set the user role based on the username
        this.userRole = username === 'admin' ? UserRole.ADMIN : UserRole.USER;
        console.log(this.userRole);

        // Navigate to the dashboard with query parameter 'id'
        this.router.navigate(['/dashboard'], { queryParams: { id: response.id } });
      } else {
        // Handle authentication failure (e.g., display error message)
        console.log('Invalid username or password');
      }
    }, (error) => {
      // Handle error if login request fails
      console.error('Login failed:', error);
    });

    // Fetch user data after login
    this.loginService.getUsers().subscribe((users) => {
      this.authService.login(users[0].userName,password)

      console.log('Users:', users);
      // Further processing of user data, if needed
    }, (error) => {
      console.error('Failed to fetch user data:', error);
    });
  }
}
