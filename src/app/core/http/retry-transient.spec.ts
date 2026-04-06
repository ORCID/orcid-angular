import { HttpErrorResponse } from '@angular/common/http'
import { defer, of, throwError } from 'rxjs'
import { retryTransient } from './retry-transient'

describe('retryTransient', () => {
  it('retries up to the max retries for retryable HTTP statuses', (done) => {
    let attempts = 0
    const source$ = defer(() => {
      attempts++
      if (attempts <= 2) {
        return throwError(
          () => new HttpErrorResponse({ status: 503, statusText: 'Retry me' })
        )
      }
      return of('ok')
    })

    source$.pipe(retryTransient(2)).subscribe({
      next: (value) => {
        expect(value).toBe('ok')
        expect(attempts).toBe(3)
        done()
      },
      error: done.fail,
    })
  })

  it('does not retry for non-retryable 4xx statuses', (done) => {
    let attempts = 0
    const err = new HttpErrorResponse({ status: 400, statusText: 'Bad' })
    const source$ = defer(() => {
      attempts++
      return throwError(() => err)
    })

    source$.pipe(retryTransient(2)).subscribe({
      next: () => done.fail('expected error'),
      error: (e) => {
        expect(e).toBe(err)
        expect(attempts).toBe(1)
        done()
      },
    })
  })

  it('does not retry for HTTP 500', (done) => {
    let attempts = 0
    const err = new HttpErrorResponse({ status: 500, statusText: 'No retry' })
    const source$ = defer(() => {
      attempts++
      return throwError(() => err)
    })

    source$.pipe(retryTransient(2)).subscribe({
      next: () => done.fail('expected error'),
      error: (e) => {
        expect(e).toBe(err)
        expect(attempts).toBe(1)
        done()
      },
    })
  })
})

