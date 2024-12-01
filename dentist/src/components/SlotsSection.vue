<template> 
    <div class="min-h-full w-full md:w-2/3 md:h-auto relative border-r border-gray-400 flex">
      <div class="ml-5 w-4/5">
        <!-- Title and Description -->
         <div class="border-b border-gray-400">
            <h2 class="pt-4 text-dentiq-h2">My Slots</h2>
            <p class="pb-3 text-dentiq-body-small  italic text-gray-500">Manage available slots, if there are specific time slots you dont want clients to see, disable them.</p>
         </div>
        <!-- Date Display -->
        <div class="flex items-center justify-between mb-4 relative pt-3">
            <h4 class="text-dentiq-h4">{{ formattedDate }}</h4>
            <button @click="toggleCalendar" class="py-1 px-3 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"> Cal </button>
        
          <!-- Calendar Display -->
          <div v-if="showCalendar" class="absolute bg-white shadow-lg rounded-md p-4 z-10 border border-gray-400 top-full right-0 mt-2">
              <Datepicker v-model="selectedDate" @change="onDateChange"></Datepicker>
          </div>
        </div>
        <!-- Slots Display -->
        <div class="grid grid-cols-3 gap-2 border-b border-gray-400 pb-4">
          <button
            v-for="slot in slots"
            :key="slot.time"
            :class="['h-full w-full p-3 text-lg font-semibold rounded-3xl transition-all duration-200', slot.active ? 'bg-dentiq-button-dark text-white border-2 border-transparent' : 'bg-white text-gray-800 border-2 border-dentiq-button-dark']"
            @click="toggleSlot(slot)">
            {{ slot.time }} 
          </button>
        </div>
        <div class="border-b border-gray-400 flex justify-center">
          <button class="bg-dentiq-button-primary m-2 p-4 text-white rounded-md">Confirm Changes</button>
        </div>
      </div>
    </div>
</template>

<script setup>
  //Imports for calendar
  import { ref, computed } from 'vue';
  import Datepicker from 'vue3-datepicker';
  import 'vue3-datepicker';

// State for the date picker
const showCalendar = ref(false); // Controls the visibility of the calendar
const selectedDate = ref(new Date()); // Holds the selected date

    // Computed property to format the selected date
    const formattedDate = computed(() => {
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    return selectedDate.value.toLocaleDateString('en-US', options);
    });

    // Toggle calendar visibility
    const toggleCalendar = () => {
    showCalendar.value = !showCalendar.value;
    };

    // Handle date change
    const onDateChange = (date) => {
      selectedDate.value = date;
      showCalendar.value = false; // Close the calendar after a date is selected
    };

    // Predefined slot times
    const slots = ref([
      { time: '08:00', active: true },
      { time: '09:00', active: true },
      { time: '10:00', active: true },
      { time: '11:00', active: true },
      { time: '12:00', active: true },
      { time: '13:00', active: true },
      { time: '14:00', active: true },
      { time: '15:00', active: true },
      { time: '16:00', active: true },
    ]);

    // Handle marking unavailable slots
    const toggleSlot = (slot) => {
      slot.active = !slot.active;
    };
</script>