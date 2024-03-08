<template>
  <div class="login-page">
    <Toast />
    <div class="login-form-container">
      <h1 class="login-title">Login To Your Account</h1>
      <form @submit.prevent="login" class="login-form">
        <div class="p-field">
          <InputText id="email" v-model="credentials.email" placeholder="Email *" required />
        </div>
        <div class="p-field">
          <Password id="password" v-model="credentials.password" placeholder="Password" required toggleMask :feedback="false" />
        </div>
        <Button type="submit" label="LOGIN" class="login-button" />
        <div class="login-footer">
          <router-link to="/reset-password/owner" class="forgot-password">Forgot Password?</router-link>
          <router-link to="/register/owner" class="register-link">Don't have an account? Register</router-link>
        </div>
      </form>
    </div>
    <div class="login-image">
      <img src="../../assets/login-image.svg" alt="Login" />
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
import Password from 'primevue/password';
import Button from 'primevue/button';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const auth = getAuth();
const store = useStore();
const router = useRouter();
const toast = useToast(); // Instantiate the toast

const credentials = ref({
  email: '',
  password: ''
});

const login = async () => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, credentials.value.email, credentials.value.password);
    // Display a success toast message
    toast.add({ severity: 'success', summary: 'Login Successful', detail: 'Welcome!', life: 3000 });
    // Assuming you have a Vuex mutation to set the user
    store.commit('setUser', userCredential.user);
    setTimeout(() => {
      router.push('/dashboard/owner');
    }, 1500); // Waits a bit longer than the toast life to navigate
  } catch (error) {
    console.error('Login error:', error.message);
    // Display an error toast message
    toast.add({ severity: 'error', summary: 'Login Failed', detail: error.message, life: 5000 });
  }
};
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f8f9fa; /* or the color matching your design */
  color: #333;
}

.login-form-container {
  padding: 2em;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.login-title {
  margin-bottom: 1rem;
}

.login-form {
  width: 100%;
}

.p-field {
  margin-bottom: 1rem;
  width: 100%;
}

.p-inputtext {
  width: 100%;
  border: none;
  border-bottom: 2px solid #009688; /* color of the bottom border */
  border-radius: 0;
}

.p-password input {
  width: 100%;
  border: none;
  border-bottom: 2px solid #009688; /* color of the bottom border */
  border-radius: 0;
}

:deep(.p-icon-field-right > .p-inputtext) {
    padding-right: 9rem;
}

.login-button {
  width: 100%;
  margin-top: 1rem;
  background-color: #6244da; /* color of the login button */
  border: none;
  border-radius: 20px;
}

.login-button:enabled:hover {
  background-color: #5434c8; /* darker shade of the button color for hover state */
}

.login-footer {
  margin-top: 1rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.forgot-password,
.register-link {
  color: #009688; /* color of the links */
  text-decoration: none;
  margin: 0.5rem 0;
}

.forgot-password:hover,
.register-link:hover {
  text-decoration: underline;
}

.login-image {
  display: none; /* Hide image for mobile, display for desktop if needed */
}

/* Add responsive styles if needed */
@media (min-width: 768px) {
  .login-page {
    flex-direction: row;
    justify-content: space-around;
  }

  .login-form-container {
    margin-right: 2rem; /* Spacing between form and image on larger screens */
  }

  .login-image {
    display: block; /* Show image on larger screens */
  }

  .login-image img {
    max-width: 100%; /* Adjust if necessary */
    height: auto;
  }
}

/* Add any additional styles to match your design */
</style>
