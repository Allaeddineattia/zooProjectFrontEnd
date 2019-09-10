import { LoginService } from './../_services/login.service';
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpParams
} from '@angular/common/http';
import { take, exhaustMap } from 'rxjs/operators';



@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private loginService: LoginService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {

    console.log('request: ', req);

    return this.loginService.userToken.pipe(
      take(1),
      exhaustMap(userToken => {
        if (!userToken) {
          return next.handle(req);
        }
        const modifiedReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${userToken.token}`
          }
        });
        return next.handle(modifiedReq);
      })
    );
  }
}
