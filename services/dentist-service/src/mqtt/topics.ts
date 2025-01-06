export const TOPICS = {
  SUBSCRIBE: {
    DENTIST_CREATE_APP: 'dentiq/appointmentService/dentistService/addSlot',
    CREATE: 'gateway/dentist/create/response',
    GET: 'gateway/dentist/get/response',
    UPDATE: 'gateway/dentist/update/response',
    DELETE: 'gateway/dentist/delete/response',
    QUERY: 'gateway/dentist/query/response',
    CLINICS: {
      QUERY_RESPONSE: 'gateway/clinic/query/response',
    },
    CREDENTIAL_VALIDATION_REQUEST: 'dentiq/dentist/validate-credentials',
  },
  PUBLISH: {
    DENTIST_AWAIT_CONF:
      'dentiq/dentistService/appointmentService/addSlot/status',
    CREATE_RESPONSE: 'dentist/create/response',
    GET_RESPONSE: 'dentist/get/response',
    UPDATE_RESPONSE: 'dentist/update/response',
    DELETE_RESPONSE: 'dentist/delete/response',
    QUERY_RESPONSE: 'dentist/query/response',
    CLINICS: {
      QUERY_RESPONSE: 'clinic/query/response',
    },
    CREDENTIAL_VALIDATION_RESPONSE: (correlationId: string) =>
      `dentiq/authService/response/validate-credentials/${correlationId}`,
  },
};
