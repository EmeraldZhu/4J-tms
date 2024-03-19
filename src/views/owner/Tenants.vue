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
import InputText from 'primevue/inputtext';
import Stepper from 'primevue/stepper';
import StepperPanel from 'primevue/stepperpanel';
import FloatLabel from 'primevue/floatlabel';
import Calendar from 'primevue/calendar';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import { getAuth } from 'firebase/auth';

const auth = getAuth();
const user = auth.currentUser;
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
</script>

<style scoped>
body {
  padding: 1rem;
}

.p-stepper {
  flex-basis: 40rem;
}
</style>