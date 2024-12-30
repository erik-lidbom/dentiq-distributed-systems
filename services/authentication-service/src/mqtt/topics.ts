export const TOPICS = {
  SUBSCRIBE: {
    LOGIN: "dentiq/authService/login",
    AUTH_REQUEST: "dentiq/authService/request/validate-token",
    CREDENTIAL_VALIDATION_RESPONSE: (correlationId: string): string =>
      `dentiq/authService/response/validate-credentials/${correlationId}`,
  },
  PUBLISH: {
    AUTH_SUCCESS: "dentiq/authService/login/success",
    AUTH_FAILURE: "dentiq/authService/login/failure",
    AUTH_RESPONSE: "dentiq/authService/response/validate-token",
    CREDENTIAL_VALIDATION_REQUEST: (role: string): string =>
      `dentiq/${role}/validate-credentials`,
  },
};
