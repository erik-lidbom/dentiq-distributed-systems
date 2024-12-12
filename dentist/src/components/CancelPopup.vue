<template>
    <div v-if="visible" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-white w-2/5 h-4/5 rounded-lg p-5 flex flex-col items-center justify-center">
            <!-- Titles Section -->
            <h1 class="text-dentiq-h2"> Are you sure? </h1>
            <p class="text-dentiq-body text-center"> This action will cancel the booking and notify the patient. The cancelation cannot be undone. </p>
            <!-- Type Name Section -->
            <div class="mt-7 flex flex-col items-center justify-center"> 
                <label for="instruction_text" class="mb-2 text-dentiq-body">Please type in the name of the patient to confirm.</label>
                <label for="patient_name" class="mb-2 text-dentiq-body"> Name: Erik Lidbom</label>
                <input type="text" id="confirm_name" class="mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5" placeholder="Type here ..." required />
                <button class="bg-red-500 px-5 py-2 rounded-lg text-white w-1/2 "> Confirm Cancellation </button>
            </div>
        </div>
    </div>
</template>
  
<script setup lang="ts">

    import { defineProps } from 'vue';
    
    defineProps({
        visible: Boolean, // Determines if the box is shown
    });

</script>