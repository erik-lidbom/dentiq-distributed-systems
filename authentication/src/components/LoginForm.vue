<template>
  <div class="w-full lg:w-3/5 h-full flex flex-col justify-center items-center">
    <div class="flex flex-col w-3/5 h-auto">
      <!-- DentiQ logo + title -->
      <div class="flex items-center justify-center gap-2 m-10">
        <img src="../assets/dentiq_logo.svg" alt="Dentiq logo" class="w-[30px] h-auto" />
        <p class="font-bold text-white text-2xl">DentiQ</p>
      </div>
      <!-- Welcome header -->
      <div class="flex flex-col items-center justify-center gap-2">
        <p class="font-bold text-white text-3xl text-center">Welcome Back</p>
        <p class="text-dentiqGray text-xl text-center">Please log in to your account</p>
      </div>
      <!-- Fields section -->
      <form @submit.prevent="validateForm" div class="py-12 gap-2 flex flex-col w-full">
        <div class="w-full relative">
          <font-awesome-icon
            icon="fa-solid fa-envelope"
            class="absolute lg:left-4 left-4 top-1/2 transform -translate-y-1/2 text-dentiqGray"
          />
          <input
            v-model="form.email"
            class="w-full rounded-2xl bg-dentiqLightGray lg:pl-12 pl-9 py-3 text-dentiqGray placeholder:text-dentiqGray bg-opacity-30"
            type="email"
            placeholder="Email"
            required
          />
        </div>
        <p class="text-red-400 text-sm lg:px-9" v-if="errors.email">{{ errors.email }}</p>
        <div class="w-full relative">
          <font-awesome-icon
            icon="fa-solid fa-lock"
            class="absolute lg:left-4 left-4 top-1/2 transform -translate-y-1/2 text-dentiqGray"
          />
          <input
            v-model="form.password"
            class="w-full rounded-2xl bg-dentiqLightGray lg:pl-12 pl-9 py-3 text-dentiqGray placeholder:text-dentiqGray bg-opacity-30"
            type="password"
            placeholder="Password"
            required
          />
          <p class="text-red-400 text-sm lg:px-9" v-if="errors.password">{{ errors.password }}</p>
        </div>
        <!-- Button -->
        <div class="flex flex-col mt-10 gap-2 font-thin">
          <p class="text-dentiq-gray text-dentiqGray text-right">Forgot password?</p>
          <button
            @click="onSubmit"
            type="submit"
            class="w-full rounded-xl bg-dentiqBtnBlue text-white py-3 hover:bg-opacity-30 transition-all duration-300"
          >
            Log In
          </button>
          <div class="flex flex row gap-2">
            <p class="text-dentiqGray">New to DentiQ?</p>
            <router-link
              to="/signup"
              class="relative text-dentiqLightBlue transition-all duration-300 hover:after:w-full after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-dentiqLightBlue after:transition-all after:duration-300"
            >
              Join now</router-link
            >
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios, { AxiosError, type AxiosResponse } from 'axios'
import { ref } from 'vue'

const BASE_URL = import.meta.env.VITE_API_GATEWAY
const PATIENT_URL = import.meta.env.VITE_PATIENT_URL
const DENTIST_URL = import.meta.env.VITE_DENTIST_URL

// Signup form Type
type SignupForm = {
  email: string
  password: string
}

// Initialize Form Reference
const form = ref<SignupForm>({
  email: '',
  password: '',
})

// Initialize Error Reference
const errors = ref({
  email: '',
  password: '',
})

// Email validation and error handling
const validateForm = (): boolean => {
  let isValid = true

  errors.value = {
    email: '',
    password: '',
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!form.value.email) {
    errors.value.email = 'Email is required.'
    isValid = false
  } else if (!emailPattern.test(form.value.email)) {
    errors.value.email = 'Invalid email address.'
    isValid = false
  }

  if (!form.value.password) {
    errors.value.password = 'Password is required.'
    isValid = false
  }
  return isValid
}

const onSubmit = async () => {
  const res: boolean = validateForm()

  if (!res) return
  await axios
    .post(`${BASE_URL}/auth/login`, form.value)
    .then((response: AxiosResponse) => {
      const { sessionId, userId, userRole } = response.data.data
      switch (userRole) {
        case 'patient':
          window.location.href = `${PATIENT_URL}/${userId}/?sessionId=${sessionId}`
          break
        case 'dentist':
          window.location.href = `${DENTIST_URL}/${userId}/?sessionId=${sessionId}`
          break
        default:
      }
    })
    .catch((error: AxiosError) => {
      console.log(error)
    })
}
</script>
