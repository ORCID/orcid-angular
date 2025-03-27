import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http'
import { Injectable } from '@angular/core'

@Injectable()
export class HttpContentTypeHeaderInterceptor implements HttpInterceptor {
  private formUrlEcondedUrls = [
    '/sendReactivation.json',
    '/social/signin/auth.json',
    '/shibboleth/signin/auth.json',
    '/signin/auth.json',
    'https://auth.dev.orcid.org/login',
  ]

  construct() {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    var method = req.method
    var urlWithParams = req.urlWithParams
    // If the request contains a content type, be sure to set the encoding to utf-8
    if (['POST', 'PUT'].includes(method)) {
      var clonedRequest
      if (this.formUrlEcondedUrls.find((x) => urlWithParams.includes(x))) {
        clonedRequest = req.clone({
          headers: req.headers.set(
            'Content-Type',
            'application/x-www-form-urlencoded;charset=utf-8'
          ),
        })
      } else {
        clonedRequest = req.clone({
          headers: req.headers.set(
            'Content-Type',
            'application/json;charset=utf-8'
          ),
        })
      }

      return next.handle(clonedRequest)
    }
    // Nothing changed, continue using the same request object
    return next.handle(req)
  }
}
