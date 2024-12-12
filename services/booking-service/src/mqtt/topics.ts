export const TOPICS = {
    APPOINTMENT: {
        PATIENT_BOOKING: "dentiq/appointmentService/patientService/bookSlot",
        DENTIST_DELETE_SLOT: "dentiq/appointmentService/notificationService/deleteSlot",
        PATIENT_CANCEL_SLOT: "dentiq/appointmentService/notificationService/cancelSlot",
        APP_CANCEL_CONF: "dentiq/appointmentService/notificationService/cancelSlot",

        PATIENT_BOOKING_REQ: "dentiq/patientClient/appointmentService/bookSlot",
        PATIENT_BOOKING_CANCEL_REQ: "dentiq/patientClient/appointmentService/cancelSlot",
        DENTIST_CREATE_APP_REQ: "dentiq/dentistClient/appointmentService/addSlots",
        DENTIST_REMOVE_SLOT_REQ: "dentiq/dentistClient/appointmentService/removeSlot",
        DENTIST_CREATE_APP: "dentiq/appointmentService/dentistService/addSlot",
        DENTIST_AWAIT_CONF: "dentiq/dentistService/appointmentService/addSlot/status",
        PATIENT_AWAIT_CONFIRMATION: "dentiq/patientService/appointmentService/bookSlot/status",
        APPOINTMENT_BOOKED: "dentiq/appointmentService/notificationService/bookedSlot",
        APPOINTMENT_CREATED: "dentiq/appointmentService/notificationService/addSlots",
        RESPOND_TO_GATEWAY: "dentiq/appointmentService/API_GATEWAY"
    },
    NOTIFICATION: {
        SLOT_UPDATE: "dentiq/notificationService/patientClient/slotUpdate",
        DENTIST_NOTIFY_BOOKING: "dentiq/notificationService/dentistClient",
        PATIENT_NOTIFY_BOOKING: "dentiq/notificationService/patientClient",
        DENTIST_CANCEL_BOOKING: "dentiq/notificationService/dentistClient/cancelSlot",
        PATIENT_CANCEL_BOOKING: "dentiq/notificationService/patientClient/cancelSlot"
    }
};