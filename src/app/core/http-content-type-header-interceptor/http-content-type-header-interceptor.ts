import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()
export class HttpContentTypeHeaderInterceptor implements HttpInterceptor {
    construct () {

    }

    intercept(req:HttpRequest<any>, next: HttpHandler) {
        var method = req.method
        var urlWithParams = req.urlWithParams
        // If the request contains a content type, be sure to set the encoding to utf-8        
        if(['POST', 'PUT'].includes(method)) {
            var clonedRequest;
            if(urlWithParams == '/signin/auth.json') {
                clonedRequest = req.clone({
                    headers: req.headers.set('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8')
                });
            } else {
                clonedRequest = req.clone({
                    headers: req.headers.set('Content-Type', 'application/json;charset=utf-8')
                });                
            }
            
            console.log("-------------------------------------------------------------------------------------")
            console.log(method)
            console.log(urlWithParams)
            console.log(clonedRequest.headers)
            console.log("-------------------------------------------------------------------------------------")
            return next.handle(clonedRequest);
        } 
        console.log('Nothing changed for ' + method + ' - ' + urlWithParams);
        // Nothing changed, continue using the same request object
        return next.handle(req);
    }
}