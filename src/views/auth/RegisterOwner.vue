<template>
  <div class="register-container">
    <div class="p-card">
      <h2 class="p-card-title">Register For Your New Account</h2>
      <form @submit.prevent="registerLandlord" class="p-fluid">
        <div class="p-field">
          <label for="firstName">First Name*</label>
          <InputText id="firstName" v-model="landlord.firstName" required />
        </div>
        <div class="p-field">
          <label for="lastName">Last Name*</label>
          <InputText id="lastName" v-model="landlord.lastName" required />
        </div>
        <div class="p-field">
          <label for="email">Email*</label>
          <InputText id="email" v-model="landlord.email" type="email" required />
        </div>
        <div class="p-field">
          <label for="address">Address*</label>
          <InputText id="address" v-model="landlord.address" required />
        </div>
        <div class="p-field">
          <label for="dob">Date of Birth</label>
          <Calendar id="dob" v-model="landlord.dob" dateFormat="dd/mm/yy"></Calendar>
        </div>
        <div class="p-field">
          <label for="gender">Gender*</label>
          <Dropdown id="gender" v-model="landlord.gender" :options="genders" optionLabel="name" placeholder="Select Gender" required></Dropdown>
        </div>
        <div class="p-field">
          <label for="profileImage">Upload Profile Images</label>
          <FileUpload id="profileImage" mode="basic" name="profileImage" accept="image/*" maxFileSize="3670016" @upload="onFileSelected"/>
        </div>
        <div class="p-field">
          <label for="password">Password*</label>
          <Password id="password" v-model="landlord.password" required toggleMask feedback={false} />
        </div>
        <Button label="Register" class="p-button-success" />
      </form>
      <p class="login-link">
        Already have an account? <router-link to="/login/landlord">Login</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import InputText from 'primevue/inputtext';
import Calendar from 'primevue/calendar';
import Dropdown from 'primevue/dropdown';
import FileUpload from 'primevue/fileupload';
import Password from 'primevue/password';
import Button from 'primevue/button';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getFirestore } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

const auth = getAuth();
const db = getFirestore();
const genders = [
  { name: 'Male', value: 'male' },
  { name: 'Female', value: 'female' }
];
const landlord = ref({
  firstName: '',
  lastName: '',
  email: '',
  address: '',
  dob: null,
  gender: null,
  profileImage: null,
  password: '',
});

const router = useRouter();
const store = useStore();

const registerLandlord = async () => {
  try {
    let imageUrl = ''; // Initialize imageUrl to be empty initially
    // Check if a file is selected for profileImage
    if (landlord.value.profileImage) {
      const storage = getStorage();
      const storageReference = storageRef(storage, `profileImages/${landlord.value.profileImage.name}`);
      const uploadTaskSnapshot = await uploadBytes(storageReference, landlord.value.profileImage);
      imageUrl = await getDownloadURL(uploadTaskSnapshot.ref);
    }

    // Proceed with Firebase Auth user creation
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      landlord.value.email,
      landlord.value.password
    );
    const user = userCredential.user;

    // Firestore data for the landlord, including imageUrl if available
    const landlordData = {
      firstName: landlord.value.firstName,
      lastName: landlord.value.lastName,
      email: landlord.value.email,
      address: landlord.value.address,
      dob: landlord.value.dob ? landlord.value.dob.toISOString().substring(0, 10) : null,
      gender: landlord.value.gender ? landlord.value.gender.value : null,
      profileImageUrl: imageUrl, // Use the imageUrl from Firebase Storage
      role: 'landlord'
    };

    await setDoc(doc(db, 'landlords', user.uid), landlordData);
    router.push('/login/landlord');
  } catch (error) {
    console.error('Registration error:', error.message);
  }
};

const onFileSelected = (event) => {
  landlord.value.profileImage = event.files[0];
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 2em;
}

.p-card {
  width: 100%;
  max-width: 500px;
  border-radius: 6px;
  padding: 2em;
}

.p-card-title {
  text-align: center;
  margin-bottom: 2em;
}

.p-field {
  margin-bottom: 1em;
}

.login-link {
  text-align: center;
  margin-top: 1em;
}

.p-button-success {
  width: 100%;
}
</style>

