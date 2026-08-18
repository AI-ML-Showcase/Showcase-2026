import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<any> => {
  const router = inject(Router);

  return next(req).pipe(
    catchError(error => {
      // Handle 401 Unauthorized
      if (error.status === 401) {
        // Token expired or invalid
        router.navigate(['/login']);
      }

      // Handle 403 Forbidden
      if (error.status === 403) {
        console.error('Insufficient permissions');
      }

      // Handle 500+ Server errors
      if (error.status >= 500) {
        console.error('Server error:', error);
      }

      return throwError(() => error);
    })
  );
};
