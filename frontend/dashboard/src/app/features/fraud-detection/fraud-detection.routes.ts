import { Routes } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-fraud-detection',
  standalone: true,
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Fraud Detection</h1>
        <p class="text-gray-600 mt-2">Real-time fraud detection and analysis</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow">
        <p class="text-gray-600">Fraud detection module coming soon...</p>
      </div>
    </div>
  `,
})
class FraudDetectionComponent {}

export const FRAUD_DETECTION_ROUTES: Routes = [
  {
    path: '',
    component: FraudDetectionComponent,
  },
];
