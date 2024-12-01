
<template>
    <div class="min-h-full w-1/3 relative">
        <h2 class="pt-4 text-dentiq-h2 text-center">My Appointments</h2>
        <div class="w-full h-full space-y-4 mt-6 border border-red-400">
            <div v-for="(appointment, index) in appointments" :key="index" class="bg-white border border-gray-300 rounded-lg p-4 flex justify-between items-center">

            </div>
        </div>
    </div>
    
</template>

<script setup lang="ts">
const appointments = [
  { date: 'Wed 27', time: '09:00', location: 'Clinic Blue', patient: 'Erik Lidbom' },
  { date: 'Wed 27', time: '10:00', location: 'Clinic Pink', patient: 'Lilly Heier' },
  { date: 'Thu 28', time: '11:00', location: 'Clinic Red', patient: 'Nabil Al Sayed' },
  { date: 'Fri 29', time: '12:00', location: 'Clinic Yellow', patient: 'Utkarsh Singh' },
  { date: 'Fri 29', time: '13:00', location: 'Clinic Lilac', patient: 'Andreas Haataja' },
  { date: 'Fri 29', time: '09:00', location: 'Clinic Green', patient: 'Erik Lidbom' }
];
</script>
