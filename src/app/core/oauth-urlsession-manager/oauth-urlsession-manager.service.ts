import { Injectable } from '@angular/core'

const LOCALSTORAGE_KEY = 'oauthRedirectUrl'

/**
 * 30 minutes expressed in milliseconds.
 */
const EXPIRATION_MS = 30 * 60 * 1000

interface StoredRedirect {
  /** Full OAuth URL (query string and all) */
  url: string
  /** Epoch-millis when this entry should be considered expired */
  expiresAt: number
}

/**
 * Centralised helper for persisting the inbound OAuth authorisation URL
 * while the visitor completes sign‑in, registration, password‑reset, etc.
 */

@Injectable({
  providedIn: 'root',
})
export class OauthURLSessionManagerService {
  /**
   * Persist the OAuth URL with a 30‑minute TTL.
   */
  set(url: string): void {
    if (!url) {
      throw new Error('Empty OAuth redirect url passed to OauthRedirectService')
    }

    const payload: StoredRedirect = {
      url,
      expiresAt: Date.now() + EXPIRATION_MS,
    }

    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(payload))
  }

  /**
   * Retrieve the stored OAuth URL **with the `login`, `prompt`, and `promp`
   * parameters stripped out**, if it exists and hasn’t expired.
   *
   * If the payload is corrupt or older than 30 minutes, it’s cleared and
   * `null` is returned instead.
   */
  get(): string | null {
    const raw = localStorage.getItem(LOCALSTORAGE_KEY)
    if (!raw) {
      return null
    }

    try {
      const payload = JSON.parse(raw) as StoredRedirect

      if (payload.expiresAt && payload.expiresAt > Date.now()) {
        return this.cleanUrl(payload.url)
      }
    } catch {
      // Ignore JSON parse errors and treat as invalid.
    }

    // Either the payload was corrupt or has timed‑out.
    this.clear()
    return null
  }

  /**
   * Remove the redirect entry from storage.
   */
  clear(): void {
    localStorage.removeItem(LOCALSTORAGE_KEY)
  }

  /**
   * Strip auth‑flow hints that shouldn’t survive redirects (`show_login`, `prompt`).
   *  Falls back gracefully if the URL
   * constructor fails (e.g. non‑absolute URL strings in very old browsers).
   */
  private cleanUrl(rawUrl: string): string {
    try {
      const u = new URL(rawUrl)
      ;['show_login', 'prompt'].forEach((param) => u.searchParams.delete(param))
      return u.toString()
    } catch {
      return rawUrl // Best effort; return original if parsing fails.
    }
  }
}
