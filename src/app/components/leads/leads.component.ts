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
import {
  FilterForm2Model,
  FilterFormModel,
} from 'src/app/models/filter-form.model';
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

  readonly filterForm2: FormGroup = new FormGroup({
    isHiring: new FormControl(false),
    projectTypes: new FormArray([
      new FormControl(), // Internal Projects
      new FormControl(), // Recruitment Agency
      new FormControl(), // External Projects
    ]),
    companySizes: new FormArray([
      new FormControl(), // 0-50
      new FormControl(), // 51-100
      new FormControl(), // 101-500
      new FormControl(), // 501-1000
      new FormControl(), // 1001+
    ]),
  });

  readonly selectedFormValues2$: Observable<FilterForm2Model> =
    this.filterForm2.valueChanges.pipe(
      startWith({
        isHiring: new FormControl(false),
        projectTypes: new FormArray([
          new FormControl(), // Internal Projects
          new FormControl(), // Recruitment Agency
          new FormControl(), // External Projects
        ]),
        companySizes: new FormArray([
          new FormControl(), // 0-50
          new FormControl(), // 51-100
          new FormControl(), // 101-500
          new FormControl(), // 501-1000
          new FormControl(), // 1001+
        ]),
      }),
      map((form: FilterForm2Model) => ({
        isHiring: form.isHiring,
        projectTypes: form.projectTypes,
        companySizes: form.companySizes,
      })),
      shareReplay(1)
    );

  // readonly selectedFormValues$: Observable<FilterFormModel> =
  //   this.filterForm.valueChanges.pipe(
  //     startWith({
  //       isHiring: true,
  //       scopeArr: [],
  //       companySizeArr: [],
  //     }),
  //     map((form: FilterFormModel) => ({
  //       isHiring: form.isHiring,
  //       scopeArr: form.scopeArr,
  //       companySizeArr: form.companySizeArr,
  //     })),
  //     shareReplay(1)
  //   );

  public mappedLeads$: Observable<LeadConvertedQueryModel[]> = combineLatest([
    this._leadsService.getLeads(),
    this.activitiesList$,
    this.selectedFormValues2$,
  ]).pipe(
    map(([leads, activities, filterForm]) => {
      const mappedLeads = this.mapLeads(leads, activities);
      console.log('Mapped Leads:', mappedLeads);
      console.log(filterForm.isHiring);
      return mappedLeads.filter((lead) => {
        if (!filterForm.isHiring) {
          console.log(filterForm.isHiring);
          return false;
        }
        return filterForm.isHiring === lead.hiring.isHiring;
      });
    })
  );

  readonly companySizeOptions$: Observable<string[]> = of([
    '0-50',
    '51-100',
    '101-500',
    '501-1000',
    '1001+',
  ]);

  // private filterLeads(
  //   leads: LeadConvertedQueryModel[],
  //   filter: FilterForm2Model
  // ) {
  // const filterByHiring = (lead: LeadConvertedQueryModel) => {
  //   if (!filter.isHiring) {
  //     return true;
  //   }
  //   return filter.isHiring === lead.hiring.isHiring;
  // };

  // const filterByScope = (lead: LeadConvertedQueryModel) => {
  //   if (
  //     !filter.projectTypes ||
  //     filter.projectTypes === null ||
  //     filter.projectTypes.length === 0
  //   ) {
  //     return true;
  //   }
  //   return filter.projectTypes.every((activity) =>
  //     lead.scope.includes(activity)
  //   );
  // };

  // const filterByCompanySize = (lead: LeadConvertedQueryModel) => {
  //   if (
  //     !filter.companySizes ||
  //     filter.companySizes === null ||
  //     filter.companySizes.length === 0
  //   ) {
  //     return true;
  //   }
  //   return filter.companySizes.some((sizeRange) => {
  //     const [minSize, maxSize] = sizeRange
  //       ?.split('-')
  //       ?.map((size) => parseInt(size, 10));
  //     const companySize = lead.companySize.total;
  //     return (
  //       companySize >= minSize && (maxSize ? companySize < maxSize : true)
  //     );
  //   });
  // };

  // const filteredLeads = leads.filter(
  //   (lead) => filterByScope(lead) && filterByCompanySize(lead)
  // );

  //   return leads.filter((lead) => filterByHiring(lead) || !filter.isHiring);
  // }

  // private filterLeads(
  //   leads: LeadConvertedQueryModel[],
  //   filter: FilterForm2Model
  // ) {
  //   const filterByHiring = (lead: LeadConvertedQueryModel) => {
  //     if (!filter.isHiring) {
  //       return true;
  //     }
  //     return filter.isHiring === lead.hiring.isHiring;
  //   };

  //   const filterByScope = (lead: LeadConvertedQueryModel) => {
  //     if (
  //       !filter.projectTypes ||
  //       filter.projectTypes === null ||
  //       filter.projectTypes.length === 0
  //     ) {
  //       return true;
  //     }
  //     return filter.projectTypes.every((activity) =>
  //       lead.scope.includes(activity)
  //     );
  //   };

  //   const filterByCompanySize = (lead: LeadConvertedQueryModel) => {
  //     if (
  //       !filter.companySizes ||
  //       filter.companySizes === null ||
  //       filter.companySizes.length === 0
  //     ) {
  //       return true;
  //     }
  //     return filter.companySizes.some((sizeRange) => {
  //       const [minSize, maxSize] = sizeRange
  //         ?.split('-')
  //         ?.map((size) => parseInt(size, 10));
  //       const companySize = lead.companySize.total;
  //       return (
  //         companySize >= minSize && (maxSize ? companySize < maxSize : true)
  //       );
  //     });
  //   };
  //   // console.log(
  //   //   leads.filter(
  //   //     (lead) =>
  //   //       filterByHiring(lead) &&
  //   //       filterByScope(lead) &&
  //   //       filterByCompanySize(lead)
  //   //   )
  //   // );
  //   return leads.filter(
  //     (lead) => filterByHiring(lead)
  //     // && filterByScope(lead) && filterByCompanySize(lead)
  //   );
  // }

  public setScopeArr(event: any) {
    const projectTypesArr = this.filterForm2.get('projectTypes') as FormArray;
    if (event.target.checked) {
      projectTypesArr.push(new FormControl(event.target.value));
    } else {
      let i = 0;
      projectTypesArr.controls.forEach((activity) => {
        if (activity.value === event.target.value) {
          projectTypesArr.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  public setCompanySizeArr(event: any) {
    const companySizesArr = this.filterForm2.get('companySizes') as FormArray;
    if (event.target.checked) {
      companySizesArr.push(new FormControl(event.target.value));
    } else {
      let i = 0;
      companySizesArr.controls.forEach((sizeRange) => {
        if (sizeRange.value === event.target.value) {
          companySizesArr.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  // public resetForm() {
  //   this.filterForm.setControl('isHiring', new FormControl(true));
  //   this.filterForm.setControl('scopeArr', new FormArray([]));
  //   this.filterForm.setControl('companySizeArr', new FormArray([]));
  // }

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
