<template>
        <Toast />
        <div class="p-grid p-justify-between p-align-center p-mb-3">
        <h1 class="p-col-fixed">Maintenance Tickets</h1>
        </div>
        <DataTable :value="tickets" paginator :rows="5" ref="maintenanceTable">
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
                </Column>
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
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
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