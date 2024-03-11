<template>
  <div class="dashboard-layout">
    <!-- Top Bar/Header -->
    <Menubar>
      <template #start>
        <MultiSelect v-model="selectedProperty" :options="properties" optionLabel="name" placeholder="Select a Property" />
      </template>
      <template #end>
        <Avatar v-if="user.image" :image="user.image" shape="circle" />
        <Avatar v-else :label="user.initials" shape="circle" />
      </template>
    </Menubar>

    <!-- Sidebar -->
    <Sidebar visible :baseZIndex="1000" :modal="false" class="sidebar-menu">
      <ul class="p-flex-column p-list-none p-m-0 p-p-0">
        <li v-for="item in menuItems" :key="item.label">
          <router-link :to="item.to">{{ item.label }}</router-link>
        </li>
      </ul>
    </Sidebar>
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

const menuItems = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Properties', to: '/properties' },
  { label: 'Tenants/Residents', to: '/tenants' },
  { label: 'Notice Board', to: '/notice-board' },
  { label: 'Maintenance Tickets', to: '/maintenance-tickets' },
  // ... other menu items
];
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  height: 100vh;
}

.sidebar-menu {
  width: 250px;
  height: 100%;
}

/* Add additional styling here */
</style>
