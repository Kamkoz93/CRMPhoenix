import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { CreateLeadComponent } from './create-lead.component';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NavbarComponentModule } from '../navbar/navbar.component-module';
import { FooterComponentModule } from '../footer/footer.component-module';

@NgModule({
  imports: [
    NavbarComponentModule,
    FooterComponentModule,
    ReactiveFormsModule,
    CommonModule,
    MatSnackBarModule,
  ],
  declarations: [CreateLeadComponent],
  providers: [],
  exports: [CreateLeadComponent],
})
export class CreateLeadComponentModule {}
