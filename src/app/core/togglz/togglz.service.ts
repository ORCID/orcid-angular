import { Injectable } from '@angular/core'
import { environment } from 'src/environments/environment'
import { HttpClient } from '@angular/common/http'
import { Config } from 'src/app/types/togglz.endpoint'
import { Observable, timer } from 'rxjs'
import { switchMapTo, refCount, publishReplay } from 'rxjs/operators'

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
      return (this.togglz = timer(0, 60 * 1000).pipe(
        switchMapTo(this.getConfig()),
        publishReplay(1),
        refCount()
      ))
    }
  }
}
