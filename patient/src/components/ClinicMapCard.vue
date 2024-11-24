<template>
    <div class="bg-white p-4 rounded shadow-lg">
      <!-- Placeholder Image -->
      <div class="flex flex-row items-center">
        <img
          :src="defaultPlaceholder"
          alt="Placeholder Image"
          class="w-20 h-20 rounded-full mr-4"
        />
        <div class="flex flex-col">
          <h1 class="text-xl font-bold">{{ clinic.name }}</h1>
          <p class="flex items-center text-gray-700">
            <font-awesome-icon :icon="['fas', 'map-marker-alt']" class="mr-2" />
            {{ clinic.address }}
          </p>
          <p class="flex items-center text-gray-700">
            <font-awesome-icon :icon="['fas', 'phone']" class="mr-2" />
            {{ clinic.phone }}
          </p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineProps } from "vue";
  import { library } from "@fortawesome/fontawesome-svg-core";
  import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
  import { faMapMarkerAlt, faPhone } from "@fortawesome/free-solid-svg-icons";
  
  // Add icons to the library
  library.add(faMapMarkerAlt, faPhone);
  
  // Props
  defineProps({
    clinic: {
      type: Object,
      required: true,
    },
  });
  
  const defaultPlaceholder = new URL(
    "@/../public/svgs/user-avatar.svg",
    import.meta.url
  ).href;
  </script>
  