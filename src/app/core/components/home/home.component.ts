import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service'; // Assurez-vous que le chemin est correct
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Import the CommonModule
import { ReactiveFormsModule } from '@angular/forms';

interface LoginResponse {
  token: string;
  user: {
    type: string;
    // other user properties
  };
}

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule]
})
export class HomeComponent implements OnInit {
  hospitals: number = 0;
  specialists: number = 0;
  detections: number = 0;
  activeButton: string = 'hopital';
  loginForm!: FormGroup;
  currentUser: any;
  showLoginForm: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.animateCount('hospitals', 15, 3000);
    this.animateCount('specialists', 150, 3000);
    this.animateCount('detections', 200, 3000);
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  animateCount(property: 'hospitals' | 'specialists' | 'detections', target: number, duration: number) {
    let start = 0;
    const increment = target / (duration / 100);
    const interval = setInterval(() => {
      start += increment;
      if (start >= target) {
        start = target;
        clearInterval(interval);
      }
      this[property] = Math.round(start);
    }, 100);
  }

  onHopitalClick() {
    this.activeButton = 'hopital';
  }

  onCliniqueClick() {
    this.activeButton = 'clinique';
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (res: LoginResponse) => {
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
