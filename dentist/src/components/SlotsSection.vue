<template> 
    <div class="min-h-full w-full lg:w-2/3 relative border-r border-gray-400 flex lg:justify-start justify-center">
      <div class="ml-5 w-4/5">
        <!-- Title and Description -->
         <div class="border-b border-gray-400">
            <h2 class="pt-4 text-dentiq-h2">My Slots</h2>
            <p class="pb-3 text-dentiq-body-small italic text-gray-500">Manage available slots, if there are specific time slots you dont want clients to see, disable them.</p>
         </div>
        <!-- Date Display -->
        <div class="flex items-center justify-between mb-4 relative pt-3">
            <h4 class="text-dentiq-h4">{{ formattedDate }}</h4>
            <button @click="toggleCalendar">
              <i class="pi pi-calendar text-gray-500 text-xl"></i> 
            </button>
        
          <!-- Calendar Display -->
          <div v-if="showCalendar" class="absolute bg-white shadow-lg rounded-md p-4 z-10 border border-gray-400 top-full right-0 mt-2">
              <Datepicker v-model="selectedDate" @change="onDateChange" @closed="showCalendar = false"/>
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
      ? 'bg-red-500 text-white border-red-500'
      : slot.isSelected
        ? 'bg-dentiq-button-dark text-white border-2 border-transparent'
        : 'bg-white text-gray-800 border-2 border-dentiq-button-dark'
  ]"
  @click="toggleSlot(slot)">
  {{ slot.time }}
</button>
        </div>
        <div class="flex justify-center">
          <button class="bg-dentiq-button-primary m-2 p-4 text-white rounded-md" @click="confirmChanges">Confirm Changes</button>
        </div>
      </div>
    </div>
</template>

<script setup>
// Imports for calendar
import { ref, computed, watch, onMounted } from 'vue';
import Datepicker from 'vue3-datepicker';
import 'vue3-datepicker';
import { deleteAppointment, fetchAppointments, postAppointments } from '@/api/bookingservice';


const fetchData = async () => {
  const date = formatDate(selectedDate.value)
  console.log('The date is: ', date);
  try {
    const appointments = await fetchAppointments('6756c273e4730b3a76915a35', date);
    console.log("Fetched appointments:", appointments);

    const appointmentData = Array.isArray(appointments?.data?.data)
    ? appointments.data.data
    : [];

    slots.value.forEach(slot => {
      const matchingApps = appointmentData.find(appointment => 
      appointment.start_time === slot.time && appointment.date === date
      );
      if(matchingApps && matchingApps.patientId) {
        slot.isBooked = true;
        slot.isSelected = false;
        if(matchingApps.patientId) {
          slot.isBooked = true
        }
      } else {
        slot.isBooked = false;
        slot.isSelected = !!matchingApps
      }
      //slot.active = !!matchingApps;
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
  } finally {
    console.log(slots.value)
  }
};

onMounted(() => {
  fetchData(); 
});

// State for the date picker
const showCalendar = ref(false); // Controls the visibility of the calendar
const selectedDate = ref(new Date()); // Holds the selected date
const selectedApponintment = ref({})

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
  { time: '08:00', isSelected: false, isBooked: false, isCreated: false },
  { time: '09:00', isSelected: false, isBooked: false , isCreated: false},
  { time: '10:00', isSelected: false, isBooked: false , isCreated: false},
  { time: '11:00', isSelected: false, isBooked: false , isCreated: false},
  { time: '12:00', isSelected: false, isBooked: false , isCreated: false},
  { time: '13:00', isSelected: false, isBooked: false , isCreated: false},
  { time: '14:00', isSelected: false, isBooked: false , isCreated: false},
  { time: '15:00', isSelected: false, isBooked: false , isCreated: false},
  { time: '16:00', isSelected: false, isBooked: false , isCreated: false},
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
    slots.value.forEach(slot => {
      const serverSlot = serverSlots.find(s => s.time === slot.time);
      slot.isSelected = serverSlot ? serverSlot.active : false;
    });
  } catch (error) {
    console.error("Error fetching slots for the date:", error);
    // Reset all slots to inactive on error
    slots.value.forEach(slot => slot.isSelected = false);
  }
};

// Watcher for selectedDate
watch(selectedDate, async (newDate, oldDate) => {
  console.log("Date changed:", newDate);

  // Reset all slots to inactive before loading the new date's data
  slots.value.forEach(slot => slot.isSelected = false);
  // call fetchData to check if slots are already picked
  await fetchData();
});

// Handle marking available slots
const toggleSlot = (slot) => {
  console.log("SLOT", slot)
  slot.isSelected = !slot.isSelected; // Toggle the active state of a slot
  if(slot.isSelected) {
    selectedAppointment.value = {
      date: selectedDate,
      start_time: slot.time
    }
  }
};

// Confirm changes and send to API
const confirmChanges = async () => {

  const appointmentData = {
    patientId: null,
    dentistId: '6756c273e4730b3a76915a35',
    date: formatDate(selectedAppoinment.date),
    start_times: selectedAppoinment.time,
    status: 'unbooked'
  };

  const slot = slots.value.filter((slot) => slot.time === selectedAppoinment.value.time).map((slot) => slot.value.isCreated === true)

  if(slot){
    
  }
  

  try {
    if(!appointment) {
      await postAppointments(appointmentData);
      alert("Changes confirmed!");
    } else {
      return;
    }

  } catch (error) {
    console.error("Failed to confirm changes:", error);
    alert("An error occurred while confirming changes.");
  }
};
</script>
