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
import { IsAdmin } from './guards/id-admin/id-admin.guard';
import { LoggedIn } from './guards/logged-in/logged-in.guard';
import { ROUTES_DEF } from './configuration/routes-definition';
@NgModule({
  imports: [
    RouterModule.forRoot([
      {
        path: ROUTES_DEF.BASE_URL,
        component: HomeComponent,
      },
      {
        path: ROUTES_DEF.AUTH,
        redirectTo: `${ROUTES_DEF.AUTH}/${ROUTES_DEF.LOGIN}`,
        pathMatch: 'full',
      },
      {
        path: ROUTES_DEF.AUTH,
        children: [
          {
            path: ROUTES_DEF.LOGIN,
            component: LoginComponent,
            canActivate: [LoggedIn],
            data: {
              redirectUrl: ROUTES_DEF.LEADS,
            },
          },
          {
            path: ROUTES_DEF.REGISTER,
            component: RegisterComponent,
            canActivate: [LoggedIn],
            data: {
              redirectUrl: ROUTES_DEF.LEADS,
            },
          },
        ],
      },
      {
        path: ROUTES_DEF.VERIFY,
        component: VerifyComponent,
        canActivate: [AuthGuard, AlwaysFalseGuard, LoggedIn],
        data: {
          redirectNotLoggedInUrl: `${ROUTES_DEF.AUTH}/${ROUTES_DEF.LOGIN}`,
          redirectUrl: ROUTES_DEF.LEADS,
        },
      },
      {
        path: ROUTES_DEF.COMPLETE_PROFILE,
        component: CompleteProfileComponent,
        canActivate: [AuthGuard],
        data: {
          redirectNotLoggedInUrl: `${ROUTES_DEF.AUTH}/${ROUTES_DEF.LOGIN}`,
        },
      },
      {
        path: ROUTES_DEF.LEADS,
        component: LeadsComponent,
        canActivate: [AuthGuard, EmailVerifiedGuard, HaveBioGuard],
        data: {
          redirectNotLoggedInUrl: `${ROUTES_DEF.AUTH}/${ROUTES_DEF.LOGIN}`,
          redirectNotVerifiedUrl: ROUTES_DEF.VERIFY,
          redirectCompleteProfileUrl: ROUTES_DEF.COMPLETE_PROFILE,
        },
      },
      {
        path: ROUTES_DEF.CREATE_LEAD,
        component: CreateLeadComponent,
        canActivate: [AuthGuard, IsAdmin],
        data: {
          redirectNotLoggedInUrl: `${ROUTES_DEF.AUTH}/${ROUTES_DEF.LOGIN}`,
          redirectUrl: ROUTES_DEF.LOGGED_IN,
          redirectNotAdmin: ROUTES_DEF.LEADS,
        },
      },

      {
        path: ROUTES_DEF.LOGGED_OUT,
        component: LoggedOutComponent,
        canActivate: [LoggedIn],
        data: {
          redirectUrl: ROUTES_DEF.LEADS,
        },
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
