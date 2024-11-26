<template>
  <div class="flex flex-row min-h-full rounded-2xl p-0 bg-dentiq-muted-lightest space-x-4 overflow-hidden relative">
    <!-- Conditional Rendering for Filter -->
    <Filter v-if="!isMobile || showFilter" @close="closeFilter" />

    <!-- Map -->
    <Map />

    <!-- Filter Button in mobile Only -->
    <button
      v-if="isMobile && !showFilter"
      @click="toggleFilter"
      class="fixed bottom-9 h-[48px] w-[100px] left-1/2 transform -translate-x-1/2 bg-dentiq-button-primary text-white font-bold py-2 px-6 rounded-lg z-50"
    >
      Filter
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import Filter from "@/components/Filter.vue";
import Map from "@/components/Map.vue";

const showFilter = ref(false);
const isMobile = ref(window.innerWidth < 630);

// Function to update the mobile status
function updateIsMobile() {
  isMobile.value = window.innerWidth < 630;
}

// Add event listeners on mount and remove on unmount
onMounted(() => {
  window.addEventListener("resize", updateIsMobile);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateIsMobile);
});

// Functions to toggle and close the filter
function toggleFilter() {
  showFilter.value = !showFilter.value;
}

function closeFilter() {
  showFilter.value = false;
}
</script>
