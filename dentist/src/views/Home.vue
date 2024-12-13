<template>
  <div
    class="flex flex-col md:flex-row min-h-full rounded-2xl p-0 bg-white overflow-hidden relative border-dentiq-muted-semilight border-2"
  >
    <SlotsSection />
    <AppointmentSection />
  </div>
</template>

<script setup lang="ts">
import SlotsSection from '@/components/SlotsSection.vue';
import AppointmentSection from '@/components/AppointmentSection.vue';
</script>
