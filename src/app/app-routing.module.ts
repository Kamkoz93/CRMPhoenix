import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponentModule } from './components/login/login.component-module';
import { RegisterComponentModule } from './components/register/register.component-module';

const routes: Routes = [{ path: 'login', component: LoginComponent }, { path: 'register', component: RegisterComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes), LoginComponentModule, RegisterComponentModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
