import { defineStore } from 'pinia';
import { fetchClinics } from '@/api';

// Define a type for Clinic
interface Clinic {
  _id: string;
  name: string;
  address: string;
  phone: string;
  services: string[];
  dentists?: any[];
}

export const useClinicStore = defineStore('clinicStore', {
  state: () => ({
    clinics: [] as Clinic[],
  }),
  actions: {
    setClinics(clinics: Clinic[]) {
      this.clinics = clinics;
    },
    async fetchAndSetClinics() {
      try {
        const response = await fetchClinics();
        this.setClinics(response.data);
        console.log('Clinics fetched successfully:', response.data);
      } catch (error) {
        console.error('Error fetching clinics:', error);
      }
    },
  },
});
