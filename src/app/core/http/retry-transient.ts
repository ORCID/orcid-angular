import { HttpContextToken, HttpErrorResponse } from '@angular/common/http'
import { MonoTypeOperatorFunction, timer } from 'rxjs'
import { retry } from 'rxjs/operators'

export const RETRYABLE_HTTP_STATUSES = new Set([0, 408, 502, 503, 504])
export const SKIP_TRANSIENT_RETRY = new HttpContextToken<boolean>(() => false)

export function retryTransient<T>(
  maxRetries = 2,
  retryDelayMs = 0
): MonoTypeOperatorFunction<T> {
  return retry({
    count: maxRetries,
    delay: (error: unknown, retryIndex: number) => {
      if (
        !(error instanceof HttpErrorResponse) ||
        !RETRYABLE_HTTP_STATUSES.has(error.status)
      ) {
        throw error
      }
      return timer(retryDelayMs * retryIndex)
    },
  })
}
