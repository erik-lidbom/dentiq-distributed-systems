<template>
  <div
    class="flex flex-col md:flex-row min-h-full rounded-2xl p-0 bg-white overflow-hidden relative border-dentiq-muted-semilight border-2"
  >
    <SlotsSection
      :slots="slots"
      @confirm-changes="handleConfirmChanges"
      @toggle-slot="toggleSlot"
    />
    <AppointmentSection
      :appointments="dentistAppointments"
      @cancel="handleCancel"
    />
    <div
      v-if="isLoading"
      class="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50"
    >
      <svg
        class="animate-spin h-20 w-20 text-dentiq-background-primary"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8H4z"
        ></path>
      </svg>
      <h3 class="text-dentiq-muted-dark text-dentiq-h3">Processing ...</h3>
    </div>
    <div
      v-if="errorMessage"
      class="absolute bottom-4 left-4 bg-red-500 text-white p-4 rounded"
    >
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import SlotsSection from '@/components/SlotsSection.vue';
import AppointmentSection from '@/components/AppointmentSection.vue';
import { computed, onMounted, ref, watchEffect } from 'vue';
import { useAppointmentStore, useClinicStore, useDentistStore } from '@/stores';
import { cancelAppointment } from '@/api/bookingService';

const appointmentStore = useAppointmentStore();
const clinicStore = useClinicStore();
const dentistStore = useDentistStore();

const isLoading = ref(false);
const errorMessage = ref<string | null>(null);

// Computed properties to extract state from Pinia stores
const appointments = computed(() => appointmentStore.appointments);
const dentistAppointments = computed(() =>
  appointmentStore.appointments.filter(
    (appointment) =>
      appointment.dentistId === localStorage.getItem('userId') &&
      appointment.status === 'booked'
  )
);
const slots = computed(() => appointmentStore.slots);

watchEffect(() => {
  if (dentistStore.dentist && appointments.value.length > 0) {
    dentistAppointments.value = appointments.value.filter(
      (appointment) =>
        appointment.dentistId === dentistStore.dentist?.id &&
        appointment.status === 'booked'
    );
  }
});

// Cancel Handler
const handleCancel = async (appointmentId: string) => {
  isLoading.value = true;

  try {
    console.log(`Cancelling appointment: ${appointmentId}`);
    const response = await cancelAppointment(appointmentId);

    // Update the source data in the store
    appointmentStore.setAppointments(
      appointmentStore.appointments.filter(
        (appointment) => appointment._id !== appointmentId
      )
    );
  } catch (error) {
    console.error('Error canceling appointment:', error);
    errorMessage.value = 'Failed to cancel appointment. Please try again.';
  } finally {
    isLoading.value = false;
  }
};

const handleConfirmChanges = async (date: string, dentistId: string) => {
  try {
    await appointmentStore.confirmChanges(dentistId, date);
  } catch (error) {
    console.error('Error confirming changes:', error);
    errorMessage.value = 'Failed to confirm changes.';
  }
};

const toggleSlot = (slot: any) => {
  appointmentStore.toggleSlot(slot);
};

onMounted(async () => {
  try {
    await appointmentStore.fetchAndSetAppointments();
    await clinicStore.fetchAndSetClinics();
    await dentistStore.fetchAndSetDentists();

    const userId = localStorage.getItem('userId');
    if (dentistStore.dentists.length > 0) {
      dentistStore.setActiveDentist(userId);
    }
  } catch (error) {
    console.error('Error initializing data:', error);
    errorMessage.value = 'Failed to load data. Please try again later.';
  }
});
</script>
