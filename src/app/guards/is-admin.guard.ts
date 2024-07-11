import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';
@Injectable({
  providedIn: 'root',
})
export class isAdminGuard implements CanActivate {
  canActivate(): boolean {
    if (this.authService.getCurrentUser().type != 'AdminZeta') {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  };

  constructor(private authService: AuthService, private router: Router) {}
}
