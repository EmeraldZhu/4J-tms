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
            <Button label="Send Invitation" @click="sendInvitation" :disabled="isSending" />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { getAuth } from "firebase/auth";
import { getFirestore, query, collection, where, getDocs, updateDoc, setDoc, doc } from "firebase/firestore";
import { provisionTenantAccount } from '../../services/tenant-provisioning';

const toast = useToast();
const tenantEmail = ref('');
const auth = getAuth();
const db = getFirestore();
const isSending = ref(false);

const sendInvitation = async () => {
  if (isSending.value) return;

  const landlord = auth.currentUser;
  if (!landlord) {
    toast.add({severity:'error', summary:'Error', detail:'Your session has expired. Please sign in again.', life: 3000});
    return;
  }

  isSending.value = true;
  try {
    // Scope the lookup to this landlord's own tenants. Without the createdBy
    // filter a landlord could invite — and thereby take over — a tenant record
    // belonging to somebody else.
    const tenantsQuery = query(
      collection(db, "tenants"),
      where("createdBy", "==", landlord.uid),
      where("email", "==", tenantEmail.value)
    );
    const querySnapshot = await getDocs(tenantsQuery);

    if (querySnapshot.empty) {
      // No tenant found with the provided email
      toast.add({severity:'error', summary:'Error', detail:'No tenant found with the provided email.', life: 3000});
      return; // Exit the function if no matching tenant is found
    }

    const tenantDoc = querySnapshot.docs[0];
    if (tenantDoc.data().authUid) {
      toast.add({severity:'warn', summary:'Already Invited', detail:'This tenant already has an account.', life: 3000});
      return;
    }

    // Runs on a secondary Firebase app, so the landlord stays signed in.
    const tenantUid = await provisionTenantAccount(tenantEmail.value);

    // Link the tenant's Firestore record to their new auth account...
    await updateDoc(doc(db, "tenants", tenantDoc.id), {
      authUid: tenantUid,
      role: 'tenant'
    });

    // ...and record the uid -> landlord mapping the security rules rely on to
    // scope notice board reads.
    await setDoc(doc(db, "tenantProfiles", tenantUid), {
      landlordId: landlord.uid,
      tenantDocId: tenantDoc.id,
      role: 'tenant'
    });

    toast.add({severity:'success', summary:'Invitation Sent', detail:'The tenant has been emailed a link to set their password.', life: 5000});
    tenantEmail.value = '';
  } catch (error) {
    console.error("Error sending invitation or linking account:", error);
    toast.add({severity:'error', summary:'Error', detail:'Failed to send invitation. Please try again.', life: 3000});
  } finally {
    isSending.value = false;
  }
};
</script>