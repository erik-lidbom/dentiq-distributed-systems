<template>
  <div id="app" class="flex flex-col min-h-screen bg-dentiq-muted-light p-4">
    <div v-if="isLoading" class="flex items-center justify-center flex-1">
      <p>Loading...</p>
    </div>
    <!-- Global Navigation Bar -->

    <template v-else>
      <!-- Global Navigation Bar -->
      <header>
        <GlobalNav />
      </header>

      <!-- Main Content Area -->
      <main class="flex-1">
        <RouterView />
      </main>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import GlobalNav from './components/shared/Header.vue';
import axios from 'axios';
import { logout } from '@/utils/helpers';

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

    if (userId.value && userId.value !== 'bookings') {
      localStorage.setItem('userId', userId.value);
    }

    if (sessionId.value) {
      const response = await axios.post(`${BASE_URL}/auth/validate-session`, {
        sessionId: sessionId.value,
      });

      const token = response.data.data.token;

      if (token) {
        localStorage.setItem('token', token);

        // Remove sessionId and userId from URL
        router.replace({ query: {}, path: '/' });
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
