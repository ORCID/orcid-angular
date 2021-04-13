import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { Observable } from 'rxjs'
import { environment } from '../../../environments/environment.local'
import { ResearchResource } from '../../types/record-research-resources.endpoint'

@Injectable({
  providedIn: 'root',
})
export class RecordResearchResourceService {
  offset = 0

  headers = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  })

  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService
  ) {}

  getResearchResourcePage(sort, sortAsc): Observable<any> {
    return this._http.get(
      environment.API_WEB +
        'research-resources/researchResourcePage.json?offset=' +
        this.offset +
        '&sort=' +
        sort +
        '&sortAsc=' +
        sortAsc
    )
  }

  getResearchResourceById(putCode: number): Observable<ResearchResource> {
    return this._http.get<ResearchResource>(
      environment.API_WEB +
        'research-resources/researchResource.json?id=' +
        putCode
    )
  }

  getPublicResearchResourceById(orcid, putCode): Observable<ResearchResource> {
    return this._http.get<ResearchResource>(
      environment.API_WEB + orcid + '/researchResource.json?id=' + putCode
    )
  }

  getPublicResearchResourcePage(sort, sortAsc, orcid): Observable<any> {
    return this._http.get(
      environment.API_WEB +
        orcid +
        '/researchResourcePage.json?offset=' +
        this.offset +
        '&sort=' +
        sort +
        '&sortAsc=' +
        sortAsc
    )
  }
}
