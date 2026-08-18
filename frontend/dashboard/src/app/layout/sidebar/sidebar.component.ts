import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatListModule, MatIconModule],
  template: `
    <nav class="w-64 bg-white border-r border-gray-200">
      <mat-nav-list>
        <h3 matSubheader class="px-4 py-3 text-sm font-semibold text-gray-700">
          Navigation
        </h3>

        <mat-list-item
          *ngFor="let item of navItems"
          [routerLink]="item.route"
          routerLinkActive="active"
          class="nav-item"
        >
          <mat-icon matListItemIcon>{{ item.icon }}</mat-icon>
          <span matListItemTitle>{{ item.label }}</span>
        </mat-list-item>

        <mat-divider></mat-divider>

        <h3 matSubheader class="px-4 py-3 text-sm font-semibold text-gray-700">
          Analytics
        </h3>

        <mat-list-item routerLink="/reports" routerLinkActive="active">
          <mat-icon matListItemIcon>assessment</mat-icon>
          <span matListItemTitle>Reports</span>
        </mat-list-item>

        <mat-list-item routerLink="/settings" routerLinkActive="active">
          <mat-icon matListItemIcon>settings</mat-icon>
          <span matListItemTitle>Settings</span>
        </mat-list-item>
      </mat-nav-list>
    </nav>
  `,
  styles: [
    `
      :host ::ng-deep {
        .nav-item {
          &.active {
            background-color: #f3f4f6;
            border-left: 4px solid #3b82f6;
          }
        }
      }
    `,
  ],
})
export class SidebarComponent {
  navItems: NavItem[] = [
    { label: 'Dashboard', route: '/dashboard', icon: 'dashboard' },
    { label: 'Fraud Detection', route: '/fraud-detection', icon: 'warning' },
    { label: 'Recommendations', route: '/recommendations', icon: 'thumb_up' },
    { label: 'Forecasting', route: '/forecasting', icon: 'trending_up' },
  ];
}
