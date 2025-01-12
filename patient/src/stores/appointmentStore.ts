import { defineStore } from 'pinia';
import { fetchAppointments } from '@/api';
import { aggregatePatientAppointments } from '@/utils/dataAggregator';
import { useDentistStore, useClinicStore } from '@/stores';

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
    appointments: [] as Appointment[],
    patientBookings: [] as Appointment[], // Store filtered bookings
  }),
  actions: {
    setAppointments(appointments: Appointment[]) {
      this.appointments = appointments;
    },
    setPatientBookings(bookings: Appointment[]) {
      this.patientBookings = bookings;
    },
    async fetchAndAggregatePatientBookings() {
      try {
        const patientId = localStorage.getItem('userId');
        // Fetch appointments
        const response = await fetchAppointments();
        const allAppointments = response.data.data;
        this.setAppointments(allAppointments);

        // Fetch dentists and clinics
        const dentistStore = useDentistStore();
        await dentistStore.fetchAndSetDentists();
        const dentists = [...dentistStore.dentists];

        const clinicStore = useClinicStore();
        await clinicStore.fetchAndSetClinics();
        const clinics = [...clinicStore.clinics.clinics];

        // Aggregate patient bookings
        const bookings = aggregatePatientAppointments(
          allAppointments,
          dentists,
          clinics,
          patientId
        );
        this.setPatientBookings(bookings);
      } catch (error) {
        console.error(
          'Error fetching and aggregating patient bookings:',
          error
        );
      }
    },
  },
});
