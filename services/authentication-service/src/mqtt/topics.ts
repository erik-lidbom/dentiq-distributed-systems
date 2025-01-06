export const TOPICS = {
  AUTHENTICATION: {
    CREATE: 'gateway/auth/create/response',
    LOGIN: 'gateway/auth/login/response',
    VALIDATE_SESSION: 'gateway/auth/validate-session/response',
    VALIDATE_TOKEN: 'auth/token/validate',
    REFRESH_TOKEN: 'auth/token/refresh',
    CREATE_RESPONSE: 'auth/create/response',
    LOGIN_RESPONSE: 'auth/login/response',
  },
  SUBSCRIBE: {
    LOGIN: 'dentiq/authService/login',
    AUTH_REQUEST: 'dentiq/authService/request/validate-token',
    CREDENTIAL_VALIDATION_RESPONSE: (correlationId: string): string =>
      `dentiq/authService/response/validate-credentials/${correlationId}`,
  },
  PUBLISH: {
    AUTH_SUCCESS: 'dentiq/authService/login/success',
    AUTH_FAILURE: 'dentiq/authService/login/failure',
    AUTH_RESPONSE: 'dentiq/authService/response/validate-token',
    CREDENTIAL_VALIDATION_REQUEST: (role: string): string =>
      `dentiq/${role}/validate-credentials`,
    AUTH_VALIDATE_SESSION: 'auth/validate-session/response',
  },
};
