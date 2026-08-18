import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <mat-card class="w-full max-w-md">
        <mat-card-header class="text-center mb-6">
          <mat-card-title class="text-2xl font-bold">Enterprise Dashboard</mat-card-title>
          <p class="text-sm text-gray-600 mt-2">Sign in to your account</p>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onLogin()" class="space-y-4">
            <!-- Email field -->
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Email</mat-label>
              <input
                matInput
                type="email"
                formControlName="email"
                placeholder="your.email@company.com"
              />
              @if (loginForm.get('email')?.hasError('required')) {
                <mat-error>Email is required</mat-error>
              }
              @if (loginForm.get('email')?.hasError('email')) {
                <mat-error>Please enter a valid email</mat-error>
              }
            </mat-form-field>

            <!-- Password field -->
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Password</mat-label>
              <input
                matInput
                type="password"
                formControlName="password"
                placeholder="Enter your password"
              />
              @if (loginForm.get('password')?.hasError('required')) {
                <mat-error>Password is required</mat-error>
              }
            </mat-form-field>

            <!-- Error message -->
            @if (error()) {
              <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {{ error() }}
              </div>
            }

            <!-- Submit button -->
            <button
              mat-raised-button
              color="primary"
              type="submit"
              class="w-full"
              [disabled]="loading() || !loginForm.valid"
            >
              @if (loading()) {
                <mat-spinner diameter="24" class="inline mr-2"></mat-spinner>
                Signing in...
              } @else {
                Sign In
              }
            </button>
          </form>

          <!-- Demo credentials -->
          <div class="mt-6 pt-6 border-t border-gray-200">
            <p class="text-xs text-gray-600 mb-2">Demo credentials:</p>
            <div class="bg-gray-50 p-3 rounded text-xs space-y-1">
              <p><strong>Email:</strong> demo&#64;company.com</p>
              <p><strong>Password:</strong> demo123</p>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      :host ::ng-deep {
        .mat-form-field {
          width: 100%;
        }

        mat-spinner {
          display: inline-block;
        }
      }
    `,
  ],
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onLogin(): void {
    if (this.loginForm.invalid) return;

    this.loading.set(true);
    this.error.set(null);

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set('Login failed. Please check your credentials.');
        console.error('Login error:', err);
      },
    });
  }
}
