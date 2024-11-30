<template> 
    <div class="min-h-full w-2/3 relative border-r border-gray-400">
        <!-- Title and Description -->
         <div class="ml-5 w-4/5 border-b border-gray-400">
            <h2 class="pt-4 text-dentiq-h2">My Slots</h2>
            <p class="pb-3 text-dentiq-body-small  italic text-gray-500">Manage available slots, if there are specific time slots you dont want clients to see, disable them.</p>
         </div>
        <!-- Date Display -->
        <div class="ml-5 w-4/5 border-b border-gray-400 flex items-center justify-between mb-4 relative">
            <h3 class="text-lg font-medium">{{  formattedDate }}</h3>
            <button @click="toggleCalendar" class="py-1 px-3 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"> Cal </button>
        

          <!-- Date Display -->
          <div v-if="showCalendar" class="absolute bg-white shadow-lg rounded-md p-4 z-10 border border-gray-400 top-full right-0 mt-2">
              <Datepicker v-model="selectedDate" @change="onDateChange"></Datepicker>
          </div>
        </div>
    </div>
</template>

<script setup>
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
</script>