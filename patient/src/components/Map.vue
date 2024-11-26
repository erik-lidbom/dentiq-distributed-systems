<template>
  <GoogleMap
    :api-key="googleMapsApiKey"
    :map-id="googleMapId"
    style="width: 100%;"
    :center="center"
    :zoom="15"
    :zoom-control="mapOptions.zoomControl"
    :map-type-control="mapOptions.mapTypeControl"
    :fullscreen-control="mapOptions.fullscreenControl"
    :street-view-control="mapOptions.streetViewControl"
  >
    <!-- Custom Markers -->
    <CustomMarker
      v-for="clinic in clinics"
      :key="clinic.id"
      :options="{ position: { lng: clinic.lng, lat: clinic.lat }, anchorPoint: 'BOTTOM_CENTER' }"
      @click="showInfoWindow(clinic)"
    >
      <div
        class="flex justify-center items-center border-dentiq-background-secondary border-4 bg-dentiq-muted-lightest rounded-full shadow-xl w-[60px] h-[60px]"
      >
        <img src="/public/svgs/logo-dark.svg" width="30" height="30" />
      </div>

      <!-- InfoWindow displayed for the active marker -->
      <div
        v-if="activeClinic && activeClinic.id === clinic.id"
        class="absolute z-50"
        style="transform: translate(-50%, -100%);"
      >
        <CustomMapCard :clinic="clinic" />
      </div>
    </CustomMarker>
  </GoogleMap>
</template>

<script setup>
import { ref } from "vue";
import { GoogleMap, CustomMarker } from "vue3-google-map";
import CustomMapCard from "./ClinicMapCard.vue";

// Map Center
const center = { lat: 57.7089, lng: 11.9746 };

// Map Options
const mapOptions = {
  mapTypeControl: false, // Disable map/satellite toggle
  fullscreenControl: false, // Disable fullscreen control
  streetViewControl: false, // Disable person logo for Street View
  zoomControl: false, // Enable or disable zoom controls (optional)
  rotateControl: false, // Disable rotate control
};

// API Key from environment variable
const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const googleMapId = import.meta.env.VITE_GOOGLE_MAP_ID;

// Clinic Mock Data
const clinics = ref([
  {
    id: 1,
    image: null,
    name: "Dentiq Clinic",
    lat: 57.7089,
    lng: 11.9746,
    address: "123 Main St",
    firstAvailableTime: "2024 Dec 19",
    services: ["Dentist", "Orthodontist", "Endodontist"],
  },
  {
    id: 2,
    image: null,
    name: "Smile Dental",
    lat: 57.7001,
    lng: 11.9668,
    address: "456 Elm St",
    phone: "031 654 321",
    firstAvailableTime: "2024 Dec 23",
    services: ["Dentist", "Orthodontist", "Endodontist", "Oral Surgeon", "Pediatric Dentist", "Periodontist", "Prosthodontist"],
  },
]);

// Active Clinic
const activeClinic = ref(null);

// Show InfoWindow
function showInfoWindow(clinic) {
  activeClinic.value = clinic;
  console.log("Active clinic:", activeClinic.value);
}

// Close InfoWindow
function closeInfoWindow() {
  activeClinic.value = null;
}
</script>