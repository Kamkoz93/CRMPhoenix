import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserCredentialsModel } from '../models/user-credentials.model';
import { DataResponseModel } from '../models/data-response.model';

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
}
