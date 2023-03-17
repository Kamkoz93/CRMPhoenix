export interface CreateLeadModel {
  readonly name: string;
  readonly websiteLink: string;
  readonly linkedinLink: string;
  readonly location: string;
  readonly industry: string;
  readonly annualRevenue: number;
  readonly activityIds: string[];
  readonly companySize: CompanySizeModel;
  readonly hiring: HiringModel;
}
export interface CompanySizeModel {
  readonly total: number;
  readonly dev: number;
  readonly fe: number;
}
export interface HiringModel {
  readonly active: boolean;
  readonly junior: boolean;
  readonly talentProgram: boolean;
}
