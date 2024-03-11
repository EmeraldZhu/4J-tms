<template>
  <div class="dashboard">
    <!-- Permanent Sidebar -->
    <div class="sidebar">
      <ul class="menu-list">
        <li v-for="item in menuItems" :key="item.label">
          <router-link :to="item.to">
            <i :class="item.icon"></i>
            <span>{{ item.label }}</span>
          </router-link>
        </li>
      </ul>
    </div>

    <!-- Top Bar/Header -->
    <div class="topbar">
      <div>
        <!-- Property dropdown placeholder -->
        <MultiSelect v-model="selectedProperty" :options="properties" optionLabel="name" placeholder="Select a Property" />
      </div>
      <div class="user-profile">
        <!-- This will show initials if no image is present, and an image if there's one -->
        <Avatar :image="user.image" :label="user.initials" shape="circle" />
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import Menubar from 'primevue/menubar';
import MultiSelect from 'primevue/multiselect';
import Avatar from 'primevue/avatar';
import Sidebar from 'primevue/sidebar';

const store = useStore();

const properties = ref([
  // This should be replaced with real property data from your store or API
  { name: 'Property 1', code: 'P1' },
  { name: 'Property 2', code: 'P2' },
  // ... more properties
]);

const selectedProperty = ref(null);

const user = computed(() => {
  // Here you would typically use a Vuex getter to get the user information
  // For now, this is just placeholder data
  return {
    image: null, // Replace with actual image URL if available
    initials: 'U', // Replace with logic to extract initials from the user's name
  };
});

const menuItems = ref([
  { label: 'Dashboard', to: '/owner/dashboard', icon: 'pi pi-fw pi-home' },
  { label: 'Properties', to: '/owner/properties', icon: 'pi pi-fw pi-list' },
  { label: 'Tenants', to: '/owner/tenants', icon: 'pi pi-fw pi-users' },
  { label: 'Notice Board', to: '/owner/notice-board', icon: 'pi pi-fw pi-clipboard' },
  { label: 'Maintenance Tickets', to: '/owner/maintenance', icon: 'pi pi-fw pi-ticket' },
  // ... other menu items
]);
</script>

<style scoped>
.dashboard {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 250px;
  background-color: #333;
  color: white;
  padding: 1rem;
  margin-right: auto;
}

.menu-list {
  list-style-type: none;
  padding: 0;
}

.menu-list li {
  padding: 0.5rem 0;
}

.menu-list li a {
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
}

.menu-list li a i {
  margin-right: 0.5rem;
}

.topbar {
  background-color: #eee;
  flex-grow: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
  margin-bottom: auto;
}

.main-content {
  flex-grow: 1;
  padding: 1rem;
}

.user-profile {
  display: flex;
  align-items: center;
}

/* Add more styles as needed */
</style>
