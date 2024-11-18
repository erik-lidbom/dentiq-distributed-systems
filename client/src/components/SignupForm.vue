<template>
  <div class="flex flex-col gap-14">
    <SignupHeader />
    <form @submit.prevent="validateForm" class="flex flex-col gap-2 w-full">
      <div class="w-full relative lg:px-9">
        <font-awesome-icon
          icon="fa-solid fa-user"
          class="absolute lg:left-14 left-4 top-1/2 transform -translate-y-1/2 text-dentiqGray"
        />
        <input
          v-model="form.fullname"
          class="w-full rounded-2xl bg-dentiqLightGray lg:pl-12 pl-9 py-3 text-dentiqGray placeholder:text-dentiqGray bg-opacity-30"
          type="text"
          placeholder="Full Name"
          required
        />
      </div>
      <p class="text-red-400 text-sm lg:px-9" v-if="errors.fullname">{{ errors.fullname }}</p>
      <div class="w-full relative lg:px-9">
        <font-awesome-icon
          icon="fa-solid fa-shield-halved"
          class="absolute lg:left-14 left-4 top-1/2 transform -translate-y-1/2 text-dentiqGray"
        />
        <input
          v-model="form.personnummer"
          class="w-full rounded-2xl bg-dentiqLightGray lg:pl-12 pl-9 py-3 text-dentiqGray placeholder:text-dentiqGray bg-opacity-30"
          type="text"
          placeholder="Personal number"
          required
        />
      </div>
      <p class="text-red-400 text-sm lg:px-9" v-if="errors.personnummer">
        {{ errors.personnummer }}
      </p>
      <div class="w-full relative lg:px-9">
        <font-awesome-icon
          icon="fa-solid fa-envelope"
          class="absolute lg:left-14 left-4 top-1/2 transform -translate-y-1/2 text-dentiqGray"
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
      <div class="w-full flex lg:flex-row flex-col gap-2 lg:px-9 h-20">
        <div class="w-full relative">
          <div class="relative">
            <font-awesome-icon
              icon="fa-solid fa-lock"
              class="absolute left-5 top-1/2 transform -translate-y-1/2 text-dentiqGray"
            />
            <input
              v-model="form.password"
              class="w-full rounded-2xl bg-dentiqLightGray text-dentiqGray py-3 pl-11 placeholder:text-dentiqGray bg-opacity-30"
              type="password"
              placeholder="Password"
              required
            />
          </div>
          <p class="text-red-400 text-sm" v-if="errors.password">
            {{ errors.password }}
          </p>
        </div>

        <div class="w-full relative">
          <div class="relative">
            <font-awesome-icon
              icon="fa-solid fa-lock"
              class="absolute left-5 top-1/2 transform -translate-y-1/2 text-dentiqGray"
            />
            <input
              v-model="form.confirmPassword"
              class="w-full rounded-2xl bg-dentiqLightGray text-dentiqGray py-3 pl-11 placeholder:text-dentiqGray bg-opacity-30"
              type="password"
              placeholder="Confirm password"
              required
            />
          </div>
          <p class="text-red-400 text-sm" v-if="errors.confirmPassword">
            {{ errors.confirmPassword }}
          </p>
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
        @click="onSubmit"
        class="w-full rounded-xl bg-dentiqBtnBlue text-white font-thin py-3 hover:bg-opacity-30 transition-all duration-300"
        placeholder="Confirm password"
      >
        Create Account
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SignupHeader from './SignupHeader.vue'

// Signup form Type
type SignupForm = {
  fullname: string
  personnummer: string
  email: string
  password: string
  confirmPassword: string
}

// Initialize Form Reference
const form = ref<SignupForm>({
  fullname: '',
  personnummer: '',
  email: '',
  password: '',
  confirmPassword: '',
})

// Initialize Error Reference
const errors = ref({
  fullname: '',
  personnummer: '',
  email: '',
  password: '',
  confirmPassword: '',
})

// Validates the form input. If any errors occur, the function will set error messages to the error reference. This errors will then be displayed at the screen. The function also returns a boolean, that we use during submission.
const validateForm = (): boolean => {
  let isValid = true

  errors.value = {
    fullname: '',
    personnummer: '',
    email: '',
    password: '',
    confirmPassword: '',
  }

  if (!form.value.fullname) {
    errors.value.fullname = 'Full Name is required.'
    isValid = false
  }
  if (!form.value.personnummer) {
    errors.value.personnummer = 'Personal number is required.'
    isValid = false
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
  if (!form.value.confirmPassword) {
    errors.value.confirmPassword = 'Confirm password is required.'
    isValid = false
  } else if (form.value.password !== form.value.confirmPassword) {
    errors.value.confirmPassword = 'Passwords do not match.'
    isValid = false
  }
  return isValid
}

const onSubmit = () => {
  const res: boolean = validateForm()

  if (!res) return

  // TODO --> Add valid form submission logic here
}
</script>
