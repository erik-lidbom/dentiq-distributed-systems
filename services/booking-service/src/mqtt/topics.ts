export const TOPICS = {
    APPOINTMENT: {


        // GATEWAY NEEDS TO PUBLISH TO THE FOLLOWING:
        PATIENT_BOOKING_REQ: "dentiq/patientClient/appointmentService/bookSlot", // PATIENT WANTS TO BOOK
        PATIENT_BOOKING_CANCEL_REQ: "dentiq/patientClient/appointmentService/cancelSlot", // PATIENT WANTS TO CANCEL APPOINTMENT
        DENTIST_CREATE_APP_REQ: "dentiq/dentistClient/appointmentService/addSlots", // DENTIST WANTS TO CREATE APPOINTMENT
        DENTIST_REMOVE_SLOT_REQ: "dentiq/dentistClient/appointmentService/removeSlot", // DENTIST WANT TO CANCEL APPOINTMENT

        // NOTIFICATION NEEDS TO LISTEN TO THE FOLLOWING:
        APPOINTMENT_BOOKED: "dentiq/appointmentService/notificationService/bookedSlot",
        APPOINTMENT_CREATED: "dentiq/appointmentService/notificationService/addSlots",
        DENTIST_DELETE_SLOT: "dentiq/appointmentService/notificationService/deleteSlot",
        PATIENT_CANCEL_SLOT: "dentiq/appointmentService/notificationService/cancelSlot",

        // TBD
        RESPOND_TO_GATEWAY: "dentiq/appointmentService/API_GATEWAY",

        // GATEWAY NEEDS TO LISTEN TO THE FOLLOWING:
        DENTIST_CREATE_APP_GATEWAY: "dentiq/appointmentService/API_GATEWAY/createAppointment",
        DENTIST_DELETE_APP_GATEWAY: "dentiq/appointmentService/API_GATEWAY/deleteAppointment",
        PATIENT_BOOK_APP_GATEWAY: "dentiq/appointmentService/API_GATEWAY/bookAppointment",
        PATIENT_CANCEL_APP_GATEWAY: "dentiq/appointmentService/API_GATEWAY/cancelAppointment"
    },
    NOTIFICATION: {
        SLOT_UPDATE: "dentiq/notificationService/patientClient/slotUpdate",
        DENTIST_NOTIFY_BOOKING: "dentiq/notificationService/dentistClient",
        PATIENT_NOTIFY_BOOKING: "dentiq/notificationService/patientClient",
        DENTIST_CANCEL_BOOKING: "dentiq/notificationService/dentistClient/cancelSlot",
        PATIENT_CANCEL_BOOKING: "dentiq/notificationService/patientClient/cancelSlot"
    }
};