import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

export const passwordValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control?.value;

  if (!password) return null;

  if (/[A-Z]/.test(password) === false) {
    return {
      passwordValidator: 'Password must cointain at least one capital case',
    };
  }
  if (/[a-z]/.test(password) === false) {
    return {
      passwordValidator: 'Password must cointain at least one lower case',
    };
  }
  if (/[0-9]/.test(password) === false) {
    return {
      passwordValidator: 'Password must cointain at least one number',
    };
  }

  if (/[!@#$%^*()]/.test(password) === false) {
    return {
      passwordValidator:
        'Password must cointain at least one special character !@#$%^*()',
    };
  }

  if (/^.{8,}$/.test(password) === false) {
    return {
      passwordValidator: 'Password must have at least 8 characters',
    };
  }

  return null;
};
