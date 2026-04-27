import { HttpErrorResponse } from '@angular/common/http'

type HttpErrorContext = {
  browserSupport: string
  csrf: string
  xsrfCookiePresent?: boolean
  authXsrfCookiePresent?: boolean
  csrfCookieState?: 'both' | 'xsrf_only' | 'auth_only' | 'none'
  currentOrigin?: string
  currentHost?: string
  currentPath?: string
  referrerHost?: string
  isOnline?: boolean
}

type StatusZeroCause = 'offline' | 'aborted' | 'network_or_cors' | 'unknown'
const MAX_ERROR_BODY_CHARS = 1000

export function httpErrorEventAttrs(
  error: HttpErrorResponse,
  context: HttpErrorContext
): Record<string, unknown> {
  const attrs: Record<string, unknown> = {
    status: error.status,
    statusText: error.statusText,
    url: error.url,
    name: error.name,
    browserSupport: context.browserSupport,
    csrf: context.csrf,
    xsrfCookiePresent: context.xsrfCookiePresent,
    authXsrfCookiePresent: context.authXsrfCookiePresent,
    csrfCookieState: context.csrfCookieState,
    requestPath: requestPath(error.url, context.currentOrigin),
    requestHost: requestHost(error.url, context.currentOrigin),
    requestOriginType: requestOriginType(error.url, context.currentOrigin),
    currentPath: context.currentPath,
    currentHost: context.currentHost,
    referrerHost: context.referrerHost,
    isOnline: context.isOnline,
    errorBody: errorBody(error.error),
    errorBodyType: errorBodyType(error.error),
  }

  const zeroCause = statusZeroCause(error, context.isOnline)
  if (zeroCause) {
    attrs.statusZeroCause = zeroCause
  }

  return attrs
}

function statusZeroCause(
  error: HttpErrorResponse,
  isOnline: boolean | undefined
): StatusZeroCause | undefined {
  if (error.status !== 0) {
    return undefined
  }

  if (isOnline === false) {
    return 'offline'
  }

  const body = error.error as any
  if (body && typeof body === 'object') {
    if (typeof body.type === 'string' && body.type.toLowerCase() === 'abort') {
      return 'aborted'
    }
    if ('isTrusted' in body) {
      return 'network_or_cors'
    }
  }

  if (/abort/i.test(error.message || '')) {
    return 'aborted'
  }

  if (isOnline === true) {
    return 'network_or_cors'
  }
  return 'unknown'
}

function requestPath(
  url: string | null,
  currentOrigin: string | undefined
): string | undefined {
  const parsed = parseUrl(url, currentOrigin)
  return parsed?.pathname
}

function requestHost(
  url: string | null,
  currentOrigin: string | undefined
): string | undefined {
  const parsed = parseUrl(url, currentOrigin)
  return parsed?.host
}

function requestOriginType(
  url: string | null,
  currentOrigin: string | undefined
): 'same_origin' | 'cross_origin' | 'invalid_or_missing' {
  const parsed = parseUrl(url, currentOrigin)
  if (!parsed) {
    return 'invalid_or_missing'
  }
  if (!currentOrigin) {
    return 'invalid_or_missing'
  }
  return parsed.origin === currentOrigin ? 'same_origin' : 'cross_origin'
}

function parseUrl(
  url: string | null,
  currentOrigin: string | undefined
): URL | undefined {
  if (!url) {
    return undefined
  }
  try {
    if (currentOrigin) {
      return new URL(url, currentOrigin)
    }
    return new URL(url)
  } catch {
    return undefined
  }
}

function errorBodyType(value: unknown): string {
  if (value == null || value === '') {
    return 'none'
  }
  if (typeof value === 'string') {
    return 'string'
  }
  if (value instanceof ProgressEvent) {
    return 'progress_event'
  }
  if (Array.isArray(value)) {
    return 'array'
  }
  if (typeof value === 'object') {
    const ctor = (value as object).constructor?.name
    return ctor ? `object:${ctor}` : 'object'
  }
  return typeof value
}

function errorBody(value: unknown): string | undefined {
  if (value == null || value === '') {
    return undefined
  }
  if (typeof value === 'string') {
    return truncate(value, MAX_ERROR_BODY_CHARS)
  }
  if (value instanceof ProgressEvent) {
    return truncate(
      JSON.stringify({
        type: value.type,
        isTrusted: value.isTrusted,
      }),
      MAX_ERROR_BODY_CHARS
    )
  }
  if (typeof value === 'object') {
    try {
      return truncate(JSON.stringify(value), MAX_ERROR_BODY_CHARS)
    } catch {
      return undefined
    }
  }
  return truncate(String(value), MAX_ERROR_BODY_CHARS)
}

function truncate(value: string, maxChars: number): string {
  if (value.length <= maxChars) {
    return value
  }
  return `${value.slice(0, maxChars)}...[truncated]`
}
