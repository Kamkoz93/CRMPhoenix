import { Inject, Injectable } from '@angular/core';
import { Observable, map, tap, BehaviorSubject, catchError, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UserCredentialsModel } from '../models/user-credentials.model';
import { DataResponseModel } from '../models/data-response.model';
import { STORAGE } from './storage';
import { CredentialsResponseDataModel } from '../models/credentials-response-data.model';
import { AuthUserDataModel } from '../models/auth-user-data.model';
import jwt_decode from 'jwt-decode';
import { API_ROUTES_DEF, ROUTES_DEF } from '../configuration/routes-definition';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private _httpClient: HttpClient,
    @Inject(STORAGE) private _storage: Storage
  ) {}
  // initialUserVerification: Observable<boolean> = this.isUserVerified().pipe(
  //   map((data) => data),
  //   shareReplay(1)
  // );

  private _loggedInSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(this.isUserLogged());
  public loggedIn$: Observable<boolean> = this._loggedInSubject.asObservable();

  private isUserLogged(): boolean {
    return this._storage.hasOwnProperty('accessToken') ?? false;
  }

  hasRole(role: string): Observable<boolean> {
    const token = this._storage.getItem('accessToken');
    if (token) {
      const decodedToken: { role?: string } = jwt_decode(token);
      const decodedRole: string = decodedToken?.role ?? '';
      return of(decodedRole === role);
    }
    return of(false);
  }

  private getMeData(): Observable<AuthUserDataModel> {
    return this._httpClient.get<AuthUserDataModel>(
      API_ROUTES_DEF.AUTH_ME ??
        'https://us-central1-courses-auth.cloudfunctions.net/auth/me'
    );
  }

  public isUserVerified(): Observable<boolean> {
    return this.getMeData().pipe(
      map((res) => {
        return true;
      }),
      catchError((error) => {
        return of(false);
      })
    );
  }

  public isEmailVerified(): Observable<boolean> {
    return this.getMeData().pipe(
      map((res) => {
        const emailVerified = res.data.user.context.email_verified;
        return emailVerified;
      }),
      catchError((error) => {
        return of(false);
      })
    );
  }

  // public getMeInformation(): Observable<AuthUserDataModel> {
  //   return this._httpClient.get<AuthUserDataModel>(
  //     'https://us-central1-courses-auth.cloudfunctions.net/auth/me'
  //   );
  // }

  // public isUserVerified(): Observable<boolean> {
  //   return this._httpClient
  //     .get<boolean>(
  //       'https://us-central1-courses-auth.cloudfunctions.net/auth/me'
  //     )
  //     .pipe(
  //       catchError((error: HttpErrorResponse) => {
  //         if (error) {
  //           return of(false);
  //         } else {
  //           return of(true);
  //         }
  //       }),
  //       shareReplay(1)
  //     );
  // }

  // public isEmailVerified(): Observable<boolean> {
  //   return this._httpClient
  //     .get<AuthUserDataModel>(
  //       'https://us-central1-courses-auth.cloudfunctions.net/auth/me'
  //     )
  //     .pipe(
  //       map((res) => {
  //         const emailVerified = res.data.user.context.email_verified;
  //         return emailVerified;
  //       }),
  //       shareReplay(1)
  //     );
  // }

  login(
    payload: UserCredentialsModel
  ): Observable<CredentialsResponseDataModel> {
    return this._httpClient
      .post<DataResponseModel<CredentialsResponseDataModel>>(
        API_ROUTES_DEF.LOGIN ??
          `https://us-central1-courses-auth.cloudfunctions.net/auth/login`,
        {
          data: payload,
        }
      )
      .pipe(
        map((response) => response.data),
        tap((data) => {
          this._loggedInSubject.next(true);
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
        API_ROUTES_DEF.REFRESH_TOKEN ??
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
          this._loggedInSubject.next(true);
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
