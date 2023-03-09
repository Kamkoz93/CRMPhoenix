import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

export const passwordMatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('password')?.value;
  const repeatedPassword = control.get('confirmPassword')?.value;

  if (!password || !repeatedPassword) return null;

  if (password !== repeatedPassword)
    return { passwordMatchValidator: 'Passwords do not match' };

  return null;
};
