import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';

import { environment } from '../../environments/environment';
import { ApiError, ApiResponse } from '../models';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    map((event) => {
      if (event instanceof HttpResponse && isApiRequest(req)) {
        return event.clone({ body: unwrapApiResponse(event.body) });
      }

      return event;
    }),
    catchError((error: HttpErrorResponse) => {
      const apiError = toApiError(error);

      console.error(
        `[HTTP] ${req.method} ${req.urlWithParams} → ${apiError.status}: ${apiError.message}`,
        apiError
      );

      return throwError(() => apiError);
    })
  );
};

function isApiRequest(req: HttpRequest<unknown>): boolean {
  return req.url.startsWith(environment.apiUrl);
}

function unwrapApiResponse(body: unknown): unknown {
  if (isApiEnvelope(body)) {
    return body.data;
  }

  return body;
}

function isApiEnvelope(body: unknown): body is ApiResponse<unknown> {
  return typeof body === 'object' && body !== null && 'data' in body;
}

function toApiError(error: HttpErrorResponse): ApiError {
  return {
    status: error.status,
    message: extractErrorMessage(error),
    url: error.url ?? undefined,
  };
}

function extractErrorMessage(error: HttpErrorResponse): string {
  if (typeof error.error === 'string') {
    return error.error;
  }

  if (Array.isArray(error.error?.errors) && error.error.errors.length > 0) {
    return error.error.errors.join(' ');
  }

  if (error.error?.message) {
    return error.error.message;
  }

  if (error.status === 0) {
    return 'Unable to reach the server. Check your connection.';
  }

  if (error.status >= 500) {
    return 'A server error occurred. Please try again later.';
  }

  return error.message || 'An unexpected error occurred';
}
