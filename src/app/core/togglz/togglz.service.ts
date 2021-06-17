import { Injectable } from '@angular/core'
import { environment } from 'src/environments/environment'
import { HttpClient } from '@angular/common/http'
import { Config } from 'src/app/types/togglz.endpoint'
import { Observable, timer } from 'rxjs'
import { switchMapTo, shareReplay, map } from 'rxjs/operators'
import { MaintenanceMessage } from 'src/app/types/togglz.local'


export enum TOGGLZ_STRINGS {
  NEW_INFO_SITE = 'NEW_INFO_SITE',
  MAINTENANCE_MESSAGE = 'MAINTENANCE_MESSAGE',
  ORCID_ANGULAR_SIGNIN = 'ORCID_ANGULAR_SIGNIN',
  ORCID_ANGULAR_SEARCH = 'ORCID_ANGULAR_SEARCH',
  ENABLE_USER_MENU = 'ENABLE_USER_MENU',
  ORCID_ANGULAR_INBOX = 'ORCID_ANGULAR_INBOX',
}

@Injectable({
  providedIn: 'root',
})
export class TogglzService {
  togglz: Observable<Config>
  constructor(private _http: HttpClient) {}

  private getConfig() {
    return this._http.get<Config>(environment.API_WEB + 'config.json', {
      withCredentials: true,
    })
  }
  getTogglz(): Observable<Config> {
    if (this.togglz) {
      return this.togglz
    } else {
      return (this.togglz = timer(0, 60 * 1000 * 10).pipe(
        switchMapTo(this.getConfig()),
        shareReplay(1)
      ))
    }
  }

  getStateOf(togglzFeatureName: TOGGLZ_STRINGS): Observable<boolean> {
    this.getTogglz()
    return this.togglz.pipe(
      map((data) => data.messages[togglzFeatureName] === 'true')
    )
  }

  getMessageOf(togglzFeatureName: TOGGLZ_STRINGS): Observable<string> {
    this.getTogglz()
    return this.togglz.pipe(map((data) => data.messages[togglzFeatureName]))
  }

  getMaintenanceMessages(): Observable<MaintenanceMessage> {
    return this.getMessageOf(TOGGLZ_STRINGS.MAINTENANCE_MESSAGE).pipe(
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
    const list = []
    nodes.forEach((element) => {
      list.push(element)
    })
    return list
  }
}
