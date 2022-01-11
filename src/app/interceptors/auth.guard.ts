import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate() {
    // check to see if a user is logged in
    if (this.authService.isLoggedIn()) {
      // if they do, return true and allow the user to load app
      return true;
    }

    // if not, they redirect them to the login page
    this.router.navigate(['/login']);
    return false;
  }
}
