import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const idToken = localStorage.getItem('id_token');
    const userId = localStorage.getItem('user_id');

    if (idToken) {
      req = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + idToken),
      });

      if (req.body instanceof FormData) {
        req.body.append('user_id', userId!);
      } else {
        req = req.clone({
          body: { ...req.body, user_id: userId },
        });
      }

      return next.handle(req);
    } else {
      return next.handle(req);
    }
  }
}
