import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs/internal/Observable'
import { environment } from '../../../environments/environment'
import { Reactivation } from '../../types/reactivation.endpoint'

@Injectable({
  providedIn: 'root',
})
export class ReactivationService {
  constructor(private _http: HttpClient) {}

  getReactivationData(resetParams): Observable<Reactivation> {
    return this._http.get<Reactivation>(
      `${environment.API_WEB}reactivationData.json?params=${resetParams}`
    )
  }
}
