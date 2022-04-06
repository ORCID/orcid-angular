import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { catchError, retry } from 'rxjs/operators'
import { AccountTrustedOrganization } from 'src/app/types/account-trusted-organizations'
import { environment } from 'src/environments/environment'

import { ErrorHandlerService } from '../error-handler/error-handler.service'

@Injectable({
  providedIn: 'root',
})
export class AccountTrustedOrganizationsService {
  headers = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  })
  constructor(
    private _errorHandler: ErrorHandlerService,
    private _http: HttpClient
  ) {}

  get(): Observable<AccountTrustedOrganization[]> {
    return of([
      {
        orcidUri: 'https://qa.orcid.org/APP-UKKL357PDMYBXF0M',
        orcidPath: 'APP-UKKL357PDMYBXF0M',
        orcidHost: 'qa.orcid.org',
        name: 'https://developers.google.com/oauthplayground',
        groupOrcidUri: null,
        groupOrcidPath: '0000-0002-3119-9310',
        groupOrcidHost: null,
        groupName: 'test',
        websiteValue: 'https://developers.google.com/oauthplayground',
        approvalDate: 1649216381211,
        scopePaths: {
          'Read your information with visibility set to Trusted Parties':
            'Read your information with visibility set to Trusted Parties',
          'Add/update your research activities (works, affiliations, etc)':
            'Add/update your research activities (works, affiliations, etc)',
        },
        tokenId: '985435',
      },
    ]).pipe(
      retry(3),
      catchError((error) => this._errorHandler.handleError(error))
    )
  }

  delete(
    account: AccountTrustedOrganization
  ): Observable<AccountTrustedOrganization[]> {
    return this._http
      .post<AccountTrustedOrganization[]>(
        environment.API_WEB +
          `account/revoke-application.json?clientId=` +
          account.orcidPath,
        undefined,
        { headers: this.headers }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }
}
