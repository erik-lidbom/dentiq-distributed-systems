<template>
    <div v-if="visible" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-white w-2/5 h-4/5 rounded-lg relative">
            <i class="pi pi-times text-gray-500 text-xl absolute top-4 right-4 cursor-pointer" @click="closePopup"></i>
            <div class="mt-7 flex flex-col items-center justify-center w-full h-auto px-5 pb-5">
                <!-- Icon Section -->
                <div class="flex mb-30">
                    <i class="pi pi-times-circle text-red-500 text-8xl"></i>
                </div>

                <!-- Titles Section -->
                <div class="w-4/5 text-center my-6">
                    <h1 class="text-dentiq-h2"> Are you sure? </h1>
                    <p class="text-dentiq-body text-gray-700"> This action will cancel the booking and notify the patient. The cancelation cannot be undone.</p>
                </div>
                
                <!-- Type Name Section --> 
                <div class="w-4/5 text-gray-700 pb-3 text-center">
                    <label for="confirm_text" class="mb-2 text-dentiq-body"> Please type 'DentiQ' to confirm the cancelation.</label>
                    <input 
                        type="text" 
                        id="confirm_dentiq" 
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5" 
                        placeholder="Type here ..." 
                        v-model="confirmationText" 
                        required 
                    />
                </div>

                <button 
                    class="w-4/5 bg-red-500 px-5 py-2 rounded-lg text-white"
                    :disabled="confirmationText !== 'DentiQ'"
                    @click="confirmCancellation"> Confirm Cancellation </button>

            </div>
        </div>
    </div>
</template>
  
<script setup lang="ts">

    import { ref, defineProps, defineEmits } from 'vue';

    const confirmationText = ref('');
    
    defineProps({
        visible: Boolean, // Determines if the box is shown
    });

    // Define emits
    const emit = defineEmits<{
        (event: 'close'): void;
        (event: 'cancelAppointment'): void;
    }>();

    const closePopup = () => {
        emit('close');  // Emit event to parent component to close the popup
    };

    const confirmCancellation = () => {
        emit('cancelAppointment'); // Emit event to parent component to cancel the appointment
        closePopup();
    };
</script>