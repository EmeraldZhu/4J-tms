<template>
  <Stepper>
    <StepperPanel header="Property Creation">
      <div class="form">
        <Toast />
        <h1>Add New Property</h1>
        <p>Fill in the details of the property you want to add.</p>
        <p>Fields marked with * are required.</p>

        <!-- The property form starts here -->
        <Stepper orientation="vertical">
          <!-- Property Name -->
          <StepperPanel header="Property Name">
            <template #header="{ index, clickCallback }">
              <button class="bg-transparent border-none inline-flex flex-column gap-2" @click="clickCallback">
                <span :class="['border-round border-2 w-3rem h-3rem inline-flex align-items-center justify-content-center', { 'bg-primary border-primary': index <= active, 'surface-border': index > active }]">
                  <i class="pi pi-building" />
                </span>
              </button>
            </template>
            <template #content="{ nextCallback }">
              <div class="flex flex-column gap-2 mx-auto" style="min-height: 16rem; max-width: 20rem">
                <div class="text-center mt-3 mb-3 text-xl font-semibold">Property Name</div>
                <div class="field p-fluid">
                  <IconField>
                    <InputIcon>
                      <i class="pi pi-building" />
                    </InputIcon>
                    <InputText v-model="property.name" type="text" placeholder="Enter property name" />
                  </IconField>
                </div>
              </div>
              <div class="flex pt-4 justify-content-end">
                <Button label="Next" icon="pi pi-arrow-right" iconPos="right" @click="nextCallback" />
              </div>
            </template>
          </StepperPanel>

          <!-- Number of Units -->
          <StepperPanel header="Number of Units">
            <template #content="{ prevCallback, nextCallback }">
              <div class="flex flex-column gap-2 mx-auto" style="min-height: 16rem; max-width: 20rem">
                <div class="text-center mt-3 mb-3 text-xl font-semibold">Number of Units</div>
                <div class="field p-fluid">
                  <InputNumber v-model="property.units" mode="decimal" :min="1" placeholder="Specify number of units" />
                </div>
              </div>
              <div class="flex pt-4 justify-content-between">
                <Button label="Back" severity="secondary" icon="pi pi-arrow-left" @click="prevCallback" />
                <Button label="Next" severity="secondary" icon="pi pi-arrow-right" @click="nextCallback" />
              </div>
            </template>
          </StepperPanel>

          <!-- Unit Names -->
          <StepperPanel header="Unit Names">
            <template #content="{ prevCallback, nextCallback }">
              <div class="flex flex-column gap-2 mx-auto" style="min-height: 16rem; max-width: 20rem">
                <div class="text-center mt-3 mb-3 text-xl font-semibold">Unit Names</div>
                <div class="field p-fluid">
                  <InputText v-model="property.unitNames" type="text" placeholder="Enter unit names, e.g. A1, 101 ..." />
                </div>
              </div>
              <div class="flex pt-4 justify-content-between">
                <Button label="Back" severity="secondary" icon="pi pi-arrow-left" @click="prevCallback" />
                <Button label="Next" severity="secondary" icon="pi pi-arrow-right" @click="nextCallback" />
              </div>
            </template>
          </StepperPanel>

          <!-- Address -->
          <StepperPanel header="Address">
            <template #content="{ prevCallback, nextCallback }">
              <div class="flex flex-column gap-2 mx-auto" style="min-height: 16rem; max-width: 20rem">
                <div class="text-center mt-3 mb-3 text-xl font-semibold">Address</div>
                <div class="field p-fluid">
                  <InputText v-model="property.address" type="text" placeholder="Enter address" />
                </div>
              </div>
              <div class="flex pt-4 justify-content-between">
                <Button label="Back" severity="secondary" icon="pi pi-arrow-left" @click="prevCallback" />
                <Button label="Next" severity="secondary" icon="pi pi-arrow-right" @click="nextCallback" />
              </div>
            </template>
          </StepperPanel>

          <!-- Media Uploads -->
          <StepperPanel header="Media Uploads">
            <template #content="{ prevCallback, nextCallback }">
              <div class="flex flex-column gap-2 mx-auto" style="min-height: 16rem; max-width: 20rem">
                <div class="text-center mt-3 mb-3 text-xl font-semibold">Media Uploads</div>
                <div class="field p-fluid">
                  <FileUpload name="media" accept="image/*" :maxFileSize="3670016" :auto="false" customUpload @uploader="onFileSelected" />
                </div>
              </div>
              <div class="flex pt-4 justify-content-between">
                <Button label="Back" severity="secondary" icon="pi pi-arrow-left" @click="prevCallback" />
                <Button label="Next" severity="secondary" icon="pi pi-arrow-right" @click="nextCallback" />
              </div>
            </template>
          </StepperPanel>

          <!-- Submit Button -->
          <StepperPanel header="Submit">
            <template #content="{ prevCallback }">
              <div class="flex flex-column gap-2 mx-auto" style="min-height: 16rem; max-width: 20rem">
                <div class="text-center mt-3 mb-3 text-xl font-semibold">Post Property</div>
                <div class="field p-fluid">
                  
                </div>
              </div>
              <div class="flex pt-4 justify-content-between">
                <Button label="Back" severity="secondary" icon="pi pi-arrow-left" @click="prevCallback" />
                <Button label="Submit" icon="pi pi-send" @click="submitProperty" :disabled="isSubmitting" />
              </div>
            </template>
          </StepperPanel>
        </Stepper>
      </div>
    </StepperPanel>
    <StepperPanel header="Unit Types">
      <div class="form">
        <Toast />
        <h1>Specify Unit Types</h1>
        <!-- Unit type form starts here -->
        <Stepper orientation="vertical">
          <!-- Step 1 -->
          <StepperPanel header="Set Unit Types">
            <template #content="{ nextCallback }">
              <div class="flex flex-column gap-2 mx-auto" style="min-height: 16rem; max-width: 20rem">
                <div class="text-center mt-3 mb-3 text-xl font-semibold">Set Unit Types</div>
                <div class="field p-fluid">
                  <IconField>
                    <InputIcon>
                      <i class="pi pi-building" />
                    </InputIcon>
                    <InputText v-model="unitType" type="text" placeholder="Enter unit type" />
                  </IconField>
                  <br>
                  <Button label="Add Unit Type" @click="addUnitType"/>
                  <br><br>
                  <DataTable :value="unitTypes" stripedRows>
                    <Column field="type" header="Unit Type"></Column>
                  </DataTable>
                </div>
              </div>
              <div class="flex pt-4 justify-content-end">
                <Button label="Next" icon="pi pi-arrow-right" iconPos="right" @click="nextCallback" />
              </div>
            </template>
          </StepperPanel>

          <!-- Submit Button -->
          <StepperPanel header="Submit">
            <template #content="{ prevCallback }">
              <div class="flex flex-column gap-2 mx-auto" style="min-height: 16rem; max-width: 20rem">
                <div class="text-center mt-3 mb-3 text-xl font-semibold">Submit Unit Types</div>
                <div class="field p-fluid">
                  
                </div>
              </div>
              <div class="flex pt-4 justify-content-between">
                <Button label="Back" severity="secondary" icon="pi pi-arrow-left" @click="prevCallback" />
                <Button label="Submit" icon="pi pi-send" @click="submitUnitTypes" />
              </div>
            </template>
          </StepperPanel>
        </Stepper>
      </div>
    </StepperPanel>
    <StepperPanel header="Unit Creation">
      <div class="form">
        <Toast />
        <h1>Add Units to Property</h1>
        <!-- Unit form starts here -->
        <Stepper orientation="vertical">
          <!-- Step 1 -->
          <StepperPanel header="Choose Property">
            <template #content="{ nextCallback }">
              <div class="flex flex-column gap-2 mx-auto" style="min-height: 16rem; max-width: 20rem">
                <div class="text-center mt-3 mb-3 text-xl font-semibold">Choose Property</div>
                <div class="field p-fluid">
                  <IconField>
                    <InputIcon>
                      <i class="pi pi-building" />
                    </InputIcon>
                    <Dropdown v-model="propertyName" editable :options="propertyNames" optionLabel="label" placeholder="Choose property" />
                  </IconField>
                </div>
              </div>
              <div class="flex pt-4 justify-content-end">
                <Button label="Next" icon="pi pi-arrow-right" iconPos="right" @click="nextCallback" />
              </div>
            </template>
          </StepperPanel>

          <!-- Step 2 -->
          <StepperPanel header="Add Unit Details">
            <template #content="{ prevCallback, nextCallback }">
              <div class="flex flex-column gap-2 mx-auto" style="min-height: 16rem; max-width: 20rem">
                <div class="text-center mt-3 mb-3 text-xl font-semibold">Add Unit Details</div>
                <div class="field p-fluid">
                  <div class="text-start mt-3 mb-3">Unit Name</div>
                  <IconField>
                    <InputIcon>
                      <i class="pi pi-building" />
                    </InputIcon>
                    <Dropdown v-model="propertyUnitName" editable :options="unitNames" optionLabel="label" placeholder="Choose unit name" />
                  </IconField>
                  <br>
                  <div class="text-start mt-3 mb-3">Unit Type</div>
                  <IconField>
                    <InputIcon>
                      <i class="pi pi-database" />
                    </InputIcon>
                    <Dropdown v-model="unitType" editable :options="unitTypes" optionLabel="label" placeholder="Choose unit type" />
                  </IconField>
                  <br>
                  <div class="text-start mt-3 mb-3">Rent Price</div>
                  <IconField>
                    <InputIcon>
                      <i class="pi pi-dollar" />
                    </InputIcon>
                    <InputText type="text" v-model="rentPrice" placeholder="Rent price" />
                  </IconField>
                </div>
              </div>
              <div class="flex pt-4 justify-content-between">
                <Button label="Back" severity="secondary" icon="pi pi-arrow-left" @click="prevCallback" />
                <Button label="Add Unit" icon="pi pi-plus-circle" @click="addUnit" :disabled="isSubmitting" />
              </div>
            </template>
          </StepperPanel>
        </Stepper>
      </div>
    </StepperPanel>
  </Stepper>
</template>

<script setup>
import { onMounted, ref, reactive, watch } from 'vue';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import Stepper from 'primevue/stepper';
import StepperPanel from 'primevue/stepperpanel';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import FileUpload from 'primevue/fileupload';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dropdown from 'primevue/dropdown';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

const auth = getAuth();
const user = auth.currentUser;
const toast = useToast();

let isSubmitting = ref(false); // Track the submission status

let activeIndex = ref(0);
let property = ref({
  name: '',
  units: 1,
  unitNames: '',
  address: '',
  media: null,
});

const steps = [
  { label: 'Property Name' },
  { label: 'Number of Units' },
  { label: 'Unit Names' },
  { label: 'Address' },
  { label: 'Media Uploads' },
  { label: 'Submit' },
];

const db = getFirestore();
const storage = getStorage();

const next = () => {
  if (activeIndex.value < steps.length - 1) {
    activeIndex.value++;
  }
};

const back = () => {
  if (activeIndex.value > 0) {
    activeIndex.value--;
  }
};

const onFileSelected = (event) => {
  property.value.media = event.files[0]; // event.files is an array of the selected files
  console.log('File selected:', property.value.media); // Log the selected file
  // Show success toast when a file is selected
  toast.add({severity: 'success', summary: 'File Selected', detail: 'Your file has been selected successfully.', life: 3000});
};

const submitProperty = async () => {
  if (isSubmitting.value) {
    // Prevent submission if already submitting
    return;
  }

  // Validate the form data
  if (!property.value.name || !property.value.units || !property.value.unitNames || !property.value.address) {
    console.error('Please fill in all required fields.');
    toast.add({severity: 'error', summary: 'Validation Error', detail: 'Please fill in all required fields.', life: 3000});
    return;
  }

  isSubmitting.value = true;

  let mediaUrl = '';
  // Check if a media file was provided
  if (property.value.media) {
    try {
      // Create a storage reference
      const mediaRef = storageRef(storage, `propertyImages/${property.value.name}/${property.value.media.name}`);
      // Upload the media file
      const snapshot = await uploadBytes(mediaRef, property.value.media);
      // Get the download URL
      mediaUrl = await getDownloadURL(snapshot.ref);
    } catch (error) {
      console.error('Upload error:', error.message);
      toast.add({severity: 'error', summary: 'Upload Error', detail: error.message, life: 3000});
      isSubmitting.value = false; // Re-enable the submit button
      return;
    }
  }

  // Prepare the form data for submission
  const data = {
    name: property.value.name,
    units: property.value.units,
    unitNames: property.value.unitNames,
    address: property.value.address,
    media: mediaUrl,
    createdBy: user.uid,
    // Add other fields as needed
  };

  if (user !== null) {
    try {
      // Add a new document with a generated id to the 'properties' collection
      const docRef = await addDoc(collection(db, 'properties'), data);

      console.log('Document written with ID: ', docRef.id);
      toast.add({severity: 'success', summary: 'Property Added', detail: 'Your property has been added successfully.', life: 3000});

      // Use the landlord's user ID obtained from Firebase Auth
      const landlordId = user.uid; 

      // Store the mapping of landlord to property
      await addDoc(collection(db, 'landlordProperties'), {
        landlordId: landlordId,
        propertyId: docRef.id
      });

      // Reset property data after successful submission
      property.value = {
        name: '',
        units: 1,
        unitNames: '',
        address: '',
        media: null,
      };
    } catch (e) {
      console.error('Error adding document: ', e);
      toast.add({severity: 'error', summary: 'Error', detail: 'There was an error processing your request.', life: 3000});
    } finally {
      isSubmitting.value = false; // Re-enable the submit button
    }
  } else {
  // Handle the case where no user is signed in
  console.error("No user signed in");
  toast.add({severity: 'error', summary: 'Authentication Error', detail: 'No user signed in.', life: 3000});
  }
};

// Reactive state for storing unit types
const unitType = ref('');
const unitTypes = reactive([]);

// Function to add a unit type
const addUnitType = () => {
  if (unitType.value.trim() !== '') {
    // Check if the user is signed in
    if (user && user.uid) {
      unitTypes.push({ 
        type: unitType.value, 
        createdBy: user.uid // Add the landlord's UID to each unit type
      });

      unitType.value = ''; // Clear the input field for the next entry
      toast.add({ severity: 'success', summary: 'Unit Type Added Locally', detail: 'The unit type has been added to the list.', life: 3000 });
    } else {
      // Handle case where no user is signed in
      toast.add({ severity: 'error', summary: 'User Not Signed In', detail: 'You must be signed in to add unit types.', life: 3000 });
    }
  } else {
    toast.add({ severity: 'warn', summary: 'Empty Field', detail: 'Unit type cannot be empty.', life: 3000 });
  }
};

const submitUnitTypes = async () => {
  if (unitTypes.length === 0) {
    toast.add({ severity: 'warn', summary: 'No Unit Types', detail: 'Please add at least one unit type before submitting.', life: 3000 });
    return;
  }

  try {
    // Submit each unit type in the unitTypes array to Firestore
    for (const unitType of unitTypes) {
      await addDoc(collection(db, 'unitTypes'), unitType);
    }
    
    toast.add({ severity: 'success', summary: 'Unit Types Submitted', detail: 'All unit types have been successfully submitted.', life: 3000 });
    
    // Clear the unitTypes array after successful submission
    unitTypes.splice(0, unitTypes.length);
  } catch (error) {
    console.error('Error submitting unit types to Firestore:', error);
    toast.add({ severity: 'error', summary: 'Submission Error', detail: 'Error submitting unit types. Please try again.', life: 3000 });
  }
};

const landlordId = user ? user.uid : null;

const propertyUnitName = ref('');
const propertyName = ref('');
const propertyNames = ref([]);
const unitNames = ref([]);
const rentPrice = ref('');

// Fetch properties on component mount
onMounted(async () => {
  if (!user) return;
  const landlordId = user.uid;
  const propertiesQuery = query(collection(db, 'properties'), where('createdBy', '==', landlordId));
  const querySnapshot = await getDocs(propertiesQuery);
  propertyNames.value = querySnapshot.docs.map(doc => ({
    label: doc.data().name,
    value: doc.id
  }));
});

// Watch for changes in propertyName to fetch property unit names
watch(propertyName, async (newVal) => {
  if (!newVal || !newVal.value) return;
  
  const documentId = newVal.value; // The selected property ID
  const propertyRef = doc(db, 'properties', documentId);
  const docSnap = await getDoc(propertyRef);

  if (docSnap.exists()) {
    const propertyData = docSnap.data();
    // All potential unit names for the property
    const allUnitNames = propertyData.unitNames.split(',').map(name => name.trim());

    // Fetch units already added for this property, considering the structure of propertyName and propertyUnitName
    const unitsQuery = query(collection(db, 'units'), where('propertyName.value', '==', documentId));
    const querySnapshot = await getDocs(unitsQuery);
    // Extract used unit names considering propertyUnitName is an object
    const usedUnitNames = querySnapshot.docs.map(doc => doc.data().propertyUnitName.value);

    // Filter out used unit names from the list of all unit names
    const unusedUnitNames = allUnitNames.filter(name => !usedUnitNames.includes(name));

    // Update the dropdown options with unused unit names
    unitNames.value = unusedUnitNames.map(name => ({ label: name, value: name }));
  } else {
    console.log("No such document found!");
  }
});

// Fetch unit types on component mount
onMounted(async () => {
  if (!user) return;
  const landlordId = user.uid;
  const unitTypesQuery = query(collection(db, 'unitTypes'), where('createdBy', '==', landlordId));
  const querySnapshot = await getDocs(unitTypesQuery);
  unitTypes.splice(0, unitTypes.length, ...querySnapshot.docs.map(doc => ({ label: doc.data().type, value: doc.id })));
});

const refreshUnitNames = async () => {
  if (!propertyName.value || !propertyName.value.value) return;

  const documentId = propertyName.value.value; // The selected property ID
  const propertyRef = doc(db, 'properties', documentId);
  const docSnap = await getDoc(propertyRef);

  if (docSnap.exists()) {
    const propertyData = docSnap.data();
    const allUnitNames = propertyData.unitNames.split(',').map(name => name.trim());

    // Fetch units already added for this property
    const unitsQuery = query(collection(db, 'units'), where('propertyName.value', '==', documentId));
    const querySnapshot = await getDocs(unitsQuery);
    const usedUnitNames = querySnapshot.docs.map(doc => doc.data().propertyUnitName.value);

    // Filter out used unit names
    const unusedUnitNames = allUnitNames.filter(name => !usedUnitNames.includes(name));

    // Update the dropdown options
    unitNames.value = unusedUnitNames.map(name => ({ label: name, value: name }));
  } else {
    console.log("No such document found!");
  }
};

const addUnit = async () => {
  if (isSubmitting.value) return;
  isSubmitting.value = true;

  // Perform the application-level check to ensure the selected unit name hasn't been used
  const unitNameQuery = query(collection(db, 'units'), where('propertyName.value', '==', propertyName.value.value), where('propertyUnitName.value', '==', propertyUnitName.value.value));
  const querySnapshot = await getDocs(unitNameQuery);

  if (!querySnapshot.empty) {
    // Unit name already exists, do not proceed with adding and show an error message
    toast.add({ severity: 'error', summary: 'Unit Name Exists', detail: 'This unit name is already used for the selected property.', life: 3000 });
    isSubmitting.value = false;
    return; // Exit the function early
  }

  try {
    // Proceed with adding the new unit since the name hasn't been used
    await addDoc(collection(db, 'units'), {
      propertyName: propertyName.value,
      propertyUnitName: propertyUnitName.value,
      unitType: unitType.value,
      rentPrice: rentPrice.value,
      createdBy: user.uid,
    });

    toast.add({ severity: 'success', summary: 'Unit Added', detail: 'The unit has been successfully added.', life: 3000 });

    // Update UI reactively
    refreshUnitNames(); // This should remove the added unit name from the dropdown options

    // Reset fields after successful submission
    propertyUnitName.value = '';
    unitType.value = '';
    rentPrice.value = '';
  } catch (error) {
    console.error('Error adding unit:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to add the unit. Please try again.', life: 3000 });
  } finally {
    isSubmitting.value = false;
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