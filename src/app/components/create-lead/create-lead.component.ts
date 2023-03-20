import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { map, Observable, shareReplay } from 'rxjs';
import { Router } from '@angular/router';
import { ActivityModel } from '../../models/activity.model';
import { LeadsService } from '../../services/leads.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  CompanySizeModel,
  CreateLeadModel,
  HiringModel,
} from 'src/app/models/create-lead.model';
import { ROUTES_DEF } from 'src/app/configuration/routes-definition';

@Component({
  selector: 'app-create-lead',
  templateUrl: './create-lead.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateLeadComponent {
  constructor(
    private _leadsService: LeadsService,
    private _router: Router,
    private cd: ChangeDetectorRef,
    private _snackBar: MatSnackBar
  ) {}

  public readonly urlRoutes = ROUTES_DEF;

  readonly createLeadForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    websiteLink: new FormControl('', [
      Validators.required,
      Validators.pattern('https?://.+'),
    ]),
    location: new FormControl('', [Validators.required]),
    industry: new FormControl('', [Validators.required]),
    annualRevenue: new FormControl('', [Validators.required]),
    linkedinLink: new FormControl('', [
      Validators.pattern('https?://www.linkedin.com/.+'),
    ]),
    activityIds: new FormArray(
      [],
      [Validators.required, Validators.minLength(1)]
    ),
    companySize: new FormGroup({
      total: new FormControl('', [Validators.required, Validators.min(1)]),
      dev: new FormControl('', [Validators.required, Validators.min(1)]),
      fe: new FormControl('', [Validators.required, Validators.min(1)]),
    }),
    hiring: new FormGroup({
      active: new FormControl(false, [Validators.required]),
      junior: new FormControl(false, [Validators.required]),
      talentProgram: new FormControl(false, [Validators.required]),
    }),
  });

  readonly activitiesList$: Observable<ActivityModel[]> = this._leadsService
    .getActivities()
    .pipe(
      map((data) => data),
      shareReplay(1)
    );

  public setAcitiviesArr(data: any) {
    const activitiesIdsArr = this.createLeadForm.get(
      'activityIds'
    ) as FormArray;

    if (data.checked) {
      activitiesIdsArr.push(new FormControl(data.value));
    } else {
      const index = activitiesIdsArr.controls.findIndex(
        (x) => x.value == data.value
      );
      activitiesIdsArr.removeAt(index);
    }
  }

  onCreateLeadFormSubmitted(createLeadForm: FormGroup) {
    if (this.createLeadForm.invalid) {
      this.createLeadForm.markAllAsTouched();
      this._snackBar.open(
        'Something went wrong, please check your form',
        'Close',
        {
          duration: 2500,
        }
      );
      return;
    }

    const name: string = createLeadForm.get('name')?.value;
    const websiteLink: string = createLeadForm.get('websiteLink')?.value;
    const linkedinLink: string = createLeadForm.get('linkedinLink')?.value;
    const location: string = createLeadForm.get('location')?.value;
    const industry: string = createLeadForm.get('industry')?.value;
    const annualRevenue: number = parseInt(
      createLeadForm.get('annualRevenue')?.value
    );
    const activityIds: string[] = createLeadForm
      .get('activityIds')
      ?.getRawValue();

    const companySize: CompanySizeModel = {
      total: createLeadForm.get('companySize.total')?.value,
      dev: createLeadForm.get('companySize.dev')?.value,
      fe: createLeadForm.get('companySize.fe')?.value,
    };
    const hiring: HiringModel = {
      active: createLeadForm.get('hiring.active')?.value,
      junior: createLeadForm.get('hiring.junior')?.value,
      talentProgram: createLeadForm.get('hiring.talentProgram')?.value,
    };
    const lead: CreateLeadModel = {
      name,
      websiteLink,
      linkedinLink,
      location,
      industry,
      annualRevenue,
      activityIds,
      companySize,
      hiring,
    };

    this._leadsService.createLead(lead).subscribe({
      next: () => {
        this._router.navigate([ROUTES_DEF.LEADS]);
      },
      error: (error: HttpErrorResponse) => {
        this.createLeadForm.setErrors({
          beValidators: error.error.message ?? 'Something went wrong..',
        });
        this.cd.markForCheck();
      },
    });
  }
}
