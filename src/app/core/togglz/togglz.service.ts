import { Injectable } from '@angular/core'
import { environment } from 'src/environments/environment'
import { HttpClient } from '@angular/common/http'
import { Config } from 'src/app/types/togglz.endpoint'
import { Observable, ReplaySubject, Subject } from 'rxjs'
import { switchMapTo, shareReplay, map, tap } from 'rxjs/operators'
import { MaintenanceMessage } from 'src/app/types/togglz.local'
import { UserService } from '..'

@Injectable({
  providedIn: 'root',
})
export class TogglzService {
  togglzSubject: ReplaySubject<Config>
  constructor(private _http: HttpClient, private userService: UserService) {}

  private getConfig() {
    return this._http.get<Config>(environment.API_WEB + 'config.json', {
      withCredentials: true,
    })
  }
  getTogglz(): Observable<Config> {
    if (!this.togglzSubject) {
      this.togglzSubject = new ReplaySubject(1)
      this.userService.$userStatusChecked
        .asObservable()
        .pipe(switchMapTo(this.getConfig()))
        .subscribe((value) => {
          this.togglzSubject.next(value)
        })
    }

    return this.togglzSubject.asObservable()
  }

  getStateOf(togglzFeatureName: string): Observable<boolean> {
    return this.getTogglz().pipe(
      map((data) => data.messages[togglzFeatureName] === 'true')
    )
  }

  getMessageOf(togglzFeatureName: string): Observable<string> {
    return this.getTogglz().pipe(
      map((data) => data.messages[togglzFeatureName])
    )
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
