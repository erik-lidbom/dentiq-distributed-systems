<template>
  <Filter
    v-if="!isMobile || showFilter"
    @close="closeFilter"
    @update:services="filterClinics"
  />
  <GoogleMap
    :api-key="googleMapsApiKey"
    :map-id="googleMapId"
    style="width: 100%"
    :center="center"
    :zoom="13"
    :zoom-control="mapOptions.zoomControl"
    :map-type-control="mapOptions.mapTypeControl"
    :fullscreen-control="mapOptions.fullscreenControl"
    :street-view-control="mapOptions.streetViewControl"
  >
    <CustomMarker
      v-for="clinic in filteredClinics"
      :key="clinic._id"
      :options="{
        position: { lng: clinic.lng, lat: clinic.lat },
        anchorPoint: 'BOTTOM_CENTER',
      }"
      @click="openCard(clinic)"
      @click.stop
    >
      <div
        class="flex justify-center items-center border-dentiq-background-secondary border-4 bg-dentiq-muted-lightest rounded-full shadow-xl w-[60px] h-[60px]"
      >
        <img src="/svgs/logo-dark.svg" width="30" height="30" alt="logo" />
      </div>
      <div
        v-if="activeClinic && activeClinic._id === clinic._id && !modalIsOpen"
        class="absolute z-50"
        style="transform: translate(-50%, -100%)"
        @click.stop
      >
        <CustomMapCard :clinic="clinic" @card-is-open="openModal" />
      </div>
    </CustomMarker>

    <!-- Modal -->
    <Modal v-if="modalIsOpen" @close="closeModal">
      <ClinicScheduleModal :clinic="activeClinic" />
    </Modal>

    <button
      v-if="isMobile && !showFilter"
      @click="toggleFilter"
      class="fixed bottom-9 h-[48px] w-[100px] left-1/2 transform -translate-x-1/2 bg-dentiq-button-primary text-white font-bold py-2 px-6 rounded-lg z-40"
    >
      Filter
    </button>
  </GoogleMap>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { GoogleMap, CustomMarker } from 'vue3-google-map';
import CustomMapCard from './ClinicMapCard.vue';
import ClinicScheduleModal from './ClinicScheduleModal.vue';
import Modal from '../shared/Modal.vue';
import Filter from './Filter.vue';
import {
  useAppointmentStore,
  useClinicStore,
  useDentistStore,
} from '@/stores/index.ts';
import { fetchClinics, fetchAppointments, fetchDentists } from '@/api/index.ts';
import { aggregateClinicData } from '@/utils/dataAggregator.ts';
import { client, mqttClient } from '@/mqtt/mqtt.ts';
import { initializeMqttClient } from '@/App.vue';

// Reactive States
const isLoading = ref(false);
const errorMessage = ref(null);
const clinics = ref([]);
const isMobile = ref(window.innerWidth < 630);
const showFilter = ref(false);
const activeClinic = ref(null);
const modalIsOpen = ref(false);
const selectedServices = ref([]);
const center = { lat: 57.7089, lng: 11.9746 };
const mapOptions = {
  mapTypeControl: false,
  fullscreenControl: false,
  streetViewControl: false,
  zoomControl: false,
  rotateControl: false,
};

const clinicStore = useClinicStore();
const dentistStore = useDentistStore();
const appointmentStore = useAppointmentStore();
let isFetching = false;

const appointments = computed(() => appointmentStore.appointments);

// Fetch and Aggregate Data
const fetchAndAggregateData = async () => {
  if (isFetching) return;
  isFetching = true;
  isLoading.value = true;
  errorMessage.value = null;

  try {
    // Fetch appointments
    const appointmentsData = await fetchAppointments();
    appointmentStore.setAppointments(appointmentsData.data.data);

    // Fetch clinics
    const clinicsData = await fetchClinics();
    clinicStore.setClinics(clinicsData.data.clinics);

    // Fetch dentists
    const dentistsData = await fetchDentists();
    dentistStore.setDentists(dentistsData.data.data);

    // Aggregate the data
    clinics.value = aggregateClinicData(
      clinicStore.clinics,
      dentistStore.dentists,
      appointmentStore.appointments
    );
  } catch (error) {
    console.error('Error fetching data:', error);
    errorMessage.value = 'Failed to load clinics. Please try again later.';
  } finally {
    isFetching = false;
    isLoading.value = false;
  }
};

// Watch for Appointments Changes
watch(
  () => appointments.value,
  async (newAppointments, oldAppointments) => {
    if (JSON.stringify(newAppointments) !== JSON.stringify(oldAppointments)) {
      await fetchAndAggregateData();
    }
  },
  { deep: true }
);

// Handle Initial Data Fetch
onMounted(async () => {
  await fetchAndAggregateData();

  const userId = localStorage.getItem('userId');
  if (userId) {
    await mqttClient.setup(userId);
  }
  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth < 630;
  });

  // Refetches data if a notification is received
  client.on('message', async (topic, message) => {
    console.log(`[MQTT]: Refetching data due to ${topic}`);
    await fetchAndAggregateData();
  });
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', () => {
    isMobile.value = window.innerWidth < 630;
  });
});

// Google Maps API Key
const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const googleMapId = import.meta.env.VITE_GOOGLE_MAP_ID;

// Watch for changes in appointments
watch(
  () => appointments.value,
  async (newAppointments, oldAppointments) => {
    // Avoid unnecessary refetches
    if (JSON.stringify(newAppointments) === JSON.stringify(oldAppointments)) {
      return;
    }

    try {
      await fetchAndAggregateData();
      activeClinic.value = null;
    } catch (error) {
      console.error('Error in watcher during refetch:', error);
    } finally {
      isFetching = false;
    }
  },
  { deep: true } // Watch for nested changes in appointments
);

// Function to update the mobile status
function updateIsMobile() {
  isMobile.value = window.innerWidth < 640;
}

// Add event listeners on mount and remove on unmount
onMounted(() => {
  window.addEventListener('resize', updateIsMobile);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateIsMobile);
});

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
};

// Function to show the info window
const showInfoWindow = (clinic) => {
  if (activeClinic.value && activeClinic.value.id === clinic.id) {
    activeClinic.value = null;
    return;
  }
  activeClinic.value = clinic;
};

const openCard = (clinic) => {
  modalIsOpen.value = false;
  showInfoWindow(clinic);
};

const closeModal = () => {
  modalIsOpen.value = false;
  // Clear active clinic to reset its state
  activeClinic.value = null;
};

const openModal = () => {
  modalIsOpen.value = true;
};
</script>
