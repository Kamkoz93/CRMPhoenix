import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, take, switchMap, of } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Injectable({ providedIn: 'root' })
export class EmailVerifiedGuard implements CanActivate {
  constructor(private _authService: AuthService, private _router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    const isVerified: boolean = this._authService.isUserVerified();
    if (!isVerified) {
      return of(
        this._router.parseUrl(route.data['redirectNotVerifiedUrl'] || 'verify')
      );
    }

    return of(true);
  }
}
