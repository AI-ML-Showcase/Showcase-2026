import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES),
      },
      {
        path: 'fraud-detection',
        loadChildren: () => import('./features/fraud-detection/fraud-detection.routes').then(m => m.FRAUD_DETECTION_ROUTES),
      },
      {
        path: 'recommendations',
        loadChildren: () => import('./features/recommendations/recommendations.routes').then(m => m.RECOMMENDATIONS_ROUTES),
      },
      {
        path: 'forecasting',
        loadChildren: () => import('./features/forecasting/forecasting.routes').then(m => m.FORECASTING_ROUTES),
      },
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: '**',
    redirectTo: '/dashboard',
  },
];
