import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, timer } from 'rxjs'
import { retry } from 'rxjs/operators'

const RETRYABLE_HTTP_STATUSES = new Set([0, 408, 502, 503, 504])
const RETRYABLE_HTTP_METHODS = new Set(['GET', 'HEAD', 'OPTIONS'])
const MAX_RETRIES = 2

@Injectable()
export class RetryTransientInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // Retrying non-idempotent requests (e.g. switch-user POST) can trigger
    // duplicate server-side actions and break account/session flows.
    if (!RETRYABLE_HTTP_METHODS.has(req.method.toUpperCase())) {
      return next.handle(req)
    }

    return next.handle(req).pipe(
      retry({
        count: MAX_RETRIES,
        delay: (error: unknown, retryIndex: number) => {
          if (
            !(error instanceof HttpErrorResponse) ||
            !RETRYABLE_HTTP_STATUSES.has(error.status)
          ) {
            throw error
          }
          // no extra delay by default; keep retryIndex for future backoff
          return timer(0 * retryIndex)
        },
      })
    )
  }
}
