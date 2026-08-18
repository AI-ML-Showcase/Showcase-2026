import { Routes } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-recommendations',
  standalone: true,
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Recommendations</h1>
        <p class="text-gray-600 mt-2">AI-powered recommendation engine</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow">
        <p class="text-gray-600">Recommendation engine module coming soon...</p>
      </div>
    </div>
  `,
})
class RecommendationsComponent {}

export const RECOMMENDATIONS_ROUTES: Routes = [
  {
    path: '',
    component: RecommendationsComponent,
  },
];
