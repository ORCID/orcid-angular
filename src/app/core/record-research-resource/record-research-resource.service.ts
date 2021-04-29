import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { Observable, of } from 'rxjs'
import { environment } from '../../../environments/environment.local'
import { ResearchResource, ResearchResources } from '../../types/record-research-resources.endpoint'
import { UserRecordOptions } from 'src/app/types/record.local'

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

  getResearchResourcePage(options: UserRecordOptions): Observable<ResearchResources> {
    if (options.publicRecordId) {
      return this._http.get<ResearchResources>(
        environment.API_WEB +
        options.publicRecordId +
        '/researchResourcePage.json?offset=' +
        this.offset +
        '&sort=' +
        (options.sort != null ? options.sort : true) +
        '&sortAsc=' +
        (options.sortAsc != null ? options.sort : true)
      )
    }
    return this._http.get<ResearchResources>(
      environment.API_WEB +
        'research-resources/researchResourcePage.json?offset=' +
        this.offset +
        '&sort=' +
        (options.sort != null ? options.sort : true) +
        '&sortAsc=' +
        (options.sortAsc != null ? options.sort : true)
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
