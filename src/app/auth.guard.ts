import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './services/auth.service'; import { UserRole } from './objects/UserRole';
;

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  userRole = "";
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): boolean {

    if (this.authService.login('admin', '')) {
      this.userRole = UserRole.ADMIN;
  console.log(this.userRole);

      return true; // Allow access to the route
    }  else if (this.authService.login('', '')) {
      this.userRole = UserRole.USER;
  console.log(this.userRole);

      return true; // Allow access to the route
    } else {
      this.router.navigate(['/login']); // Redirect to login page if not logged in
      return false;
    }
  
  }


}
