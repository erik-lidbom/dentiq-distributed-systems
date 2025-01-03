export const TOPICS = {
  SUBSCRIBE: {
    PATIENT_BOOKING: "dentiq/appointmentService/patientService/bookSlot",
    CREDENTIAL_VALIDATION_REQUEST: "dentiq/patient/validate-credentials",
  },
  PUBLISH: {
    PATIENT_AWAIT_CONFIRMATION: "dentiq/patientService/appointmentService/bookSlot/status",
    CREDENTIAL_VALIDATION_RESPONSE: (correlationId: string) =>
      `dentiq/authService/response/validate-credentials/${correlationId}`,
    PATIENT_REGISTERED: "dentiq/appointmentService/notificationService/addSlots",
  },
};
