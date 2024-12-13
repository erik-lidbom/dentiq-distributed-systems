<template>
    <div class="lg:min-h-full w-full lg:w-1/3 flex-col justify-center pb-4">
        <h2 class="pt-4 text-dentiq-h2 text-center">My Appointments</h2>
        <div class="w-11/12 h-auto space-y-4 mt-6 mx-auto">

            <!-- Appointment Boxes -->
             <div v-for="(appointment, index) in appointments" :key="index" class="bg-white border border-gray-300 rounded-lg flex justify-between items-stretch">
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
                        <span class="text-xs md:text-sm">{{ appointment.time }}</span>
                    </div>
                
                    <!-- Location -->
                    <div class="flex items-center space-x-2 mt-1">
                        <i class="pi pi-globe w-5 h-5 text-gray-500"></i>
                        <span class="text-xs md:text-sm">{{ appointment.location }}</span>
                    </div>
                    
                    <!-- Patient Name -->
                    <div class="flex items-center space-x-2 mt-2">
                        <i class="pi pi-user w-5 h-5 text-gray-500"></i>
                        <span class="text-xs md:text-sm">{{ appointment.patient }}</span>
                    </div>
                </div>

                <!-- Cancel Button -->
                <div class="flex items-center">
                    <button class="bg-red-500 px-5 py-2 rounded-lg text-white mr-3" @click="showCancelPopup">Cancel</button>
                </div>
                
            </div>
        </div>
        <CancelPopup :visible="cancelPopupVisible" @close="closeCancelPopup" />
    </div>
    
</template>

<script setup lang="ts">

    import { ref } from 'vue'; // Updates page automatically 
    import CancelPopup from '@/components/CancelPopup.vue';

    const appointments = ref([
    { date: 'Dec 27', time: '09:00', location: 'Clinic Blue', patient: 'Erik Lidbom' },
    { date: 'Dec 28', time: '11:00', location: 'Clinic Red', patient: 'Nabil Al Sayed' },
    { date: 'Dec 29', time: '12:00', location: 'Clinic Yellow', patient: 'Utkarsh Singh' }, 
    ]);

    const cancelAppointment = (index: number) => {  // Removes appointment at given index
        appointments.value.splice(index,1)
    };

    const cancelPopupVisible = ref(false); // Controls popop visibility

    // Show popup
    const showCancelPopup = () => {
        cancelPopupVisible.value = true;
    }

    const closeCancelPopup = () => {
        cancelPopupVisible.value = false;
    };


</script>
