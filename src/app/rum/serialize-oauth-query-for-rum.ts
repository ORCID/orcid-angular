import { Params } from '@angular/router'

/**
 * Stable `application/x-www-form-urlencoded` string of all route query params,
 * for RUM journey context (captures state, prompt, nonce, etc., not only core OAuth fields).
 */
export function serializeQueryParamsForRum(
  params: Params | null | undefined
): string | undefined {
  if (!params || typeof params !== 'object') {
    return undefined
  }
  const keys = Object.keys(params).sort()
  if (keys.length === 0) {
    return undefined
  }
  const sp = new URLSearchParams()
  for (const key of keys) {
    const val = params[key]
    if (val === undefined || val === null) {
      continue
    }
    if (Array.isArray(val)) {
      val.forEach((v) => sp.append(key, String(v)))
    } else {
      sp.set(key, String(val))
    }
  }
  const s = sp.toString()
  return s || undefined
}
