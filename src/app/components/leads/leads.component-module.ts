import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { NavbarComponentModule } from '../navbar/navbar.component-module';
import { FooterComponentModule } from '../footer/footer.component-module';
import { LeadsComponent } from './leads.component';
import { HasRoleDirective } from 'src/app/directives/has-role.directive';

@NgModule({
  imports: [
    NavbarComponentModule,
    FooterComponentModule,
    CommonModule,
    MatTableModule,
    MatListModule,
    RouterModule,
    ReactiveFormsModule,
  ],
  declarations: [LeadsComponent, HasRoleDirective],
  providers: [],
  exports: [LeadsComponent],
})
export class LeadsComponentModule {}
