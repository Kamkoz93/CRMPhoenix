import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ROUTES_DEF } from '../../configuration/routes-definition';

@Injectable({ providedIn: 'root' })
export class HomeRedirectGuard implements CanActivate {
  constructor(private _router: Router) {}

  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this._router.parseUrl(`${ROUTES_DEF.AUTH}/${ROUTES_DEF.LOGIN}`);
  }
}
