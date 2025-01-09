import { computed, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { AuthResponse } from '../models/authResponse.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = environment.apiUrl;

  private accessToken = signal<string | null>(
    localStorage.getItem('accessToken')
  );
  private refreshToken = signal<string | null>(
    localStorage.getItem('refreshToken')
  );

  isAuthenticated = computed(() => !!this.accessToken());

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap((response) => this.setSession(response)),
        catchError((error) => throwError(() => error))
      );
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.accessToken.set(null);
    this.refreshToken.set(null);
    this.router.navigate(['/login']);
  }

  private setSession(response: AuthResponse): void {
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    this.accessToken.set(response.accessToken);
    this.refreshToken.set(response.refreshToken);
  }

  refreshTokens(): Observable<AuthResponse> {
    const refreshToken = this.refreshToken();
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/auth/refresh`, { refreshToken })
      .pipe(
        tap((response) => this.setSession(response)),
        catchError((error) => {
          this.logout();
          return throwError(() => error);
        })
      );
  }

  getAccessToken(): string | null {
    return this.accessToken();
  }
}
