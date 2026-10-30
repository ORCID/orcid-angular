import { Injectable } from '@angular/core'

const LOCALSTORAGE_KEY = 'oauthRedirectUrl'
const LOCALSTORAGE_JUST_REGISTERED_KEY = 'oauthJustRegistered'
const LOCALSTORAGE_PASSWORD_JUST_RESET_KEY = 'passwordJustReset'

/**
 * 30 minutes expressed in milliseconds.
 */
const EXPIRATION_MS = 30 * 60 * 1000

/**
 * Long enough to reach sign-in, short enough that a reset which never got
 * there does not surface on a later visit (PD-14612).
 */
const PASSWORD_JUST_RESET_EXPIRATION_MS = 5 * 60 * 1000

interface StoredRedirect {
  /** Full OAuth URL (query string and all) */
  url: string
  /** Epoch-millis when this entry should be considered expired */
  expiresAt: number
}

interface StoredBooleanFlag {
  value: boolean
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
   * Latches once `consumeJustRegistered()` has taken the stored flag away, so
   * later non-destructive readers still see it. A registration always crosses a
   * full page navigation, so this can only ever mean "this page load followed a
   * registration".
   */
  private justRegisteredThisPageLoad = false

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
   * Persist a one-time flag indicating OAuth flow continues right after registration.
   */
  setJustRegistered(value = true): void {
    const payload: StoredBooleanFlag = {
      value: !!value,
      expiresAt: Date.now() + EXPIRATION_MS,
    }
    localStorage.setItem(
      LOCALSTORAGE_JUST_REGISTERED_KEY,
      JSON.stringify(payload)
    )
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
   * Remove the redirect entry from storage. Only storage is cleared —
   * `justRegisteredThisPageLoad` is page-load scoped on purpose.
   */
  clear(): void {
    localStorage.removeItem(LOCALSTORAGE_KEY)
    localStorage.removeItem(LOCALSTORAGE_JUST_REGISTERED_KEY)
  }

  /**
   * Persist a one-time flag telling the next sign-in form that a signed-out
   * password reset has just succeeded. Lives outside `clear()` because the
   * OAuth branch of the reset clears the redirect before it leaves.
   */
  setPasswordJustReset(): void {
    const payload: StoredBooleanFlag = {
      value: true,
      expiresAt: Date.now() + PASSWORD_JUST_RESET_EXPIRATION_MS,
    }
    try {
      localStorage.setItem(
        LOCALSTORAGE_PASSWORD_JUST_RESET_KEY,
        JSON.stringify(payload)
      )
    } catch {
      // no storage, no notice: the reset itself has already succeeded
    }
  }

  /**
   * Read and clear the one-time password reset flag.
   */
  consumePasswordJustReset(): boolean {
    // Read by the sign-in form as it loads, so a browser that refuses storage
    // must cost the notice and nothing else
    try {
      const raw = localStorage.getItem(LOCALSTORAGE_PASSWORD_JUST_RESET_KEY)
      localStorage.removeItem(LOCALSTORAGE_PASSWORD_JUST_RESET_KEY)
      if (!raw) {
        return false
      }
      const payload = JSON.parse(raw) as StoredBooleanFlag
      return !!payload.value && payload.expiresAt > Date.now()
    } catch {
      return false
    }
  }

  /**
   * Read and clear one-time post-registration flag.
   */
  consumeJustRegistered(): boolean {
    const value = this.readJustRegisteredFlag()
    this.justRegisteredThisPageLoad = this.justRegisteredThisPageLoad || value
    localStorage.removeItem(LOCALSTORAGE_JUST_REGISTERED_KEY)
    return value
  }

  /**
   * Non-destructive read of the same flag, for callers that only need to know
   * whether this page load followed a registration. Stays true for the rest of
   * the page load even after `consumeJustRegistered()` has cleared storage, so
   * readers never have to race each other over a one-time flag.
   */
  isJustRegistered(): boolean {
    return this.justRegisteredThisPageLoad || this.readJustRegisteredFlag()
  }

  private readJustRegisteredFlag(): boolean {
    const raw = localStorage.getItem(LOCALSTORAGE_JUST_REGISTERED_KEY)
    if (!raw) {
      return false
    }
    try {
      const payload = JSON.parse(raw) as StoredBooleanFlag
      if (payload.expiresAt && payload.expiresAt > Date.now()) {
        return !!payload.value
      }
    } catch {
      // Ignore malformed payload and return false.
    }
    return false
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
