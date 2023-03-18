import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponentModule } from '../navbar/navbar.component-module';
import { VerifyComponent } from './verify.component';

@NgModule({
  imports: [NavbarComponentModule, RouterModule],
  declarations: [VerifyComponent],
  providers: [],
  exports: [VerifyComponent],
})
export class VerifyComponentModule {}
