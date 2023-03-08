import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LoginComponentModule } from './components/login/login.component-module';

const routes: Routes = [{ path: 'login', component: LoginComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes), LoginComponentModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
