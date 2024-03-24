<template>
  <div class="grid">
    <Toast />
    <ConfirmPopup></ConfirmPopup>
    <OverlayPanel ref="op" :showCloseIcon="true" class="overlaypanel-demo" appendTo="body">
      <form @submit.prevent="updateProperty" class="p-fluid">
        <div class="p-field">
          <label for="name">Name</label>
          <InputText id="name" v-model="selectedProperty.name" placeholder="Name" />
        </div>
        <div class="p-field">
          <label for="address">Address</label>
          <InputText id="address" v-model="selectedProperty.address" placeholder="Address" />
        </div>
        <div class="p-field">
          <label for="units">Units</label>
          <InputText id="units" v-model="selectedProperty.units" placeholder="Units" type="number" />
        </div>
        <div class="p-field">
          <label for="unitNames">Unit Names</label>
          <InputText id="unitNames" v-model="selectedProperty.unitNames" placeholder="Unit Names" />
        </div>
        <div class="p-field">
          <label for="media">Image URL</label>
          <InputText id="media" v-model="selectedProperty.media" placeholder="Image URL" />
        </div>
        <br>
        <Button label="Update Property" type="submit" class="p-mt-2" />
      </form>
    </OverlayPanel>
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
              <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2"
                @click="openEditPanel(slotProps.data, $event)" />
              <Button icon="pi pi-trash" class="p-button-rounded p-button-danger"
                @click="deleteProperty(slotProps.data, $event)" />
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
    <OverlayPanel ref="opUnit" class="overlaypanel-demo">
      <form @submit.prevent="updateUnit" class="p-fluid">
        <div class="p-field">
          <label for="propertyName">Property Name</label>
          <Dropdown id="propertyName" v-model="selectedUnit.propertyName.value" :options="landlordProperties"
            optionLabel="label" placeholder="Select a property" />
        </div>
        <div class="p-field">
          <label for="propertyUnitName">Unit Name</label>
          <InputText id="propertyUnitName" v-model="selectedUnit.propertyUnitName.label" placeholder="Unit Name" />
        </div>
        <div class="p-field">
          <label for="unitType">Unit Type</label>
          <Dropdown id="unitType" v-model="selectedUnit.unitType.value" :options="unitTypes" optionLabel="label"
            placeholder="Select unit type" />
        </div>
        <div class="p-field">
          <label for="rentPrice">Rent Price</label>
          <InputText id="rentPrice" v-model="selectedUnit.rentPrice" placeholder="Rent Price" type="number" />
        </div>
        <br>
        <Button label="Update Unit" type="submit" class="p-mt-2" />
      </form>
    </OverlayPanel>
    <div class="col-6 border-round">
      <h3>Your Units</h3>
      <div class="property-selector">
        <Dropdown v-model="selectedProperty" :options="landlordProperties" optionLabel="label"
          placeholder="Select a property" />
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
              <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2"
                @click="openEditUnitPanel(slotProps.data, $event)" />
              <Button icon="pi pi-trash" class="p-button-rounded p-button-danger"
                @click="deleteUnit(slotProps.data, $event)" />
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
import OverlayPanel from 'primevue/overlaypanel';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
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
const op = ref(null);
const opUnit = ref(null);
const selectedUnit = ref({});
const unitTypes = ref([]);

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
        toast.add({ severity: 'success', summary: 'Delete Successful', detail: `Property "${property.name}" has been deleted.`, life: 3000 });
      } catch (error) {
        toast.add({ severity: 'error', summary: 'Delete Failed', detail: 'Failed to delete property.', life: 3000 });
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
        toast.add({ severity: 'success', summary: 'Delete Successful', detail: `Unit "${unit.propertyUnitName.label}" has been deleted.`, life: 3000 });
      } catch (error) {
        toast.add({ severity: 'error', summary: 'Delete Failed', detail: 'Failed to delete unit.', life: 3000 });
      }
    }
  });
};

const openEditPanel = (property, event) => {
  selectedProperty.value = { ...property };
  op.value.toggle(event);
};

const updateProperty = async () => {
  try {
    await updateDoc(doc(db, 'properties', selectedProperty.value.id), selectedProperty.value);
    toast.add({ severity: 'success', summary: 'Success', detail: 'Property updated successfully.', life: 3000 });
    fetchProperties(); // Refresh the properties list
    op.value.hide(); // Close the OverlayPanel
  } catch (error) {
    console.error("Error updating property: ", error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to update property.', life: 3000 });
  }
};

const openEditUnitPanel = (unit, event) => {
  selectedUnit.value = { ...unit };
  opUnit.value.toggle(event);
};

const fetchUnitTypes = async () => {
  const querySnapshot = await getDocs(collection(db, 'unitTypes'));
  unitTypes.value = querySnapshot.docs.map(doc => ({ label: doc.data().type, value: doc.id }));
};

const updateUnit = async () => {
  try {
    const updatedUnit = {
      propertyName: { label: landlordProperties.value.find(p => p.value === selectedUnit.value.propertyName.value).label, value: selectedUnit.value.propertyName.value },
      propertyUnitName: {
        label: selectedUnit.value.propertyUnitName.label, // New unit name from form
        value: selectedUnit.value.propertyUnitName.label // Use the same new name for both label and value
      },
      unitType: { label: unitTypes.value.find(ut => ut.value === selectedUnit.value.unitType.value).label, value: selectedUnit.value.unitType.value },
      rentPrice: selectedUnit.value.rentPrice
    };
    await updateDoc(doc(db, 'units', selectedUnit.value.id), updatedUnit);
      // propertyName: { label: landlordProperties.value.find(p => p.value === selectedUnit.value.propertyName.value).label, value: selectedUnit.value.propertyName.value },
      // propertyUnitName: { ...selectedUnit.value.propertyUnitName },
      // unitType: { label: unitTypes.value.find(ut => ut.value === selectedUnit.value.unitType.value).label, value: selectedUnit.value.unitType.value },
      // rentPrice: selectedUnit.value.rentPrice
    toast.add({ severity: 'success', summary: 'Success', detail: 'Unit updated successfully.', life: 3000 });
    fetchUnits(selectedProperty.value);
    opUnit.value.hide(); // Close the OverlayPanel
  } catch (error) {
    console.error("Error updating unit: ", error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to update unit.', life: 3000 });
  }
};

onMounted(() => {
  fetchUnitTypes();
  fetchProperties();
});
</script>