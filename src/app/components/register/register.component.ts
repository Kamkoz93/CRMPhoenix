import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { passwordValidator } from 'src/app/custom-validators/password.validator';
import { passwordMatchValidator } from 'src/app/custom-validators/password-match.validator';
import { HttpErrorResponse } from '@angular/common/http';
import { termsConditionsValidator } from 'src/app/custom-validators/terms-condition.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  constructor(
    private _userService: UserService,
    private _authService: AuthService,
    private _snackBar: MatSnackBar,
    private _router: Router,
    private cd: ChangeDetectorRef
  ) {}
  readonly registerForm: FormGroup = new FormGroup(
    {
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [Validators.required, passwordValidator]),
      confirmPassword: new FormControl('', [Validators.required]),
      isTermsAccepeted: new FormControl(true, [
        Validators.required,
        termsConditionsValidator,
      ]),
    },
    {
      validators: [passwordMatchValidator],
    }
  );

  onRegisterFormSubmitted(registerForm: FormGroup) {
    if (this.registerForm.invalid) {
      this._snackBar.open('Form is invalid', 'Close');
      return;
    }
    const email: string = registerForm.get('email')?.value;
    const password: string = registerForm.get('password')?.value;
    this._userService
      .registerUser({ email: email, password: password })
      .subscribe({
        next: () => {
          this._authService.login({ email: email, password: password });
          this._router.navigate(['/login']);
        },
        error: (error: HttpErrorResponse) => {
          this.registerForm.setErrors({
            beValidators: error.error.message,
          });
          this._snackBar.open('Something went wrong', 'Close');
          this.cd.markForCheck();
        },
      });
  }
}
