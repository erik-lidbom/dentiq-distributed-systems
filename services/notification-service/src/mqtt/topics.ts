export const TOPICS = {
  SUBSCRIBE: {
    APPOINTMENT_CREATED:
      "dentiq/appointmentService/notificationService/addSlots",
    APPOINTMENT_BOOKED:
      "dentiq/appointmentService/notificationService/bookedSlot",
    APPOINTMENT_CANCEL_CONFIRMATION:
      "dentiq/appointmentService/notificationService/cancelSlot",
  },
  PUBLISH: {
    APPOINTMENT_CREATED_DENTIST:
      "dentiq/notificationService/dentistService/addSlots",
    APPOINTMENT_CREATED_PATIENT:
      "dentiq/notificationService/patientService/addSlots",
    APPOINTMENT_BOOKED_DENTIST:
      "dentiq/notificationService/dentistClient/booked",
    APPOINTMENT_BOOKED_PATIENT:
      "dentiq/notificationService/patientClient/booked",
    APPOINTMENT_CANCEL_DENTIST:
      "dentiq/notificationService/dentistClient/cancelSlot",
    APPOINTMENT_CANCEL_PATIENT:
      "dentiq/notificationService/patientClient/cancelSlot",
  },
};
