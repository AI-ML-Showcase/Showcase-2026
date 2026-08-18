import { Component, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { DashboardComponent } from '../components/dashboard.component';
import { MockDataService } from '../../../core/services/mock-data.service';

export interface DashboardMetrics {
  totalTransactions: number;
  fraudCases: number;
  alertsToday: number;
  avgConfidence: number;
}

@Component({
  selector: 'app-dashboard-container',
  standalone: true,
  imports: [CommonModule, DashboardComponent],
  template: `
    @if (loading()) {
      <div class="text-center py-12">
        <p class="text-gray-600">Loading dashboard...</p>
      </div>
    } @else {
      <app-dashboard [metrics]="metrics()"></app-dashboard>
    }
  `,
})
export class DashboardContainerComponent implements OnInit {
  // Signals
  metrics = signal<DashboardMetrics>({
    totalTransactions: 0,
    fraudCases: 0,
    alertsToday: 0,
    avgConfidence: 0,
  });
  loading = signal(true);

  constructor(
    private http: HttpClient,
    private mockDataService: MockDataService
  ) {
    // Effect to handle metrics loading
    effect(() => {
      if (this.metrics()) {
        console.log('Metrics updated:', this.metrics());
      }
    });
  }

  ngOnInit(): void {
    this.loadMetrics();
  }

  private loadMetrics(): void {
    this.http
      .get<DashboardMetrics>('/api/dashboard/metrics')
      .pipe(
        catchError(error => {
          if (error.status === 404 || error.status === 0) {
            return this.mockDataService.getDashboardMetrics();
          }
          return throwError(() => error);
        })
      )
      .subscribe({
        next: metrics => {
          this.metrics.set(metrics);
          this.loading.set(false);
        },
        error: error => {
          console.error('Failed to load metrics', error);
          this.loading.set(false);
        },
      });
  }
}
