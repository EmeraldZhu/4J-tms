// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import RegisterOwner from '../views/RegisterOwner.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/register/owner',
    name: 'RegisterOwner',
    component: RegisterOwner,
  },
  // ... your other routes
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
