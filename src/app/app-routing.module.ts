import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { VerifyComponent } from './components/verify/verify.component';

import { LoginComponentModule } from './components/login/login.component-module';
import { RegisterComponentModule } from './components/register/register.component-module';
import { VerifyComponentModule } from './components/verify/verify.component-module';
import { LeadsComponent } from './components/leads/leads.component';
import { EmailVerifiedGuard } from './guards/email-verified/email-verified.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'verify', component: VerifyComponent },
  {
    path: 'leads',
    component: LeadsComponent,
    canActivate: [EmailVerifiedGuard],
    data: { redirectNotVerifiedUrl: '/verify' },
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    LoginComponentModule,
    RegisterComponentModule,
    VerifyComponentModule,
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
