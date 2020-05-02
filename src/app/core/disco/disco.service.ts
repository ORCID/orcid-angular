import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { environment } from '../../../environments/environment'
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root',
})
export class DiscoService {
  constructor(private http: HttpClient) {}

  getDiscoFeed(): Observable<any> {
    return this.http.get(environment.BASE_URL + 'Shibboleth.sso/DiscoFeed')
  }
}
