export enum ROUTES_DEF {
  BASE_URL = '',
  AUTH = 'auth',
  LOGIN = 'login',
  REGISTER = 'register',
  LOGGED_IN = 'logged-in',
  LOGGED_OUT = 'logged-out',
  LEADS = 'leads',
  VERIFY = 'verify',
  COMPLETE_PROFILE = 'complete-profile',
  CREATE_LEAD = 'create-lead',
}

export enum API_ROUTES_DEF {
  LOGIN = 'https://us-central1-courses-auth.cloudfunctions.net/auth/login',
  REGISTER = 'https://us-central1-courses-auth.cloudfunctions.net/auth/register2',
  REFRESH_TOKEN = 'https://us-central1-courses-auth.cloudfunctions.net/auth/refresh',
  CHECK_BIO = 'https://us-central1-courses-auth.cloudfunctions.net/auth/my-bio',
  ADD_BIO = 'https://us-central1-courses-auth.cloudfunctions.net/auth/add-bio',
  AUTH_ME = 'https://us-central1-courses-auth.cloudfunctions.net/auth/me',
  LEADS = 'https://us-central1-courses-auth.cloudfunctions.net/leads',
  ACTIVITIES = 'https://us-central1-courses-auth.cloudfunctions.net/leads/activities',
}
