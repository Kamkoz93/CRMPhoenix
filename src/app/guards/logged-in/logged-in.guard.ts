import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { combineLatest, map, Observable, take } from 'rxjs';
import { ROUTES_DEF } from '../../configuration/routes-definition';
import { AuthService } from 'src/app/services/auth.service';

@Injectable()
export class LoggedIn implements CanActivate {
  constructor(private _authService: AuthService, private _router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return combineLatest([
      this._authService.loggedIn$,
      this._authService.isUserVerified(),
    ]).pipe(
      take(1),
      map(([isLogged, isVerfied]) => {
        return isLogged && isVerfied
          ? this._router.parseUrl(route.data['redirectUrl'] || ROUTES_DEF.LEADS)
          : true;
      })
    );
  }
}
