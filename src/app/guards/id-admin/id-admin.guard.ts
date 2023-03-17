import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, take, map } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Injectable()
export class IsAdmin implements CanActivate {
  constructor(private _authService: AuthService, private _router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this._authService.hasRole('admin').pipe(
      take(1),
      map((isAdmin) => {
        return !isAdmin
          ? this._router.parseUrl(route.data['redirectNotAdminUrl'] || '/leads')
          : true;
      })
    );
  }
}
