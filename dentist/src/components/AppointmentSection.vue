
<template>
    <div class="min-h-full w-1/3 flex-col justify-center">
        <h2 class="pt-4 text-dentiq-h2 text-center">My Appointments</h2>
        <div class="w-11/12 h-auto space-y-4 mt-6 mx-auto">

            <!-- Appointment Boxes -->
             <div v-for="(appointment, index) in appointments" :key="index" class="bg-white border border-gray-300 rounded-lg flex justify-between items-stretch">
                <div class="min-w-4 flex space-x-4 border-r border-gray-300 p-4"> 
                    <!-- Date Section -->
                    <div class="flex flex-col items-center">
                        <span class="text-dentiq-h4">{{ appointment.date.split(' ')[0] }}</span>
                        <span class="text-dentiq-h1">{{ appointment.date.split(' ')[1] }}</span>
                    </div>
                </div>

            </div>
        </div>
    </div>
    
</template>

<script setup lang="ts">
const appointments = [
  { date: 'Dec 27', time: '09:00', location: 'Clinic Blue', patient: 'Erik Lidbom' },
  { date: 'Dec 28', time: '11:00', location: 'Clinic Red', patient: 'Nabil Al Sayed' },
  { date: 'Dec 29', time: '12:00', location: 'Clinic Yellow', patient: 'Utkarsh Singh' },
];
</script>
