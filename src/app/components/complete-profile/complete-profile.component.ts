import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { addBioValidator } from 'src/app/custom-validators/addBio.validator';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-complete-profile',
  templateUrl: './complete-profile.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompleteProfileComponent {
  readonly addBioForm: FormGroup = new FormGroup({
    content: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(?=(\b\w+\b.*){10})(.*?[.?!]){2,}.*$/),
    ]),
  });

  constructor(
    private _userService: UserService,
    private _router: Router,
    private cd: ChangeDetectorRef,
    private _snackBar: MatSnackBar
  ) {}

  onBioFormSubmitted(addBioForm: FormGroup) {
    if (this.addBioForm.invalid) {
      // this._snackBar.open('Form is invalid', 'Close');
      return;
    }
    const content: string = addBioForm.get('content')?.value;
    this._userService.addUserBio({ content: content }).subscribe({
      next: () => {
        this._router.navigate(['/leads']);
      },
      error: (error: HttpErrorResponse) => {
        this.addBioForm.setErrors({
          beValidators: error.error.message,
        });
        this._snackBar.open('Something went wrong', 'Close');
        this.cd.markForCheck();
      },
    });
  }
}
