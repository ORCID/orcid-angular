import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { Works } from 'src/app/types'
import { retry, catchError } from 'rxjs/operators'
import { environment } from 'src/environments/environment'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root',
})
export class WorksService {
  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService
  ) {}
  getWorks(id: string): Observable<Works> {
    const offset = '0'
    const sort = 'date'
    const sortAsc = 'false'
    return this._http
      .get<Works>(
        environment.API_WEB +
          `${id}/worksPage.json?offset=${offset}&sort=${sort}&sortAsc=${sortAsc}`
      )
      .pipe(
        retry(3),
        catchError(this._errorHandler.handleError)
      )
  }
}
