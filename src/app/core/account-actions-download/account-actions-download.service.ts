import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Inject, Injectable } from '@angular/core'
import { catchError, retry, tap } from 'rxjs/operators'
import { WINDOW } from 'src/app/cdk/window'
import { environment } from 'src/environments/environment'
import { ErrorHandlerService } from '../error-handler/error-handler.service'

@Injectable({
  providedIn: 'root',
})
export class AccountActionsDownloadService {
  headers = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  })
  constructor(
    private _errorHandler: ErrorHandlerService,
    private _http: HttpClient,
    @Inject(WINDOW) private _window: Window
  ) {}

  downloadUserData() {
    return this.downloadBlogFile({
      url: environment.API_WEB + 'get-my-data',
      dataType: 'application/octet-stream',
    })
  }

  private downloadBlogFile({
    url,
    dataType,
  }: {
    url: string
    dataType: string
  }) {
    return this._http
      .post(url, {}, { observe: 'response', responseType: 'blob' })
      .pipe(
        tap((response) => {
          const filename =
            response.headers.get('filename') != null
              ? response.headers.get('filename')
              : 'orcid.zip'
          const blob = new Blob([response.body], { type: dataType })
          const link = this._window.document.createElement('a')
          link.href = this._window.window.URL.createObjectURL(blob)
          link.download = filename
          this._window.document.body.appendChild(link)
          link.click()
          this._window.document.body.removeChild(link)
        }),
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }
}
