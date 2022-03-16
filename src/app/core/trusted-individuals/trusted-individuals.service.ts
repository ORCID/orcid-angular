import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { TrustedIndividuals } from 'src/app/types/trusted-individuals.endpoint'
import { environment } from 'src/environments/environment'
import { P } from '@angular/cdk/keycodes'
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class TrustedIndividualsService {
  constructor(private _http: HttpClient) {}

  getTrustedIndividuals(): Observable<TrustedIndividuals> {
    return this._http
      .get<TrustedIndividuals>(
        `${environment.API_WEB}delegators/delegators-and-me.json`,
        {
          withCredentials: true,
        }
      )
      .pipe(
        map((x) => {
          x.delegators.forEach(
            (x) =>
              (x.receiverName =
                x.receiverName ||
                $localize`:@@account.nameIsPri:Name is private`)
          )
          return x
        })
      )
  }
}
