<template>
        <Toast />
        <div class="p-grid p-justify-between p-align-center p-mb-3">
                <h1 class="p-col-fixed">Maintenance Tickets</h1>
        </div>
        <DataTable :value="tickets" paginator :rows="5" ref="maintenanceTable" editMode="row"
                v-model:editingRows="editingRows" dataKey="id" @row-edit-save="onRowEditSave">
                <template #paginatorend>
                        <Button type="button" icon="pi pi-download" text @click="exportMaintenanceData" />
                </template>
                <Column field="createdBy.name" header="Raised By"></Column>
                <Column field="dateCreated" header="When"></Column>
                <Column field="location.name" header="Location"></Column>
                <Column field="category.name" header="Category"></Column>
                <Column field="description" header="Description"></Column>
                <Column field="status" header="Status">
                        <template #body="slotProps">
                                <Tag :value="slotProps.data.status" :severity="getTagSeverity(slotProps.data.status)" />
                        </template>
                        <template #editor="{ data }">
                                <Dropdown v-model="data.status" :options="statusOptions" optionLabel="name"
                                        optionValue="code" placeholder="Select a Status" @change="console.log('Dropdown changed:', data.status)"></Dropdown>
                        </template>
                </Column>
                <Column :rowEditor="true" style="width: 10%; min-width: 8rem" bodyStyle="text-align:center"></Column>
        </DataTable>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import { getFirestore, collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { useStore } from 'vuex';

const db = getFirestore();
const store = useStore();

const toast = useToast();

const tickets = ref([]);

onMounted(async () => {
        const q = query(collection(db, 'maintenance'));
        const querySnapshot = await getDocs(q);
        tickets.value = querySnapshot.docs.map(doc => {
                const data = doc.data();
                // Convert the Timestamp to a JavaScript Date and format it as a string
                data.dateCreated = data.dateCreated.toDate().toLocaleDateString('en-GB');
                data.id = doc.id; // Assign Firestore document ID as 'id'
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

const editingRows = ref([]);

const statusOptions = ref([
        { name: 'Open', code: 'Open' },
        { name: 'In Progress', code: 'In Progress' },
        { name: 'Closed', code: 'Closed' }
]);

const onRowEditSave = async (event) => {
    console.log("onRowEditSave triggered with event:", event);

    // Assuming `newData` contains the updated status, let's use that if available
    const updatedData = event.newData ? JSON.parse(JSON.stringify(event.newData)) : JSON.parse(JSON.stringify(event.data));
    console.log("Using updated data for Firestore and UI update:", updatedData);

    const docRef = doc(db, 'maintenance', updatedData.id);
    console.log("Attempting to update document ID:", updatedData.id, "with new status:", updatedData.status);

    try {
        await updateDoc(docRef, {
            status: updatedData.status
        });
        console.log(`Document ID: ${updatedData.id} successfully updated in Firestore with status: ${updatedData.status}`);

        const index = tickets.value.findIndex(ticket => ticket.id === updatedData.id);
        if (index !== -1) {
            tickets.value[index] = { ...tickets.value[index], ...updatedData };
            tickets.value = [...tickets.value];
            console.log("Local state updated successfully for ticket ID:", updatedData.id);
        } else {
            console.log("Failed to find ticket in local state for ID:", updatedData.id);
        }
    } catch (error) {
        console.error("Error updating document in Firestore: ", error);
    }

    console.log("Current state of tickets after update attempt:", JSON.parse(JSON.stringify(tickets.value)));
};

const maintenanceTable = ref(null);

const exportMaintenanceData = () => {
        maintenanceTable.value.exportCSV();
}
</script>