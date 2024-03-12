<template>
  <div class="form">
    <Toast />
    <h1>Add New Property</h1>
    <p>Fill in the details of the property you want to add.</p>
    <p>Fields marked with * are required.</p>

    <!-- The form starts here -->
    <Stepper>
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
              <InputText v-model="property.unitNames" type="text" placeholder="Enter unit names" />
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
          <Button label="Submit" icon="pi pi-send" @click="submit" :disabled="isSubmitting" />
        </div>
        </template>
      </StepperPanel>
    </Stepper>
  </div>
</template>

<script setup>
import { ref } from 'vue';
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
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

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

const submit = async () => {
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
    // Add other fields as needed
  };

  try {
    // Add a new document with a generated id to the 'properties' collection
    const docRef = await addDoc(collection(db, 'properties'), data);

    console.log('Document written with ID: ', docRef.id);
    toast.add({severity: 'success', summary: 'Property Added', detail: 'Your property has been added successfully.', life: 3000});

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