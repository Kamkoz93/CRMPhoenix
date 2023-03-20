export interface FilterFormModel {
  readonly isHiring: {
    name: string;
    checked: boolean;
  };
  readonly projectTypeBoxes: {
    name: string;
    checked: boolean;
  }[];
  readonly companySizeBoxes: {
    name: string;
    checked: boolean;
  }[];
}
