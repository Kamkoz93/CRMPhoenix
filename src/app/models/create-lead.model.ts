export interface CreateLeadModel {
  readonly name: string;
  readonly websiteLink: string;
  readonly location: string;
  readonly industry: string;
  readonly annualRevenue: number;
  readonly activityIds: string[];
  readonly companySize: {
    readonly total: number;
    readonly dev: number;
    readonly fe: number;
  };
  readonly hiring: {
    readonly active: boolean;
    readonly junior: boolean;
    readonly talentProgram: boolean;
  };
}
