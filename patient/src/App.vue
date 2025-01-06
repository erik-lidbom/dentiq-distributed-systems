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
import { useRoute, useRouter } from 'vue-router';
import GlobalNav from './components/shared/Header.vue';
import axios from 'axios';
import test from 'node:test';

const router = useRouter();
const userId = ref<string | null>(null);
const sessionId = ref<string | null>(null);
const isLoading = ref(true); // Controls whether the application is loading

onMounted(async () => {
  try {
    sessionId.value = new URLSearchParams(window.location.search).get(
      'sessionId'
    );

    console.log('User ID:', userId.value);
    console.log('Session ID:', sessionId.value);

    if (sessionId.value) {
      const response = await axios.post(
        `http://localhost:4000/api/auth/validate-session`,
        { sessionId: sessionId.value }
      );
      console.log('Response:', JSON.stringify(response.data, null, 2));

      const token = response.data.data.token;
      const refreshToken = response.data.data.refreshToken;

      console.log(token);
      console.log(refreshToken);
      console.log('YEEEY');

      if (token && refreshToken) {
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        console.log('Tokens stored successfully');

        const test1 = localStorage.getItem('token');
        console.log('TEST!' + test1);

        // Remove sessionId from URL
        router.replace({ query: {} });
      } else {
        console.warn('Token or refreshToken missing from response');
      }
    } else {
      console.warn('Missing userId or sessionId');
    }
  } catch (error) {
    console.error('Error during authentication:', error);
    // Optionally redirect to login page or show an error message
    router.replace('/login');
  } finally {
    isLoading.value = false; // Set to false after onMounted logic finishes
  }
});
</script>
