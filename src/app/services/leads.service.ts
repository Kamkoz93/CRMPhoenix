import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { DataResponseModel } from '../models/data-response.model';
import { CreateLeadModel } from '../models/create-lead.model';
import { ActivityModel } from '../models/activity.model';
import { LeadModel } from '../models/lead.model';
import { FilterFormModel } from '../models/filter-form.model';
import { LeadConvertedQueryModel } from '../queries/lead-converted.query-model';
import { API_ROUTES_DEF } from '../configuration/routes-definition';

@Injectable({ providedIn: 'root' })
export class LeadsService {
  constructor(private _httpClient: HttpClient) {}

  public getActivities(): Observable<ActivityModel[]> {
    return this._httpClient
      .get<DataResponseModel<ActivityModel[]>>(
        API_ROUTES_DEF.ACTIVITIES ??
          'https://us-central1-courses-auth.cloudfunctions.net/leads/activities'
      )
      .pipe(map((data) => data.data));
  }

  public getLeads(): Observable<LeadModel[]> {
    return this._httpClient
      .get<DataResponseModel<LeadModel[]>>(
        API_ROUTES_DEF.LEADS ??
          'https://us-central1-courses-auth.cloudfunctions.net/leads'
      )
      .pipe(map((data) => data.data));
  }

  public createLead(
    lead: CreateLeadModel
  ): Observable<DataResponseModel<CreateLeadModel>> {
    return this._httpClient.post<DataResponseModel<CreateLeadModel>>(
      API_ROUTES_DEF.LEADS ??
        'https://us-central1-courses-auth.cloudfunctions.net/leads',
      { data: lead }
    );
  }

  public filterLeads(
    leads: LeadConvertedQueryModel[],
    filter: FilterFormModel
  ) {
    const filteredScopeArr = filter.projectTypeBoxes;
    const companySizeArr = filter.companySizeBoxes;
    const isHiring = filter.isHiring.checked;

    const filterByHiring = (lead: LeadConvertedQueryModel) => {
      if (!isHiring) {
        return true;
      }
      return isHiring === lead.hiring.isHiring;
    };

    const filterByScope = (lead: LeadConvertedQueryModel) => {
      if (
        !filteredScopeArr ||
        filteredScopeArr === null ||
        filteredScopeArr.length === 0
      ) {
        return true;
      }
      return filteredScopeArr
        .filter((scope) => scope.checked)
        .every((checkedScope) => lead.scope.includes(checkedScope.name));
    };

    const filterByCompanySize = (lead: LeadConvertedQueryModel) => {
      if (
        !companySizeArr ||
        companySizeArr === null ||
        companySizeArr.length === 0
      ) {
        return true;
      }
      const checkedRanges = companySizeArr.filter((range) => range.checked);
      if (checkedRanges.length === 0) {
        return true;
      }
      const companySize = lead.companySize.total;
      return checkedRanges.some((range) => {
        const [minSize, maxSize] = range.name
          ?.split('-')
          ?.map((size) => parseInt(size, 10));
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
          isHiring: lead.hiring.active,
          juniors: lead.hiring.junior,
          talentProgram: lead.hiring.talentProgram,
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
