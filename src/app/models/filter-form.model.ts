import { CheckBoxModel } from './check-box.model';

export interface FilterFormModel {
  readonly isHiring: CheckBoxModel;
  readonly projectTypeBoxes: CheckBoxModel[];
  readonly companySizeBoxes: CheckBoxModel[];
}
