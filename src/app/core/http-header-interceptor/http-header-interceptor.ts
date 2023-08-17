import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()
export class HttpHeaderInterceptor implements HttpInterceptor {
    construct () {

    }

    intercept(req:HttpRequest<any>, next: HttpHandler) {
        var method = req.method
        var contentType = req.headers.get('Content-Type');
        var urlWithParams = req.urlWithParams
        console.log("-------------------------------------------------------------------------------------")
        console.log(method)
        console.log(urlWithParams)
        if(!contentType) {
            console.log("No content type");
        } else {
            console.log(contentType);

        }
        console.log("-------------------------------------------------------------------------------------")
        
        //const clonedRequest = req.clone({
        //    headers: req.headers.set('Content-Type', 'application/json;charset=utf8')
        //});
        return next.handle(req);
    }
}