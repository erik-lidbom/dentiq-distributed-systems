<template>
    <div class="h-auto lg:min-h-full w-full lg:w-1/3 flex-col justify-center pb-4">
        <h2 class="pt-4 text-dentiq-h2 text-center">My Appointments</h2>
        <div class="w-11/12 h-auto space-y-4 mt-6 mx-auto">
            <!-- Appointment Boxes -->
            <div v-for="(appointment, index) in appointments" :key="index"
                class="bg-white border border-gray-300 rounded-lg flex justify-between items-stretch">
                <div class="flex space-x-4 border-r border-gray-300 p-4">
                    <!-- Date Section -->
                    <div class="flex flex-col items-center">
                        <span class="text-dentiq-h4">{{ appointment.date.split(' ')[0] }}</span>
                        <span class="text-dentiq-h1">{{ appointment.date.split(' ')[1] }}</span>
                    </div>
                </div>
                <!-- 'Info' Section -->
                <div class="flex-col justify-center ml-4 flex-grow space-y-2">
                    <!-- Time -->
                    <div class="flex items-center space-x-2 mt-3">
                        <i class="pi pi-clock w-5 h-5 text-gray-500"></i>
                        <span class="text-xs md:text-sm">{{ appointment.start_time }}</span>
                    </div>

                    <!-- Location -->
                    <div class="flex items-center space-x-2 mt-1">
                        <i class="pi pi-globe w-5 h-5 text-gray-500"></i>
                        <span class="text-xs md:text-sm">{{ appointment.clinic }}</span>
                    </div>

                    <!-- Patient Name -->
                    <div class="flex items-center space-x-2 mt-2">
                        <i class="pi pi-user w-5 h-5 text-gray-500"></i>
                        <span class="text-xs md:text-sm">{{ appointment.patientId }}</span>
                    </div>
                </div>
                <!-- Cancel Button -->
                <div class="flex items-center">
                    <button class="bg-red-500 px-5 py-2 rounded-lg text-white mr-3"
                        @click="showCancelPopup(index)">Cancel</button>
                </div>
            </div>
        </div>
        <CancelPopup :visible="cancelPopupVisible" @close="closeCancelPopup"
            @cancelAppointment="selectedAppointmentIndex !== null && cancelAppointment(selectedAppointmentIndex)" />
    </div>
</template>

<script setup lang="ts">

import { onMounted, ref, watch } from 'vue'; // Updates page automatically 
import CancelPopup from '@/components/CancelPopup.vue';
import { deleteAppointment, fetchAppointments } from '@/api/bookingservice';

const appointments = ref<any[]>([]);
const fetchedAppointments = ref<any[]>([]);
const selectedAppointmentIndex = ref<number | null>(null);

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function isFutureDate(dateString: string): boolean {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0)
    console.log('THE FORMAT OF NEW DATE IS: ', currentDate)

    const appointmentDate = new Date(dateString);
    appointmentDate.setHours(0, 0, 0, 0);
    console.log('THE FORMAT OF DATE IS: ', appointmentDate)
    return appointmentDate >= currentDate;
}

const fetchAndRefreshAppointments = async () => {
    try {
        const response = await fetchAppointments("6756c273e4730b3a76915a35");
        fetchedAppointments.value = response.data.data;
        
        appointments.value = fetchedAppointments.value
            .filter(({ date, patientId }) => patientId && isFutureDate(date) )
            .map(({ _id, date, start_time, patientId, clinic }) => ({
                _id,
                date: formatDate(date),
                start_time,
                patientId: patientId,
                clinic: clinic || 'Clinic A'
            }));
            console.log('IN HERE')

    } catch (error) {
        console.error('Error fetching appointments: ', error);
    }
}

onMounted(async () => {
    await fetchAndRefreshAppointments();
});


const cancelAppointment = async (index: number) => {  // Removes appointment at given index
    if (index !== null) {
        const appointmentToDelete = appointments.value[index];
        console.log('AppointmentID for Deletion: ', appointmentToDelete)

        try {
            const response = await deleteAppointment(appointmentToDelete._id)
            if(response.status === 200) {
                appointments.value.splice(index, 1);
                console.log('Appointment deleted successfully: ', response.message);
                try {
                    await fetchAndRefreshAppointments();
                } catch (error) {
                    console.error('ERR: ', error)
                }
            } else {
                console.error('Failed to delete appointment: ', response.message);
            }

        } catch (error) {
            console.error('An error occured while trying to delete appointment: ', error)
        }
    }
};

const cancelPopupVisible = ref(false); // Controls popop visibility

// Show popup
const showCancelPopup = (index: number) => {
    selectedAppointmentIndex.value = index;
    cancelPopupVisible.value = true;
}

const closeCancelPopup = () => {
    cancelPopupVisible.value = false;
};

</script>