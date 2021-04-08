import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs/internal/Observable'
import { environment } from '../../../environments/environment'
import { Reactivation } from '../../types/reactivation.endpoint'

@Injectable({
  providedIn: 'root',
})
export class ReactivationService {
  headers: HttpHeaders

  constructor(private _http: HttpClient) {
    this.headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    })
  }

  postReactivationConfirm(obj): Observable<any> {
    const encoded_data = JSON.stringify(obj)

    return this._http.post(
      `${environment.API_WEB}reactivationConfirm.json`,
      encoded_data,
      { headers: this.headers }
    )
  }

  getReactivationData(resetParams): Observable<Reactivation> {
    return this._http.get<Reactivation>(
      `${environment.API_WEB}reactivationData.json?params=${resetParams}`
    )
  }
}
