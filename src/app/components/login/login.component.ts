import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ROUTES_DEF } from 'src/app/configuration/routes-definition';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  public readonly urlRoutes = ROUTES_DEF;
  readonly loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(
    private _authService: AuthService,
    private _router: Router,
    private cd: ChangeDetectorRef,
    private _snackBar: MatSnackBar
  ) { }

  onLoginFormSubmitted(loginForm: FormGroup): void {
    if (!this.loginForm.valid) {
      this._snackBar.open('Check Your credentials', 'Close', {
        duration: 2500,
      });
      return;
    }
    const email: string = loginForm.get('email')?.value;
    const password: string = loginForm.get('password')?.value;
    this._authService.login({ email: email, password: password }).subscribe({
      next: () => {
        this._router.navigate(['/leads']);
      },
      error: (error: HttpErrorResponse) => {
        this.loginForm.setErrors({
          beValidators: error.error.message,
        });
        this._snackBar.open('Check Your credentials', 'Close', {
          duration: 2500,
        });
        this.cd.markForCheck();
      },
    });
  }
}
