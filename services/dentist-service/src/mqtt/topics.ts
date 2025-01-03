export const TOPICS = {
  SUBSCRIBE: {
    DENTIST_CREATE_APP: 'dentiq/appointmentService/dentistService/addSlot',
    CREDENTIAL_VALIDATION_REQUEST: 'dentiq/dentist/validate-credentials',
  },
  PUBLISH: {
    DENTIST_AWAIT_CONF:
      'dentiq/dentistService/appointmentService/addSlot/status',
    CREDENTIAL_VALIDATION_RESPONSE: (correlationId: string) =>
      `dentiq/authService/response/validate-credentials/${correlationId}`,
  },
};
