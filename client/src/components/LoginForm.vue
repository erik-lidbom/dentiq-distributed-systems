<template>
    <div class="w-full lg:w-3/5 h-full flex flex-col justify-center items-center">
        <div class="flex flex-col border border-green-400 w-3/5 h-auto">
            <!-- DentiQ logo + title --> 
            <div class="flex items-center justify-center gap-2 m-10">
                <img src="../assets/dentiq_logo.svg" alt="Dentiq logo" class="w-[30px] h-auto" />
                <p class="font-bold text-white text-2xl">DentiQ</p>
            </div>
            <!-- Welcome header --> 
            <div class="flex flex-col items-center justify-center gap-2">
                <p class="font-bold text-white text-3xl text-center">Welcome Back</p>
                <p class="text-dentiqGray text-xl text-center"> Please log in to your account</p>
            </div>
            <!-- Fields section --> 
            <form @submit.prevent="validateForm" div class="py-12 gap-2 flex flex-col w-full border">
                <div class="w-full relative">
                    <font-awesome-icon icon='fa-solid fa-envelope' class="absolute lg:left-4 left-4 top-1/2 transform -translate-y-1/2 text-dentiqGray"/>
                    <input v-model="form.email" class="w-full rounded-2xl bg-dentiqLightGray lg:pl-12 pl-9 py-3 text-dentiqGray placeholder:text-dentiqGray bg-opacity-30" type="email" placeholder="Email" required />
                </div>
                <p class="text-red-400 text-sm lg:px-9" v-if="errors.email">{{ errors.email }}</p>
                <div class="w-full relative">
                    <font-awesome-icon icon='fa-solid fa-lock' class="absolute lg:left-4 left-4 top-1/2 transform -translate-y-1/2 text-dentiqGray"/>
                    <input v-model="form.password" class="w-full rounded-2xl bg-dentiqLightGray lg:pl-12 pl-9 py-3 text-dentiqGray placeholder:text-dentiqGray bg-opacity-30" type="password" placeholder="Password" required />
                    <p class="text-red-400 text-sm lg:px-9" v-if="errors.password">{{ errors.password }}</p>
                </div>
                <button type="submit" class="w-full rounded-xl bg-dentiqBtnBlue text-white font-thin py-3 hover:bg-opacity-30 transition-all duration-300 mt-10">Log In </button>
            </form>  
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

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
</script>
