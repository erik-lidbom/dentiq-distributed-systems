<template>
    <div class="w-full lg:w-3/5 h-full flex flex-col justify-center items-center">
        <div class="flex flex-col border border-green-400 w-auto h-auto">
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
            <div class="py-12 gap-2 flex flex-col">
                <div class="w-[500px] relative lg:px-9">
                    <font-awesome-icon icon='fa-solid fa-envelope' class="absolute lg:left-14 left-4 top-1/2 transform -translate-y-1/2 text-dentiqGray"/>
                    <input v-model="form.email" class="w-full rounded-2xl bg-dentiqLightGray lg:pl-12 pl-9 py-3 text-dentiqGray placeholder:text-dentiqGray bg-opacity-30" type="email" placeholder="Email" required />
                </div>
                <div class="w-[500px] relative lg:px-9">
                    <font-awesome-icon icon='fa-solid fa-lock' class="absolute lg:left-14 left-4 top-1/2 transform -translate-y-1/2 text-dentiqGray"/>
                    <input v-model="form.password" class="w-full rounded-2xl bg-dentiqLightGray lg:pl-12 pl-9 py-3 text-dentiqGray placeholder:text-dentiqGray bg-opacity-30" type="password" placeholder="Password" required />
                </div>
            </div>
            
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

</script>
