# ADR-017: Reactive Login Form with Material Design

## Status
Accepted

## Context
The application needs a secure, user-friendly login form that:
- Validates email and password inputs
- Provides clear error feedback
- Handles async authentication operations
- Follows Material Design principles
- Integrates with Angular's Reactive Forms

## Decision
Implement login form using Angular Reactive Forms (FormBuilder, FormGroup) with Material Design components (MatFormField, MatCard, MatButton) and inline error messages.

## Rationale
1. **Reactive Forms**: Type-safe, composable, and reactive architecture
2. **Material Components**: Professional styling, accessibility (WCAG compliance), consistency
3. **Tailwind Utility Classes**: Gradient background, responsive layout, semantic spacing
4. **Signal-based Loading/Error**: Async state management without RxJS subscriptions
5. **Demo Credentials**: Shows example login for development/demo purposes

## Implementation Details
```typescript
// Form validation rules
- email: [required, email format]
- password: [required, minLength 6]

// States tracked with signals
- loading: boolean (during login request)
- error: string | null (error message display)

// Error handling
- Network errors: "Login failed. Please check your credentials."
- Server errors: Logged to console, user-friendly message displayed
- Form validation: Real-time feedback per field
```

## Consequences
- **Positive**: Clean, typed forms; professional UI; clear error feedback
- **Negative**: Requires Material CSS bundle; FormBuilder setup boilerplate
- **Mitigations**: Material CSS lazy-loaded; FormBuilder patterns documented in codebase

## Related ADRs
- ADR-013: Signals Pattern for State Management
- ADR-014: Material + Tailwind Integration
