import { Injectable } from '@angular/core'
import { environment } from '../../../environments/environment'
import { HttpClient } from '@angular/common/http'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { retry, catchError, flatMap } from 'rxjs/operators'
// TODO: It might be posuble to return the news response as a JSON from the backend to avoid adding XML2JS in to production bundle.
import { Parser } from 'xml2js'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  environment
  parser = new Parser()

  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService
  ) {}

  getNews() {
    return this._http.get(environment.API_NEWS, { responseType: 'text' }).pipe(
      retry(3),
      catchError(this._errorHandler.handleError),
      flatMap(data =>
        Observable.create(observer => {
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
  }
}
