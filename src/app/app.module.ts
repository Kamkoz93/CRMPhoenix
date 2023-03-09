import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { STORAGE } from './services/storage';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AuthGuard } from './guards/auth/auth.guard';
import { EmailVerifiedGuard } from './guards/email-verified/email-verified.guard';
import { LoggedIn } from './guards/logged-in/logged-in.guard';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NoopAnimationsModule,
  ],
  providers: [
    { provide: STORAGE, useValue: localStorage },
    LoggedIn,
    EmailVerifiedGuard,
    AuthGuard,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
