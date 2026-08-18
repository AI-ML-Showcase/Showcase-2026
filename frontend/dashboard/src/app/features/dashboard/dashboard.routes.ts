import { Routes } from '@angular/router';
import { DashboardContainerComponent } from './containers/dashboard-container.component';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: DashboardContainerComponent,
  },
];
