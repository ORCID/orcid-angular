import { HttpErrorResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { throwError } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  constructor() {}
  public handleError(error: Error | HttpErrorResponse) {
    if (error instanceof HttpErrorResponse) {
      // Server error
      console.error(
        `
__Server error__
(status:${error.status} (${error.statusText}) url: ${error.url})
name: "${error.name}"
message: "${error.message}"
ok: "${error.ok}"
`
      )
      return throwError({
        error: error,
        message: `<${error.status} (${error.statusText})>`,
      })
    } else {
      // Client side error
      console.error(
        `
__Local error__
(name:${error.name})
message: "${error.message}"
stack: "${error.stack}"
`
      )
      return throwError({
        error: error,
        message: `${error.name}`,
      })
    }
  }

  public xml2jsParser(error) {
    console.error(error)
  }
}
