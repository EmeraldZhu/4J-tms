<template>
  <div class="reset-password-page">
    <Toast />
    <div class="reset-password-card">
      <div class="icon-container">
        <span class="pi pi-lock" style="font-size: 3rem"></span>
      </div>
      <h2>Forgot Password?</h2>
      <p>Enter your email address and we'll send you a link to reset your password.</p>
      <form @submit.prevent="sendResetLink" class="reset-password-form">
        <InputText id="email" v-model="email" placeholder="Email *" required />
        <Button type="submit" label="SUBMIT" class="submit-button" />
        <router-link to="/register/owner" class="register-link">Create new account? Register</router-link>
        <div class="divider"></div>
        <router-link to="/login/owner" class="back-link">BACK TO LOGIN</router-link>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import Toast from 'primevue/toast'; // Import Toast component
import { useToast } from 'primevue/usetoast'; // Import useToast hook
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import 'primeicons/primeicons.css';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

const auth = getAuth();
const email = ref('');
const router = useRouter();
const store = useStore(); // if you need to use Vuex for some reason
const toast = useToast(); // Instantiate the toast

const sendResetLink = async () => {
  try {
    await sendPasswordResetEmail(auth, email.value);
    // Display a success toast message
    toast.add({ severity: 'success', summary: 'Success', detail: 'Reset link sent to your email address.', life: 3000 });
    console.log('Reset link sent to:', email.value);
    // Optionally navigate the user to the login page after showing the message
    setTimeout(() => {
      router.push('/login/owner');
    }, 3200); // Waits a bit longer than the toast life to navigate
  } catch (error) {
    console.error('Error sending reset email:', error.message);
    // Display an error toast message
    toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });
  }
};
</script>

<style scoped>
.reset-password-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f5f5f5; /* This color should match your design background */
}

.reset-password-card {
  background: #fff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 10px 25px 0 rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
  max-width: 700px;
}

.icon-container {
  margin-bottom: 1rem;
}

.reset-password-form .p-inputtext {
  width: 100%;
  margin-bottom: 1rem;
}

.submit-button {
  width: 100%;
  background-color: #6244da; /* Adjust the color to match your design */
  border: none;
  margin-bottom: 1rem;
}

.submit-button:enabled:hover {
  background-color: #5434c8; /* A darker shade for hover state */
}

.register-link {
  color: #6244da; /* Adjust the color to match your design */
  text-decoration: none;
  display: block;
  margin-bottom: 1rem;
}

.divider {
  border-top: 1px solid #ddd; /* Light divider line */
  margin-bottom: 1rem;
}

.back-link {
  color: #6244da; /* Adjust the color to match your design */
  text-decoration: none;
  display: block;
}
</style>