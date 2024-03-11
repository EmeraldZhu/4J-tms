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
  { label: 'Dashboard', to: '/owner/dashboard', icon: 'pi pi-fw pi-th-large' },
  { label: 'Properties', to: '/owner', icon: 'pi pi-fw pi-building' },
  { label: 'Tenants', to: '/owner/tenants', icon: 'pi pi-fw pi-users' },
  { label: 'Notice Board', to: '/owner/notice-board', icon: 'pi pi-fw pi-inbox' },
  { label: 'Maintenance Tickets', to: '/owner/maintenance', icon: 'pi pi-fw pi-ticket' },
  // ... other menu items
]);
</script>

<style scoped>
.dashboard {
  display: grid;
  grid-template-columns: 250px auto; /* Sidebar width and auto for the rest */
  grid-template-rows: auto 1fr; /* Top bar height auto and content takes the rest */
  height: 100vh;
}

.sidebar {
  grid-row: 1 / span 2; /* Makes the sidebar span from the first to the last row */
  background-color: #f0f0f0;
  color: black;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.menu-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.menu-list li {
  padding: 0.5rem 1rem;
  margin: 0.25rem 0;
  transition: background-color 0.3s;
}

.menu-list li a {
  color: black;
  text-decoration: none;
  display: flex;
  align-items: center;
}

.menu-list li a i {
  margin-right: 0.5rem;
}

.menu-list li:hover {
  background-color: #e0e0e0;
}

.topbar {
  grid-column: 2; /* Aligns the top bar next to the sidebar */
  background-color: #333;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 2rem;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
}

.main-content {
  grid-column: 2; /* Ensures content starts next to the sidebar */
  grid-row: 2; /* Positions the main content under the top bar */
  padding: 1rem;
}

.user-profile {
  display: flex;
  align-items: center;
}
</style>
