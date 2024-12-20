export const TOPICS = {
  SUBSCRIBE: {
    LOGIN: "dentiq/authService/login",
    AUTH_REQUEST: "dentiq/authService/request/validate-token", // New topic for token validation
  },
  PUBLISH: {
    AUTH_SUCCESS: "dentiq/authService/login/success",
    AUTH_FAILURE: "dentiq/authService/login/failure",
    AUTH_RESPONSE: "dentiq/authService/response/validate-token", // Validation response
  },
};
