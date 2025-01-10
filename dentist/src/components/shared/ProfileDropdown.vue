<template>
  <div class="relative" ref="dropdownWrapper">
    <!-- User Avatar -->
    <div class="relative h-fit w-fit">
      <div
        @click="toggleDropdownVisibility"
        class="flex w-fit pl-3 justify-center items-center cursor-pointer text-dentiq-muted-darker hover:bg-dentiq-muted-lighter rounded-xl"
      >
        <div class="flex flex-row items-center space-x-2">
          <div class="hidden sm:flex flex-col text-right">
            <p class="text-dentiq-text-dark font-normal text-dentiq-body-small">
              {{ user.name }}
            </p>
            <p
              class="text-dentiq-muted-default font-normal text-dentiq-body-small"
            >
              {{ user.speciality }}
            </p>
          </div>
          <img
            src="/svgs/user-avatar.svg"
            alt="User"
            class="h-[60px] w-[60px] border-4 rounded-full"
          />
        </div>
      </div>
    </div>

    <!-- User Dropdown Options -->
    <div
      v-if="isOpen"
      class="absolute top-[6px] -right-24 min-[400px]:right-0 p-1 sm:w-72 w-[290px] bg-white shadow-md rounded-xl mt-16 z-50 overflow-hidden"
    >
      <button
        @click="handleLogOut"
        class="hover:bg-dentiq-danger-light text-dentiq-danger-default text-start w-full h-[48px] px-3 rounded-lg text-dentiq-body-small"
      >
        Log out
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { logout } from '@/utils/helpers';
import { useDentistStore } from '@/stores';

// State for visibility of the dropdown
const isOpen = ref(false);

// Ref to track the dropdown wrapper
const dropdownWrapper = ref<HTMLElement | null>(null);

// Toggle visibility of the dropdown
const toggleDropdownVisibility = () => {
  isOpen.value = !isOpen.value;
};

// Fetch user data
const dentistStore = useDentistStore();

// Use a computed property for reactive user data
const user = computed(() => ({
  name: dentistStore.dentist?.name || 'Loading Name...',
  speciality: dentistStore.dentist?.speciality || 'Specialty',
}));

const handleLogOut = () => {
  isOpen.value = false;
  logout();
};

// Function to handle clicks outside the dropdown
const handleClickOutside = (event: MouseEvent) => {
  if (
    dropdownWrapper.value &&
    !dropdownWrapper.value.contains(event.target as Node)
  ) {
    isOpen.value = false;
  }
};

onMounted(() => {
  // Attach the outside click listener
  console.log('dentistStore: ', dentistStore.dentist);
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  // Detach the outside click listener
  document.removeEventListener('click', handleClickOutside);
});
</script>
