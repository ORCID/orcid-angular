import { Injectable } from '@angular/core'
import { Observable, ReplaySubject } from 'rxjs'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { environment } from '../../../environments/environment.local'
import { PeerReview } from '../../types/record-peer-review.endpoint'

@Injectable({
  providedIn: 'root',
})
export class RecordPeerReviewService {
  $peer: ReplaySubject<PeerReview[]>
  headers = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  })

  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService
  ) {}

  getPeerReviewGroups(sortAsc: true | false): Observable<PeerReview[]> {
    return this._http.get<PeerReview[]>(
      environment.API_WEB + 'peer-reviews/peer-reviews.json?sortAsc=' + sortAsc
    )
  }

  getPeerReviewById(putCode: number): Observable<PeerReview> {
    return this._http.get<PeerReview>(
      environment.API_WEB + 'peer-reviews/peer-review.json?putCode=' + putCode
    )
  }

  getPeerReviewImportWizardList(): Observable<PeerReview[]> {
    return this._http.get<PeerReview[]>(
      environment.API_WEB + 'workspace/retrieve-peer-review-import-wizards.json'
    )
  }

  getPublicPeerReviewById(orcid: string, putCode: number): Observable<any> {
    return this._http.get(
      environment.API_WEB + orcid + '/peer-review.json?putCode=' + putCode
    )
  }
}
