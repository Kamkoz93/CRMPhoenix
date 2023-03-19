import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Observable, combineLatest, of } from 'rxjs';
import { map, shareReplay, startWith } from 'rxjs/operators';
import { LeadsService } from '../../services/leads.service';
import { LeadConvertedQueryModel } from '../../queries/lead-converted.query-model';
import { LeadModel } from '../../models/lead.model';
import { ActivityModel } from '../../models/activity.model';
import { FilterFormModel } from 'src/app/models/filter-form.model';
import { ROUTES_DEF } from 'src/app/configuration/routes-definition';

@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeadsComponent {
  public readonly urlRoutes = ROUTES_DEF;
  constructor(private _leadsService: LeadsService) {}

  readonly activitiesList$: Observable<ActivityModel[]> = this._leadsService
    .getActivities()
    .pipe(shareReplay(1));

  readonly filterForm: FormGroup = new FormGroup({
    isHiring: new FormControl(true),
    projectTypes: new FormArray([]),
    companySizes: new FormArray([]),
  });

  readonly selectedFormValues$: Observable<FilterFormModel> =
    this.filterForm.valueChanges.pipe(
      startWith({
        isHiring: true,
        projectTypes: new FormArray([]),
        companySizes: new FormArray([]),
      }),
      map((form: FilterFormModel) => ({
        isHiring: form.isHiring,
        projectTypes: form.projectTypes,
        companySizes: form.companySizes,
      })),
      shareReplay(1)
    );

  public mappedLeads$: Observable<LeadConvertedQueryModel[]> = combineLatest([
    this._leadsService.getLeads(),
    this.activitiesList$,
    this.selectedFormValues$,
  ]).pipe(
    map(([leads, activities, filterForm]) => {
      const mappedLeads = this._leadsService.mapLeads(leads, activities);
      return this._leadsService.filterLeads(mappedLeads, filterForm);
    })
  );

  readonly companySizeOptions$: Observable<string[]> = of([
    '0-50',
    '51-100',
    '101-500',
    '501-1000',
    '1001+',
  ]);

  private setArray(data: any, valuesArray: FormArray) {
    if (data.checked) {
      valuesArray.push(new FormControl(data.value));
    } else {
      const index = valuesArray.controls.findIndex(
        (x) => x.value == data.value
      );
      valuesArray.removeAt(index);
    }
  }

  public setScopeArr(data: any) {
    const activitiesArr = <FormArray>this.filterForm.controls['projectTypes'];
    return this.setArray(data, activitiesArr);
  }

  public setCompanySizesArr(data: any) {
    const companySizesArray = <FormArray>(
      this.filterForm.controls['companySizes']
    );
    return this.setArray(data, companySizesArray);
  }

  public resetFilterForm(): void {
    this.filterForm.patchValue({
      isHiring: true,
      projectTypes: [],
      companySizes: [],
    });

    const projectTypesFormArray = this.filterForm.get(
      'projectTypes'
    ) as FormArray;
    projectTypesFormArray.clear();

    const companySizesFormArray = this.filterForm.get(
      'companySizes'
    ) as FormArray;
    companySizesFormArray.clear();

    this.uncheckAllChecks();
  }

  public uncheckAllChecks() {
    const checkboxes = document.querySelectorAll<HTMLInputElement>('#checkbox');
    checkboxes.forEach((checkbox: HTMLInputElement) => {
      checkbox.checked = false;
    });
  }
}
