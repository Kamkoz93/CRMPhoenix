export interface LeadConvertedQueryModel {
  readonly name: string;
  readonly linkedInUrl: string;
  readonly websiteUrl: string;
  readonly scope: string[];
  readonly hiring: {
    readonly isHiring: boolean | string;
    readonly juniors: boolean | string;
    readonly talentProgram: boolean | string;
  };
  readonly industry: string;
  readonly location: string;
  readonly companySize: {
    readonly fe: number;
    readonly dev: number;
    readonly total: number;
  };
  readonly revenue: string;
  readonly sales_stage?: string;
}
