import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';

export interface DashboardMetrics {
  totalTransactions: number;
  fraudCases: number;
  alertsToday: number;
  avgConfidence: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatGridListModule, MatIconModule],
  template: `
    <div class="space-y-6">
      <!-- Page title -->
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p class="text-gray-600 mt-2">Welcome to the Enterprise AI/ML Platform</p>
      </div>

      <!-- Metrics grid -->
      <mat-grid-list cols="4" rowHeight="160px" class="gap-4">
        <!-- Total Transactions -->
        <mat-grid-tile>
          <mat-card class="w-full bg-white shadow">
            <mat-card-content class="flex flex-col justify-center h-full">
              <div class="text-center">
                <mat-icon class="text-4xl text-blue-500">trending_up</mat-icon>
                <p class="text-2xl font-bold text-gray-900">
                  {{ (metrics().totalTransactions | number) ?? '-' }}
                </p>
                <p class="text-sm text-gray-600">Total Transactions</p>
              </div>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>

        <!-- Fraud Cases -->
        <mat-grid-tile>
          <mat-card class="w-full bg-white shadow">
            <mat-card-content class="flex flex-col justify-center h-full">
              <div class="text-center">
                <mat-icon class="text-4xl text-red-500">warning</mat-icon>
                <p class="text-2xl font-bold text-gray-900">
                  {{ (metrics().fraudCases | number) ?? '-' }}
                </p>
                <p class="text-sm text-gray-600">Fraud Cases Detected</p>
              </div>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>

        <!-- Alerts Today -->
        <mat-grid-tile>
          <mat-card class="w-full bg-white shadow">
            <mat-card-content class="flex flex-col justify-center h-full">
              <div class="text-center">
                <mat-icon class="text-4xl text-yellow-500">notifications_active</mat-icon>
                <p class="text-2xl font-bold text-gray-900">
                  {{ (metrics().alertsToday | number) ?? '-' }}
                </p>
                <p class="text-sm text-gray-600">Alerts Today</p>
              </div>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>

        <!-- Avg Confidence -->
        <mat-grid-tile>
          <mat-card class="w-full bg-white shadow">
            <mat-card-content class="flex flex-col justify-center h-full">
              <div class="text-center">
                <mat-icon class="text-4xl text-green-500">check_circle</mat-icon>
                <p class="text-2xl font-bold text-gray-900">
                  {{ (metrics().avgConfidence * 100).toFixed(1) }}%
                </p>
                <p class="text-sm text-gray-600">Avg Confidence</p>
              </div>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>
      </mat-grid-list>

      <!-- Quick stats section -->
      <mat-card class="bg-white shadow">
        <mat-card-header>
          <mat-card-title>System Status</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="grid grid-cols-2 gap-4">
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                <mat-icon class="text-green-500">check_circle</mat-icon>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">All Services</p>
                <p class="text-xs text-gray-600">Operational</p>
              </div>
            </div>
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                <mat-icon class="text-blue-500">storage</mat-icon>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">Data Pipeline</p>
                <p class="text-xs text-gray-600">Last update 5 minutes ago</p>
              </div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      :host ::ng-deep {
        .mat-grid-tile {
          padding: 8px;
        }

        .mat-card {
          margin: 0;
        }
      }
    `,
  ],
})
export class DashboardComponent {
  metrics = input<DashboardMetrics>({
    totalTransactions: 0,
    fraudCases: 0,
    alertsToday: 0,
    avgConfidence: 0,
  });
}
