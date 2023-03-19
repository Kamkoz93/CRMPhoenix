import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { DataResponseModel } from '../models/data-response.model';
import { CreateLeadModel } from '../models/create-lead.model';
import { ActivityModel } from '../models/activity.model';
import { LeadModel } from '../models/lead.model';
import { FilterFormModel } from '../models/filter-form.model';
import { LeadConvertedQueryModel } from '../queries/lead-converted.query-model';

@Injectable({ providedIn: 'root' })
export class LeadsService {
  constructor(private _httpClient: HttpClient) {}

  public getActivities(): Observable<ActivityModel[]> {
    return this._httpClient
      .get<DataResponseModel<ActivityModel[]>>(
        'https://us-central1-courses-auth.cloudfunctions.net/leads/activities'
      )
      .pipe(map((data) => data.data));
  }

  public getLeads(): Observable<LeadModel[]> {
    return this._httpClient
      .get<DataResponseModel<LeadModel[]>>(
        'https://us-central1-courses-auth.cloudfunctions.net/leads'
      )
      .pipe(map((data) => data.data));
  }

  public createLead(
    lead: CreateLeadModel
  ): Observable<DataResponseModel<CreateLeadModel>> {
    return this._httpClient.post<DataResponseModel<CreateLeadModel>>(
      'https://us-central1-courses-auth.cloudfunctions.net/leads',
      { data: lead }
    );
  }

  public filterLeads(
    leads: LeadConvertedQueryModel[],
    filter: FilterFormModel
  ) {
    const filterByHiring = (lead: LeadConvertedQueryModel) => {
      if (!filter.isHiring) {
        return true;
      }
      return filter.isHiring === lead.hiring.isHiring;
    };

    const filterByScope = (lead: LeadConvertedQueryModel) => {
      if (
        !filter.projectTypes ||
        filter.projectTypes === null ||
        filter.projectTypes.length === 0
      ) {
        return true;
      }
      return filter.projectTypes.every((activity) =>
        lead.scope.includes(activity)
      );
    };

    const filterByCompanySize = (lead: LeadConvertedQueryModel) => {
      if (
        !filter.companySizes ||
        filter.companySizes === null ||
        filter.companySizes.length === 0
      ) {
        return true;
      }
      return filter.companySizes.some((sizeRange: string) => {
        const [minSize, maxSize] = sizeRange
          ?.split('-')
          ?.map((size) => parseInt(size, 10));
        const companySize = lead.companySize.total;
        return (
          companySize >= minSize && (maxSize ? companySize <= maxSize : true)
        );
      });
    };
    return leads.filter(
      (lead) =>
        filterByHiring(lead) && filterByScope(lead) && filterByCompanySize(lead)
    );
  }

  public mapLeads(leads: LeadModel[], activities: ActivityModel[]) {
    const activitiesMap = activities.reduce((a, c) => {
      return { ...a, [c.id]: c };
    }, {}) as Record<string, ActivityModel>;
    return leads.map((lead) => {
      return {
        name: lead.name,
        scope: lead.activityIds.map((act) => activitiesMap[act]?.name) ?? [],
        hiring: {
          isHiring: lead.hiring.active === '' ? false : true,
          juniors: lead.hiring.junior === '' ? false : true,
          talentProgram: lead.hiring.talentProgram === '' ? false : true,
        },
        industry: lead.industry,
        location: lead.location,
        linkedInUrl: lead.linkedinLink,
        websiteUrl: lead.websiteLink,
        companySize: {
          fe: lead.companySize.fe,
          dev: lead.companySize.dev,
          total: lead.companySize.total,
        },
        revenue: lead.annualRevenue,
      };
    });
  }
}
