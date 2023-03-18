import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { ROUTES_DEF } from '../../configuration/routes-definition';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({ providedIn: 'root' })
export class EmailVerifiedGuard implements CanActivate {
  constructor(private _authService: AuthService, private _router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this._authService.isEmailVerified().pipe(
      take(1),
      map((isVer) => {
        if (isVer === false) {
          return this._router.parseUrl(
            route.data['redirectNotVerifiedUrl'] || ROUTES_DEF.VERIFY
          );
        }
        return true;
      })
    );
  }
}
