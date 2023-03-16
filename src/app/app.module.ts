import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { STORAGE } from './services/storage';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AuthGuard } from './guards/auth/auth.guard';
import { EmailVerifiedGuard } from './guards/email-verified/email-verified.guard';
import { LoggedIn } from './guards/logged-in/logged-in.guard';
import { AuthInterceptor } from './services/auth.interceptor';
import { HomeRedirectGuard } from './guards/home-redirect/home-redirect.guard';
import { HaveBioGuard } from './guards/have-bio/have-bio.guard';
import { AlwaysFalseGuard } from './guards/always-false/always-false.guard';
import { RefreshTokenInterceptor } from './services/refresh-token.interceptor';
import { LoaderInterceptor } from './services/loader.interceptor';
import { LoaderComponentModule } from './components/loader/loader.component-module';
import { NavbarComponentModule } from './components/navbar/navbar.component-module';
import { FooterComponentModule } from './components/footer/footer.component-module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NoopAnimationsModule,
    NavbarComponentModule,
    FooterComponentModule,
    LoaderComponentModule,
  ],
  providers: [
    { provide: STORAGE, useValue: localStorage },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RefreshTokenInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true,
    },
    EmailVerifiedGuard,
    LoggedIn,
    AuthGuard,
    AlwaysFalseGuard,
    HaveBioGuard,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
