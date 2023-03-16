import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, shareReplay } from 'rxjs';
import { Router } from '@angular/router';
import { ActivityModel } from '../../models/activity.model';
import { LeadsService } from '../../services/leads.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  readonly createLeadForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    websiteLink: new FormControl('', [
      Validators.required,
      Validators.pattern('https?://.+'),
    ]),
    location: new FormControl('', [Validators.required]),
    industry: new FormControl('', [Validators.required]),
    annualRevenue: new FormControl('', [Validators.required]),
    linkedIn: new FormControl('', [
      Validators.pattern('https?://www.linkedin.com/.+'),
    ]),
    activityIds: new FormControl(
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
    .pipe(shareReplay(1));

  onCreateLeadFormSubmitted(createLeadForm: FormGroup) {
    // if (this.createLeadForm.invalid) {
    //   this._snackBar.open('Form is invalid', 'Close');
    //   return;
    // }

    const name: string = createLeadForm.get('name')?.value;
    const websiteLink: string = createLeadForm.get('websiteLink')?.value;
    const location: string = createLeadForm.get('location')?.value;
    const industry: string = createLeadForm.get('industry')?.value;
    const annualRevenue: number = createLeadForm.get('annualRevenue')?.value;
    const activityIds: string[] = createLeadForm.get('activityIds')?.value;
    const companySize: {} = {
      total: createLeadForm.get('total')?.value,
      dev: createLeadForm.get('dev')?.value,
      fe: createLeadForm.get('fe')?.value,
    };
    const hiring: {} = {
      active: createLeadForm.get('active')?.value,
      junior: createLeadForm.get('junior')?.value,
      talentProgram: createLeadForm.get('talentProgram')?.value,
    };
    const lead = {
      name,
      websiteLink,
      location,
      industry,
      annualRevenue,
      activityIds,
      companySize,
      hiring,
    };

    console.log(lead);
    //   this._leadsService.createLead(lead).subscribe({
    //     next: () => {
    //       this._router.navigate(['/leads']);
    //     },
    //     error: (error: HttpErrorResponse) => {
    //       this.createLeadForm.setErrors({
    //         beValidators: error.error.message,
    //       });
    //       this.cd.markForCheck();
    //     },
    //   });
  }
}
