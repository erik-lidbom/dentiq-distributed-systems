export const TOPICS = {
    SUBSCRIBE: {
      PATIENT_BOOKING: "dentiq/appointmentService/patientService/bookSlot",
    },
    PUBLISH: {
      PATIENT_AWAIT_CONFIRMATION: "dentiq/patientService/appointmentService/bookSlot/status",
      PATIENT_REGISTERED: "dentiq/appointmentService/notificationService/addSlots", // Using existing topic from Notification Service
    },
  };
  