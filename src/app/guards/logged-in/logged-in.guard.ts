import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { map, Observable } from 'rxjs';

import { AuthService } from 'src/app/services/auth.service';

@Injectable()
export class LoggedIn implements CanActivate {
  constructor(private _authService: AuthService, private _router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this._authService.loggedIn$.pipe(
      map((isLoggedIn) => {
        return isLoggedIn
          ? this._router.parseUrl(route.data['redirectUrl'] || 'logged-in')
          : true;
      })
    );
  }
}
