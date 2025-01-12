import SignupView from '@/views/SignupView.vue'
import LoginView from '@/views/LogInView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/signup',
      name: 'signup',
      component: SignupView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/:pathMatch(.)',
      redirect: '/login',
    },
  ],
})

router.beforeEach((to, from, next) => {
  if (to.path !== '/login' && to.path !== '/signup') {
    next('/login') // Redirect to /login
  } else {
    next()
  }
})

export default router
