import { NgModule } from '@angular/core';
import { NavbarComponentModule } from '../navbar/navbar.component-module';
import { VerifyComponent } from './verify.component';

@NgModule({
  imports: [NavbarComponentModule],
  declarations: [VerifyComponent],
  providers: [],
  exports: [VerifyComponent],
})
export class VerifyComponentModule {}
