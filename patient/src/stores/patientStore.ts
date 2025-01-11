import { defineStore } from 'pinia';
import { fetchPatient } from '@/api';

// Define a type for Dentist

export const usePatientStore = defineStore('patientStore', {
  state: () => ({
    patient: null as Patient | null,
  }),
  actions: {
    setPatient(patient: Patient) {
      this.patient = patient;
    },
    async fetchAndSetPatient() {
      try {
        const response = await fetchPatient();
        if (response.data.user) {
          this.setPatient(response.data.user);
        } else {
          console.warn('No patient data in response:', response);
        }
      } catch (error) {
        console.error('Error fetching patient data:', error);
      }
    },
  },
});
