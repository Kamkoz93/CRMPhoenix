import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { VerifyComponent } from './components/verify/verify.component';
import { LeadsComponent } from './components/leads/leads.component';
import { CompleteProfileComponent } from './components/complete-profile/complete-profile.component';
import { CreateLeadComponent } from './components/create-lead/create-lead.component';
import { LoggedOutComponent } from './components/logged-out/logged-out.component';
import { LoginComponentModule } from './components/login/login.component-module';
import { RegisterComponentModule } from './components/register/register.component-module';
import { VerifyComponentModule } from './components/verify/verify.component-module';
import { CompleteProfileComponentModule } from './components/complete-profile/complete-profile.component-module';
import { CreateLeadComponentModule } from './components/create-lead/create-lead.component-module';
import { LoggedOutComponentModule } from './components/logged-out/logged-out.component-module';
import { LeadsComponentModule } from './components/leads/leads.component-module';
import { HaveBioGuard } from './guards/have-bio/have-bio.guard';
import { AuthGuard } from './guards/auth/auth.guard';
import { LoggedIn } from './guards/logged-in/logged-in.guard';
import { AlwaysFalseGuard } from './guards/always-false/always-false.guard';
import { EmailVerifiedGuard } from './guards/email-verified/email-verified.guard';
import { HomeComponent } from './components/home/home.component';
import { HomeComponentModule } from './components/home/home.component-module';

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
