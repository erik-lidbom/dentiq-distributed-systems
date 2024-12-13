<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div
      class="bg-white rounded-3xl overflow-hidden shadow-lg relative w-[75vw] md:min-w-[600px] max-w-[700px] h-fit"
    >
      <!-- Close Button -->
      <button
        class="absolute top-4 right-4 text-dentiq-muted-darker bg-dentiq-muted-lighter p-2 rounded-2xl hover:text-black hover:bg-dentiq-muted-light h-10 w-10"
        @click="closeModalInside"
      >
        ✕
      </button>
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['close']);

const closeModalInside = () => {
  emit('close');
};
</script>
