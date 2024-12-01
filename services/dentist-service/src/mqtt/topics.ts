export const TOPICS = {
  SUBSCRIBE: {
    DENTIST_CREATE_APP: "dentiq/appointmentService/dentistService/addSlot",
    PATIENT_BOOKING: "dentiq/appointmentService/patientService/bookSlot",
  },
  PUBLISH: {
    DENTIST_AWAIT_CONF: "dentiq/dentistService/appointmentService/addSlot/status",
    PATIENT_AWAIT_CONFIRMATION: "dentiq/patientService/appointmentService/bookSlot/status",
    ERROR: "dentiq/dentistService/error", // Add this line for error messages
  },
};
