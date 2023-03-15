import { Inject, Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { STORAGE } from './storage';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(@Inject(STORAGE) private _storage: Storage) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token = this._storage.getItem('accessToken');

    if (!token) {
      return next.handle(request);
    } else {
      const authReq = request.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });

      return next.handle(authReq);
    }
  }
}
