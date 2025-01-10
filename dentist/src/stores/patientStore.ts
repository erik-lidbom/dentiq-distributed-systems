import { defineStore } from 'pinia';
import { fetchPatient } from '@/api';

interface Patient {
  fullname: string;
  email: string;
  _id: string;
}

export const usePatientStore = defineStore('patientStore', {
  state: () => ({
    patients: {} as Record<string, Patient>, // Store patients by ID
  }),
  actions: {
    setPatient(patient: Patient) {
      this.patients[patient._id] = patient;
    },
    async fetchAndSetPatient(patientId: string) {
      if (this.patients[patientId]) {
        // Patient data is already cached
        return this.patients[patientId];
      }
      try {
        const response = await fetchPatient(patientId);
        if (response?.user) {
          this.setPatient(response.user);
          return response.user;
        } else {
          console.warn('No patient data in response:', response);
        }
      } catch (error) {
        console.error(
          `Error fetching patient data for ID ${patientId}:`,
          error
        );
      }
    },
  },
});
