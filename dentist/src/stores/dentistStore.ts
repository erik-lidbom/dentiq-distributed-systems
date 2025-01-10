import { defineStore } from 'pinia';
import { fetchDentists } from '@/api';

// Define a type for Dentist
interface Dentist {
  _id: string;
  name: string;
  speciality: string;
  clinic: string; // Clinic ID
  availability: { date: string; times: string[] }[];
}

export const useDentistStore = defineStore('dentistStore', {
  state: () => ({
    dentists: [] as Dentist[], // Specify type here
  }),
  actions: {
    setDentists(dentists: Dentist[]) {
      this.dentists = dentists;
    },
    async fetchAndSetDentists() {
      try {
        const response = await fetchDentists();
        if (response?.data) {
          this.setDentists(response.data.data);
          console.log('Dentists fetched: ', this.dentists);
        } else {
          console.warn('No data found in the response:', response);
        }
      } catch (error) {
        console.error('Error fetching dentists:', error);
      }
    },
  },
});
