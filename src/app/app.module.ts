import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponentModule } from './components/footer/footer.component-module';
import { LoaderComponentModule } from './components/loader/loader.component-module';
import { NavbarComponentModule } from './components/navbar/navbar.component-module';
import { AlwaysFalseGuard } from './guards/always-false/always-false.guard';
import { AuthGuard } from './guards/auth/auth.guard';
import { EmailVerifiedGuard } from './guards/email-verified/email-verified.guard';
import { HaveBioGuard } from './guards/have-bio/have-bio.guard';
import { LoggedIn } from './guards/logged-in/logged-in.guard';
import { AuthInterceptor } from './services/auth.interceptor';
import { LoaderInterceptor } from './services/loader.interceptor';
import { RefreshTokenInterceptor } from './services/refresh-token.interceptor';
import { STORAGE } from './services/storage';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
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
