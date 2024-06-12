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

    return true
  }


}
