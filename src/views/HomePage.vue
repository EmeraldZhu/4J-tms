<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <!-- Content for Property Owner Section -->
      <div class="section-content owner-section">
        <div class="text-content">
          <h2>Are You A Property Owner?</h2>
          <ul>
            <li>Post your property online for future tenants to view</li>
            <li>Manage all your tenants in one place</li>
            <li>Keep track of your tenant's maintenance records</li>
          </ul>
          <Button label="Login" class="p-button-outlined" @click="goToLogin('owner')" />
          <Button label="Register" class="p-button-help" @click="goToRegister('owner')" />
        </div>
        <div class="image-content">
          <!-- Place your property owner image here -->
          <img src="../assets/property-owner.svg" alt="">
        </div>
      </div>

      <!-- Content for Tenant Section -->
      <div class="section-content tenant-section">
        <div class="text-content">
          <h2>Are You A Tenant?</h2>
          <ul>
            <li>Submit maintenance tickets</li>
            <li>Contact the Property Owners</li>
            <!-- <li>Keep track of your payments and due dates</li> -->
          </ul>
          <Button label="Login" class="p-button-outlined" @click="goToLogin('tenant')" />
        </div>
        <div class="image-content">
          <!-- Place your tenant image here -->
          <img src="../assets/tenant.svg" alt="">
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import Button from 'primevue/button';

const router = useRouter();

function goToLogin(role) {
  if (role === 'owner') {
    // Navigate to the landlord login page
    router.push('/login/owner');
  } else if (role === 'tenant') {
    // Navigate to the tenant login page
    router.push('/login/tenant');
  }
}

function goToRegister(role) {
  if (role === 'owner') {
    // Navigate to the landlord register page
    router.push('/register/owner');
  }
}
</script>

<style>
.home-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.hero-section {
  display: flex;
  flex-direction: column;
}

.section-content {
  display: flex;
  flex-wrap: wrap; /* Allows the flex items to wrap as needed */
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding: 2rem;
  background: #f4f4f4;
  border-radius: 8px;
}

.section-content .text-content,
.section-content .image-content {
  flex: 1 0 100%; /* Grow: 1, Shrink: 0, Basis: 100% */
  max-width: 100%; /* Prevents flex items from growing beyond 100% */
}

@media (min-width: 640px) {
  .section-content .text-content,
  .section-content .image-content {
    flex: 1; /* Allows the flex items to grow and shrink as needed */
    max-width: 50%; /* Allows the flex items to occupy half of the container's width */
  }
}

.section-content ul {
  list-style: none;
  padding: 0;
}

.section-content ul li {
  margin-bottom: 0.5rem;
}

.section-content h2 {
  margin-top: 0;
}

.p-button {
  margin-right: 0.5rem;
}

.p-button-help {
  background-color: #9c27b0;
  border-color: #9c27b0;
  color: #ffffff;
}
</style>
