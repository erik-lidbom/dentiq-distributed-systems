export const TOPICS = {
  SUBSCRIBE: {
    AUTH_LOGIN: 'gateway/auth/login/response',
    AUTH_REQUEST: 'dentiq/authService/request/validate-token',
    CREDENTIAL_VALIDATION_RESPONSE: (correlationId: string): string =>
      `dentiq/authService/response/validate-credentials/${correlationId}`,
    AUTH_VALIDATE_TOKEN: 'gateway/auth/validate-token/response',
    AUTH_CREATE_ACCOUNT: 'gateway/auth/create/response',
    AUTH_VALIDATE_SESSION: 'gateway/auth/validate-session/response',
  },
  PUBLISH: {
    AUTH_CREATE_ACCOUNT: 'auth/create/response',
    AUTH_LOGIN: 'auth/login/response',
    AUTH_VALIDATE_SESSION: 'auth/validate-session/response',
    AUTH_VALIDATE_TOKEN: 'auth/validate-token/response',
  },
};
