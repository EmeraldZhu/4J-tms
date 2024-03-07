// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import RegisterOwner from '../views/auth/RegisterOwner.vue';
import LoginOwner from '../views/auth/LoginOwner.vue';

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
  {
    path: '/login/owner',
    name: 'LoginOwner',
    component: LoginOwner,
  }
  // ... your other routes
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
