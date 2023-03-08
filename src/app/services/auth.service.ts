import { Inject, Injectable } from '@angular/core';
import { Observable, map, tap, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LoginResponseModel } from '../models/login-response.model';
import { UserCredentialsModel } from '../models/user-credentials.model';
import { DataResponseModel } from '../models/data-response.model';
import { STORAGE } from './storage';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private _httpClient: HttpClient,
    @Inject(STORAGE) private _storage: Storage
  ) {}

  private _accessTokenSubject: BehaviorSubject<string | null> =
    new BehaviorSubject<string | null>(this._storage.getItem('token'));
  public token$: Observable<string | null> =
    this._accessTokenSubject.asObservable();

  private _refreshTokenSubject: BehaviorSubject<string | null> =
    new BehaviorSubject<string | null>(this._storage.getItem('refreshToken'));
  public refreshToken$: Observable<string | null> =
    this._refreshTokenSubject.asObservable();

  login(payload: UserCredentialsModel): Observable<LoginResponseModel> {
    return this._httpClient
      .post<DataResponseModel<LoginResponseModel>>(
        `https://us-central1-courses-auth.cloudfunctions.net/auth/login`,
        {
          data: payload,
        }
      )
      .pipe(
        map((response) => response.data),
        tap((data) => {
          const accessToken = data.accessToken;
          const refreshToken = data.refreshToken;
          this._accessTokenSubject.next(accessToken);
          this._refreshTokenSubject.next(refreshToken);
          this._storage.setItem('accessToken', accessToken);
          this._storage.setItem('refreshToken', refreshToken);
        })
      );
  }
}
