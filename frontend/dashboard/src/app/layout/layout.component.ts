import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    HeaderComponent,
    SidebarComponent,
  ],
  template: `
    <div class="flex h-screen flex-col">
      <!-- Header -->
      <app-header></app-header>

      <!-- Main content with sidebar -->
      <div class="flex flex-1 overflow-hidden">
        <!-- Sidebar -->
        <app-sidebar></app-sidebar>

        <!-- Content area -->
        <main class="flex-1 overflow-auto bg-gray-50">
          <div class="p-6">
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [],
})
export class LayoutComponent {}
