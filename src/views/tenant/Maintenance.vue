<template>
    <Toast />
    <div class="p-grid p-justify-between p-align-center p-mb-3">
        <h1 class="p-col-fixed">Maintenance Tickets</h1>
        <Button class="p-col-fixed" label="Raise Ticket" @click="showDialog = true" />
    </div>
    <Dialog v-model:visible="showDialog" header="Raise A Ticket">
        <div class="p-fluid">
            <div class="p-field">
                <label for="location">Location</label>
                <Dropdown id="location" v-model="ticket.location" :options="locations" optionLabel="name" />
            </div>
            <div class="p-field">
                <label for="category">Category</label>
                <Dropdown id="category" v-model="ticket.category" :options="categories" optionLabel="name" />
            </div>
            <div class="p-field">
                <label for="description">Description</label>
                <Textarea id="description" v-model="ticket.description" rows="5" />
            </div>
        </div>
        <div class="p-d-flex p-jc-between p-mt-3">
            <Button label="Send" @click="submitTicket" />
            <Button label="Cancel" @click="showDialog = false" />
        </div>
    </Dialog>
    <br>
    <DataTable :value="tickets" paginator :rows="5" ref="maintenanceTable">
        <template #paginatorend>
            <Button type="button" icon="pi pi-download" text @click="exportMaintenanceData" />
        </template>
        <Column field="dateCreated" header="When"></Column>
        <Column field="location.name" header="Location"></Column>
        <Column field="category.name" header="Category"></Column>
        <Column field="description" header="Description"></Column>
        <Column field="status" header="Status">
            <template #body="slotProps">
                <Tag :value="slotProps.data.status" :severity="getTagSeverity(slotProps.data.status)" />
            </template>
        </Column>
    </DataTable>
</template>

<script setup>
import { ref, watchEffect, onMounted } from 'vue';
import { useStore } from 'vuex';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Textarea from 'primevue/textarea';
import Toast from 'primevue/toast';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import { useToast } from 'primevue/usetoast';
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, query, where, getDocs } from "firebase/firestore";

const auth = getAuth();
const db = getFirestore();
const store = useStore();

const toast = useToast();

const showDialog = ref(false);
const ticket = ref({
    location: '',
    category: '',
    description: '',
});

const locations = [
    { name: 'Common Area' },
    { name: 'Room' },
    { name: 'Other' },
];

const categories = [
    { name: 'Electrical' },
    { name: 'Plumbing' },
    { name: 'Paint Works' },
    { name: 'Carpentry' },
    { name: 'Other' },
];

watchEffect(() => {
    const userData = store.state.user;
    if (userData) {
        name = userData.fullNames;
    }
});

const submitTicket = async () => {
    const newTicket = {
        ...ticket.value,
        dateCreated: new Date(),
        createdBy: {
            name: name,
            uid: auth.currentUser.uid,
        },
        status: 'Open',
    };

    try {
        await addDoc(collection(db, 'maintenance'), newTicket);
        showDialog.value = false;
        toast.add({ severity: 'success', summary: 'Success', detail: 'Ticket submitted successfully', life: 3000 });

        // Reset the form fields
        ticket.value = {
            location: '',
            category: '',
            description: '',
        };
    } catch (e) {
        console.error('Error adding document: ', e);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to submit ticket', life: 3000 });
    }
};

const tickets = ref([]);

onMounted(async () => {
    const q = query(collection(db, 'maintenance'), where('createdBy.uid', '==', auth.currentUser.uid));
    const querySnapshot = await getDocs(q);
    tickets.value = querySnapshot.docs.map(doc => {
        const data = doc.data();
        // Convert the Timestamp to a JavaScript Date and format it as a string
        data.dateCreated = data.dateCreated.toDate().toLocaleDateString('en-GB');
        return data;
    });
});

const getTagSeverity = (status) => {
    switch (status) {
        case 'Open': return 'info';
        case 'In Progress': return 'warning';
        case 'Closed': return 'success';
        default: return 'info';
    }
};

const maintenanceTable = ref(null);

const exportMaintenanceData = () => {
  maintenanceTable.value.exportCSV();
}
</script>