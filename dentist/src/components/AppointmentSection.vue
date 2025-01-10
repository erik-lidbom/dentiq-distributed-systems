<template>
  <div
    class="h-auto lg:min-h-full w-full lg:w-1/3 flex-col justify-center pb-4"
  >
    <h2 class="pt-4 text-dentiq-h2 text-center">My Appointments</h2>
    <div class="w-11/12 h-auto space-y-4 mt-6 mx-auto">
      <!-- Appointment Boxes -->
      <div
        v-for="(appointment, index) in appointments"
        :key="appointment._id"
        class="bg-white border border-gray-300 rounded-lg flex justify-between items-stretch"
      >
        <div class="flex space-x-4 border-r border-gray-300 p-4">
          <!-- Date Section -->
          <div class="flex flex-col items-center">
            <span class="text-dentiq-h4">{{
              appointment.date.split(' ')[0]
            }}</span>
            <span class="text-dentiq-h1">{{
              appointment.date.split(' ')[1]
            }}</span>
          </div>
        </div>
        <!-- Info Section -->
        <div class="flex-col justify-center ml-4 flex-grow space-y-2">
          <!-- Time -->
          <div class="flex items-center space-x-2 mt-3">
            <i class="pi pi-clock w-5 h-5 text-gray-500"></i>
            <span class="text-xs md:text-sm">{{ appointment.start_time }}</span>
          </div>
          <!-- Location -->
          <div class="flex items-center space-x-2 mt-1">
            <i class="pi pi-question w-5 h-5 text-gray-500"></i>
            <span class="text-xs md:text-sm">{{
              appointment.reason_for_visit
                ? appointment.reason_for_visit
                : 'Reason Not Given'
            }}</span>
          </div>
          <!-- Patient Name -->
          <div class="flex items-center space-x-2 mt-2">
            <i class="pi pi-user w-5 h-5 text-gray-500"></i>
            <span class="text-xs md:text-sm">
              {{ patientDetails[appointment.patientId]?.name || 'Loading...' }}
            </span>
          </div>
        </div>
        <!-- Cancel Button -->
        <div class="flex items-center">
          <button
            class="bg-red-500 px-5 py-2 rounded-lg text-white mr-3"
            @click="showCancelPopup(appointment._id)"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
    <!-- Cancel Popup -->
    <CancelPopup
      :visible="cancelPopupVisible"
      @close="closeCancelPopup"
      @cancelAppointment="
        selectedAppointmentId !== null && cancel(selectedAppointmentId)
      "
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, defineProps, ref } from 'vue';
import CancelPopup from '@/components/CancelPopup.vue';

// Props
const props = defineProps<{
  appointments: {
    _id: string;
    date: string;
    start_time: string;
    patientId: string;
    dentistId: string;
    status: string;
    reason_for_visit: string;
  }[];
}>();

// Reactive state for patient details
const patientDetails = reactive<
  Record<string, { name: string; email: string }>
>({});

// Emit
const emit = defineEmits(['cancel']);

// Reactive State
const cancelPopupVisible = ref(false);
const selectedAppointmentId = ref<string | null>(null);

// Cancel Appointment Logic
const cancel = async (appointmentId: string) => {
  emit('cancel', appointmentId); // Notify parent
  closeCancelPopup();
};

// Popup Controls
const showCancelPopup = (appointmentId: string) => {
  selectedAppointmentId.value = appointmentId;
  cancelPopupVisible.value = true;
};

const closeCancelPopup = () => {
  cancelPopupVisible.value = false;
};
</script>
