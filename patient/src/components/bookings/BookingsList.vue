<template>
  <div class="flex flex-col gap-4 min-h-full">
    <!-- Conditional Rendering -->
    <div v-if="bookings.length > 0" class="space-y-4">
      <h4 class="text-dentiq-muted-default">{{ bookings.length }} Bookings</h4>
      <div
        v-for="booking in bookings"
        :key="booking._id"
        class="flex flex-col gap-2 p-6 bg-white rounded-xl shadow-lg"
      >
        <div class="flex justify-between items-center">
          <p class="text-dentiq-text-dark font-semibold text-dentiq-body">
            {{ booking.date }}
          </p>
          <p
            class="text-dentiq-muted-default font-medium text-dentiq-body-small"
          >
            {{ booking.start_time }}
          </p>
        </div>
        <p class="text-dentiq-muted-darkest font-normal text-dentiq-body-small">
          Doctor: {{ booking.dentist.name }}
        </p>
        <p class="text-dentiq-muted-darkest font-normal text-dentiq-body-small">
          Clinic: {{ booking.clinic.name }}
        </p>
        <p class="text-dentiq-muted-darkest font-normal text-dentiq-body-small">
          Address: {{ booking.clinic.address }}
        </p>
        <button
          class="self-end px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
          @click="handleOpenModal(booking._id)"
        >
          Cancel Booking
        </button>

        <!-- Confirmation Dialog -->
        <Modal v-if="modalIsOpen" @close="closeModal">
          <div class="gap-4 flex flex-col items-center justify-center h-full">
            <h3>Are you sure you want to cancel?</h3>
            <button
              class="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
              @click="confirmCancel"
            >
              Cancel Booking
            </button>
          </div>
        </Modal>
      </div>
    </div>

    <!-- No Bookings Fallback -->
    <div
      v-else
      class="flex flex-col p-4 gap-10 h-full justify-center items-center text-dentiq-muted-default text-dentiq-body"
    >
      <img :src="doctors" alt="No Bookings" class="max-w-[200px] mx-auto" />
      <h3 class="text-dentiq-h3 text-dentiq-muted-semiLight">
        No Bookings Found
      </h3>
      <button
        class="px-4 py-2 w-[200px] text-white text-dentiq-body-large bg-dentiq-button-primary rounded-lg hover:bg-opacity-90"
        @click="handleBookNow"
      >
        Book Now
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Modal from '@/components/shared/Modal.vue';
import type { Clinic, Dentist } from '@/types/types';
import doctors from '/illustrations/doctors.svg';
import router from '@/router';

// Booking type
interface Booking {
  _id: string;
  date: string;
  start_time: string;
  dentist: Dentist;
  clinic: Clinic;
}

// Props
defineProps<{
  bookings: Booking[];
}>();

// Emit event for canceling a booking
const emit = defineEmits(['cancel']);

// State for confirmation dialog
const modalIsOpen = ref(false);
const currentBookingId = ref<string | null>(null);

// Open the confirmation dialog
const handleOpenModal = (id: string) => {
  currentBookingId.value = id;
  modalIsOpen.value = true;
};

const handleBookNow = () => {
  // Redirect to booking page
  router.push('/');
};

// Close the confirmation dialog
const closeModal = () => {
  modalIsOpen.value = false;
  currentBookingId.value = null;
};

// Confirm cancellation
const confirmCancel = () => {
  if (currentBookingId.value !== null) {
    emit('cancel', currentBookingId.value); // Notify parent
    closeModal();
  }
};
</script>
