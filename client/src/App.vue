<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import axios from 'axios'
import { logout } from '@/utils/helpers'
import { onMounted, ref } from 'vue'

const BASE_URL = import.meta.env.VITE_API_GATEWAY

const router = useRouter()
const sessionId = ref<string | null>(null)
const userId = ref<string | null>(null)
const isLoading = ref(true) // Controls whether the application is loading

onMounted(async () => {
  try {
    sessionId.value = new URLSearchParams(window.location.search).get('sessionId')

    userId.value = window.location.pathname.split('/')[1]

    if (userId.value) {
      localStorage.setItem('userId', userId.value)
    }

    if (sessionId.value) {
      const response = await axios.post(`${BASE_URL}/auth/validate-session`, {
        sessionId: sessionId.value,
      })

      const token = response.data.token

      if (token) {
        localStorage.setItem('token', token)

        // Remove sessionId and userId from URL
        router.replace({ query: {}, path: '/' })
      } else {
        console.warn('Token or refreshToken missing from response')
      }
    } else {
      console.warn('Missing userId or sessionId')
    }
  } catch (error) {
    console.error('Error during authentication:', error)
    logout()
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <RouterView />
</template>
