import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly JWT_TOKEN = 'token';
  private readonly USER = 'user';
  private apiUrl = 'http://localhost:3000/api/users'; // URL de base pour les requêtes

  constructor(private http: HttpClient, private router: Router) {}

  login(user: { email: string; password: string }) {
    return this.http
      .post<any>(`${this.apiUrl}/login`, user)
      .pipe(
        tap(res => {
          this.storeJwtToken(res.token);
          this.setCurruntUser(res.user);
        })
      );
  }

  signup(user: {
    fullName: string;
    email: string;
    password: string;
    iAgree: boolean;
  }) {
    return this.http
      .post<{ token: string, user: any }>(`${this.apiUrl}/signup`, user)
      .pipe(
        tap(res => {
          this.storeJwtToken(res.token);
          this.setCurruntUser(res.user);
        })
      );
  }

  storeJwtToken(jwt: string) {
    localStorage.setItem(this.JWT_TOKEN, jwt);
  }

  setCurruntUser(user: any) {
    localStorage.setItem(this.USER, JSON.stringify(user));
  }

  getJwtToken() {
    return localStorage.getItem(this.JWT_TOKEN);
  }

  getCurrentUser() {
    const userString = localStorage.getItem(this.USER);
    return userString ? JSON.parse(userString) : null;
  }

  getSpecialistId() {
    const currentUser = this.getCurrentUser();
    return currentUser ? currentUser._id : null;
  }

  getSpecialistWorkspace() {
    const currentUser = this.getCurrentUser();
    return currentUser ? currentUser.workspace : null;
  }

  loggedIn() {
    return !!this.getJwtToken();
  }

  logout() {
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem(this.USER);
    // Redirect the user to the login page
    this.router.navigate(['login']);
  }
}
