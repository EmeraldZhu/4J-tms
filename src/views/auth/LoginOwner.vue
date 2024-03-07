<template>
  <div class="login-container">
    <div class="login-card">
      <h2>Login To Your Account</h2>
      <form @submit.prevent="login">
        <div class="p-field">
          <label for="email">Email*</label>
          <InputText id="email" v-model="credentials.email" required />
        </div>
        <div class="p-field">
          <label for="password">Password*</label>
          <Password id="password" v-model="credentials.password" required toggleMask />
        </div>
        <Button label="Login" class="p-button-rounded p-button-success" />
      </form>
      <p>
        <router-link to="/reset-password">Forgot Password?</router-link>
      </p>
      <p>
        Don't have an account? <router-link to="/register/owner">Register</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const auth = getAuth();
const store = useStore();
const router = useRouter();

const credentials = ref({
  email: '',
  password: ''
});

const login = async () => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, credentials.value.email, credentials.value.password);
    // Assuming you have a Vuex mutation to set the user
    store.commit('setUser', userCredential.user);
    // Redirect to the landlord dashboard
    router.push('/dashboard/owner');
  } catch (error) {
    console.error('Login error:', error.message);
    // Handle errors appropriately (e.g., show an error message)
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.login-card {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  border-radius: 6px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.login-card h2 {
  text-align: center;
  margin-bottom: 2rem;
}

.p-field {
  margin-bottom: 1rem;
}

/* Add additional styles to match your attached design */
</style>
