# ADR-018: Mock Data Service for Development

## Status
Accepted

## Context
The backend API is not yet implemented, but frontend development should proceed. We need:
- Realistic mock data for all features
- Simulated API latency (200-500ms)
- Same interfaces as real API
- Easy toggle between mock and real API
- No mock code in production

## Decision
Create `MockDataService` that:
1. Returns mock data matching API response types
2. Simulates realistic delays with RxJS `delay` operator
3. Used in development, excluded from production builds
4. Accepts demo credentials (demo@company.com / demo123)
5. Same Observable-based interface as real API services

## Rationale
1. **Parallel Development**: Frontend and backend teams work independently
2. **Realistic Testing**: 500ms delays catch performance issues
3. **Type Safety**: Mock data matches real API response types
4. **Easy Switching**: Replace MockDataService with real API service via dependency injection
5. **Production Clean**: Tree-shaking removes development-only code

## Implementation
```typescript
// MockDataService provides:
- login(email, password): Observable<AuthResponse>
- getDashboardMetrics(): Observable<DashboardMetrics>
- getCurrentUser(): Observable<User>
- getFraudCases(): Observable<any[]>
- getRecommendations(): Observable<any[]>
- getForecast(days): Observable<any[]>

// Usage in auth.service.ts:
private http: HttpClient | MockDataService (injected)
// At build time, configure provider to use real API in production
```

## Future Migration Path
1. Backend implements `/api/auth/login` endpoint
2. Replace MockDataService with HttpClient calls
3. Remove mock delay logic
4. Point environment.apiUrl to real API
5. Update service dependency injection

## Consequences
- **Positive**: Unblocked frontend development, realistic testing, type-safe mocks
- **Negative**: Need to maintain dual code paths initially
- **Mitigations**: Clear comments marking development-only code, feature flags for API switching

## Related ADRs
- ADR-016: Build & Deployment (production bundling)
- ADR-013: Signals Pattern (state management)
