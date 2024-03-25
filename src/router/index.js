// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import RegisterOwner from '../views/auth/RegisterOwner.vue';
import LoginOwner from '../views/auth/LoginOwner.vue';
import ResetPassword from '../views/auth/ResetPassword.vue';
import OwnerDashboardLayout from '../components/layouts/OwnerDashboardLayout.vue';
import OwnerDashboard from '../views/owner/Dashboard.vue';
import Maintenance from '../views/owner/Maintenance.vue';
import NoticeBoard from '../views/owner/NoticeBoard.vue';
import Properties from '../views/owner/Properties.vue';
import Tenants from '../views/owner/Tenants.vue';
import Invitations from '../views/owner/Invitations.vue';
import TenantDashboardLayout from '../components/layouts/TenantDashboardLayout.vue';
import TenantDashboard from '../views/tenant/Dashboard.vue';
import LoginTenant from '../views/auth/LoginTenant.vue';
import ResetPasswordTenant from '../views/auth/ResetPasswordTenant.vue';
import TenantMaintenance from '../views/tenant/Maintenance.vue';
import TenantNoticeBoard from '../views/tenant/NoticeBoard.vue';

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
    path: '/login/tenant',
    name: 'LoginTenant',
    component: LoginTenant,
  },
  {
    path: '/reset-password/owner',
    name: 'ResetPassword',
    component: ResetPassword,
  },
  {
    path: '/reset-password/tenant',
    name: 'ResetPasswordTenant',
    component: ResetPasswordTenant,
  },
  {
    path: '/owner',
    component: OwnerDashboardLayout,
    children: [
      {
        path: 'properties',
        name: 'OwnerProperties',
        component: Properties,
      },
      {
        path: '',
        name: 'OwnerDashboard',
        component: OwnerDashboard,
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
      {
        path: 'invitations',
        name: 'OwnerInvitations',
        component: Invitations,
      },
    ]
  },
  {
    path: '/tenant',
    component: TenantDashboardLayout,
    children: [
      {
        path: '',
        name: 'TenantDashboard',
        component: TenantDashboard,
      },
      {
        path: 'maintenance',
        name: 'TenantMaintenance',
        component: TenantMaintenance,
      },
      {
        path: 'notice-board',
        name: 'TenantNoticeBoard',
        component: TenantNoticeBoard,
      },
    ]
  },

  // ... your other routes
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
