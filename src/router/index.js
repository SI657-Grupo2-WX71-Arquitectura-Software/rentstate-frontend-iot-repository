import { createRouter, createWebHistory } from 'vue-router'
import profileView from "@/views/profile.view.vue";
import loginView from "@/views/login.view.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'profile',
      component: profileView
    },
    {
      path: '/login',
      name: 'login',
      component: loginView
    },
    {
      path: '/property',
      name: 'property',
      component: () => import('@/views/property.view.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: { name: 'profile' }
    }
  ]
})

export default router
