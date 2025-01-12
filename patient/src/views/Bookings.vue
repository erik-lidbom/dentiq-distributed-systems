<template>
  <div
    class="h-full w-full flex flex-col gap-4 bg-dentiq-muted-lightest rounded-2xl p-6"
  >
    <h3
      class="text-dentiq-h3 w-full font-light text-dentiq-text-primary font-archivoBlack"
    >
      My Bookings
    </h3>

    <!-- Loading Spinner -->
    <div
      v-if="isLoading"
      class="flex flex-col justify-center items-center gap-4 h-60"
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
      <h3 class="text-dentiq-muted-dark text-dentiq-h3">
        {{ loadingMessage }}
      </h3>
    </div>

    <!-- List -->
    <div v-else class="w-full h-full items-center justify-center">
      <BookingsList :bookings="bookings" @cancel="handleCancel" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import BookingsList from '@/components/bookings/BookingsList.vue';
import { useAppointmentStore } from '@/stores';
import { cancelBooking } from '@/api/bookingService';

// Appointment Store
const appointmentStore = useAppointmentStore();

// Reactive State
const bookings = computed(() => appointmentStore.patientBookings);
const isLoading = ref(false); // Tracks whether a loading spinner should be shown
const loadingMessage = ref(''); // Dynamic loading message
const loadingTimeout = ref<number | null>(null); // Tracks the timeout ID for loading
const errorMessage = ref<string | null>(null); // Error message for failed operations

// Timeout duration15 seconds (in milliseconds)
const LOADING_TIMEOUT = 15000;

// Start the loading process with a timeout
const startLoading = (message: string) => {
  isLoading.value = true;
  loadingMessage.value = message;
  errorMessage.value = null;

  // Set a timeout to handle long-running operations
  loadingTimeout.value = setTimeout(() => {
    isLoading.value = false;
    errorMessage.value = 'The operation took too long. Please try again.';
    console.warn('Loading operation timed out.');
  }, LOADING_TIMEOUT);
};

// Stop the loading process
const stopLoading = () => {
  isLoading.value = false;
  if (loadingTimeout.value) {
    clearTimeout(loadingTimeout.value); // Clear the timeout
    loadingTimeout.value = null;
  }
};

// Fetch bookings on mount
onMounted(async () => {
  startLoading('Loading your bookings...');
  try {
    await appointmentStore.fetchAndAggregatePatientBookings();
    console.log('Patient bookings fetched successfully:', bookings.value);
  } catch (error) {
    console.error('Error fetching patient bookings:', error);
    errorMessage.value = 'Failed to load bookings. Please try again.';
  } finally {
    stopLoading();
  }
});

// Handle cancel booking
const handleCancel = async (id: string) => {
  const originalBookings = [...bookings.value];

  // Optimistically remove the booking from the list
  appointmentStore.setPatientBookings(
    bookings.value.filter((booking) => booking._id !== id)
  );

  console.log(`Booking with ID ${id} was optimistically canceled.`);

  startLoading('Canceling your booking...');

  try {
    const response = await cancelBooking(id);

    if (response.data.status === 200) {
      console.log(`Booking with ID ${id} successfully canceled.`);
    } else {
      throw new Error('Failed to cancel booking');
    }
  } catch (error) {
    console.error(`Error canceling booking with ID ${id}:`, error);

    // Revert the optimistic update if the API call fails
    appointmentStore.setPatientBookings(originalBookings);
    errorMessage.value = 'Failed to cancel booking. Please try again.';
  } finally {
    stopLoading();
  }
};
</script>
