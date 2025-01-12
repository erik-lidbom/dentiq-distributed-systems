export const TOPICS = {
  SUBSCRIBE: {
    CREATE: 'gateway/booking/create/response',
    GET: 'gateway/booking/get/response',
    UPDATE: 'gateway/booking/update/response',
    DELETE: 'gateway/booking/delete/response',
    DELETE_MANY: 'gateway/booking/delete-many/response',
    CANCEL: 'gateway/booking/cancel/response',
    BOOK: 'gateway/booking/book/response',
    QUERY: 'gateway/booking/query/response',
  },
  PUBLISH: {
    CREATE_RESPONSE: 'booking/create/response',
    GET_RESPONSE: 'booking/get/response',
    UPDATE_RESPONSE: 'booking/update/response',
    DELETE_RESPONSE: 'booking/delete/response',
    DELETE_MANY_RESPONSE: 'booking/delete-many/response',
    CANCEL_RESPONSE: 'booking/cancel/response',
    BOOK_RESPONSE: 'booking/book/response',
    QUERY_RESPONSE: 'booking/query/response',
    CREATE_NOTIFICATION_RESPONSE:
      'dentiq/appointmentService/notificationService/addSlots',
    BOOK_NOTIFICATION_RESPONSE:
      'dentiq/appointmentService/notificationService/bookedSlot',
    CANCEL_NOTIFICATION_PATIENT_RESPONSE:
      'dentiq/appointmentService/notificationService/cancelSlot',
    CANCEL_NOTIFICATION_DENTIST_RESPONSE:
      'dentiq/appointmentService/notificationService/deleteSlot',
  },
};
