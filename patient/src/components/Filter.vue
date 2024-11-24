<template>
    <div class="min-h-full rounded-2xl p-2 w-[228px] space-y-8">
      <!-- Header -->
      <h2 class="text-dentiq-h4 font-semibold text-dentiq-muted-darkest">Filter by</h2>
      
      <!-- Services List -->
       <div class="flex flex-col space-y-4">
        <h3 class="text-dentiq-body font-semibold text-dentiq-muted-darkest">Services</h3>
        <hr>
        <div class="text-dentiq-body-small text-dentiq-muted-darker flex-wrap gap-1 flex">
            <h3 v-for="(service, index) in services" :key="index" class=" px-2 py-1 rounded-md bg-dentiq-muted-light w-fit">{{ service.name }}</h3>
        </div>
      </div>

      <!-- Accessability -->
      <div class="flex flex-col space-y-4">
        <h3 class="text-dentiq-body font-semibold text-dentiq-muted-darkest">Accessability</h3>
        <hr>
        <div class="text-dentiq-body-small text-dentiq-muted-darker flex-wrap gap-1 flex">
            <h3 v-for="(service, index) in services" :key="index" class=" px-2 py-1 rounded-md bg-dentiq-muted-light w-fit">{{ service.name }}</h3>
        </div>
      </div>
  
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref } from "vue";
  
  let services = ref([
    { name: "Dentist", selected: false },
    { name: "Orthodontist", selected: false },
    { name: "Endodontist", selected: false },
    { name: "Oral Surgeon", selected: false },
    { name: "Pediatric Dentist", selected: false },
    { name: "Periodontist", selected: false },
    { name: "Prosthodontist", selected: false }
  ]);
  </script>
  