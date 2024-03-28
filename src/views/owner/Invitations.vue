<template>
    <Toast />
    <div class="p-fluid p-formgrid p-grid">
        <div class="p-field p-col-12">
            <label for="tenantEmail">Tenant's Email</label>
            <br><br>
            <InputText id="tenantEmail" v-model="tenantEmail" type="email" placeholder="Enter tenant's email" />
        </div>
        <br>
        <div class="p-field p-col-12">
            <Button label="Send Invitation" @click="sendInvitation" />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { getAuth, createUserWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { getFirestore, query, collection, where, getDocs, updateDoc, doc } from "firebase/firestore";

const toast = useToast();
const tenantEmail = ref('');
const auth = getAuth();
const db = getFirestore();
const router = useRouter();

// Function to generate a secure temporary password
function generateTempPassword(length = 10) {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
  let retVal = "";
  for (let i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}

const sendInvitation = async () => {
  try {
    // Check if the email exists in the tenants collection
    const tenantsQuery = query(collection(db, "tenants"), where("email", "==", tenantEmail.value));
    const querySnapshot = await getDocs(tenantsQuery);

    if (querySnapshot.empty) {
      // No tenant found with the provided email
      toast.add({severity:'error', summary:'Error', detail:'No tenant found with the provided email.', life: 3000});
      return; // Exit the function if no matching tenant is found
    }

    // If a tenant is found, proceed with account creation and password reset email
    let uid;
    querySnapshot.forEach((doc) => {
      // Proceed with the first match; consider logic adjustments for multiple matches
      uid = doc.id; // Optionally store Firestore tenant document ID if needed
    });

    const tempPassword = generateTempPassword(12); // Generate a strong temporary password
    const userCredential = await createUserWithEmailAndPassword(auth, tenantEmail.value, tempPassword);
    await sendPasswordResetEmail(auth, tenantEmail.value);

    // Optionally link the tenant's Firestore record with their Firebase Auth UID here
    querySnapshot.forEach(async (docSnapshot) => {
      await updateDoc(doc(db, "tenants", docSnapshot.id), {
        authUid: userCredential.user.uid,
        role: 'tenant'
      });
    });

    toast.add({severity:'info', summary:'Session Refresh', detail:'For security reasons, you will be redirected to login again.', life: 5000});
    toast.add({severity:'success', summary:'Invitation Sent', detail:'Tenant invitation has been successfully sent. You will be redirected to the login page shortly to ensure the security of your session.', life: 5000});
    setTimeout(() => {
      router.push('/login/owner');
    }, 5000);
  } catch (error) {
    console.error("Error sending invitation or linking account::", error);
    toast.add({severity:'error', summary:'Error', detail:`Failed to send invitation: ${error.message}`, life: 3000});
  }
};
</script>