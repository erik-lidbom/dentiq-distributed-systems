<template>
  <div id="app" class="flex flex-col h-full bg-dentiq-background-beige p-4">
    <!-- Global Navigation Bar -->
    <header>
      <Header />
    </header>

    <!-- Main Content Area -->
    <main class="flex-1">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router';
import 'primeicons/primeicons.css';
import axios from 'axios';
import { logout } from '@/utils/helpers';
import { onBeforeMount, onMounted, ref } from 'vue';
import Header from '@/components/shared/Header.vue';
import { useDentistStore } from '@/stores';

const BASE_URL = import.meta.env.VITE_API_GATEWAY;

const router = useRouter();
const sessionId = ref<string | null>(null);
const userId = ref<string | null>(null);
const isLoading = ref(true); // Controls whether the application is loading

onMounted(async () => {
  try {
    sessionId.value = new URLSearchParams(window.location.search).get(
      'sessionId'
    );

    userId.value = window.location.pathname.split('/')[1];

    if (userId.value) {
      localStorage.setItem('userId', userId.value);
    }

    if (sessionId.value) {
      const response = await axios.post(`${BASE_URL}/auth/validate-session`, {
        sessionId: sessionId.value,
      });

      const { token, role } = response.data.data;

      if (role !== 'dentist' || !role) {
        logout();
      }

      if (token) {
        localStorage.setItem('token', token);

        // Remove sessionId and userId from URL
        await router.replace({ query: {}, path: '/' });
      } else {
        console.warn('Token or refreshToken missing from response');
      }
    } else {
      console.warn('Missing userId or sessionId');
    }
  } catch (error) {
    console.error('Error during authentication:', error);
    logout();
  } finally {
    isLoading.value = false;
  }
});
</script>
