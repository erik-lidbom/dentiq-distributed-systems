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
import { TOPICS } from '@/mqtt/topics.ts';
import { client, mqttClient } from '@/mqtt/mqtt.ts';

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
const modalIsOpen = ref(false);

// Fetch clinics and appointments on mount
const clinicStore = useClinicStore();
const dentistStore = useDentistStore();
const appointmentStore = useAppointmentStore();

// Computed appointments
const appointments = computed(() => appointmentStore.appointments);

// Track if data is being fetched
let isFetching = false;

// Watch for changes in appointments
watch(
  () => appointments.value,
  async (newAppointments, oldAppointments) => {
    console.log('Appointments changed, refetching data');

    // Avoid unnecessary refetches
    if (JSON.stringify(newAppointments) === JSON.stringify(oldAppointments)) {
      console.log('No significant changes in appointments, skipping refetch.');
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

// Function to fetch and aggregate data
const fetchAndAggregateData = async () => {
  if (isFetching) return;
  isFetching = true;

  try {
    const appointmentsData = await fetchAppointments();
    const clinicsData = await fetchClinics();
    const dentistsData = await fetchDentists();

    // Set data in stores
    clinicStore.setClinics(clinicsData.data.clinics);
    dentistStore.setDentists(dentistsData.data.data);
    appointmentStore.setAppointments(appointmentsData.data.data);

    // Aggregate data
    clinics.value = aggregateClinicData(
      clinicStore.clinics,
      dentistStore.dentists,
      appointmentStore.appointments
    );
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    isFetching = false;
  }
};

onMounted(async () => {
  // Initial data fetch
  await fetchAndAggregateData();

  // Setup MQTT client
  await mqttClient.setup();

  // Listen for booking and cancellation notifications
  client.on('message', async (topic, message) => {
    if (
      topic === TOPICS.SUBSCRIBE.NOTIFICATION_BOOKED_SLOT ||
      topic === TOPICS.SUBSCRIBE.NOTIFICATION_CANCELLED_SLOT
    ) {
      console.log(`[MQTT]: Refetching data due to ${topic}`);
      await fetchAndAggregateData();
    }
  });
});

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
  console.log('Active clinic:', activeClinic.value);
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
