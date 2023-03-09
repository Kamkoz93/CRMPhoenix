import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  readonly loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(
    private _authService: AuthService,
    private _router: Router,
    private cd: ChangeDetectorRef,
    private _snackBar: MatSnackBar
  ) {}

  onLoginFormSubmitted(loginForm: FormGroup): void {
    if (!this.loginForm.valid) {
      this._snackBar.open('Form is invalid', 'Close');
      return;
    }
    const email: string = loginForm.get('email')?.value;
    const password: string = loginForm.get('password')?.value;
    this._authService.login({ email: email, password: password }).subscribe({
      next: () => {
        this._router.navigate(['/login']);
      },
      error: (error: HttpErrorResponse) => {
        this.loginForm.setErrors({
          beValidators: error.error.message,
        });
        this._snackBar.open('Something went wrong', 'Close');
        this.cd.markForCheck();
      },
    });
  }
}
