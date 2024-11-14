<template>
  <div class="flex flex-col gap-14">
    <SignupHeader />
    <form class="flex flex-col gap-2 w-full">
      <div class="w-full relative lg:px-9">
        <font-awesome-icon
          icon="fa-solid fa-user"
          class="absolute lg:left-14 left-4 top-1/2 transform -translate-y-1/2 text-dentiqGray"
        />
        <input
          class="w-full rounded-2xl bg-dentiqLightGray lg:pl-12 pl-9 py-3 text-dentiqGray placeholder:text-dentiqGray bg-opacity-30"
          type="text"
          placeholder="Full Name"
        />
      </div>
      <div class="w-full relative lg:px-9">
        <font-awesome-icon
          icon="fa-solid fa-shield-halved"
          class="absolute lg:left-14 left-4 top-1/2 transform -translate-y-1/2 text-dentiqGray"
        />
        <input
          class="w-full rounded-2xl bg-dentiqLightGray lg:pl-12 pl-9 py-3 text-dentiqGray placeholder:text-dentiqGray bg-opacity-30"
          type="text"
          placeholder="Personnummer"
        />
      </div>
      <div class="w-full relative lg:px-9">
        <font-awesome-icon
          icon="fa-solid fa-envelope"
          class="absolute lg:left-14 left-4 top-1/2 transform -translate-y-1/2 text-dentiqGray"
        />
        <input
          class="w-full rounded-2xl bg-dentiqLightGray lg:pl-12 pl-9 py-3 text-dentiqGray placeholder:text-dentiqGray bg-opacity-30"
          type="text"
          placeholder="Email"
        />
      </div>
      <div class="w-full flex lg:flex-row flex-col items-center justify-center gap-2 lg:px-9">
        <div class="w-full relative">
          <font-awesome-icon
            icon="fa-solid fa-lock"
            class="absolute left-5 top-1/2 transform -translate-y-1/2 text-dentiqGray"
          />
          <input
            class="w-full rounded-2xl bg-dentiqLightGray text-dentiqGray py-3 pl-11 placeholder:text-dentiqGray bg-opacity-30"
            type="password"
            placeholder="Password"
          />
        </div>
        <div class="w-full relative">
          <font-awesome-icon
            icon="fa-solid fa-lock"
            class="absolute left-5 top-1/2 transform -translate-y-1/2 text-dentiqGray"
          />
          <input
            class="w-full rounded-2xl bg-dentiqLightGray text-dentiqGray py-3 pl-11 placeholder:text-dentiqGray bg-opacity-30"
            type="password"
            placeholder="Confirm password"
          />
        </div>
      </div>
    </form>

    <div class="w-full flex flex-col gap-5 lg:px-9">
      <div class="flex items-center justify-start font-thin gap-2">
        <p class="text-dentiqGray">Already have an account?</p>
        <router-link
          to="/login"
          class="text-dentiqLightBlue hover:text-opacity-30 transition-all duration-300"
        >
          Log in
        </router-link>
      </div>
      <button
        class="w-full rounded-xl bg-dentiqBtnBlue text-white font-thin py-3 hover:bg-opacity-30 transition-all duration-300"
        type="password"
        placeholder="Confirm password"
      >
        Create Account
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import SignupHeader from './SignupHeader.vue'
</script>
