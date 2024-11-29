<template>
  <div id="app" class="flex flex-col min-h-screen bg-dentiq-muted-light p-4">
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
</script>
