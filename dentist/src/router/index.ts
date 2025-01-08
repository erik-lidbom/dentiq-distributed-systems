import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:dentistId?',
      name: 'dentist',
      component: Home,
    },
  ],
});

export default router;
