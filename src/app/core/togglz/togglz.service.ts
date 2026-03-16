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
   * Value per feature is either "true"/"false" or a number 0-100 (percentage).
   * - "false" or "0" → false.
   * - "true" or "100" → true.
   * - "1"-"99" → per-session random sample (sessionStorage) so that % of users get true.
   */
  getStateOf(togglzFeatureName: TogglzFlag): Observable<boolean> {
    return this.getTogglz().pipe(
      map((data) => {
        const raw = data.messages[togglzFeatureName]
        if (raw === 'false' || raw === '0') return false
        if (raw === 'true' || raw === '100') return true

        const pct = Math.max(
          0,
          Math.min(100, parseInt(raw ?? '0', 10) || 0)
        )
        if (pct <= 0) return false
        if (pct >= 100) return true

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
