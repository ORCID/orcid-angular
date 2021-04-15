import { Injectable } from '@angular/core'
import { environment } from 'src/environments/environment'
import { HttpClient } from '@angular/common/http'
import { Config } from 'src/app/types/togglz.endpoint'
import { Observable, timer } from 'rxjs'
import { switchMapTo, shareReplay, map } from 'rxjs/operators'
import { MaintenanceMessage } from 'src/app/types/togglz.local'

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

  getStateOf(togglzFeatureName: string): Observable<boolean> {
    this.getTogglz()
    return this.togglz.pipe(
      map((data) => data.messages[togglzFeatureName] === 'true')
    )
  }

  getMessageOf(togglzFeatureName: string): Observable<string> {
    this.getTogglz()
    return this.togglz.pipe(map((data) => data.messages[togglzFeatureName]))
  }

  getMaintenanceMessages(): Observable<MaintenanceMessage> {
    return this.getMessageOf('MAINTENANCE_MESSAGE').pipe(
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
