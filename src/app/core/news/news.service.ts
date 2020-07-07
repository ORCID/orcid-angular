import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { catchError, flatMap, retry, take, switchMap } from 'rxjs/operators'
import { ErrorHandlerService } from 'src/app/core/error-handler/error-handler.service'
import { environment } from 'src/environments/environment'
import { Parser } from 'xml2js'
import { TogglzService } from '../togglz/togglz.service'

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  environment
  parser = new Parser()

  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService,
    private _togglz: TogglzService
  ) {}

  getNews() {
    // TODO @leomendoza123 remove when the toggle call when the new info is stable
    // that will avoid the wait time of the togglz check
    return this._togglz.getStateOf('NEW_INFO_SITE').pipe(
      take(1),
      switchMap((newInfoStateToggle) => {
        // Select the correct URL to get the news feed
        let url = environment.API_NEWS
        if (!newInfoStateToggle) {
          url = environment.API_NEWS_DEPRECATED
        }
        // Get the news!
        return this._http.get(url, { responseType: 'text' }).pipe(
          retry(3),
          catchError((error) => this._errorHandler.handleError(error)),
          flatMap((data) =>
            Observable.create((observer) => {
              // TODO: It might be possible to return the news response as a JSON from the backend
              // to avoid adding XML2JS in to production bundle.
              this.parser.parseString(data, (error, parsedData) => {
                if (!error) {
                  if (
                    parsedData &&
                    parsedData.rss &&
                    parsedData.rss.channel &&
                    parsedData.rss.channel[0] &&
                    parsedData.rss.channel[0].item
                  ) {
                    observer.next(
                      parsedData.rss.channel[0].item.filter((item, index) => {
                        return index < 6
                      })
                    )
                  } else {
                    this._errorHandler.xml2jsParser('invalid data response')
                  }
                } else {
                  this._errorHandler.xml2jsParser(error)
                }
              })
            })
          )
        )
      })
    )
  }
}
