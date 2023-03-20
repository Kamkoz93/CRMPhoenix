import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES_DEF } from 'src/app/configuration/routes-definition';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifyComponent {
  public readonly urlRoutes = ROUTES_DEF;
  constructor(private _authService: AuthService, private _router: Router) {}

  logout() {
    this._authService.logout();
    this._router.navigate([ROUTES_DEF.LOGGED_OUT]);
  }
}
