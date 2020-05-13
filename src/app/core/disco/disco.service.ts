import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { environment } from '../../../environments/environment'
import { HttpClient } from '@angular/common/http'
import { Institutional } from '../../types/institutional.endpoint'

@Injectable({
  providedIn: 'root',
})
export class DiscoService {
  constructor(private _http: HttpClient) {}

  getDiscoFeed(): Observable<Institutional[]> {
    return this._http.get<Institutional[]>(
      environment.BASE_URL + 'Shibboleth.sso/DiscoFeed'
    )
  }
}
