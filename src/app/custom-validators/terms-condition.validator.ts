import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

export const termsConditionsValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const isTermsChecked = control?.value;
  console.log(isTermsChecked);

  if (isTermsChecked === false) {
    return {
      termsConditionsValidator: 'Terms and Conditions must be accepted',
    };
  }
  return null;
};
