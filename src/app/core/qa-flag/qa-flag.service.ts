import { Injectable } from '@angular/core'
import { QaFlag } from './qa-flags.enum'

@Injectable({
  providedIn: 'root',
})
export class QaFlagsService {
  private knownFlags = Object.values(QaFlag)
  // This is an array of strings like:
  // ["forceNotSeemXInterstitial", "forceInterstialCheckOnEverySessionReload", "forceUserElegibleForX"]

  /**
   * Returns true if the specified QA flag is set to "true" in localStorage.
   * @param flag A valid QaFlag enum value
   */
  public isFlagEnabled(flag: QaFlag): boolean {
    // Because flag is guaranteed to be a known value (from QaFlag),
    // we only do a simple localStorage check.
    const value = localStorage.getItem(flag)
    if (runtimeEnvironment.debugger && value) {
      console.info(
        `[QAFlag] ⚠️ Caution you have "${flag}" is set to "${value}"`
      )
    }
    return value === 'true'
  }
}
