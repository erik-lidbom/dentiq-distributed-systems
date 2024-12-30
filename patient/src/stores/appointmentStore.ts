import { defineStore } from 'pinia';

// Define a type for Appointment
interface Appointment {
  _id: string;
  dentistId: string;
  patientId: string;
  date: string;
  time: string;
}

export const useAppointmentStore = defineStore('appointmentStore', {
  state: () => ({
    appointments: [] as Appointment[], // Specify type here
  }),
  actions: {
    setAppointments(appointments: Appointment[]) {
      this.appointments = appointments;
    },
  },
});
