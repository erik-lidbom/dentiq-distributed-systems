// vitest.setup.ts

import { config } from '@vue/test-utils';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { createRouter, createWebHistory } from 'vue-router';
import SignupView from '@/views/SignupView.vue';
import LoginView from '@/views/LoginView.vue';

// Set up Vue Router with the routes for client
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: SignupView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
  ],
});

// Register global components
config.global.components = {
  'font-awesome-icon': FontAwesomeIcon,
};

// Register router plugin globally
config.global.plugins = [router];
