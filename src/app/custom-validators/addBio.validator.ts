import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const addBioValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const bioContent: string = control.get('content')?.value;

  const words = bioContent.trim().split(/\s+/);
  const sentences = bioContent
    .trim()
    .split(/[.?!]+/)
    .filter((sentence) => sentence.trim().length > 0);

  console.log('words: ' + words.length, 'sent: ' + sentences.length);

  if (words.length < 10 && sentences.length < 2) {
    return {
      addBioValidator:
        'Your bio should have at least 10 words and 2 sentences.',
    };
  }
  return null;
};
