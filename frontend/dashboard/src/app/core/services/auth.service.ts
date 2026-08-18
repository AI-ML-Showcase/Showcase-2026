import { Injectable, signal, computed, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { MockDataService } from './mock-data.service';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'engineer' | 'analyst';
  permissions: string[];
}

export interface AuthToken {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Signals
  private authToken = signal<AuthToken | null>(this.loadTokenFromStorage());
  private currentUser = signal<User | null>(null);
  private loading = signal(false);
  private error = signal<string | null>(null);

  // Computed signals
  isAuthenticated = computed(() => this.authToken() !== null);
  userEmail = computed(() => this.currentUser()?.email ?? '');
  userRole = computed(() => this.currentUser()?.role ?? null);
  hasPermission = (permission: string) =>
    computed(() => this.currentUser()?.permissions.includes(permission) ?? false);

  // Effects
  constructor(
    private http: HttpClient,
    private mockDataService: MockDataService
  ) {
    effect(() => {
      if (this.authToken()) {
        this.saveTokenToStorage(this.authToken()!);
      } else {
        this.clearTokenStorage();
      }
    });
  }

  login(email: string, password: string): Observable<AuthToken> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.post<AuthToken>('/api/auth/login', { email, password }).pipe(
      tap(token => {
        this.authToken.set(token);
        this.fetchCurrentUser();
        this.loading.set(false);
      }),
      catchError(err => {
        if (err.status === 404 || err.status === 0) {
          return this.mockDataService.login(email, password).pipe(
            tap(token => {
              this.authToken.set(token);
              this.fetchCurrentUser();
              this.loading.set(false);
            })
          );
        }

        this.error.set('Login failed. Please check your credentials.');
        this.loading.set(false);
        return throwError(() => err);
      })
    );
  }

  logout(): void {
    this.authToken.set(null);
    this.currentUser.set(null);
  }

  refreshToken(): Observable<AuthToken> {
    if (!this.authToken()) {
      return throwError(() => new Error('No token to refresh'));
    }

    return this.http.post<AuthToken>('/api/auth/refresh', {}).pipe(
      tap(token => this.authToken.set(token)),
      catchError(err => {
        if (err.status === 404 || err.status === 0) {
          return this.mockDataService.refreshToken('demo-refresh').pipe(
            tap(token => this.authToken.set(token))
          );
        }

        this.logout();
        return throwError(() => new Error('Token refresh failed'));
      })
    );
  }

  private fetchCurrentUser(): void {
    this.http
      .get<User>('/api/auth/me')
      .pipe(
        catchError(err => {
          if (err.status === 404 || err.status === 0) {
            return this.mockDataService.getCurrentUser();
          }
          return throwError(() => err);
        })
      )
      .subscribe(
        user => this.currentUser.set(user),
        () => this.logout()
      );
  }

  getToken(): string | null {
    return this.authToken()?.access_token ?? null;
  }

  private loadTokenFromStorage(): AuthToken | null {
    try {
      const token = localStorage.getItem('auth_token');
      return token ? JSON.parse(token) : null;
    } catch {
      return null;
    }
  }

  private saveTokenToStorage(token: AuthToken): void {
    localStorage.setItem('auth_token', JSON.stringify(token));
  }

  private clearTokenStorage(): void {
    localStorage.removeItem('auth_token');
  }
}
