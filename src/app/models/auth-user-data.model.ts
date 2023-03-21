export interface AuthUserDataModel {
  readonly data: {
    readonly user: {
      readonly id: string;
      readonly context: {
        readonly iss: string;
        readonly aud: string;
        readonly auth_time: number;
        readonly user_id: string;
        readonly sub: string;
        readonly iat: number;
        readonly exp: number;
        readonly email: string;
        readonly email_verified: boolean;
        readonly firebase: {
          readonly identities: { email: string[] };
          readonly sign_in_provider: string;
        };
        readonly uid: string;
      };
    };
  };
}
