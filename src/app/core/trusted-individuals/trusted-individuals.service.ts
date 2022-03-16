import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { TrustedIndividuals } from 'src/app/types/trusted-individuals.endpoint'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root',
})
export class TrustedIndividualsService {
  constructor(private _http: HttpClient) {}

  getTrustedIndividuals(): Observable<TrustedIndividuals> {
    return this._http.get<TrustedIndividuals>(
      `${environment.API_WEB}delegators/delegators-and-me.json`,
      {
        withCredentials: true,
      }
    )
  }
}
