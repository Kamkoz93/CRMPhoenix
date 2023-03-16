export interface AuthUserDataModel {
  data: {
    user: {
      id: string;
      context: {
        iss: string;
        aud: string;
        auth_time: number;
        user_id: string;
        sub: string;
        iat: number;
        exp: number;
        email: string;
        email_verified: false;
        firebase: {
          identities: { email: string[] };
          sign_in_provider: string;
        };
        uid: string;
      };
    };
  };
}
