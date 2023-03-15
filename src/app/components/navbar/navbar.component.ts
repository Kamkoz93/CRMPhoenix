import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  constructor(private _authService: AuthService, private _router: Router) {}

  logout() {
    this._authService.logout();
    this._router.navigate(['/logged-out']);
  }
}
