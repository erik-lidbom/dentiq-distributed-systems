<template>
    <div v-if="visible" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white w-2/5 h-2/3 rounded-lg"></div>
    </div>
</template>
  
<script setup lang="ts">

    import { defineProps } from 'vue';
    
    defineProps({
        visible: Boolean, // Determines if the box is shown
    });

</script>