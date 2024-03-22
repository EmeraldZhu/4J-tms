<template>
<div class="form">
        <Toast />
        <h1>Add New Tenant</h1>
        <Stepper orientation="vertical">
                <!-- Tenant Personal Info -->
                <StepperPanel header="Personal Info">
                        <template #content="{ nextCallback }">
                                <div class="flex flex-column gap-2 mx-auto" style="min-height: 16rem; max-width: 20rem">
                                        <div class="text-center mt-3 mb-3 text-xl font-semibold">Personal Info</div>
                                        <div class="field p-fluid">
                                                <FloatLabel>
                                                        <InputText type="text" id="fullNames" v-model="tenant.fullNames" required />
                                                        <label for="fullNames">Full names*</label>
                                                </FloatLabel>
                                                <br>
                                                <FloatLabel>
                                                        <InputText type="email" id="email" v-model="tenant.email" required />
                                                        <label for="email">Email*</label>
                                                </FloatLabel>
                                                <br>
                                                <FloatLabel>
                                                        <Calendar id="dob" v-model="tenant.dob" dateFormat="dd/mm/yy"></Calendar>
                                                        <label for="dob">Date of Birth</label>
                                                </FloatLabel>
                                                <br>
                                                <FloatLabel>
                                                        <InputText type="text" id="idNumber" v-model="tenant.idNumber" />
                                                        <label for="idNumber">National ID Number</label>
                                                </FloatLabel>
                                                <br>
                                                <FloatLabel>
                                                        <Dropdown id="gender" v-model="tenant.gender" :options="genders" optionLabel="name" placeholder="Select Gender" required></Dropdown>
                                                        <label for="gender">Gender</label>
                                                </FloatLabel>
                                        </div>
                                </div>
                                <div class="flex pt-4 justify-content-end">
                                        <Button label="Next" icon="pi pi-arrow-right" iconPos="right" @click="nextCallback" />
                                </div>
                        </template>
                </StepperPanel>

                <!-- Check-in Status -->
                <StepperPanel header="Check-in Status">
                        <template #content="{ prevCallback, nextCallback }">
                                <div class="flex flex-column gap-2 mx-auto" style="min-height: 16rem; max-width: 20rem">
                                        <div class="text-center mt-3 mb-3 text-xl font-semibold">Check-in Status</div>
                                        <div class="field p-fluid">
                                                <FloatLabel>
                                                        <Dropdown id="checkInStatus" v-model="tenant.checkInStatus" :options="checkInStatuses" optionLabel="name" placeholder="Checked In?" required></Dropdown>
                                                        <label for="checkInStatus">Checked In?</label>
                                                </FloatLabel>
                                                <br>
                                                <FloatLabel v-if="tenant.checkInStatus && tenant.checkInStatus.value === 'yes'">
                                                        <Calendar id="checkInDate" v-model="tenant.checkInDate" dateFormat="dd/mm/yy"></Calendar>
                                                        <label for="checkInDate">Check-in Date</label>
                                                </FloatLabel>
                                                <br v-if="tenant.checkInStatus && tenant.checkInStatus.value === 'yes'">
                                                <FloatLabel v-if="tenant.checkInStatus && tenant.checkInStatus.value === 'yes'">
                                                        <Calendar id="checkOutDate" v-model="tenant.checkOutDate" dateFormat="dd/mm/yy"></Calendar>
                                                        <label for="checkOutDate">Check-out Date</label>
                                                </FloatLabel>
                                        </div>
                                </div>
                                <div class="flex pt-4 justify-content-between">
                                        <Button label="Back" severity="secondary" icon="pi pi-arrow-left" @click="prevCallback" />
                                        <Button label="Next" icon="pi pi-arrow-right" @click="nextCallback" />  
                                </div>
                        </template>
                </StepperPanel>

                <!-- Property & Unit Assignment -->
                <StepperPanel header="Property & Unit Assignment">
                        <template #content="{ prevCallback }">
                                <div class="flex flex-column gap-2 mx-auto" style="min-height: 16rem; max-width: 20rem">
                                        <div class="text-center mt-3 mb-3 text-xl font-semibold">Property & Unit Assignment</div>
                                        <div class="field p-fluid">
                                                <div class="text-start mt-3 mb-3">Property Name</div>
                                                        <Dropdown v-model="propertyName" editable :options="propertyNames" optionLabel="label" placeholder="Choose property" />
                                                <div class="text-start mt-3 mb-3">Unit Name</div>
                                                        <Dropdown v-model="propertyUnitName" editable :options="unitNames" optionLabel="label" placeholder="Choose unit name" />
                                        </div>
                                </div>
                                <div class="flex pt-4 justify-content-between">
                                        <Button label="Back" severity="secondary" icon="pi pi-arrow-left" @click="prevCallback" />
                                        <Button label="Add Tenant" icon="pi pi-plus-circle" @click="addTenant" :disabled="isSubmitting" />
                                        <Button label="Reset" icon="pi pi-replay" @click="resetForm" /> 
                                </div>
                        </template>
                </StepperPanel>
        </Stepper>       
</div>
<br>
<h1>Tenants</h1>
<div class="property-selector">
        <Dropdown v-model="selectedProperty" :options="landlordProperties" optionLabel="label" placeholder="Select a property" />
</div>
<br>
<div class="tenants-datatable">
        <DataTable v-model:filters="filters" :value="tenants" :paginator="true" :rows="10">
                <Column field="fullNames" header="Name"></Column>
                <Column field="idNumber" header="ID Number"></Column>
                <Column field="propertyId.label" header="Property"></Column>
                <Column field="unitId.label" header="Unit"></Column>
                <Column field="checkInDate" header="Check-in">
                        <template #body="slotProps">
                                {{ slotProps.data.checkInDate ? new Date(slotProps.data.checkInDate).toLocaleDateString() : '' }}
                        </template>
                </Column>
                <Column field="checkOutDate" header="Check-out">
                        <template #body="slotProps">
                                {{ slotProps.data.checkOutDate ? new Date(slotProps.data.checkOutDate).toLocaleDateString() : '' }}
                        </template>
                </Column>
                <Column field="checkInStatus.name" header="Status"></Column>
                <Column header="Action">
                        <template #body="slotProps">
                                <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editTenant($event, slotProps.data)" />
                                <Button icon="pi pi-trash" class="p-button-rounded p-button-danger" @click="deleteTenant(slotProps.data)" />
                        </template>
                </Column>
        </DataTable>
</div>

<OverlayPanel ref="overlayPanel">
    <div class="form">
        <!-- Full Names -->
        <FloatLabel>
            <InputText type="text" id="editFullNames" v-model="editingTenant.fullNames" required />
            <label for="editFullNames">Full names*</label>
        </FloatLabel>
        <br>

        <!-- Email -->
        <FloatLabel>
            <InputText type="email" id="editEmail" v-model="editingTenant.email" required />
            <label for="editEmail">Email*</label>
        </FloatLabel>
        <br>

        <!-- Date of Birth -->
        <FloatLabel>
            <Calendar id="editDob" v-model="editingTenant.dob" dateFormat="dd/mm/yy"></Calendar>
            <label for="editDob">Date of Birth</label>
        </FloatLabel>
        <br>

        <!-- National ID Number -->
        <FloatLabel>
            <InputText type="text" id="editIdNumber" v-model="editingTenant.idNumber" />
            <label for="editIdNumber">National ID Number</label>
        </FloatLabel>
        <br>

        <!-- Gender -->
        <FloatLabel>
            <Dropdown id="editGender" v-model="editingTenant.gender" :options="genders" optionLabel="name" placeholder="Select Gender" required></Dropdown>
            <label for="editGender">Gender</label>
        </FloatLabel>
        <br>

        <!-- Check-in Status -->
        <FloatLabel>
            <Dropdown id="editCheckInStatus" v-model="editingTenant.checkInStatus" :options="checkInStatuses" optionLabel="name" placeholder="Checked In?" required></Dropdown>
            <label for="editCheckInStatus">Checked In?</label>
        </FloatLabel>
        <br>

        <!-- Check-in Date -->
        <FloatLabel v-if="editingTenant.checkInStatus && editingTenant.checkInStatus.value === 'yes'">
            <Calendar id="editCheckInDate" v-model="editingTenant.checkInDate" dateFormat="dd/mm/yy"></Calendar>
            <label for="editCheckInDate">Check-in Date</label>
        </FloatLabel>
        <br v-if="editingTenant.checkInStatus && editingTenant.checkInStatus.value === 'yes'">

        <!-- Check-out Date -->
        <FloatLabel v-if="editingTenant.checkInStatus && editingTenant.checkInStatus.value === 'yes'">
            <Calendar id="editCheckOutDate" v-model="editingTenant.checkOutDate" dateFormat="dd/mm/yy"></Calendar>
            <label for="editCheckOutDate">Check-out Date</label>
        </FloatLabel>
        <br>

        <!-- Update Tenant Button -->
        <Button label="Update Tenant" @click="updateTenant" />
    </div>
</OverlayPanel>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import InputText from 'primevue/inputtext';
import Stepper from 'primevue/stepper';
import StepperPanel from 'primevue/stepperpanel';
import FloatLabel from 'primevue/floatlabel';
import Calendar from 'primevue/calendar';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import OverlayPanel from 'primevue/overlaypanel';       
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, addDoc, deleteDoc, updateDoc, doc } from 'firebase/firestore';

const auth = getAuth();
const user = auth.currentUser;
const db = getFirestore();
const toast = useToast();

let isSubmitting = ref(false); // Track the submission status

const genders = [
  { name: 'Male', value: 'male' },
  { name: 'Female', value: 'female' }
];

const checkInStatuses = [
  { name: 'Yes', value: 'yes' },
  { name: 'No', value: 'no' }
];

const tenant = ref({
        fullNames: '',
        email: '',
        dob: null,
        idNumber: '',
        gender: null,
        checkInStatus: null,
        checkInDate: null,
        checkOutDate: null,
});

// Refs for storing property and unit names
const propertyNames = ref([]);
const unitNames = ref([]);

// Fetch properties on component mounted lifecycle hook
onMounted(async () => {
    if (user) {
        const landlordPropertiesQuery = query(collection(db, 'properties'), where('createdBy', '==', user.uid));
        const querySnapshot = await getDocs(landlordPropertiesQuery);
        propertyNames.value = querySnapshot.docs.map(doc => ({
            label: doc.data().name,
            value: doc.id // Store Firestore document ID as value for later use
        }));
    }
});

// Reactive property to store the selected property ID
const propertyName = ref('');
const propertyUnitName = ref('');

// Reactive ref to store the IDs of the occupied units
const occupiedUnitIds = ref([]);

// Fetch all tenant-occupied unit IDs when the component is mounted
onMounted(async () => {
    const tenantQuery = query(collection(db, 'tenants'));
    const tenantSnapshot = await getDocs(tenantQuery);
    occupiedUnitIds.value = tenantSnapshot.docs.map(tenantDoc => tenantDoc.data().unitId.value);
});

// Watcher to fetch unit names when a property is selected and filter out occupied units
watch(propertyName, async (newValueObj) => {
    const newValue = newValueObj.value;
    console.log("Selected property ID:", newValue);

    if (newValue) {
        const unitsQuery = query(collection(db, 'units'), where('propertyName.value', '==', newValue));
        const unitSnapshot = await getDocs(unitsQuery);
        
        // Filter out units that have already been assigned
        unitNames.value = unitSnapshot.docs
            .filter(unitDoc => !occupiedUnitIds.value.includes(unitDoc.id))
            .map(unitDoc => ({
                label: unitDoc.data().propertyUnitName.label,
                value: unitDoc.id
            }));
    } else {
        unitNames.value = []; // Reset unit names if no property is selected
    }
});


const resetForm = () => {
    tenant.value = {
        fullNames: '',
        email: '',
        dob: null,
        idNumber: '',
        gender: null,
        checkInStatus: null,
        checkInDate: null,
        checkOutDate: null,
    };
    propertyName.value = '';
    propertyUnitName.value = '';
    isSubmitting.value = false;
};

const addTenant = async () => {
    if (isSubmitting.value) return;
    isSubmitting.value = true;

    // Validate required fields
    if (!tenant.value.fullNames || !tenant.value.email || !tenant.value.gender) {
        toast.add({ severity: 'error', summary: 'Validation Error', detail: 'Please fill in all required fields.', life: 3000 });
        isSubmitting.value = false;
        return;
    }

    try {
        // Prepare the data for Firestore
        const tenantData = {
                ...tenant.value,
                dob: tenant.value.dob ? tenant.value.dob.toISOString() : null, // Convert date to ISO string
                checkInDate: tenant.value.checkInDate ? tenant.value.checkInDate.toISOString() : null,
                checkOutDate: tenant.value.checkOutDate ? tenant.value.checkOutDate.toISOString() : null,
                createdBy: user ? user.uid : null,
                propertyId: propertyName.value,
                unitId: propertyUnitName.value,
        };

    
        // Add a new document with a generated ID to the 'tenants' collection
        await addDoc(collection(db, 'tenants'), tenantData);
        toast.add({ severity: 'success', summary: 'Tenant Added', detail: 'The tenant has been successfully added.', life: 3000 });
        resetForm();
    } catch (error) {
        console.error('Error adding tenant:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to add the tenant. Please try again.', life: 3000 });
    } finally {
        isSubmitting.value = false;
    }
};

const filters = ref({});
const landlordProperties = ref([]); // Assume this is populated with the landlord's properties
const selectedProperty = ref(null);
const tenants = ref([]); // Assume this is populated with tenants from Firestore
const filteredTenants = ref([]);

const fetchLandlordProperties = async () => {
        if (!user) return;
        const q = query(collection(db, 'properties'), where('createdBy', '==', user.uid));
        const querySnapshot = await getDocs(q);
        landlordProperties.value = querySnapshot.docs.map(doc => ({
                id: doc.id,
                label: doc.data().name,
        }));
};

onMounted(fetchLandlordProperties);

// Function to fetch tenants based on selected property
const fetchTenantsForProperty = async (propertyId) => {
  // Fetch tenants from Firestore where propertyId matches and update filteredTenants
  console.log("Fetching tenants for property:", propertyId);
  if (!propertyId) {
        console.log("No propertyId provided");
        tenants.value = [];
        return;
  }

  const q = query(collection(db, 'tenants'), where('propertyId.value', '==', propertyId));
  try {
    const querySnapshot = await getDocs(q);
    //const fetchedTenants = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const fetchedTenants = querySnapshot.docs.map(doc => {
      const data = doc.data();
      // Convert Timestamps to JavaScript Date objects
      // Helper function to safely convert potential Firestore Timestamps to Date objects
      const toDate = (timestamp) => timestamp?.toDate ? timestamp.toDate() : timestamp;
      return {
        ...data,
        checkInDate: toDate(data.checkInDate),
        checkOutDate: toDate(data.checkOutDate),
        dob: toDate(data.dob), // Convert dob as well if stored as Timestamp
        id: doc.id // include the document ID
      };
    });
    console.log("Tenants fetched:", fetchedTenants);
    tenants.value = fetchedTenants;
  } catch (error) {
    console.error("Error fetching tenants:", error);
  }
};

// Watcher to fetch tenants when a property is selected
watch(() => selectedProperty.value?.id, (newId) => {
  if (newId) {
    console.log("Property ID selected:", newId);
    fetchTenantsForProperty(newId);
  }
}, { deep: true });

const editTenant = (event, tenant) => {
    editingTenant.value = { ...tenant };
    overlayPanel.value.show(event);
};

const deleteTenant = async (tenant) => {
  if (!confirm(`Are you sure you want to delete ${tenant.fullNames}? This action cannot be undone.`)) {
    return;
  }

  try {
    // Assuming `tenant.id` is the document ID of the tenant in Firestore
    await deleteDoc(doc(db, 'tenants', tenant.id));
    toast.add({ severity: 'success', summary: 'Tenant Deleted', detail: 'The tenant has been successfully deleted.', life: 3000 });

    // Refresh the tenants list for the currently selected property
    if (selectedProperty.value) {
      await fetchTenantsForProperty(selectedProperty.value.id);
    }
  } catch (error) {
    console.error('Error deleting tenant:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete the tenant. Please try again.', life: 3000 });
  }
};

const overlayPanel = ref(null);
const editingTenant = ref({});

const updateTenant = async () => {
    // Assume editingTenant.value has an id property
    if (editingTenant.value.checkInStatus.value === 'no') {
        editingTenant.value.checkInDate = null;
        editingTenant.value.checkOutDate = null;
    }

    const tenantRef = doc(db, 'tenants', editingTenant.value.id);
    try {
        // Prepare the tenant data for update, ensuring dates are in a suitable format
        const updateData = {
            ...editingTenant.value,
            // Firestore expects JavaScript Date objects or null for date fields
            checkInDate: editingTenant.value.checkInDate,
            checkOutDate: editingTenant.value.checkOutDate,
            // Convert other necessary fields as needed
        };
        
        await updateDoc(tenantRef, updateData);
        toast.add({ severity: 'success', summary: 'Tenant Updated', detail: 'The tenant has been successfully updated.', life: 3000 });
        overlayPanel.value.hide();
        fetchTenantsForProperty(selectedProperty.value.id); // Refresh tenant list
    } catch (error) {
        console.error('Error updating tenant:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to update the tenant. Please try again.', life: 3000 });
    }
};
</script>

<style scoped>
body {
  padding: 1rem;
}

.p-stepper {
  flex-basis: 40rem;
}
</style>