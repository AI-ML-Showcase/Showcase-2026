import { Routes } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-forecasting',
  standalone: true,
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Forecasting</h1>
        <p class="text-gray-600 mt-2">Time series forecasting and predictions</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow">
        <p class="text-gray-600">Forecasting module coming soon...</p>
      </div>
    </div>
  `,
})
class ForecastingComponent {}

export const FORECASTING_ROUTES: Routes = [
  {
    path: '',
    component: ForecastingComponent,
  },
];
