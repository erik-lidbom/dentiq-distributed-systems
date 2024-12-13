<template>
    <div v-if="visible" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-white w-2/5 h-4/5 rounded-lg">
            <div class="mt-7 flex flex-col items-center justify-center w-full h-auto px-5 pb-5">
                <!-- Icon Section -->
                <div class="flex mb-30">
                    <i class="pi pi-times-circle text-red-500 text-8xl"></i>
                </div>

                <!-- Titles Section -->
                <div class="w-full text-center my-6">
                    <h1 class="text-dentiq-h2"> Are you sure? </h1>
                    <p class="text-dentiq-body text-gray-700"> This action will cancel the booking and notify the patient. The cancelation cannot be undone. Please type in the name of the patient to confirm.</p>
                </div>
                
                <!-- Type Name Section --> 
                <div class="w-full text-gray-700 pb-3">
                    <label for="patient_name" class="mb-2 text-dentiq-body italic"> Name: Erik Lidbom</label>
                    <input type="text" id="confirm_name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5" placeholder="Type here ..." required />
                </div>

                <button class="bg-red-500 px-5 py-2 rounded-lg text-white"> Confirm Cancellation </button>

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