import { Inject, Injectable } from '@angular/core';
import {
  Observable,
  map,
  tap,
  BehaviorSubject,
  shareReplay,
  catchError,
  of,
} from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UserCredentialsModel } from '../models/user-credentials.model';
import { DataResponseModel } from '../models/data-response.model';
import { STORAGE } from './storage';
import { CredentialsResponseDataModel } from '../models/credentials-response-data.model';
import { AuthUserDataModel } from '../models/auth-user-data.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private _httpClient: HttpClient,
    @Inject(STORAGE) private _storage: Storage
  ) {}
  initialUserVerification: Observable<boolean> = this.isUserVerified().pipe(
    shareReplay(1)
  );
  initialEmailVerification: Observable<boolean> = this.isEmailVerified().pipe(
    shareReplay(1)
  );

  private _loggedInSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(this.isUserLogged());
  public loggedIn$: Observable<boolean> = this._loggedInSubject.asObservable();

  private isUserLogged(): boolean {
    return this._storage.hasOwnProperty('accessToken') ?? false;
  }

  // private _isUserVerifiedSubject: BehaviorSubject<boolean> =
  //   new BehaviorSubject<any>('');
  // public isUserVerified$: Observable<boolean> =
  //   this._isUserVerifiedSubject.asObservable();

  // private _isEmailVerifiedSubject: BehaviorSubject<boolean> =
  //   new BehaviorSubject<any>('');
  // public isEmailVerified$: Observable<boolean> =
  //   this._isEmailVerifiedSubject.asObservable();

  public getMeInformation(): Observable<AuthUserDataModel> {
    return this._httpClient.get<AuthUserDataModel>(
      'https://us-central1-courses-auth.cloudfunctions.net/auth/me'
    );
  }

  public isUserVerified(): Observable<boolean> {
    return this._httpClient
      .get<any>('https://us-central1-courses-auth.cloudfunctions.net/auth/me')
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error) {
            return of(false);
          } else {
            return of(true);
          }
        })
      );
  }

  public isEmailVerified(): Observable<boolean> {
    return this._httpClient
      .get<AuthUserDataModel>(
        'https://us-central1-courses-auth.cloudfunctions.net/auth/me'
      )
      .pipe(
        map((res) => {
          const emailVerified = res.data.user.context.email_verified ?? false;
          return emailVerified;
        })
      );
  }

  login(
    payload: UserCredentialsModel
  ): Observable<CredentialsResponseDataModel> {
    return this._httpClient
      .post<DataResponseModel<CredentialsResponseDataModel>>(
        `https://us-central1-courses-auth.cloudfunctions.net/auth/login`,
        {
          data: payload,
        }
      )
      .pipe(
        map((response) => response.data),
        tap((data) => {
          this.isEmailVerified();
          this.saveUserStorage(data);
        })
      );
  }

  private saveUserStorage(data: CredentialsResponseDataModel): void {
    this._storage.setItem('accessToken', data.accessToken);
    this._storage.setItem('refreshToken', data.refreshToken);
  }

  refreshToken(refreshToken: string): Observable<CredentialsResponseDataModel> {
    return this._httpClient
      .post<DataResponseModel<CredentialsResponseDataModel>>(
        'https://us-central1-courses-auth.cloudfunctions.net/auth/refresh',
        {
          data: {
            refreshToken: refreshToken,
          },
        }
      )
      .pipe(
        map((response) => response.data),
        tap((data) => {
          this.isEmailVerified();
          this.saveUserStorage(data);
        })
      );
  }

  public logout(): void {
    this._loggedInSubject.next(false);
    this._storage.clear();
  }
}
