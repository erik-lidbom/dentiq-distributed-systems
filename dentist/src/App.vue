<template>
  <div id="app" class="flex flex-col h-full bg-dentiq-background-beige p-4">
    <!-- Global Navigation Bar -->
    <header>
      <GlobalNav />
    </header>

    <!-- Main Content Area -->
    <main class="flex-1">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import GlobalNav from './components/GlobalNav.vue';
import 'primeicons/primeicons.css';
</script>
