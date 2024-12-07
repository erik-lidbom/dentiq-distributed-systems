<template>
    <input
      v-model="searchInput"
      placeholder="Search for a clinic"
      class="flex-1 max-w-[689px] w-full h-[48px] px-3 text-dentiq-text-dark rounded-[10px] bg-dentiq-muted-lighter"
      @input="onSearch"
    />
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  // Reactive search input
  const searchInput = ref<string>('');
  
  // Emit event to parent on search input
  const emit = defineEmits(['searchQuery']);
  
  function onSearch() {
    emit('searchQuery', searchInput.value);
  }
  </script>
  