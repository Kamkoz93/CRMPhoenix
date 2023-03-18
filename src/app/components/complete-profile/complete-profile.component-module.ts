import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CompleteProfileComponent } from './complete-profile.component';

@NgModule({
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  declarations: [CompleteProfileComponent],
  providers: [],
  exports: [CompleteProfileComponent],
})
export class CompleteProfileComponentModule {}
