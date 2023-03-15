import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoggedOutComponent } from './logged-out.component';

@NgModule({
  imports: [RouterModule],
  declarations: [LoggedOutComponent],
  providers: [],
  exports: [LoggedOutComponent]
})
export class LoggedOutComponentModule {
}
