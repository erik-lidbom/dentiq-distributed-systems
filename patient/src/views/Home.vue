<template>
  <div class="flex flex-row min-h-full rounded-2xl p-2 sm:p-4 bg-dentiq-muted-lightest space-x-4">
    <Filter />
    <Map />
  </div>
</template>

<script setup lang="ts">
import Filter from '@/components/Filter.vue';
import Map from '../components/Map.vue';
</script>
