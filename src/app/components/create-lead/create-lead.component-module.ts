import { NgModule } from '@angular/core';
import { FooterComponentModule } from '../footer/footer.component-module';
import { NavbarComponentModule } from '../navbar/navbar.component-module';
import { CreateLeadComponent } from './create-lead.component';

@NgModule({
  imports: [NavbarComponentModule, FooterComponentModule],
  declarations: [CreateLeadComponent],
  providers: [],
  exports: [CreateLeadComponent],
})
export class CreateLeadComponentModule {}
