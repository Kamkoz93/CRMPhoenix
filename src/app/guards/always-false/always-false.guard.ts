import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, take, map } from 'rxjs';
import { ROUTES_DEF } from 'src/app/configuration/routes-definition';
import { AuthService } from '../../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AlwaysFalseGuard implements CanActivate {
  constructor(private _authService: AuthService, private _router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this._authService.isEmailVerified().pipe(
      map((isVer) => {
        console.log('guard :' + isVer);
        if (isVer) {
          return this._router.parseUrl('leads');
        }
        return true;
      })
    );
  }
}
