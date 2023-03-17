import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CompleteProfileComponent } from './components/complete-profile/complete-profile.component';
import { CompleteProfileComponentModule } from './components/complete-profile/complete-profile.component-module';
import { CreateLeadComponent } from './components/create-lead/create-lead.component';
import { CreateLeadComponentModule } from './components/create-lead/create-lead.component-module';
import { HomeComponent } from './components/home/home.component';
import { HomeComponentModule } from './components/home/home.component-module';
import { LeadsComponent } from './components/leads/leads.component';
import { LeadsComponentModule } from './components/leads/leads.component-module';
import { LoggedOutComponent } from './components/logged-out/logged-out.component';
import { LoggedOutComponentModule } from './components/logged-out/logged-out.component-module';
import { LoginComponent } from './components/login/login.component';
import { LoginComponentModule } from './components/login/login.component-module';
import { RegisterComponent } from './components/register/register.component';
import { RegisterComponentModule } from './components/register/register.component-module';
import { VerifyComponent } from './components/verify/verify.component';
import { VerifyComponentModule } from './components/verify/verify.component-module';
import { AlwaysFalseGuard } from './guards/always-false/always-false.guard';
import { AuthGuard } from './guards/auth/auth.guard';
import { EmailVerifiedGuard } from './guards/email-verified/email-verified.guard';
import { HaveBioGuard } from './guards/have-bio/have-bio.guard';
import { LoggedIn } from './guards/logged-in/logged-in.guard';

@NgModule({
  imports: [
    RouterModule.forRoot([
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'auth',
        canActivate: [],
        children: [
          {
            path: 'login',
            component: LoginComponent,
            canActivate: [LoggedIn],
            data: {
              redirectUrl: '/leads',
            },
          },
          {
            path: 'register',
            component: RegisterComponent,
            canActivate: [LoggedIn],
            data: {
              redirectUrl: '/leads',
            },
          },
        ],
      },
      {
        path: 'verify',
        component: VerifyComponent,
        canActivate: [AuthGuard, AlwaysFalseGuard],
        data: {
          redirectNotLoggedInUrl: '/auth/login',
        },
      },
      {
        path: 'complete-profile',
        component: CompleteProfileComponent,
        canActivate: [AuthGuard],
        data: {
          redirectNotLoggedInUrl: '/auth/login',
        },
      },
      {
        path: 'leads',
        component: LeadsComponent,
        canActivate: [AuthGuard, EmailVerifiedGuard, HaveBioGuard],
        data: {
          redirectNotLoggedInUrl: '/auth/login',
          redirectNotVerifiedUrl: '/verify',
          redirectCompleteProfileUrl: '/complete-profile',
        },
      },
      {
        path: 'create-lead',
        component: CreateLeadComponent,
        canActivate: [AuthGuard],
        data: {
          redirectNotLoggedInUrl: '/auth/login',
          redirectUrl: 'logged-in',
        },
      },

      {
        path: 'logged-out',
        component: LoggedOutComponent,
      },
    ]),
    HomeComponentModule,
    LoginComponentModule,
    RegisterComponentModule,
    VerifyComponentModule,
    CompleteProfileComponentModule,
    LeadsComponentModule,
    CreateLeadComponentModule,
    LoggedOutComponentModule,
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
