import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AlwaysFalseGuard implements CanActivate {
  constructor(private _authService: AuthService, private _router: Router) {}

  canActivate(): boolean {
    if (this._authService.isEmailVerified()) {
      return true;
    } else {
      return false;
    }
  }
}
