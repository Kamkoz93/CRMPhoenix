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
import { ActivityModel } from '../../models/activity.model';
import { FilterFormModel } from 'src/app/models/filter-form.model';
import { ROUTES_DEF } from 'src/app/configuration/routes-definition';
import { CheckBoxModel } from 'src/app/models/check-box.model';

@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeadsComponent implements OnInit {
  public readonly urlRoutes = ROUTES_DEF;
  constructor(private _leadsService: LeadsService) {}

  readonly activitiesList$: Observable<ActivityModel[]> = this._leadsService
    .getActivities()
    .pipe(shareReplay(1));

  readonly activitiesCheckboxes$: Observable<CheckBoxModel[]> =
    this.activitiesList$.pipe(
      map((activities) =>
        activities.map((act) => ({ name: act.name, checked: false }))
      )
    );

  readonly companySizeOptions$: Observable<CheckBoxModel[]> = of([
    { name: '0-50', checked: false },
    { name: '51-100', checked: false },
    { name: '101-500', checked: false },
    { name: '501-1000', checked: false },
    { name: '1001+', checked: false },
  ]);

  readonly form_model: FormGroup = new FormGroup({
    isHiring: new FormGroup({
      name: new FormControl('isHiring'),
      checked: new FormControl(true),
    }),
    projectTypeBoxes: new FormArray([
      new FormGroup({
        name: new FormControl('Internal Projects'),
        checked: new FormControl(false),
      }),
      new FormGroup({
        name: new FormControl('External Projects'),
        checked: new FormControl(false),
      }),
      new FormGroup({
        name: new FormControl('Recruitment Agency'),
        checked: new FormControl(false),
      }),
    ]),
    companySizeBoxes: new FormArray([
      new FormGroup({
        name: new FormControl('0-50'),
        checked: new FormControl(false),
      }),
      new FormGroup({
        name: new FormControl('51-100'),
        checked: new FormControl(false),
      }),
      new FormGroup({
        name: new FormControl('101-500'),
        checked: new FormControl(false),
      }),
      new FormGroup({
        name: new FormControl('501-1000'),
        checked: new FormControl(false),
      }),
      new FormGroup({
        name: new FormControl('1001+'),
        checked: new FormControl(false),
      }),
    ]),
  });

  readonly selectedFormValues$: Observable<FilterFormModel> =
    this.form_model.valueChanges.pipe(
      startWith(this.filterFromStorage),
      map((formValue: FilterFormModel) => ({
        isHiring: {
          name: formValue.isHiring.name,
          checked: formValue.isHiring.checked,
        },
        projectTypeBoxes: formValue.projectTypeBoxes.map(
          (box: CheckBoxModel) => ({
            name: box.name,
            checked: box.checked,
          })
        ),
        companySizeBoxes: formValue.companySizeBoxes.map(
          (box: CheckBoxModel) => ({
            name: box.name,
            checked: box.checked,
          })
        ),
      })),
      shareReplay(1)
    );

  onSubmit() {
    localStorage.setItem('filter', JSON.stringify(this.form_model.value));
    const filter = JSON.parse(localStorage.getItem('filter') ?? 'false');
  }

  get filterFromStorage() {
    const filter = JSON.parse(localStorage.getItem('filter') ?? 'false');
    const defaultFilter = this.form_model.value;
    if (filter != false) {
      return filter;
    }
    return defaultFilter;
  }

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

  resetForm() {
    this.form_model.reset({
      isHiring: {
        name: 'isHiring',
        checked: true,
      },
      projectTypeBoxes: this.form_model
        .get('projectTypeBoxes')
        ?.value.map((box: CheckBoxModel) => ({
          name: box.name,
          checked: false,
        })),
      companySizeBoxes: this.form_model
        .get('companySizeBoxes')
        ?.value.map((box: CheckBoxModel) => ({
          name: box.name,
          checked: false,
        })),
    });
  }

  ngOnInit() {
    if (this.filterFromStorage != false) {
      return this.form_model.setValue(this.filterFromStorage);
    }
    return;
  }
}
