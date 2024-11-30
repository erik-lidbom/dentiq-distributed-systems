export const TOPICS = {
    APPOINTMENT: {
        PATIENT_BOOKING: "dentiq/appointmentService/patientService/bookSlot",
        APP_CANCELED: "dentiq/appointmentService/dentistService/cancelSlot",
        APP_CANCEL_CONF: "dentiq/appointmentService/notificationService/cancelSlot",
        PATIENT_AWAIT_CONFIRMATION: "dentiq/appointmentService/patientService/bookSlot/status",
        DENTIST_CREATE_APP: "dentiq/appointmentService/dentistService/addSlot",
        DENTIST_AWAIT_CONF: "dentiq/dentistService/appointmentService/addSlots/status",
        APPOINTMENT_BOOKED: "dentiq/appointmentService/notificationService/bookedSlot",
        APPOINTMENT_CREATED: "dentiq/appointmentService/notificationService/addSlots"
    },
    NOTIFICATION: {
        SLOT_UPDATE: "dentiq/notificationService/patientClient/slotUpdate",
        DENTIST_NOTIFY_BOOKING: "dentiq/notificationService/dentistClient",
        PATIENT_NOTIFY_BOOKING: "dentiq/notificationService/patientClient",
        DENTIST_CANCEL_BOOKING: "dentiq/notificationService/dentistClient/cancelSlot",
        PATIENT_CANCEL_BOOKING: "dentiq/notificationService/patientClient/cancelSlot"
    }
};