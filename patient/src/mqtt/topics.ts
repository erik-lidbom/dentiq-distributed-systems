export const TOPICS = {
  SUBSCRIBE: {
    NOTIFICATION_CREATED:
      'dentiq/notificationService/patientInterface/addNotification',
    NOTIFICATION_ADDED_SLOT:
      'dentiq/notificationService/patientService/addSlots',
    NOTIFICATION_BOOKED_SLOT: 'dentiq/notificationService/patientClient/booked',
    NOTIFICATION_CANCELLED_SLOT:
      'dentiq/notificationService/patientClient/cancelSlot',
  },
  PUBLISH: {
    NOTIFICATION_REMOVED:
      'dentiq/patientInterface/notificationService/removeNotification',
  },
};
