<template>
  <div class="flex flex-col justify-between h-full rounded-2xl p-6 min-[630px]:w-[250px] space-y-8 bg-dentiq-muted-lightest absolute min-[630px]:relative right-0 left-0 top-0 bottom-0 z-50 w-full">
    <div class="space-y-6">
      <!-- Header -->
      <div>
        <h2 class="text-dentiq-h4 font-semibold text-dentiq-muted-darkest">Filter by</h2>
      </div>

      <!-- Services List -->
      <div class="flex flex-col space-y-4">
        <h3 class="text-dentiq-body font-semibold text-dentiq-muted-darkest">Services</h3>
        <hr />
        <div class="text-dentiq-body-small text-dentiq-muted-darker flex-wrap gap-1 flex">
          <h3
            v-for="(service, index) in services"
            :key="index"
            :class="[
              'px-2 py-1 rounded-md w-fit',
              service.selected || selectedServices.includes(service.name)
                ? 'bg-dentiq-button-primary text-white'
                : 'bg-dentiq-muted-light text-dentiq-muted-darker'
            ]"
            @click="toggleService(service)"
          >
            {{ service.name }}
          </h3>
        </div>
      </div>
    </div>

    <!-- Apply Button -->
    <div v-if="isMobile">
      <button
        @click="$emit('close')"
        class="bg-dentiq-button-primary text-white font-semibold text-dentiq-h4 py-2 px-4 rounded-lg w-full"
      >
        Close
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineEmits, onMounted } from "vue";

// Retrieve selected services from localStorage
let savedServices = JSON.parse(localStorage.getItem("selectedServices") || "[]");

// Services Data
const services = ref([
  { name: "Dentist", selected: savedServices.includes("Dentist") },
  { name: "Orthodontist", selected: savedServices.includes("Orthodontist") },
  { name: "Endodontist", selected: savedServices.includes("Endodontist") },
  { name: "Oral Surgeon", selected: savedServices.includes("Oral Surgeon") },
  { name: "Pediatric Dentist", selected: savedServices.includes("Pediatric Dentist") },
  { name: "Periodontist", selected: savedServices.includes("Periodontist") },
  { name: "Prosthodontist", selected: savedServices.includes("Prosthodontist") },
]);

const selectedServices = ref(savedServices);

const emit = defineEmits(["close", "update:services"]);

const isMobile = ref(window.innerWidth < 630);

// Function to update the mobile status
function updateIsMobile() {
  isMobile.value = window.innerWidth < 630;
}

// Emit selected services as an array
function toggleService(service: { name: string; selected: boolean }) {
  service.selected = !service.selected;

  // Update selected services
  if (service.selected) {
    if (!selectedServices.value.includes(service.name)) {
      selectedServices.value.push(service.name);
    }
  } else {
    selectedServices.value = selectedServices.value.filter((name) => name !== service.name);
  }

  // Emit the updated array
  emit("update:services", selectedServices.value);

  // Save to localStorage
  localStorage.setItem("selectedServices", JSON.stringify(selectedServices.value));

  console.log("Updated Selected Services:", selectedServices.value);
}

// Add event listeners on mount and remove on unmount
window.addEventListener("resize", updateIsMobile);
onMounted(() => {
  // Sync services with localStorage on mount
  services.value.forEach((service) => {
    service.selected = savedServices.includes(service.name);
  });
});
</script>
