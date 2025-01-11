export const TOPICS = {
  SUBSCRIBE: {
    NOTIFICATION_FAILED: 'appointment/failed',
    NOTIFICATION_ADDED_SLOT: 'appointment/added',
    NOTIFICATION_BOOKED_SLOT: 'appointment/booked',
    NOTIFICATION_CANCELLED_SLOT: 'appointment/cancelled',
    NOTIFICATION_APPOINTMENT_CREATED:
      'dentiq/notificationService/patientService/addSlots',
    NOTIFICATION_APPOINTMENT_BOOKED:
      'dentiq/notificationService/patientClient/booked',
    NOTIFICATION_APPOINTMENT_CANCEL:
      'dentiq/notificationService/patientClient/cancelSlot',
    NOTIFICATION_REMOVED: 'appointment/removed',
  },
  PUBLISH: {
    NOTIFICATION_REMOVED: 'appointment/removed/response',
  },
};
