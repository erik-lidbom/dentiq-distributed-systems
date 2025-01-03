export const TOPICS = {
  SUBSCRIBE: {
    DENTIST_CREATE_APP: 'dentiq/appointmentService/dentistService/addSlot',
    CREDENTIAL_VALIDATION_REQUEST: 'dentiq/dentist/validate-credentials',
  },
  PUBLISH: {
    DENTIST_AWAIT_CONF: 'dentiq/dentistService/appointmentService/addSlot/status',
    CREDENTIAL_VALIDATION_RESPONSE: (correlationId: string) =>
      `dentiq/authService/response/validate-credentials/${correlationId}`,
    CREATE_RESPONSE: 'dentiq/dentistService/create/response',
    GET_RESPONSE: 'dentiq/dentistService/get/response',
    UPDATE_RESPONSE: 'dentiq/dentistService/update/response',
    DELETE_RESPONSE: 'dentiq/dentistService/delete/response',
    QUERY_RESPONSE: 'dentiq/dentistService/query/response',
    CLINICS: {
      QUERY_RESPONSE: 'dentiq/clinicService/query/response',
    },
  },
};
