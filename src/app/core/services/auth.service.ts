import {
  computed,
  Inject,
  Injectable,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { AuthResponse } from '../models/authResponse.model';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { CustomJwtPayload } from '../models/jwt.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = environment.apiUrl;

  // Initialize signals with null to avoid accessing localStorage too early.
  private accessToken = signal<string | null>(null);
  private refreshToken = signal<string | null>(null);
  private authInitialized = signal(false);

  isAuthenticated = computed(() => !!this.accessToken());

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    // Only use localStorage if running in the browser.
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('accessToken');
      const refresh = localStorage.getItem('refreshToken');
      this.accessToken.set(token);
      this.refreshToken.set(refresh);
      this.authInitialized.set(true);
    }
  }

  login(email: string, password: string): Observable<AuthResponse | null> {
    // Ensure that login is performed only on the browser.
    if (isPlatformBrowser(this.platformId)) {
      return this.http
        .post<AuthResponse>(`${this.apiUrl}/auth/login`, { email, password })
        .pipe(
          tap((response) => this.setSession(response)),
          catchError((error) => throwError(() => error))
        );
    } else {
      return of(null);
    }
  }

  logout(): void {
    // Only manipulate localStorage in the browser.
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
    this.accessToken.set(null);
    this.refreshToken.set(null);
    this.router.navigate(['/login']);
  }

  private setSession(response: AuthResponse): void {
    // Only update localStorage on the browser.
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
    }
    this.accessToken.set(response.accessToken);
    this.refreshToken.set(response.refreshToken);
  }

  refreshTokens(): Observable<AuthResponse> {
    const currentRefreshToken = this.refreshToken();
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/auth/refresh`, {
        refreshToken: currentRefreshToken,
      })
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

  getDecodedAccessToken(): CustomJwtPayload | null {
    const token = this.getAccessToken();
    if (!token) {
      return null;
    }
    try {
      return jwtDecode<CustomJwtPayload>(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  isAuthInitialized() {
    return this.authInitialized();
  }
}
