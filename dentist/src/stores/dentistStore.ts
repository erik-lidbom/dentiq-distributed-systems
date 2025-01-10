import { defineStore } from 'pinia';
import { fetchDentists } from '@/api';

// Define a type for Dentist
interface Dentist {
  _id: string;
  name: string;
  speciality: string;
  clinic: string;
  availability: { date: string; times: string[] }[];
  id: string;
}

export const useDentistStore = defineStore('dentistStore', {
  state: () => ({
    dentists: [] as Dentist[],
    dentist: null as Dentist | null,
  }),
  actions: {
    setDentists(dentists: Dentist[]) {
      this.dentists = dentists;
    },
    setActiveDentist(dentistId: string | null) {
      this.dentist =
        this.dentists.find((dentist) => dentist.id === dentistId) || null;
    },
    async fetchAndSetDentists() {
      try {
        const response = await fetchDentists();
        if (response?.data?.data) {
          this.setDentists(response.data.data);
          console.log('Dentists fetched:', this.dentists);
          this.setActiveDentist(localStorage.getItem('userId'));
        } else {
          console.warn('No dentists data in response:', response);
        }
      } catch (error) {
        console.error('Error fetching dentists:', error);
      }
    },
  },
});
