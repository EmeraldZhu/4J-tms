// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import RegisterOwner from '../views/auth/RegisterOwner.vue';
import LoginOwner from '../views/auth/LoginOwner.vue';
import ResetPassword from '../views/auth/ResetPassword.vue';
import OwnerDashboard from '../components/layouts/OwnerDashboard.vue';
import Dashboard from '../views/owner/Dashboard.vue';
import Maintenance from '../views/owner/Maintenance.vue';
import NoticeBoard from '../views/owner/NoticeBoard.vue';
import Properties from '../views/owner/Properties.vue';
import Tenants from '../views/owner/Tenants.vue';

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
  },
  {
    path: '/reset-password/owner',
    name: 'ResetPassword',
    component: ResetPassword,
  },
  {
    path: '/owner',
    component: OwnerDashboard,
    children: [
      {
        path: '',
        name: 'OwnerProperties',
        component: Properties,
      },
      {
        path: 'dashboard',
        name: 'OwnerDashboard',
        component: Dashboard,
      },
      {
        path: 'maintenance',
        name: 'OwnerMaintenance',
        component: Maintenance,
      },
      {
        path: 'notice-board',
        name: 'OwnerNoticeBoard',
        component: NoticeBoard,
      },
      {
        path: 'tenants',
        name: 'OwnerTenants',
        component: Tenants,
      },
    ]
  },

  // ... your other routes
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
