<template>
  <div
    class="h-screen w-full flex flex-col gap-4 bg-dentiq-muted-lightest rounded-2xl p-6"
  >
    <h3
      class="text-dentiq-h3 w-full font-light text-dentiq-text-primary font-archivoBlack"
    >
      My Bookings
    </h3>

    <!--  List   -->
    <div class="w-full">
      <BookingsList :bookings="bookings" @cancel="handleCancel" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import BookingsList from '@/components/bookings/BookingsList.vue';

// types
interface Booking {
  id: number;
  date: string;
  doctor: string;
  location: string;
  time: string;
}

// States and lifecycle hooks
const bookings = ref<Booking[]>([]);

// Fetch bookings
onMounted(() => {
  bookings.value = [
    {
      id: 1,
      date: '12th June 2021',
      location: 'Nordstan, Gothenburg',
      doctor: 'Dr. John Doe',
      time: '10:00 AM',
    },
    {
      id: 2,
      date: '15th June 2021',
      location: 'Mölndal, Gothenburg',
      doctor: 'Dr. Jane Doe',
      time: '11:00 AM',
    },
  ];
});

// Handle cancel booking
const handleCancel = (id: number) => {
  bookings.value = bookings.value.filter((booking) => booking.id !== id);
  console.log(`Booking with ID ${id} was canceled.`);
};
</script>
