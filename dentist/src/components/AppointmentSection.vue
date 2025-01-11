<template>
  <div class="max-h-full w-full lg:w-1/3 flex-col justify-center pb-4">
    <h2 class="pt-4 text-dentiq-h2 text-center">My Appointments</h2>
    <div class="h-full space-y-4 p-6 w-fit overflow-y-scroll">
      <!-- Appointment Boxes -->
      <div
        v-for="(appointment, index) in appointments"
        :key="appointment._id"
        class="flex flex-wrap p-4 gap-4 bg-white border border-gray-300 rounded-lg justify-between items-stretch"
      >
        <!-- Appointment Details -->
        <div class="flex">
          <div class="flex space-x-4 border-r border-gray-300 p-4">
            <!-- Date Section -->
            <div class="flex flex-col items-center">
              <span class="text-dentiq-h4">{{
                appointment.date.split('-')[0]
              }}</span>
              <div class="flex gap-1">
                <span class="text-dentiq-h3">{{
                  new Date(appointment.date).toLocaleString('default', {
                    month: 'short',
                  })
                }}</span>
                <span class="text-dentiq-h3">{{
                  appointment.date.split('-')[2]
                }}</span>
              </div>
            </div>
          </div>
          <!-- Info Section -->
          <div class="flex-col justify-center ml-4 flex-grow space-y-2">
            <!-- Time -->
            <div class="flex items-center space-x-2 mt-3">
              <i class="pi pi-clock w-5 h-5 text-gray-500"></i>
              <span class="text-xs md:text-sm">{{
                appointment.start_time
              }}</span>
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
                {{ appointment.patientId || 'Loading...' }}
              </span>
            </div>
          </div>
        </div>
        <!-- Cancel Button -->
        <div class="flex items-center w-full">
          <button
            class="bg-red-500 px-5 py-2 rounded-lg text-white w-full"
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
import { reactive, defineProps, ref, onMounted } from 'vue';
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
