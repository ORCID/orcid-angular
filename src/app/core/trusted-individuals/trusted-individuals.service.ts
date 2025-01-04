import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { TrustedIndividuals } from 'src/app/types/trusted-individuals.endpoint'
import { environment } from 'src/environments/environment'
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class TrustedIndividualsService {
  constructor(private _http: HttpClient) {}

  getTrustedIndividuals(): Observable<TrustedIndividuals> {
    return this._http
      .get<TrustedIndividuals>(
        `${runtimeEnvironment.API_WEB}delegators/delegators-and-me.json`,
        {
          withCredentials: true,
        }
      )
      .pipe(
        map((response) => {
          if (response?.delegators?.length) {
            response.delegators.forEach((delegator) => {
              if (!delegator.giverName?.value) {
                delegator.giverName.value = $localize`:@@account.nameIsPri:Name is private`
              }
            })
          }
          return response
        })
      )
  }
}
