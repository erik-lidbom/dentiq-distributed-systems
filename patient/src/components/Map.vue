<template>
  <Filter v-if="!isMobile || showFilter" @close="closeFilter" @update:services="filterClinics" />
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
    <CustomMarker
      v-for="clinic in filteredClinics"
      :key="clinic.id"
      :options="{ position: { lng: clinic.lng, lat: clinic.lat }, anchorPoint: 'BOTTOM_CENTER' }"
      @click="showInfoWindow(clinic)"
    >
      <!-- Marker Icon -->
      <div
        class="flex justify-center items-center border-dentiq-background-secondary border-4 bg-dentiq-muted-lightest rounded-full shadow-xl w-[60px] h-[60px]"
      >
        <img src="/svgs/logo-dark.svg" width="30" height="30" />
      </div>
      <!-- InfoWindow displayed for the active marker -->
      <div
        v-if="activeClinic && activeClinic.id === clinic.id"
        class="absolute z-50"
        style="transform: translate(-50%, -100%);"
        @click.stop
      >
        <CustomMapCard :clinic="clinic" />
      </div>
    </CustomMarker>
    <!-- Filter Button in mobile Only -->
    <button
      v-if="isMobile && !showFilter"
      @click="toggleFilter"
      class="fixed bottom-9 h-[48px] w-[100px] left-1/2 transform -translate-x-1/2 bg-dentiq-button-primary text-white font-bold py-2 px-6 rounded-lg z-50"
    >
      Filter
    </button>
  </GoogleMap>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { GoogleMap, CustomMarker } from "vue3-google-map";
import CustomMapCard from "./ClinicMapCard.vue";
import Filter from "./Filter.vue";
import { fetchClinics } from "@/services/clinicService";

// Google Maps Center
const center = { lat: 57.7089, lng: 11.9746 };
// Google Maps Options
const mapOptions = {
  mapTypeControl: false,
  fullscreenControl: false,
  streetViewControl: false,
  zoomControl: false,
  rotateControl: false,
};
// Google Maps API Key
const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const googleMapId = import.meta.env.VITE_GOOGLE_MAP_ID;
// Track filter status
const showFilter = ref(false);
// Track mobile status
const isMobile = ref(window.innerWidth < 630);
// Track clinics
const clinics = ref([]);
// Track active clinic
const activeClinic = ref(null);
// Track selected services
const selectedServices = ref([]); 

// Function to update the mobile status
function updateIsMobile() {
  isMobile.value = window.innerWidth < 640;
}

// Add event listeners on mount and remove on unmount
onMounted(() => {
  window.addEventListener("resize", updateIsMobile);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateIsMobile);
});

onMounted(async () => {
  try{
    const response = await fetchClinics();
    
    clinics.value = response;
  } catch (error) {
    console.error(error)} 
  }
);


// Functions to toggle and close the filter
function toggleFilter() {
  showFilter.value = !showFilter.value;
}

// Function to close the filter
function closeFilter() {
  showFilter.value = false;
}

// Filter clinics based on selected services
const filteredClinics = computed(() => {
  // Show all clinics if no filters are selected
  if (selectedServices.value.length === 0) return clinics.value; 
  return clinics.value.filter((clinic) =>
    clinic.services.some((service) => selectedServices.value.includes(service))
  );
});

const filterClinics = (services) => {
  // Update selected services
  selectedServices.value = services; 
}

// Function to show the info window
const showInfoWindow = (clinic) => {
  if(activeClinic.value && activeClinic.value.id === clinic.id) {
    activeClinic.value = null;
    return;
  }
  activeClinic.value = clinic;
  console.log("Active clinic:", activeClinic.value);
}
</script>
