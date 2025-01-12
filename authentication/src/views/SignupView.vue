<template>
  <main>
    <div class="w-full bg-custom-gradient h-screen flex">
      <div class="lg:w-3/5 w-full flex flex-col items-center justify-center gap-10 px-10">
        <div class="flex items-center justify-center gap-2">
          <img src="../assets/dentiq_logo.svg" alt="Dentiq logo" class="w-[30px] h-auto" />
          <p class="font-bold text-white text-2xl">DentiQ</p>
        </div>
        <SignupForm />
      </div>
      <DentiQBanner />
    </div>
  </main>
</template>

<script setup lang="ts">
  import SignupForm from '../components/SignupForm.vue'
  import DentiQBanner from '../components/DentiQBanner.vue'
</script>
