import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { DataResponseModel } from '../models/data-response.model';
import { CreateLeadModel } from '../models/create-lead.model';
import { ActivityModel } from '../models/activity.model';
import { LeadModel } from '../models/lead.model';

@Injectable({ providedIn: 'root' })
export class LeadsService {
  constructor(private _httpClient: HttpClient) {}

  getActivities(): Observable<ActivityModel[]> {
    return this._httpClient
      .get<DataResponseModel<ActivityModel[]>>(
        'https://us-central1-courses-auth.cloudfunctions.net/leads/activities'
      )
      .pipe(map((data) => data.data));
  }

  getLeads(): Observable<LeadModel[]> {
    return this._httpClient
      .get<DataResponseModel<LeadModel[]>>(
        'https://us-central1-courses-auth.cloudfunctions.net/leads'
      )
      .pipe(map((data) => data.data));
  }

  createLead(
    lead: CreateLeadModel
  ): Observable<DataResponseModel<CreateLeadModel>> {
    return this._httpClient.post<DataResponseModel<CreateLeadModel>>(
      'https://us-central1-courses-auth.cloudfunctions.net/leads',
      { data: lead }
    );
  }
}
