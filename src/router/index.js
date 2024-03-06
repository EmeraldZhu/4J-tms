// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  // ... your other routes
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
