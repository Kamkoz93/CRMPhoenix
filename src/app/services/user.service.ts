import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, of, shareReplay } from 'rxjs';
import { UserCredentialsModel } from '../models/user-credentials.model';
import { DataResponseModel } from '../models/data-response.model';
import { BioContentModel } from '../models/bio-content.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private _httpClient: HttpClient) {}

  registerUser(payload: UserCredentialsModel): any {
    return this._httpClient.post<DataResponseModel<UserCredentialsModel>>(
      'https://us-central1-courses-auth.cloudfunctions.net/auth/register2',
      {
        data: payload,
      }
    );
  }

  public haveBio(): Observable<boolean> {
    return this._httpClient
      .get<boolean>(
        'https://us-central1-courses-auth.cloudfunctions.net/auth/my-bio'
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 404) {
            return of(false);
          } else {
            return of(true);
          }
        }),
        shareReplay(1)
      );
  }

  addUserBio(payload: BioContentModel): any {
    return this._httpClient.post<DataResponseModel<string>>(
      'https://us-central1-courses-auth.cloudfunctions.net/auth/add-bio',
      {
        data: payload,
      }
    );
  }
}
