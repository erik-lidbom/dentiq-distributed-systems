<template>
  <GoogleMap
    api-key="AIzaSyD2mhiM4-Oem9ysJpOmYwYXJrHqv15aJ9s"
    map-id="308fb395aaafab13"
    style="width: 100%"
    :center="center"
    :zoom="15"
  >
    <CustomMarker v-for="clinic in clinics" :options="{ position: { lng : clinic.lng, lat: clinic.lat}, anchorPoint: 'BOTTOM_CENTER' }" @click="showInfoWindow(clinic)">
      <div class="flex justify-center items-center border-dentiq-background-secondary border-4 bg-dentiq-muted-lightest rounded-full shadow-xl w-[60px] h-[60px] ">
        <img src="/public/svgs/logo-dark.svg" width="30" height="30"/>
      </div>
    </CustomMarker>

    <div
      v-if="activeClinic"
      class="bg-white p-4 rounded shadow-lg w-fit absolute top-1"
      :style="infoWindowStyle"
    >
      <CustomMapCard :clinic="activeClinic" />
    </div>
  </GoogleMap>
</template>

<script setup>
import { ref, nextTick, computed } from "vue";
import { GoogleMap, CustomMarker } from "vue3-google-map";
import CustomMapCard from "./ClinicMapCard.vue";

const center = { lat: 57.7089, lng: 11.9746 };
const clinics = ref([
  {
    id: 1,
    name: "Dentiq Clinic",
    lat: 57.7089,
    lng: 11.9746,
    address: "123 Main St",
    phone: "031 123 456",
  },
  {
    id: 2,
    name: "Smile Dental",
    lat: 57.7001,
    lng: 11.9668,
    address: "456 Elm St",
    phone: "031 654 321",
  },
]);

const activeClinic = ref(null);
const infoWindowPosition = ref({ x: 0, y: 0 });
const googleMap = ref(null);


async function showInfoWindow(clinic) {
  console.log("Clinic clicked:", clinic);
  activeClinic.value = clinic;

  await nextTick();

  const map = googleMap.value?.$mapObject;
  if (!map || !google.maps) {
    console.warn("Map or Google Maps object is not ready.");
    return;
  }

  const position = new google.maps.LatLng(clinic.lat, clinic.lng);
  const overlay = new google.maps.OverlayView();
  overlay.onAdd = () => {};
  overlay.draw = () => {};
  overlay.setMap(map);

  const projection = overlay.getProjection();
  if (projection) {
    const pixelPosition = projection.fromLatLngToDivPixel(position);
    if (pixelPosition) {
      infoWindowPosition.value = {
        x: pixelPosition.x || 0,
        y: pixelPosition.y || 0,
      };
    } else {
      console.warn("Invalid pixel position for clinic:", clinic);
    }
  } else {
    console.warn("Projection is not ready.");
  }
}

function closeInfoWindow() {
  activeClinic.value = null;
}

const infoWindowStyle = computed(() => ({
  position: "absolute",
  transform: "translate(-50%, -100%)",
  left: `${infoWindowPosition.value.x}px`,
  top: `${infoWindowPosition.value.y}px`,
}));
</script>

<style>
.info-window {
  position: absolute;
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 100;
}
</style>
