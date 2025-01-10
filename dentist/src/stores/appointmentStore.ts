import { defineStore } from 'pinia';
import {
  fetchAllAppointments,
  postAppointments,
  deleteAppointments,
} from '@/api/bookingService';
import { fetchClinics } from '@/api';

export const useAppointmentStore = defineStore('appointment', {
  state: () => ({
    appointments: [] as any[],
    slots: Array.from({ length: 9 }, (_, i) => ({
      time: `${8 + i}:00`,
      isSelected: false,
      isBooked: false,
      isCreated: false,
      isToBeCreated: false,
      isToBeDeleted: false,
      id: '',
    })),
    dentistBookings: [] as any[],
  }),
  actions: {
    /**
     * Load appointments for a given dentist and date
     */
    setAppointments(appointments: any[]) {
      this.appointments = appointments;
    },
    async fetchAndSetAppointments() {
      try {
        const response = await fetchAllAppointments();
        this.setAppointments(response);
        console.log('Appointments fetched successfully:', response);
      } catch (error) {
        console.error('Error fetching clinics:', error);
      }
    },
  },
});
