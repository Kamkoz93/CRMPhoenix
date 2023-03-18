import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { ROUTES_DEF } from '../../configuration/routes-definition';

@Injectable({ providedIn: 'root' })
export class HaveBioGuard implements CanActivate {
  constructor(private _userService: UserService, private _router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this._userService.haveBio().pipe(
      take(1),
      map((haveBio) => {
        if (!haveBio) {
          return this._router.parseUrl(
            route.data['redirectCompleteProfileUrl'] ||
              ROUTES_DEF.COMPLETE_PROFILE
          );
        }
        return true;
      })
    );
  }
}
