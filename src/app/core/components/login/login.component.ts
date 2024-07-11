import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service'; // Assurez-vous que le chemin est correct
import { Router } from '@angular/router';

interface LoginResponse {
  token: string;
  user: {
    type: string;
    // other user properties
  };
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  currentUser: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (res: LoginResponse) => { // Explicitly type 'res'
          console.log(res);
          this.authService.storeJwtToken(res.token);
          this.authService.setCurruntUser(res.user);

          switch (res.user.type) {
            case 'Specialist':
              this.router.navigate(['specialist/manage-patients']);
              break;
            case 'Owner':
              this.router.navigate(['owner/dashowner']);
              break;
            default:
              this.router.navigate(['admin/dashboard']);
              break;
          }
        },
        error: (err: unknown) => {
          console.error('Login Failed', err);
        },
      });
    }
  }
}
