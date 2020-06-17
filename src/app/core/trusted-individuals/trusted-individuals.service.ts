import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, of } from 'rxjs'
import { TrustedIndividuals } from 'src/app/types/trusted-individuals.endpoint'
import { environment } from 'src/environments/environment'
import { retry, catchError } from 'rxjs/operators'
import { ErrorHandlerService } from '../error-handler/error-handler.service'

@Injectable({
  providedIn: 'root',
})
export class TrustedIndividualsService {
  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService
  ) {}

  getTrustedIndividuals(): Observable<TrustedIndividuals> {
    // return this._http
    //   .get<TrustedIndividuals>(`${environment.API_WEB}register.json`, {
    //     withCredentials: true,
    //   })
    //   .pipe(
    //     retry(3),
    //     catchError((error) => this._errorHandler.handleError(error))
    //   )

    return of({
      delegators: [
        {
          giverOrcid: {
            uri: 'https://qa.orcid.org/0000-0002-5319-7148',
            path: '0000-0002-5319-7148',
            host: 'qa.orcid.org',
          },
          giverName: {
            errors: [],
            value: 'Given Names Deactivated Family Name Deactivated',
            required: true,
            getRequiredMessage: null,
          },
          receiverOrcid: {
            uri: 'https://qa.orcid.org/0000-0002-9361-1905',
            path: '0000-0002-9361-1905',
            host: 'qa.orcid.org',
          },
          receiverName: null,
          approvalDate: 1537207920033,
        },
        {
          giverOrcid: {
            uri: 'https://qa.orcid.org/0000-0002-2036-7905',
            path: '0000-0002-2036-7905',
            host: 'qa.orcid.org',
          },
          giverName: {
            errors: [],
            value: 'Leonardo Mendoza',
            required: true,
            getRequiredMessage: null,
          },
          receiverOrcid: {
            uri: 'https://qa.orcid.org/0000-0002-9361-1905',
            path: '0000-0002-9361-1905',
            host: 'qa.orcid.org',
          },
          receiverName: null,
          approvalDate: 1586967300968,
        },
        {
          giverOrcid: {
            uri: 'https://qa.orcid.org/0000-0002-2036-7905',
            path: '0000-0002-2036-7905',
            host: 'qa.orcid.org',
          },
          giverName: {
            errors: [],
            value: 'Leonardo Mendoza',
            required: true,
            getRequiredMessage: null,
          },
          receiverOrcid: {
            uri: 'https://qa.orcid.org/0000-0002-9361-1905',
            path: '0000-0002-9361-1905',
            host: 'qa.orcid.org',
          },
          receiverName: null,
          approvalDate: 1586967300968,
        },
        {
          giverOrcid: {
            uri: 'https://qa.orcid.org/0000-0002-2036-7905',
            path: '0000-0002-2036-7905',
            host: 'qa.orcid.org',
          },
          giverName: {
            errors: [],
            value: 'Leonardo Mendoza',
            required: true,
            getRequiredMessage: null,
          },
          receiverOrcid: {
            uri: 'https://qa.orcid.org/0000-0002-9361-1905',
            path: '0000-0002-9361-1905',
            host: 'qa.orcid.org',
          },
          receiverName: null,
          approvalDate: 1586967300968,
        },
        {
          giverOrcid: {
            uri: 'https://qa.orcid.org/0000-0002-2036-7905',
            path: '0000-0002-2036-7905',
            host: 'qa.orcid.org',
          },
          giverName: {
            errors: [],
            value: 'Leonardo Mendoza',
            required: true,
            getRequiredMessage: null,
          },
          receiverOrcid: {
            uri: 'https://qa.orcid.org/0000-0002-9361-1905',
            path: '0000-0002-9361-1905',
            host: 'qa.orcid.org',
          },
          receiverName: null,
          approvalDate: 1586967300968,
        },
        {
          giverOrcid: {
            uri: 'https://qa.orcid.org/0000-0002-2036-7905',
            path: '0000-0002-2036-7905',
            host: 'qa.orcid.org',
          },
          giverName: {
            errors: [],
            value: 'Leonardo Mendoza',
            required: true,
            getRequiredMessage: null,
          },
          receiverOrcid: {
            uri: 'https://qa.orcid.org/0000-0002-9361-1905',
            path: '0000-0002-9361-1905',
            host: 'qa.orcid.org',
          },
          receiverName: null,
          approvalDate: 1586967300968,
        },
        {
          giverOrcid: {
            uri: 'https://qa.orcid.org/0000-0002-2036-7905',
            path: '0000-0002-2036-7905',
            host: 'qa.orcid.org',
          },
          giverName: {
            errors: [],
            value: 'Leonardo Mendoza',
            required: true,
            getRequiredMessage: null,
          },
          receiverOrcid: {
            uri: 'https://qa.orcid.org/0000-0002-9361-1905',
            path: '0000-0002-9361-1905',
            host: 'qa.orcid.org',
          },
          receiverName: null,
          approvalDate: 1586967300968,
        },
        {
          giverOrcid: {
            uri: 'https://qa.orcid.org/0000-0002-2036-7905',
            path: '0000-0002-2036-7905',
            host: 'qa.orcid.org',
          },
          giverName: {
            errors: [],
            value: 'Leonardo Mendoza',
            required: true,
            getRequiredMessage: null,
          },
          receiverOrcid: {
            uri: 'https://qa.orcid.org/0000-0002-9361-1905',
            path: '0000-0002-9361-1905',
            host: 'qa.orcid.org',
          },
          receiverName: null,
          approvalDate: 1586967300968,
        },
        {
          giverOrcid: {
            uri: 'https://qa.orcid.org/0000-0002-2036-7905',
            path: '0000-0002-2036-7905',
            host: 'qa.orcid.org',
          },
          giverName: {
            errors: [],
            value: 'Leonardo Mendoza',
            required: true,
            getRequiredMessage: null,
          },
          receiverOrcid: {
            uri: 'https://qa.orcid.org/0000-0002-9361-1905',
            path: '0000-0002-9361-1905',
            host: 'qa.orcid.org',
          },
          receiverName: null,
          approvalDate: 1586967300968,
        },
        {
          giverOrcid: {
            uri: 'https://qa.orcid.org/0000-0002-2036-7905',
            path: '0000-0002-2036-7905',
            host: 'qa.orcid.org',
          },
          giverName: {
            errors: [],
            value: 'Leonardo Mendoza',
            required: true,
            getRequiredMessage: null,
          },
          receiverOrcid: {
            uri: 'https://qa.orcid.org/0000-0002-9361-1905',
            path: '0000-0002-9361-1905',
            host: 'qa.orcid.org',
          },
          receiverName: null,
          approvalDate: 1586967300968,
        },
        {
          giverOrcid: {
            uri: 'https://qa.orcid.org/0000-0002-2036-7905',
            path: '0000-0002-2036-7905',
            host: 'qa.orcid.org',
          },
          giverName: {
            errors: [],
            value: 'Leonardo Mendoza',
            required: true,
            getRequiredMessage: null,
          },
          receiverOrcid: {
            uri: 'https://qa.orcid.org/0000-0002-9361-1905',
            path: '0000-0002-9361-1905',
            host: 'qa.orcid.org',
          },
          receiverName: null,
          approvalDate: 1586967300968,
        },
        {
          giverOrcid: {
            uri: 'https://qa.orcid.org/0000-0002-2036-7905',
            path: '0000-0002-2036-7905',
            host: 'qa.orcid.org',
          },
          giverName: {
            errors: [],
            value: 'Leonardo Mendoza',
            required: true,
            getRequiredMessage: null,
          },
          receiverOrcid: {
            uri: 'https://qa.orcid.org/0000-0002-9361-1905',
            path: '0000-0002-9361-1905',
            host: 'qa.orcid.org',
          },
          receiverName: null,
          approvalDate: 1586967300968,
        },
        {
          giverOrcid: {
            uri: 'https://qa.orcid.org/0000-0002-2036-7905',
            path: '0000-0002-2036-7905',
            host: 'qa.orcid.org',
          },
          giverName: {
            errors: [],
            value: 'Leonardo Mendoza',
            required: true,
            getRequiredMessage: null,
          },
          receiverOrcid: {
            uri: 'https://qa.orcid.org/0000-0002-9361-1905',
            path: '0000-0002-9361-1905',
            host: 'qa.orcid.org',
          },
          receiverName: null,
          approvalDate: 1586967300968,
        },
        {
          giverOrcid: {
            uri: 'https://qa.orcid.org/0000-0002-2036-7905',
            path: '0000-0002-2036-7905',
            host: 'qa.orcid.org',
          },
          giverName: {
            errors: [],
            value: 'Leonardo Mendoza',
            required: true,
            getRequiredMessage: null,
          },
          receiverOrcid: {
            uri: 'https://qa.orcid.org/0000-0002-9361-1905',
            path: '0000-0002-9361-1905',
            host: 'qa.orcid.org',
          },
          receiverName: null,
          approvalDate: 1586967300968,
        },
        {
          giverOrcid: {
            uri: 'https://qa.orcid.org/0000-0002-2036-7905',
            path: '0000-0002-2036-7905',
            host: 'qa.orcid.org',
          },
          giverName: {
            errors: [],
            value: 'Leonardo Mendoza',
            required: true,
            getRequiredMessage: null,
          },
          receiverOrcid: {
            uri: 'https://qa.orcid.org/0000-0002-9361-1905',
            path: '0000-0002-9361-1905',
            host: 'qa.orcid.org',
          },
          receiverName: null,
          approvalDate: 1586967300968,
        },
        {
          giverOrcid: {
            uri: 'https://qa.orcid.org/0000-0002-2036-7905',
            path: '0000-0002-2036-7905',
            host: 'qa.orcid.org',
          },
          giverName: {
            errors: [],
            value: 'Leonardo Mendoza',
            required: true,
            getRequiredMessage: null,
          },
          receiverOrcid: {
            uri: 'https://qa.orcid.org/0000-0002-9361-1905',
            path: '0000-0002-9361-1905',
            host: 'qa.orcid.org',
          },
          receiverName: null,
          approvalDate: 1586967300968,
        },
      ],
    })
  }

  // TODO @angel review
  // since the switch account is returning a 302 witch triggers a redirect to `my-orcid`
  // and we also trigger a reload, to reload the oauth page
  // there might be some scenarios where these two different request might not work as expected.
  switchAccount(id: string) {
    return (
      this._http
        .get(`${environment.API_WEB}switch-user?username=${id}`, {
          withCredentials: true,
        })
        // TODO @leomendoza123 catch 302 error and reload the page
        .pipe()
    )
  }
}
