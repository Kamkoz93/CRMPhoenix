import { Inject, Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpEvent,
} from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { STORAGE } from './storage';
import { Router } from '@angular/router';

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {
  constructor(
    private _authService: AuthService,
    private _router: Router,
    @Inject(STORAGE) private _storage: Storage
  ) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err) => {
        const refreshToken = this._storage.getItem('refreshToken');

        if (
          (err.status === 401 &&
            err.error.message === 'Authentication required' &&
            refreshToken) ||
          (err.status === 403 &&
            err.error.message === 'Token is invalid' &&
            refreshToken)
        ) {
          return this._authService.refreshToken(refreshToken).pipe(
            switchMap((data) => {
              const newReq = request.clone({
                headers: request.headers.set(
                  'Authorization',
                  `Bearer ${data.accessToken}`
                ),
              });
              return next.handle(newReq);
            })
          );
        }
        this._authService.logout();
        return throwError(() => err);
      })
    );
  }
}
