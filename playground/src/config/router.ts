import { createRouter, createWebHistory } from 'vue-router'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/:ins',
      component: () => import('../views/Preview.vue'),
    },
    {
      path: '/',
      component: () => import('../views/Preview.vue'),
    },
  ],
})
