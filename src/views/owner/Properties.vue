<template>
  <div class="form">
    <h1>Add New Property</h1>
    <p>Fill in the details of the property you want to add.</p>
    <p>Fields marked with * are required.</p>

    <!-- The form starts here -->
    <Stepper>
      <!-- Property Name -->
      <StepperPanel header="Property Name">
        <template #content="{ nextCallback }">
          <h3>Property Name *</h3>
          <InputText v-model="property.name" placeholder="Enter property name" />
          <Button label="Next" @click="nextCallback" />
        </template>
      </StepperPanel>

      <!-- Number of Units -->
      <StepperPanel header="Number of Units">
        <template #content="{ prevCallback, nextCallback }">
          <h3>Number of Units *</h3>
          <InputNumber v-model="property.units" mode="decimal" :min="1" />
          <Button label="Back" @click="prevCallback" />
          <Button label="Next" @click="nextCallback" />
        </template>
      </StepperPanel>

      <!-- Unit Names -->
      <StepperPanel header="Unit Names">
        <template #content="{ prevCallback, nextCallback }">
          <h3>Unit Names *</h3>
          <InputText v-model="property.unitNames" placeholder="Enter unit names" />
          <Button label="Back" @click="prevCallback" />
          <Button label="Next" @click="nextCallback" />
        </template>
      </StepperPanel>

      <!-- Address -->
      <StepperPanel header="Address">
        <template #content="{ prevCallback, nextCallback }">
          <h3>Address *</h3>
          <Textarea v-model="property.address" rows={5} cols={30} placeholder="Enter address" />
          <Button label="Back" @click="prevCallback" />
          <Button label="Next" @click="nextCallback" />
        </template>
      </StepperPanel>

      <!-- Media Uploads -->
      <StepperPanel header="Media Uploads">
        <template #content="{ prevCallback, nextCallback }">
          <h3>Media Uploads</h3>
          <FileUpload name="media" accept="image/*" :maxFileSize="3670016" :auto="false" customUpload @uploader="onFileSelected" />
          <Button label="Back" @click="prevCallback" />
          <Button label="Next" @click="nextCallback" />
        </template>
      </StepperPanel>

      <!-- Submit Button -->
      <StepperPanel header="Submit">
        <template #content="{ prevCallback }">
          <Button label="Submit" @click="submit" />
          <Button label="Back" @click="prevCallback" />
        </template>
      </StepperPanel>
    </Stepper>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Steps from 'primevue/steps';
import Stepper from 'primevue/stepper';
import StepperPanel from 'primevue/stepperpanel';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Textarea from 'primevue/textarea';
import FileUpload from 'primevue/fileupload';
import Button from 'primevue/button';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

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
};

const submit = async () => {
  // Validate the form data
  if (!property.value.name || !property.value.units || !property.value.unitNames || !property.value.address) {
    console.error('Please fill in all required fields.');
    return;
  }

  let mediaUrl = '';
  // Check if a media file was provided
  if (property.value.media) {
    // Create a storage reference
    const mediaRef = storageRef(storage, `propertyImages/${property.value.name}/${property.value.media.name}`);
    // Upload the media file
    const snapshot = await uploadBytes(mediaRef, property.value.media).catch((error) => {
      console.error('Upload error:', error.message);
      throw error;
    });
    // Get the download URL
    mediaUrl = await getDownloadURL(snapshot.ref).catch((error) => {
      console.error('Download URL error:', error.message);
      throw error;
    });
    console.log(mediaUrl); // Log the download URL
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
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};
</script>

<style scoped>
/* Form */
.form {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
}

/* Form Fields */
.form .p-field {
  margin-bottom: 1rem;
}

/* Buttons */
.form .p-button {
  margin-top: 1rem;
}

/* Stepper */
.form .p-steps {
  margin-bottom: 2rem;
}

/* Active Step */
.form .p-steps .p-steps-item.p-highlight .p-steps-title {
  color: #1976d2;
}
</style>