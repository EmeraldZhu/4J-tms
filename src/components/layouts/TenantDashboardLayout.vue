<template>
    <div class="dashboard" v-if="!isLoading">
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
            <div><br><br></div>
            <div class="user-profile">
                <!-- This will show initials if no image is present, and an image if there's one -->
                <Avatar v-if="user" :image="user.photoURL" :label="user.initials" size="large" shape="circle"
                    @click="op.toggle($event)" class="clickable-avatar" />
                <OverlayPanel ref="op">
                    <Button label="Logout" icon="pi pi-sign-out" @click="logout" />
                </OverlayPanel>
            </div>
        </div>

        <!-- Main Content -->
        <div class="main-content">
            <router-view />
        </div>
    </div>
    <div v-else>
        Loading...
    </div>
</template>

<script setup>
import { ref, computed, onMounted, toRefs } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import Avatar from 'primevue/avatar';
import Button from 'primevue/button';
import OverlayPanel from 'primevue/overlaypanel';

const store = useStore();
const router = useRouter();
const isLoading = computed(() => store.state.isLoading);

const op = ref(null);

const logout = async () => {
  try {
    await store.dispatch('logout');
    router.push('/login/tenant');
  } catch (error) {
    console.error('Error during logout:', error);
  }
};

const user = computed(() => {
  const userData = store.state.user;
  if (userData) {
    // Split the full name into first name and last name
    const [firstName, lastName] = userData.fullNames.split(' ');
    // Safely extract the first character from the first name and last name
    const initials = `${firstName?.[0] ?? 'U'}${lastName?.[0] ?? 'N'}`;
    const photoURL = userData.photoURL || null;
    return { ...toRefs(userData), initials, photoURL };
  }
  return null;
});

const menuItems = ref([
  { label: 'Dashboard', to: '/tenant', icon: 'pi pi-fw pi-th-large' },
  { label: 'Notice Board', to: '/tenant/notice-board', icon: 'pi pi-fw pi-inbox' },
  { label: 'Maintenance Tickets', to: '/tenant/maintenance', icon: 'pi pi-fw pi-cog' },
  // ... other menu items
]);

onMounted(() => {
  store.dispatch('fetchUser');
});
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

.clickable-avatar:hover {
  cursor: pointer;
}
</style>