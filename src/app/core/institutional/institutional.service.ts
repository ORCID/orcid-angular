import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { environment } from '../../../environments/environment.local'
import { catchError, map } from 'rxjs/operators'
import { of } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class InstitutionalService {
  defaultReturn =
    environment.BASE_URL +
    'Shibboleth.sso/Login?SAMLDS=1&target=' +
    encodeURIComponent('https:' + environment.BASE_URL + 'shibboleth/signin')

  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService
  ) {}

  public login(entityID) {
    const headers: HttpHeaders = new HttpHeaders({
      Accept: 'text/html',
      responseType: 'text',
    })
    return this._http
      .get<any>(
        this.defaultReturn + '&entityID=' + encodeURIComponent(entityID),
        { headers: headers }
      )
      .pipe(catchError((val) => of({})))
      .pipe(map((response) => response.loggedIn || null))
  }
}
