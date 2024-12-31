<template>
  <div class="flex flex-col gap-4">
    <!-- Conditional Rendering -->
    <div v-if="props.bookings.length > 0" class="space-y-4">
      <div
        v-for="booking in props.bookings"
        :key="booking.id"
        class="flex flex-col gap-2 p-4 bg-white rounded-xl shadow-lg"
      >
        <div class="flex justify-between items-center">
          <p class="text-dentiq-text-dark font-semibold text-dentiq-body">
            {{ booking.date }}
          </p>
          <p
            class="text-dentiq-muted-default font-medium text-dentiq-body-small"
          >
            {{ booking.time }}
          </p>
        </div>
        <p class="text-dentiq-muted-darkest font-normal text-dentiq-body-small">
          Doctor: {{ booking.doctor }}
        </p>
        <p class="text-dentiq-muted-darkest font-normal text-dentiq-body-small">
          Location: {{ booking.location }}
        </p>
        <button
          class="self-end px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
          @click="cancelBooking(booking.id)"
        >
          Cancel Booking
        </button>
      </div>
    </div>

    <!-- No Bookings Fallback -->
    <div
      v-else
      class="p-4 bg-white rounded-xl shadow-lg text-center text-dentiq-muted-default text-dentiq-body"
    >
      No bookings available.
    </div>
  </div>
</template>

<script setup lang="ts">
// Define types
interface Booking {
  id: number;
  date: string;
  doctor: string;
  location: string;
  time: string;
}

// Props
const props = defineProps<{
  bookings: Booking[];
}>();

// Emit event for canceling a booking
const emit = defineEmits(['cancel']);

const cancelBooking = (id: number) => {
  emit('cancel', id);
};
</script>
