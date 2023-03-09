import { Inject, Injectable } from '@angular/core';
import { Observable, map, tap, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UserCredentialsModel } from '../models/user-credentials.model';
import { DataResponseModel } from '../models/data-response.model';
import { STORAGE } from './storage';
import { CredentialsResponseDataModel } from '../models/credentials-response-data.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private _httpClient: HttpClient,
    @Inject(STORAGE) private _storage: Storage
  ) {}
  private _loggedInSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(this.isUserLogged());

  private isUserLogged(): boolean {
    return this._storage.hasOwnProperty('accessToken') ?? false;
  }
  public isUserVerified(): boolean {
    return this._storage.getItem('emailVerified') === 'true' ? true : false;
  }

  public loggedIn$: Observable<boolean> = this._loggedInSubject.asObservable();

  // private _accessTokenSubject: BehaviorSubject<string | null> =
  //   new BehaviorSubject<string | null>(this._storage.getItem('token'));
  // public token$: Observable<string | null> =
  //   this._accessTokenSubject.asObservable();

  // private _refreshTokenSubject: BehaviorSubject<string | null> =
  //   new BehaviorSubject<string | null>(this._storage.getItem('refreshToken'));
  // public refreshToken$: Observable<string | null> =
  //   this._refreshTokenSubject.asObservable();

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
          this._loggedInSubject.next(true);
          this.saveUserStorage(data);
        })
      );
  }

  private saveUserStorage(data: CredentialsResponseDataModel): void {
    this._storage.setItem('id', data.id);
    this._storage.setItem('accessToken', data.accessToken);
    this._storage.setItem('emailVerified', data.emailVerified);
    this._storage.setItem('refreshToken', data.refreshToken);
  }

  public logout(): void {
    this._loggedInSubject.next(false);
    this._storage.clear();
  }
}
