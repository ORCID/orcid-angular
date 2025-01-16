import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { retry, catchError, switchMap, tap } from 'rxjs/operators'
import { of } from 'rxjs'
import { ERROR_REPORT } from 'src/app/errors'

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService
  ) {}

  changeLanguage(languageCode: string) {
    languageCode = languageCode.toLocaleLowerCase().replace('-', '_')

    return of({}).pipe(
      // If the language is not listed on the current frontend environment it wont attempt to change it
      tap(() => {
        if (!runtimeEnvironment.production) {
          {
            throw new Error(`change-language-require-production-mode`)
          }
        }
        if (
          !Object.keys(runtimeEnvironment.LANGUAGE_MENU_OPTIONS).find(
            (x) => x.toLocaleLowerCase().replace('-', '_') === languageCode
          )
        ) {
          throw new Error(`invalid-language-code-${languageCode}`)
        }
      }),
      switchMap(() =>
        this._http
          .get(runtimeEnvironment.API_WEB + 'lang.json?lang=' + languageCode)
          .pipe(retry(3))
      ),
      catchError((error) =>
        this._errorHandler.handleError(error, ERROR_REPORT.STANDARD_VERBOSE)
      )
    )
  }
}
