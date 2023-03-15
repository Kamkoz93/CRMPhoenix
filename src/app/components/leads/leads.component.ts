import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Observable, combineLatest, of } from 'rxjs';
import { filter, map, shareReplay, startWith } from 'rxjs/operators';
import { LeadsService } from '../../services/leads.service';
import { LeadConvertedQueryModel } from '../../queries/lead-converted.query-model';
import { LeadModel } from '../../models/lead.model';
import { ActivityModel } from '../../models/activity.model';
import { FilterFormModel } from 'src/app/models/filter-form.model';
import { SalesStageModel } from 'src/app/models/sales-stage.model';

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

  filterForm: FormGroup = new FormGroup({
    isHiring: new FormControl(true),
    scopeArr: new FormArray([]),
    companySizeArr: new FormArray([]),
  });

  readonly selectedFormValues$: Observable<FilterFormModel> =
    this.filterForm.valueChanges.pipe(
      startWith({
        isHiring: true,
        scopeArr: [],
        companySizeArr: [],
      }),
      map((form: FilterFormModel) => ({
        isHiring: form.isHiring,
        scopeArr: form.scopeArr,
        companySizeArr: form.companySizeArr,
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
      console.log(filter.isHiring);
      if (!filter.isHiring) {
        return true;
      }
      return filter.isHiring === lead.hiring.isHiring;
    };

    const filterByScope = (lead: LeadConvertedQueryModel) => {
      console.log(filter.scopeArr);
      if (
        !filter.scopeArr ||
        filter.scopeArr === null ||
        filter.scopeArr.length === 0
      ) {
        return true;
      }
      return filter.scopeArr.every((activity) => lead.scope.includes(activity));
    };

    const filterByCompanySize = (lead: LeadConvertedQueryModel) => {
      console.log(filter.companySizeArr);
      if (
        !filter.companySizeArr ||
        filter.companySizeArr === null ||
        filter.companySizeArr.length === 0
      ) {
        return true;
      }
      return filter.companySizeArr.some((sizeRange) => {
        const [minSize, maxSize] = sizeRange
          ?.split('-')
          ?.map((size) => parseInt(size, 10));
        const companySize = lead.companySize.total;
        return (
          companySize >= minSize && (maxSize ? companySize < maxSize : true)
        );
      });
    };
    // console.log(
    //   leads.filter(
    //     (lead) =>
    //       filterByHiring(lead) &&
    //       filterByScope(lead) &&
    //       filterByCompanySize(lead)
    //   )
    // );
    return leads.filter(
      (lead) =>
        filterByHiring(lead) && filterByScope(lead) && filterByCompanySize(lead)
    );
  }

  public setScopeArr(event: any) {
    const scopeArray = this.filterForm.get('scopeArr') as FormArray;
    if (event.target.checked) {
      scopeArray.push(new FormControl(event.target.value));
    } else {
      let i = 0;
      scopeArray.controls.forEach((activity) => {
        if (activity.value === event.target.value) {
          scopeArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  public setCompanySizeArr(event: any) {
    const sizeArray = this.filterForm.get('companySizeArr') as FormArray;
    if (event.target.checked) {
      sizeArray.push(new FormControl(event.target.value));
    } else {
      let i = 0;
      sizeArray.controls.forEach((sizeRange) => {
        if (sizeRange.value === event.target.value) {
          sizeArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  public resetForm() {
    this.filterForm.setControl('isHiring', new FormControl(true));
    this.filterForm.setControl('scopeArr', new FormArray([]));
    this.filterForm.setControl('companySizeArr', new FormArray([]));
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
}
