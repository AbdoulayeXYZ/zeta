import { Injectable } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
@Injectable({
  providedIn: 'root',
})
export class isSpecialistGuard {
  canActivate: CanActivateFn = () => {
    if (this.authService.getCurruntUser().type != 'Specialist') {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  };
  

  constructor(private authService: AuthService, private router: Router) {}
}
