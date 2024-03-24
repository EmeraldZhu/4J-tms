<template>
    <div class="grid">
        <Toast />
        <ConfirmPopup></ConfirmPopup>
        <div class="col-6 border-round">
            <h3>Your Properties</h3>
            <div class="properties-datatable">
                <DataTable :value="properties">
                <!-- Define your columns here -->
                        <Column field="media" header="Image">
                                <template #body="slotProps">
                                        <img :src="slotProps.data.media" alt="Property Image" style="width: 50px; height: 50px;">
                                </template>
                        </Column>
                        <Column field="name" header="Property"></Column>
                        <Column field="units" header="Units"></Column>
                        <Column field="address" header="Address"></Column>
                        <Column header="Action">
                                <template #body="slotProps">
                                        <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editProperty(slotProps.data)" />
                                        <Button icon="pi pi-trash" class="p-button-rounded p-button-danger" @click="deleteProperty(slotProps.data, $event)" />
                                </template>
                        </Column>
                </DataTable>
            </div>
        </div>
        <div class="col-6 border-round">
            <h3>Your Units</h3>
            <div class="property-selector">
                <Dropdown v-model="selectedProperty" :options="landlordProperties" optionLabel="label" placeholder="Select a property" />
            </div>
            <br>
            <div class="units-datatable">
                <DataTable :value="units">
                <!-- Define your columns here -->
                        <Column field="propertyName.label" header="Property Name"></Column>
                        <Column field="propertyUnitName.label" header="Unit Name"></Column>
                        <Column field="unitType.label" header="Unit Type"></Column>
                        <Column field="rentPrice" header="Rent"></Column>
                        <Column header="Action">
                                <template #body="slotProps">
                                        <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editUnit(slotProps.data)" />
                                        <Button icon="pi pi-trash" class="p-button-rounded p-button-danger" @click="deleteUnit(slotProps.data, $event)" />
                                </template>
                        </Column>
                </DataTable>
            </div> 
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import ConfirmPopup from 'primevue/confirmpopup';
import { useConfirm } from 'primevue/useconfirm';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, addDoc, deleteDoc, updateDoc, doc } from 'firebase/firestore';

const auth = getAuth();
const user = auth.currentUser;
const db = getFirestore();
const properties = ref([]);
const units = ref([]);
const selectedProperty = ref(null);
const landlordProperties = ref([]);
const toast = useToast();
const confirm = useConfirm();

const fetchProperties = async () => {
  if (!user) return;
  const propertiesQuery = query(collection(db, 'properties'), where('createdBy', '==', user.uid));
  const querySnapshot = await getDocs(propertiesQuery);
  properties.value = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  landlordProperties.value = querySnapshot.docs.map(doc => ({ label: doc.data().name, value: doc.id }));
};

const fetchUnits = async (propertyId) => {
  if (!propertyId) {
    units.value = [];
    return;
  }
  const unitsQuery = query(collection(db, 'units'), where('propertyName.value', '==', propertyId));
  const querySnapshot = await getDocs(unitsQuery);
  units.value = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
};

onMounted(fetchProperties);

watch(selectedProperty, (newValue) => {
  fetchUnits(newValue.value);
});

const deleteProperty = async (property) => {
  console.log('Attempting to delete property:', property.name);
  confirm.require({
    target: event.target,
    message: `Are you sure you want to delete the property "${property.name}"?`,
    acceptLabel: 'Yes',
    rejectLabel: 'No',
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      try {
        await deleteDoc(doc(db, 'properties', property.id));
        properties.value = properties.value.filter(p => p.id !== property.id);
        toast.add({severity: 'success', summary: 'Delete Successful', detail: `Property "${property.name}" has been deleted.`, life: 3000});
      } catch (error) {
        toast.add({severity: 'error', summary: 'Delete Failed', detail: 'Failed to delete property.', life: 3000});
      }
    }
  });
};

const deleteUnit = async (unit) => {
  console.log('Attempting to delete unit:', unit.propertyUnitName.label);
  confirm.require({
    target: event.target,
    message: `Are you sure you want to delete the unit "${unit.propertyUnitName.label}"?`,
    acceptLabel: 'Yes',
    rejectLabel: 'No',
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      try {
        await deleteDoc(doc(db, 'units', unit.id));
        units.value = units.value.filter(u => u.id !== unit.id);
        toast.add({severity: 'success', summary: 'Delete Successful', detail: `Unit "${unit.propertyUnitName.label}" has been deleted.`, life: 3000});
      } catch (error) {
        toast.add({severity: 'error', summary: 'Delete Failed', detail: 'Failed to delete unit.', life: 3000});
      }
    }
  });
};
</script>