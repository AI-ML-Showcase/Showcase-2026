# Enterprise AI/ML Dashboard Frontend

A production-ready Angular 18 LTS dashboard for enterprise AI/ML systems. This application demonstrates modern Angular architecture, best practices, and operational excellence patterns.

## Features

- **Enterprise Architecture**: Component-based design with lazy-loaded feature modules
- **State Management**: Angular Signals pattern for reactive state
- **Authentication**: JWT-based auth with token refresh, guards, and interceptors
- **Material Design**: Professional UI with accessibility (WCAG compliance)
- **Responsive Layout**: Mobile-friendly dashboard with sidebar navigation
- **Type Safety**: Strict TypeScript configuration with full type coverage
- **Dashboard Metrics**: Real-time metrics display for AI/ML systems
- **Feature Modules**: Modular organization - Dashboard, Fraud Detection, Recommendations, Forecasting

## Quick Start

### Prerequisites
- Node.js 18+ and npm 9+
- Angular CLI 18+

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Application available at http://localhost:4200
```

### Demo Credentials
```
Email: demo@company.com
Password: demo123
```

## Build & Deployment

```bash
# Development build with source maps
npm run build

# Production build with optimization
npm run build:prod

# Run tests with coverage
npm test -- --code-coverage

# Run E2E tests
npm run e2e
```

## Project Structure

```
src/
├── app/
│   ├── core/
│   │   ├── services/          # Business logic (auth, api)
│   │   ├── guards/            # Route guards (auth, permissions)
│   │   └── interceptors/       # HTTP interceptors
│   ├── shared/
│   │   ├── components/        # Reusable UI components
│   │   ├── pipes/             # Custom pipes
│   │   └── directives/        # Custom directives
│   ├── features/
│   │   ├── dashboard/         # Dashboard feature module
│   │   ├── fraud-detection/   # Fraud detection module
│   │   ├── recommendations/   # Recommendations module
│   │   └── forecasting/       # Forecasting module
│   ├── layout/
│   │   ├── header/            # Top navigation
│   │   └── sidebar/           # Side navigation
│   ├── app.config.ts          # App configuration & providers
│   ├── app.routes.ts          # Main routing definition
│   └── app.component.ts       # Root component
├── environments/              # Environment-specific config
├── styles.scss               # Global styles + Tailwind
└── main.ts                   # Application entry point
```

## Architecture Patterns

### 1. Standalone Components
All components are standalone (no NgModules). This is the modern Angular 17+ approach.

```typescript
@Component({
  standalone: true,
  imports: [CommonModule, MatModule],
  template: `...`,
})
export class MyComponent {}
```

### 2. Signals State Management
Uses Angular Signals for reactive state instead of RxJS subjects.

```typescript
private data = signal<Type | null>(null);
public data$ = computed(() => this.data());

constructor() {
  effect(() => {
    // Side effects: logging, persistence, API calls
  });
}
```

### 3. Smart/Dumb Components
Feature containers load data (Smart), pass to presentational components (Dumb).

```typescript
// Smart (Container) - loads data, manages state
@Component({ template: `<app-dumb [data]="metrics()"></app-dumb>` })
class DashboardContainer { /* loads and manages state */ }

// Dumb (Presentational) - receives data, renders UI
@Component({ template: `<div>{{ data().value }}</div>` })
class Dashboard { data = input<Type>(); }
```

### 4. Lazy-loaded Feature Routes
Features are loaded on-demand via Angular Router.

```typescript
{
  path: 'dashboard',
  loadComponent: () => import('./features/dashboard/routes')
    .then(m => m.DASHBOARD_ROUTES),
  canActivate: [authGuard]
}
```

### 5. Functional Interceptors & Guards
Modern Angular 17+ functional approach instead of classes.

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).getToken();
  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }
  return next(req);
};
```

## Authentication Flow

1. User enters credentials on login page
2. LoginComponent calls `authService.login(email, password)`
3. Service makes POST request to `/api/auth/login`
4. Server returns `{ access_token, refresh_token, expires_in }`
5. Token stored in localStorage via Signals effect
6. `authInterceptor` adds token to subsequent requests
7. `authGuard` protects routes requiring authentication
8. Token refresh on 401 response via error interceptor

## API Integration

### Environment Configuration
```typescript
// environment.ts (development)
apiUrl: 'http://localhost:3000/api'

// environment.prod.ts (production)
apiUrl: 'https://api.company.com/api'
```

### Service HTTP Calls
```typescript
// auth.service.ts
login(email: string, password: string): Observable<AuthResponse> {
  return this.http.post<AuthResponse>('/auth/login', { email, password });
}

// dashboard.service.ts
getMetrics(): Observable<DashboardMetrics> {
  return this.http.get<DashboardMetrics>('/dashboard/metrics');
}
```

## Styling

### Material Design + Tailwind
- **Material**: Components (buttons, cards, toolbars, forms), accessibility, themes
- **Tailwind**: Utility classes, responsive design, semantic spacing

```html
<!-- Example: Material card with Tailwind spacing -->
<mat-card class="p-6 mb-4 shadow-lg">
  <h2 class="text-2xl font-bold text-gray-900 mb-4">Metrics</h2>
  <div class="grid grid-cols-4 gap-4">
    <!-- metric cards -->
  </div>
</mat-card>
```

## Testing Strategy

### Unit Tests (60% - Services, Pipes, Utilities)
```bash
npm test
```
- Service method testing with HttpTestingController
- Pipe transformation testing
- Utility function testing

### Component Tests (30% - UI, Inputs/Outputs)
```bash
npm test -- --include='**/*.component.spec.ts'
```
- Component initialization
- Input/output binding
- User interactions
- Template rendering

### E2E Tests (10% - Critical Paths)
```bash
npm run e2e
```
- Login flow
- Navigation
- Feature interactions

### Coverage Goal
- Overall: >80%
- Critical paths: >95%
- UI components: >70%

```bash
npm test -- --code-coverage
```

## Architecture Decision Records (ADRs)

Key architectural decisions documented:
- **ADR-011**: Angular 18 LTS as framework
- **ADR-012**: Standalone components with feature-based organization
- **ADR-013**: Signals pattern for reactive state
- **ADR-014**: Material + Tailwind integration
- **ADR-015**: Three-tier testing pyramid
- **ADR-016**: Docker/Kubernetes deployment
- **ADR-017**: Reactive login form with Material Design

See `/docs/decisions/` for full details.

## Development Workflow

### Add a New Feature Module
1. Create feature folder: `src/app/features/my-feature/`
2. Create routes: `my-feature.routes.ts` with FEATURE_ROUTES export
3. Update `app.routes.ts` to lazy-load the feature
4. Create container/presentational components in feature
5. Implement services for business logic
6. Add tests for all components/services

### Add a Shared Component
1. Create in `src/app/shared/components/`
2. Make standalone with proper imports
3. Use in features by importing directly
4. Document usage in component JSDoc

### Add a Service
1. Create in `src/app/core/services/` (core) or feature folder
2. Use Signals for state management
3. Use HttpClient for API calls
4. Export public observables/signals only
5. Add unit tests with HttpTestingController

## Performance Optimization

### Bundle Optimization
- Lazy loading of feature routes
- Tree-shaking of unused code
- Differential loading for modern browsers
- Gzip compression (nginx)

### Change Detection
- OnPush strategy for component trees
- Signals reactive change detection
- Computed signals for derived state

### HTTP Optimization
- Reuse HttpClient instance via injection
- Cancel pending requests on component destroy
- Implement request caching
- Batch API requests when possible

## Security

### OWASP Compliance
- **XSS Prevention**: Angular sanitization, no innerHTML without bypassSecurityTrustHtml
- **CSRF Protection**: Add CSRF token to state-changing requests
- **SQL Injection**: Use parameterized API requests
- **Auth**: JWT in httpOnly cookie (preferred) or localStorage
- **Data Validation**: Client-side + server-side validation

### Implementation
- `authGuard` protects routes
- `authInterceptor` adds bearer tokens
- `errorInterceptor` handles 401/403
- Strict CORS headers on backend
- Content-Security-Policy headers

## Deployment

### Docker
```bash
# Build Docker image
docker build -t dashboard:latest .

# Run container
docker run -p 80:80 dashboard:latest
```

### Kubernetes
```bash
# Deploy to cluster
kubectl apply -f k8s/deployment.yaml

# View deployment
kubectl get deployments dashboard
```

### Environment-specific Configuration
- Development: `ng serve` (dev server)
- Staging: `npm run build` + deploy to staging cluster
- Production: `npm run build:prod` + deploy to production cluster

## Monitoring & Logging

### Client-side Logging
- Browser console for development
- Error reporting service for production
- User session tracking

### Application Metrics
- HTTP request duration
- Component render performance
- Bundle size tracking

## Troubleshooting

### Common Issues

**Port 4200 already in use:**
```bash
ng serve --port 4300
```

**Styles not loading:**
```bash
npm install
npm start
```

**Module resolution errors:**
- Check `tsconfig.json` path aliases
- Ensure standalone component imports all dependencies
- Verify barrel exports in index.ts files

**Authentication errors:**
- Check API endpoint in `environment.ts`
- Verify demo credentials
- Check browser console for CORS errors

## Resources

- [Angular 18 Documentation](https://angular.io)
- [Angular Material](https://material.angular.io)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript](https://www.typescriptlang.org)
- [RxJS](https://rxjs.dev)

## Contributing

Follow established patterns:
1. Use standalone components
2. Implement Signals for state
3. Create unit tests for services
4. Create component tests for UI
5. Follow TypeScript strict mode
6. Add JSDoc comments for public APIs
7. Create ADR for significant decisions

## License

Enterprise AI/ML Showcase - Internal Use Only

## Support

For issues or questions, contact the platform team.
