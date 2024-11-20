<script setup lang="ts">
import SignupForm from '../components/SignupForm.vue'
</script>

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
      <div class="lg:w-2/5 p-9 lg:block hidden">
        <div
          class="w-full h-full rounded-lg bg-[#081C3D] bg-opacity-20 flex flex-col items-center justify-center gap-12 px-10"
        >
          <img src="../assets/dentiq_logo.svg" alt="Dentiq logo" class="w-[250px] h-auto" />
          <div class="flex flex-col items-center justify-center">
            <p class="text-2xl font-bold text-white">Your Smile, Our Priority</p>
            <p class="text-2xl font-bold text-white">Effortless Booking, Expert Care</p>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
