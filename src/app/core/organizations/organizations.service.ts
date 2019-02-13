import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { AffiliationsDetails, OrgDisambiguated } from 'src/app/types'
import { environment } from '../../../environments/environment'
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root',
})
export class OrganizationsService {
  constructor(private _http: HttpClient) {}

  getOrgDisambiguated(type, value): Observable<OrgDisambiguated> {
    if (type && value) {
      return this._http.get<OrgDisambiguated>(
        environment.API_WEB +
          `orgs/disambiguated/${type}?value=${encodeURIComponent(value)}`
      )
    } else {
      return of(null)
    }
  }
}
