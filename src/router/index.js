import { createRouter, createWebHistory } from 'vue-router';
import { store } from '../store';
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
    meta: { guestOnly: true },
  },
  {
    path: '/login/owner',
    name: 'LoginOwner',
    component: LoginOwner,
    meta: { guestOnly: true },
  },
  {
    path: '/login/tenant',
    name: 'LoginTenant',
    component: LoginTenant,
    meta: { guestOnly: true },
  },
  {
    path: '/reset-password/owner',
    name: 'ResetPassword',
    component: ResetPassword,
    meta: { guestOnly: true },
  },
  {
    path: '/reset-password/tenant',
    name: 'ResetPasswordTenant',
    component: ResetPasswordTenant,
    meta: { guestOnly: true },
  },
  {
    path: '/owner',
    component: OwnerDashboardLayout,
    meta: { requiresAuth: true, role: 'landlord' },
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
    meta: { requiresAuth: true, role: 'tenant' },
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

const homeForRole = (role) => (role === 'landlord' ? '/owner' : '/tenant');

// Client-side guard. This is a usability layer only — it keeps signed-out or
// wrong-role users out of dashboard URLs, but the authoritative access control
// lives in firestore.rules, which is enforced server-side.
router.beforeEach(async (to) => {
  // Make sure the auth listener has reported at least once, otherwise a hard
  // refresh on a protected URL would be evaluated against a null user.
  await store.dispatch('fetchUser');

  const { requiresAuth, role: requiredRole } = to.meta;
  const isAuthenticated = store.getters.isAuthenticated;
  const role = store.state.role;

  if (requiresAuth && !isAuthenticated) {
    return { path: requiredRole === 'tenant' ? '/login/tenant' : '/login/owner' };
  }

  if (requiresAuth && requiredRole && role !== requiredRole) {
    // Signed in, but for the other portal. Send them to their own dashboard
    // rather than a login page they are already past.
    return { path: homeForRole(role) };
  }

  // Keep signed-in users away from the login and registration pages.
  if (to.meta.guestOnly && isAuthenticated) {
    return { path: homeForRole(role) };
  }

  return true;
});

export default router;
