import { defineStore } from 'pinia';

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
  },
});
