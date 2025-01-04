import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Bookings from '@/views/Bookings.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/bookings',
      name: 'bookings',
      component: Bookings,
    },
  ],
});

export default router;
