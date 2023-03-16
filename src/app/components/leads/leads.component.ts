import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  QueryList,
  ViewChild,
  ViewChildren,
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

@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeadsComponent {
  constructor(private _leadsService: LeadsService) {}

  readonly activitiesList$: Observable<ActivityModel[]> = this._leadsService
    .getActivities()
    .pipe(shareReplay(1));

  setScopeArr(data: any) {
    const scopeFormArray = <FormArray>this.filterForm.controls['projectTypes'];

    if (data.checked) {
      scopeFormArray.push(new FormControl(data.value));
    } else {
      const index = scopeFormArray.controls.findIndex(
        (x) => x.value == data.value
      );
      scopeFormArray.removeAt(index);
    }
  }

  setCompanySizesArr(data: any) {
    const companySizesArray = <FormArray>(
      this.filterForm.controls['companySizes']
    );

    if (data.checked) {
      companySizesArray.push(new FormControl(data.value));
    } else {
      const index = companySizesArray.controls.findIndex(
        (x) => x.value == data.value
      );
      companySizesArray.removeAt(index);
    }
  }

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
      const mappedLeads = this.mapLeads(leads, activities);
      return this.filterLeads(mappedLeads, filterForm);
    })
  );

  readonly companySizeOptions$: Observable<string[]> = of([
    '0-50',
    '51-100',
    '101-500',
    '501-1000',
    '1001+',
  ]);

  private filterLeads(
    leads: LeadConvertedQueryModel[],
    filter: FilterFormModel
  ) {
    const filterByHiring = (lead: LeadConvertedQueryModel) => {
      if (!filter.isHiring) {
        return true;
      }
      return filter.isHiring === lead.hiring.isHiring;
    };

    const filterByScope = (lead: LeadConvertedQueryModel) => {
      if (
        !filter.projectTypes ||
        filter.projectTypes === null ||
        filter.projectTypes.length === 0
      ) {
        return true;
      }
      return filter.projectTypes.every((activity) =>
        lead.scope.includes(activity)
      );
    };

    const filterByCompanySize = (lead: LeadConvertedQueryModel) => {
      if (
        !filter.companySizes ||
        filter.companySizes === null ||
        filter.companySizes.length === 0
      ) {
        return true;
      }
      return filter.companySizes.some((sizeRange: string) => {
        const [minSize, maxSize] = sizeRange
          ?.split('-')
          ?.map((size) => parseInt(size, 10));
        const companySize = lead.companySize.total;
        return (
          companySize >= minSize && (maxSize ? companySize <= maxSize : true)
        );
      });
    };
    return leads.filter(
      (lead) =>
        filterByHiring(lead) && filterByScope(lead) && filterByCompanySize(lead)
    );
  }

  private mapLeads(leads: LeadModel[], activities: ActivityModel[]) {
    const activitiesMap = activities.reduce((a, c) => {
      return { ...a, [c.id]: c };
    }, {}) as Record<string, ActivityModel>;
    return leads.map((lead) => {
      return {
        name: lead.name,
        scope: lead.activityIds.map((act) => activitiesMap[act]?.name) ?? [],
        hiring: {
          isHiring: lead.hiring.active === '' ? false : true,
          juniors: lead.hiring.junior === '' ? false : true,
          talentProgram: lead.hiring.talentProgram === '' ? false : true,
        },
        industry: lead.industry,
        location: lead.location,
        linkedInUrl: lead.linkedinLink,
        websiteUrl: lead.websiteLink,
        companySize: {
          fe: lead.companySize.fe,
          dev: lead.companySize.dev,
          total: lead.companySize.total,
        },
        revenue: lead.annualRevenue,
      };
    });
  }

  resetFilterForm(): void {
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

  uncheckAllChecks() {
    const checkboxes = document.querySelectorAll<HTMLInputElement>('#checkbox');
    checkboxes.forEach((checkbox: HTMLInputElement) => {
      checkbox.checked = false;
    });
  }
}
