import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar.component';

@NgModule({
  imports: [RouterModule],
  declarations: [NavbarComponent],
  providers: [],
  exports: [NavbarComponent],
})
export class NavbarComponentModule {}
