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
            <li>Keep track of your tenant's payments</li>
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
            <li>Browse through all kinds of properties for rent</li>
            <li>Contact the Property Owners</li>
            <li>Keep track of your payments and due dates</li>
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
    router.push('/login/landlord');
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
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding: 2rem;
  background: #f4f4f4;
  border-radius: 8px;
}

.section-content .text-content {
  flex: 1;
}

.section-content .image-content {
  flex: 1;
  /* Add styles for your images */
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

/* Adjust Button styles as needed */
.p-button {
  margin-right: 0.5rem;
}

.p-button-help {
  background-color: #9c27b0;
  border-color: #9c27b0;
  color: #ffffff;
}

/* Add more styles as needed for your layout and theming */
</style>
