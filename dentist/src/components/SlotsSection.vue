<template>
  <div
    class="min-h-full w-full lg:w-2/3 relative border-r border-gray-400 flex lg:justify-start justify-center"
  >
    <div class="ml-5 w-4/5">
      <!-- Title and Description -->
      <div class="border-b border-gray-400">
        <h2 class="pt-4 text-dentiq-h2">My Slots</h2>
        <p class="pb-3 text-dentiq-body-small italic text-gray-500">
          Manage available slots, if there are specific time slots you dont want
          clients to see, disable them.
        </p>
      </div>
      <!-- Date Display -->
      <div class="flex items-center justify-between mb-4 relative pt-3">
        <h4 class="text-dentiq-h4">{{ formattedDate }}</h4>
        <button @click="toggleCalendar">
          <i class="pi pi-calendar text-gray-500 text-xl"></i>
        </button>

        <!-- Calendar Display -->
        <div
          v-if="showCalendar"
          class="absolute bg-white shadow-lg rounded-md p-4 z-10 border border-gray-400 top-full right-0 mt-2"
        >
          <Datepicker v-model="selectedDate" @closed="showCalendar = false" />
        </div>
      </div>
      <!-- Slots Display -->
      <div class="grid grid-cols-3 gap-2 border-b border-gray-400 pb-4">
        <button
          v-for="slot in slots"
          :key="slot.time"
          :disabled="slot.isBooked"
          :class="[
            'h-full w-full p-3 text-lg font-semibold rounded-3xl transition-all duration-200',
            slot.isBooked
              ? 'bg-red-500 text-white border-red-500' // Booked slots
              : slot.isSelected
                ? slot.isCreated
                  ? 'border-red-500 bg-white text-red-500 border-2' // Marked for deletion
                  : 'bg-green-500 text-white border-2 border-transparent' // Selected but not created
                : slot.isCreated
                  ? 'text-white border-2 bg-dentiq-button-dark' // Created slots
                  : 'text-gray-500 border-2 bg-white', // Default
          ]"
          @click="toggleSlot(slot)"
        >
          <span
            v-if="slot.isSelected"
            class="ml-2 text-xl font-bold flex items-center justify-center"
          >
            <font-awesome-icon
              v-if="slot.isCreated"
              :icon="faTrash"
              class="text-red-500"
            />
            <span v-else>+</span>
          </span>
          <span v-else>
            {{ slot.time }}
          </span>
        </button>
      </div>
      <div class="flex justify-center">
        <button
          class="bg-dentiq-button-primary m-2 p-4 text-white rounded-md"
          @click="confirmChanges"
        >
          Confirm Changes
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// Imports for calendar
import { ref, computed, watch, onMounted } from 'vue';
import Datepicker from 'vue3-datepicker';
import 'vue3-datepicker';
import {
  deleteAppointment,
  fetchAppointments,
  postAppointments,
} from '@/api/bookingservice';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

// Fetch data
const fetchData = async () => {
  const date = formatDate(selectedDate.value);
  try {
    const appointments = await fetchAppointments(
      '6770eb7b0f353c41ad4f9422',
      date
    );
    const appointmentData = appointments?.data?.data || [];

    slots.value.forEach((slot) => {
      const appointment = appointmentData.find(
        (a) => a.start_time === slot.time && a.date === date
      );
      // Mark as created if there's an appointment
      slot.isCreated = !!appointment; 
       // Assign appointment ID if available
      slot.id = appointment?._id || '';
      // Mark as booked if a patient exists
      slot.isBooked = !!appointment?.patientId; 
      slot.isSelected = false; 
      slot.isToBeCreated = false;
      slot.isToBeDeleted = false; 
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    // Reset all slots on error
    slots.value.forEach((slot) => {
      slot.isCreated = false;
      slot.isBooked = false;
      slot.isSelected = false;
      slot.isToBeCreated = false;
      slot.isToBeDeleted = false;
      slot.id = '';
    });
  }
};

onMounted(() => {
  fetchData();
});

// State for the date picker
const showCalendar = ref(false);
const selectedDate = ref(new Date()); 

// Computed property to format the selected date
const formattedDate = computed(() => {
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  return selectedDate.value.toLocaleDateString('en-US', options);
});

// Toggle calendar visibility
const toggleCalendar = () => {
  showCalendar.value = !showCalendar.value;
};

// Predefined slot times
const slots = ref([
  {
    time: '08:00',
    isSelected: false,
    isBooked: false,
    isCreated: false,
    isToBeCreated: false,
    isToBeDeleted: false,
    id: '',
  },
  {
    time: '09:00',
    isSelected: false,
    isBooked: false,
    isCreated: false,
    isToBeCreated: false,
    isToBeDeleted: false,
    id: '',
  },
  {
    time: '10:00',
    isSelected: false,
    isBooked: false,
    isCreated: false,
    isToBeCreated: false,
    isToBeDeleted: false,
    id: '',
  },
  {
    time: '11:00',
    isSelected: false,
    isBooked: false,
    isCreated: false,
    isToBeCreated: false,
    isToBeDeleted: false,
    id: '',
  },
  {
    time: '12:00',
    isSelected: false,
    isBooked: false,
    isCreated: false,
    isToBeCreated: false,
    isToBeDeleted: false,
    id: '',
  },
  {
    time: '13:00',
    isSelected: false,
    isBooked: false,
    isCreated: false,
    isToBeCreated: false,
    isToBeDeleted: false,
    id: '',
  },
  {
    time: '14:00',
    isSelected: false,
    isBooked: false,
    isCreated: false,
    isToBeCreated: false,
    isToBeDeleted: false,
    id: '',
  },
  {
    time: '15:00',
    isSelected: false,
    isBooked: false,
    isCreated: false,
    isToBeCreated: false,
    isToBeDeleted: false,
    id: '',
  },
  {
    time: '16:00',
    isSelected: false,
    isBooked: false,
    isCreated: false,
    isToBeCreated: false,
    isToBeDeleted: false,
    id: '',
  },
]);

// Helper function to format the date as YYYY-MM-DD
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const day = String(date.getDate()).padStart(2, '0'); // Pad single-digit days
  return `${year}-${month}-${day}`;
};

// Load slots from API for the selected date
const loadSlotsForDate = async (id, date) => {
  try {
    const response = await fetchAppointments(id, formatDate(date));
    const serverSlots = response.data || [];
    slots.value.forEach((slot) => {
      const serverSlot = serverSlots.find((s) => s.time === slot.time);
      slot.isSelected = serverSlot ? serverSlot.active : false;
    });
  } catch (error) {
    console.error('Error fetching slots for the date:', error);
    // Reset all slots to inactive on error
    slots.value.forEach((slot) => (slot.isSelected = false));
  }
};

// Watcher for selectedDate
watch(selectedDate, async (newDate, oldDate) => {
  console.log('Date changed:', newDate);

  // Reset all slots to their default state
  slots.value.forEach((slot) => {
    slot.isSelected = false;
    slot.isBooked = false;
    slot.isCreated = false;
    slot.isToBeCreated = false;
    slot.isToBeDeleted = false;
    slot.id = '';
  });

  // Fetch data for the new date
  await fetchData();
});

// Handle marking available slots
const toggleSlot = (slot) => {
  if (slot.isBooked) return; // Prevent toggling booked slots

  if (slot.isCreated) {
    // If already created, mark for deletion
    slot.isToBeDeleted = !slot.isToBeDeleted;
    slot.isToBeCreated = false;
  } else {
    // If not created, mark for creation
    slot.isToBeCreated = !slot.isToBeCreated;
    slot.isToBeDeleted = false;
  }

  slot.isSelected = slot.isToBeCreated || slot.isToBeDeleted;
};

// Confirm changes and send to API
const confirmChanges = async () => {
  try {
    const slotsToCreate = slots.value.filter((slot) => slot.isToBeCreated);
    const slotsToDelete = slots.value.filter((slot) => slot.isToBeDeleted);

    console.log('Slots to create:', slotsToCreate);
    console.log('Slots to delete:', slotsToDelete);

    // Batch API requests
    await Promise.all([
      postAppointments({
        dentistId: '6770eb7b0f353c41ad4f9422',
        patientId: null,
        date: formatDate(selectedDate.value),
        start_times: slotsToCreate.map((slot) => slot.time),
      }),
      ...slotsToDelete.map((slot) => deleteAppointment(slot.id)),
    ]);

    alert('Changes confirmed!');
    // Fetch data again to update the UI
    await fetchData(); 
  } catch (error) {
    console.error('Error confirming changes:', error);
    alert('An error occurred while confirming changes.');
  }
};
</script>
