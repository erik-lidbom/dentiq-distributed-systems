import { defineStore } from 'pinia';

// Define a type for Clinic
interface Clinic {
  _id: string;
  name: string;
  address: string;
  phone: string;
  services: string[];
  dentists?: any[]; // If dentists are included in the clinic, otherwise define Dentist type explicitly
}

export const useClinicStore = defineStore('clinicStore', {
  state: () => ({
    clinics: [] as Clinic[], // Specify type here
  }),
  actions: {
    setClinics(clinics: Clinic[]) {
      this.clinics = clinics;
    },
  },
});
