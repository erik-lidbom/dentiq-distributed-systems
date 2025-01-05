<template>
  <div
    class="z-50 flex items-center justify-center bg-black bg-opacity-50"
    :class="isMobile ? 'w-screen h-screen fixed inset-0' : 'fixed inset-0'"
    tabindex="0"
    role="dialog"
    aria-modal="true"
  >
    <div
      class="bg-white overflow-hidden shadow-lg relative"
      :class="
        isMobile
          ? 'w-full h-full rounded-none'
          : 'w-[75vw] md:min-w-[600px] max-w-[700px] h-fit rounded-3xl'
      "
    >
      <!-- Close Button -->
      <button
        class="absolute text-dentiq-muted-darker bg-dentiq-muted-lighter p-4 rounded-2xl hover:text-black hover:bg-dentiq-muted-light"
        :class="isMobile ? 'top-4 right-4' : 'top-4 right-4'"
        @click="closeModalInside"
        type="button"
        aria-label="Close modal"
      >
        ✕
      </button>
      <div
        class="flex flex-col h-full"
        :class="isMobile ? 'px-4 py-6' : 'px-8 py-6'"
      >
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['close']);

// Reactive state for screen size
const isMobile = ref(window.innerWidth < 768);

// Update `isMobile` value on window resize
const updateIsMobile = () => {
  isMobile.value = window.innerWidth < 768;
};

// Ref to track the dropdown wrapper
const dropdownWrapper = (ref < HTMLElement) | (null > null);

const closeModalInside = () => {
  emit('close');
};
</script>
