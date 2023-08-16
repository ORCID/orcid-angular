import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()
export class HttpHeaderInterceptor implements HttpInterceptor {
    construct () {

    }

    intercept(req:HttpRequest<any>, next: HttpHandler) {
        const clonedRequest = req.clone({
            headers: req.headers.set('Content-Type', 'application/json;charset=utf8')
        });
        return next.handle(clonedRequest);
    }
}