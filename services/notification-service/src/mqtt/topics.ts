export const TOPICS = {
  SUBSCRIBE: {
    APPOINTMENT_GET_NOTIFICATIONS: 'gateway/notification/get/response',
    APPOINTMENT_CREATED:
      'dentiq/appointmentService/notificationService/addSlots',
    APPOINTMENT_BOOKED:
      'dentiq/appointmentService/notificationService/bookedSlot',
    APPOINTMENT_PATIENT_CANCEL_CONFIRMATION:
      'dentiq/appointmentService/notificationService/cancelSlot',
    APPOINTMENT_DENTIST_CANCEL_CONFIRMATION:
      'dentiq/appointmentService/notificationService/deleteSlot',
  },
  PUBLISH: {
    APPOINTMENT_GET_NOTIFICATIONS: 'notification/get/response',
    APPOINTMENT_CREATED_DENTIST: 'appointment/added',
    APPOINTMENT_BOOKED_PATIENT: 'appointment/booked',
    APPOINTMENT_CANCEL_DENTIST: 'appointment/cancelled/dentist',
    APPOINTMENT_CANCEL_PATIENT: 'appointment/cancelled/patient',
  },
};
