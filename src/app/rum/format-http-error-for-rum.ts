import { HttpErrorResponse } from '@angular/common/http'

/**
 * Stable string for RUM journey attributes.
 * Avoids passing `error.error` (ProgressEvent / opaque body) as an object.
 */
export function formatHttpErrorForRum(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    return summarizeHttpErrorResponse(error)
  }
  if (error && typeof error === 'object') {
    const o = error as Record<string, unknown>
    if (typeof o.status === 'number') {
      const url = typeof o.url === 'string' ? o.url : ''
      const msg = typeof o.message === 'string' ? o.message : ''
      const st = typeof o.statusText === 'string' ? o.statusText : ''
      return `${o.status} ${st} ${msg} ${url}`.trim()
    }
  }
  if (error instanceof Error) {
    return error.message
  }
  return String(error)
}

function summarizeHttpErrorResponse(error: HttpErrorResponse): string {
  const status = `${error.status} ${error.statusText || ''}`.trim()
  const url = error.url ? ` ${error.url}` : ''

  const body = error.error
  if (body == null || body === '') {
    return `${status}${url}`.trim()
  }
  if (typeof body === 'string') {
    return `${status}: ${body.slice(0, 300)}${url}`
  }
  if (typeof body === 'object' && body !== null) {
    const anyBody = body as Record<string, unknown>
    if ('isTrusted' in anyBody) {
      return `${status} (network blocked, CORS, or request aborted)${url}`
    }
    try {
      return `${status}: ${JSON.stringify(body).slice(0, 300)}${url}`
    } catch {
      return `${status}${url}`
    }
  }
  return `${status}${url}`
}
