<template>
  <div class="reset-password-container">
    <h1>Reset Your Password</h1>
    <p>Enter your email address below, and we'll send you a link to reset your password.</p>
    <form @submit.prevent="sendResetLink">
      <div class="p-field">
        <label for="email">Email</label>
        <InputText id="email" v-model="email" placeholder="Enter your email" required />
      </div>
      <Button label="Send Reset Link" class="p-button-rounded p-button-info" />
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

const auth = getAuth();
const email = ref('');
const router = useRouter();
const store = useStore(); // if you need to use Vuex for some reason

const sendResetLink = async () => {
  try {
    await sendPasswordResetEmail(auth, email.value);
    console.log('Reset link sent to:', email.value);
    // Show success message and potentially navigate the user to the login page
    router.push('/login/owner');
  } catch (error) {
    console.error('Error sending reset email:', error.message);
    // Handle errors, such as invalid email, etc.
  }
};
</script>

<style scoped>
.reset-password-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  max-width: 400px;
  margin: auto;
  height: 100vh;
}

.p-field {
  margin-bottom: 1rem;
}

.p-button-info {
  margin-top: 1rem;
}
</style>
