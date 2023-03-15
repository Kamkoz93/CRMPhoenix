export interface LeadModel {
  readonly name: string;
  readonly hiring: {
    readonly junior: boolean | string;
    readonly active: boolean | string;
    readonly talentProgram: boolean | string;
  };
  readonly annualRevenue: string;
  readonly industry: string;
  readonly location: string;
  readonly companySize: {
    readonly fe: number;
    readonly dev: number;
    readonly total: number;
  };
  readonly websiteLink: string;
  readonly activityIds: string[];
  readonly linkedinLink: string;
}
