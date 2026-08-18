import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

export interface DashboardMetrics {
  totalTransactions: number;
  fraudCases: number;
  alertsToday: number;
  avgConfidence: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'engineer' | 'analyst';
  permissions: string[];
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: User;
}

@Injectable({
  providedIn: 'root',
})
export class MockDataService {
  private mockMetrics: DashboardMetrics = {
    totalTransactions: 15243,
    fraudCases: 48,
    alertsToday: 12,
    avgConfidence: 0.942,
  };

  private mockUser: User = {
    id: '1',
    email: 'demo@company.com',
    name: 'Demo User',
    role: 'admin',
    permissions: ['read', 'write', 'delete'],
  };

  private mockAuthResponse: AuthResponse = {
    access_token: 'demo-token-' + Math.random().toString(36).substr(2, 9),
    refresh_token: 'demo-refresh-' + Math.random().toString(36).substr(2, 9),
    expires_in: 3600,
    user: this.mockUser,
  };

  constructor() {}

  /**
   * Mock login - simulates 500ms delay like real API
   */
  login(email: string, password: string): Observable<AuthResponse> {
    // Accept demo credentials or any email/password combo for development
    if (email && password && password.length >= 6) {
      return of(this.mockAuthResponse).pipe(delay(500));
    }
    throw new Error('Invalid credentials');
  }

  /**
   * Mock dashboard metrics fetch
   */
  getDashboardMetrics(): Observable<DashboardMetrics> {
    return of(this.mockMetrics).pipe(delay(300));
  }

  /**
   * Mock user profile fetch
   */
  getCurrentUser(): Observable<User> {
    return of(this.mockUser).pipe(delay(200));
  }

  /**
   * Mock token refresh
   */
  refreshToken(refreshToken: string): Observable<AuthResponse> {
    this.mockAuthResponse.access_token =
      'demo-token-' + Math.random().toString(36).substr(2, 9);
    return of(this.mockAuthResponse).pipe(delay(400));
  }

  /**
   * Mock fraud detection data
   */
  getFraudCases(): Observable<any[]> {
    return of([
      {
        id: '1',
        timestamp: new Date(),
        amount: 2500,
        merchant: 'Suspicious Store X',
        riskScore: 0.95,
        status: 'flagged',
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 3600000),
        amount: 5000,
        merchant: 'Overseas Transaction',
        riskScore: 0.87,
        status: 'reviewed',
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 7200000),
        amount: 150,
        merchant: 'Normal Store',
        riskScore: 0.12,
        status: 'approved',
      },
    ]).pipe(delay(400));
  }

  /**
   * Mock recommendations
   */
  getRecommendations(): Observable<any[]> {
    return of([
      {
        id: '1',
        type: 'product',
        title: 'Product A',
        score: 0.92,
        reason: 'Based on your purchase history',
      },
      {
        id: '2',
        type: 'service',
        title: 'Premium Service',
        score: 0.85,
        reason: 'Recommended for your profile',
      },
      {
        id: '3',
        type: 'product',
        title: 'Product B',
        score: 0.78,
        reason: 'Popular among similar users',
      },
    ]).pipe(delay(350));
  }

  /**
   * Mock forecast data
   */
  getForecast(days: number = 30): Observable<any[]> {
    const forecast = [];
    const now = Date.now();
    for (let i = 0; i < days; i++) {
      forecast.push({
        date: new Date(now + i * 86400000),
        predicted: Math.random() * 10000 + 5000,
        confidence: 0.7 + Math.random() * 0.25,
        lower_bound: Math.random() * 8000 + 4000,
        upper_bound: Math.random() * 12000 + 6000,
      });
    }
    return of(forecast).pipe(delay(500));
  }
}
