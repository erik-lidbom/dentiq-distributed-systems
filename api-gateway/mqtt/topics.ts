export const TOPICS = {
  SUBSCRIBE: {
    PATIENT_CREATE: 'patient/create/response',
    PATIENT_GET: 'patient/get/response',
    PATIENT_UPDATE: 'patient/update/response',
    PATIENT_DELETE: 'patient/delete/response',
    PATIENT_QUERY: 'patient/query/response',

    DENTIST_CREATE: 'dentist/create/response',
    DENTIST_GET: 'dentist/get/response',
    DENTIST_UPDATE: 'dentist/update/response',
    DENTIST_DELETE: 'dentist/delete/response',
    DENTIST_QUERY: 'dentist/query/response',

    CLINIC_CREATE: 'clinic/create/response',
    CLINIC_GET: 'clinic/get/response',
    CLINIC_UPDATE: 'clinic/update/response',
    CLINIC_DELETE: 'clinic/delete/response',
    CLINIC_QUERY: 'clinic/query/response',

    NOTIFICATION_CREATE: 'notification/create/response',
    NOTIFICATION_GET: 'notification/get/response',
    NOTIFICATION_UPDATE: 'notification/update/response',
    NOTIFICATION_DELETE: 'notification/delete/response',
    NOTIFICATION_QUERY: 'notification/query/response',

    BOOKING_CREATE: 'booking/create/response',
    BOOKING_GET: 'booking/get/response',
    BOOKING_UPDATE: 'booking/update/response',
    BOOKING_DELETE: 'booking/delete/response',
    BOOKING_CANCEL: 'booking/cancel/response',
    BOOKING_QUERY: 'booking/query/response',
    BOOKING_BOOK: 'booking/book/response',

    LOGGING_CREATE: 'logging/create/response',
    LOGGING_GET: 'logging/get/response',
    LOGGING_UPDATE: 'logging/update/response',
    LOGGING_DELETE: 'logging/delete/response',
    LOGGING_QUERY: 'logging/query/response',

    AUTH_CREATE: 'auth/create/response',
    AUTH_GET: 'auth/get/response',
    AUTH_UPDATE: 'auth/update/response',
    AUTH_DELETE: 'auth/delete/response',
    AUTH_QUERY: 'auth/query/response',
    AUTH_LOGIN: 'auth/login/response',
    AUTH_SESSION: 'auth/validate-session/response',
    AUTH_TOKEN: 'auth/validate-token/response',
  } as Record<
    `${string}_${
      | 'CREATE'
      | 'GET'
      | 'UPDATE'
      | 'DELETE'
      | 'QUERY'
      | 'BOOK'
      | 'CANCEL'
      | 'LOGIN'
      | 'SESSION'
      | 'TOKEN'}`,
    string
  >,
  PUBLISH: {
    PATIENT_CREATE_RESPONSE: 'gateway/patient/create/response',
    PATIENT_GET_RESPONSE: 'gateway/patient/get/response',
    PATIENT_UPDATE_RESPONSE: 'gateway/patient/update/response',
    PATIENT_DELETE_RESPONSE: 'gateway/patient/delete/response',
    PATIENT_QUERY_RESPONSE: 'gateway/patient/query/response',

    DENTIST_CREATE_RESPONSE: 'gateway/dentist/create/response',
    DENTIST_GET_RESPONSE: 'gateway/dentist/get/response',
    DENTIST_UPDATE_RESPONSE: 'gateway/dentist/update/response',
    DENTIST_DELETE_RESPONSE: 'gateway/dentist/delete/response',
    DENTIST_QUERY_RESPONSE: 'gateway/dentist/query/response',

    CLINIC_CREATE_RESPONSE: 'gateway/clinic/create/response',
    CLINIC_GET_RESPONSE: 'gateway/clinic/get/response',
    CLINIC_UPDATE_RESPONSE: 'gateway/clinic/update/response',
    CLINIC_DELETE_RESPONSE: 'gateway/clinic/delete/response',
    CLINIC_QUERY_RESPONSE: 'gateway/clinic/query/response',

    NOTIFICATION_CREATE_RESPONSE: 'gateway/notification/create/response',
    NOTIFICATION_GET_RESPONSE: 'gateway/notification/get/response',
    NOTIFICATION_UPDATE_RESPONSE: 'gateway/notification/update/response',
    NOTIFICATION_DELETE_RESPONSE: 'gateway/notification/delete/response',
    NOTIFICATION_QUERY_RESPONSE: 'gateway/notification/query/response',

    BOOKING_CREATE_RESPONSE: 'gateway/booking/create/response',
    BOOKING_GET_RESPONSE: 'gateway/booking/get/response',
    BOOKING_UPDATE_RESPONSE: 'gateway/booking/update/response',
    BOOKING_DELETE_RESPONSE: 'gateway/booking/delete/response',
    BOOKING_CANCEL_RESPONSE: 'gateway/booking/cancel/response',
    BOOKING_QUERY_RESPONSE: 'gateway/booking/query/response',
    BOOKING_BOOK_RESPONSE: 'gateway/booking/book/response',

    LOGGING_CREATE_RESPONSE: 'gateway/logging/create/response',
    LOGGING_GET_RESPONSE: 'gateway/logging/get/response',
    LOGGING_UPDATE_RESPONSE: 'gateway/logging/update/response',
    LOGGING_DELETE_RESPONSE: 'gateway/logging/delete/response',
    LOGGING_QUERY_RESPONSE: 'gateway/logging/query/response',

    AUTH_CREATE_RESPONSE: 'gateway/auth/create/response',
    AUTH_LOGIN_RESPONSE: 'gateway/auth/login/response',
    AUTH_GET_RESPONSE: 'gateway/auth/get/response',
    AUTH_UPDATE_RESPONSE: 'gateway/auth/update/response',
    AUTH_DELETE_RESPONSE: 'gateway/auth/delete/response',
    AUTH_QUERY_RESPONSE: 'gateway/auth/query/response',
    AUTH_SESSION_RESPONSE: 'gateway/auth/validate-session/response',
    AUTH_TOKEN_RESPONSE: 'gateway/auth/validate-token/response',
  } as Record<
    `${string}_${
      | 'CREATE'
      | 'GET'
      | 'UPDATE'
      | 'DELETE'
      | 'QUERY'
      | 'BOOK'
      | 'CANCEL'
      | 'LOGIN'
      | 'SESSION'
      | 'TOKEN'}_RESPONSE`,
    string
  >,
};
