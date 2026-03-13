import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, ReplaySubject } from 'rxjs'
import { map, switchMapTo } from 'rxjs/operators'
import {
  Config,
  ConfigMessageKey,
  TogglzFlag,
} from 'src/app/types/config.endpoint'
import { MaintenanceMessage } from 'src/app/types/togglz.local'

@Injectable({
  providedIn: 'root',
})
export class TogglzService {
  togglzSubject: ReplaySubject<Config>
  $userStatusChecked = new ReplaySubject()

  constructor(private _http: HttpClient) {}

  private getConfig() {
    return this._http.get<Config>(runtimeEnvironment.API_WEB + 'config.json', {
      withCredentials: true,
    })
  }

  reportUserStatusChecked(value) {
    this.$userStatusChecked.next(value)
  }

  getTogglz(): Observable<Config> {
    if (!this.togglzSubject) {
      this.togglzSubject = new ReplaySubject(1)
      this.$userStatusChecked
        .asObservable()
        .pipe(switchMapTo(this.getConfig()))
        .subscribe((value) => {
          this.togglzSubject.next(value)
        })
    }

    return this.togglzSubject.asObservable()
  }

  /**
   * Resolves the effective on/off state of a feature.
   * - If the flag is "false", returns false.
   * - If the flag is "true" and there is no percentage (or 100), returns true.
   * - If the flag is "true" and FEATURE_PERCENTAGE is 1–99, uses a per-session random
   *   sample (stored in sessionStorage) so that roughly that percentage of users get true.
   */
  getStateOf(togglzFeatureName: TogglzFlag): Observable<boolean> {
    return this.getTogglz().pipe(
      map((data) => {
        const enabled = data.messages[togglzFeatureName] === 'true'
        if (!enabled) return false

        const messages = data.messages as Record<string, string>
        const pctStr = messages[`${togglzFeatureName}_PERCENTAGE`] ?? '100'
        const pct = Math.max(
          0,
          Math.min(100, parseInt(pctStr, 10) || 100)
        )
        if (pct >= 100) return true
        if (pct <= 0) return false

        const storageKey = `togglz-sample-${togglzFeatureName}`
        const stored = sessionStorage.getItem(storageKey)
        if (stored !== null) return stored === 'true'

        const sampled = Math.random() * 100 < pct
        sessionStorage.setItem(storageKey, String(sampled))
        return sampled
      })
    )
  }

  getMessageOf(togglzFeatureName: TogglzFlag): Observable<string> {
    return this.getTogglz().pipe(
      map((data) => data.messages[togglzFeatureName])
    )
  }

  getConfigurationOf(configKey: ConfigMessageKey): Observable<string> {
    return this.getTogglz().pipe(map((data) => data.messages[configKey]))
  }

  getMaintenanceMessages(): Observable<MaintenanceMessage> {
    return this.getMessageOf(TogglzFlag.MAINTENANCE_MESSAGE).pipe(
      map((value) => {
        const plainHtml = value
        const parser = new DOMParser()
        const htmlElement = parser.parseFromString(plainHtml, 'text/html')
        const closableElements = this.nodelistToArray(
          htmlElement.querySelectorAll('div.closable')
        )
        const nonClosableElements = this.nodelistToArray(
          htmlElement.querySelectorAll('div.regular')
        )
        return { plainHtml, closableElements, nonClosableElements }
      })
    )
  }

  nodelistToArray(nodes: NodeListOf<Element>): Element[] {
    const list: Element[] = []
    nodes.forEach((element) => {
      list.push(element)
    })
    return list
  }
}
