<template>
    <div class="p-grid p-justify-between p-align-center p-mb-3">
        <h1 class="p-col-fixed">Notice Board</h1>
    </div>
    <br>
    <DataTable :value="messages" paginator :rows="5" ref="messagesTable">
        <template #paginatorend>
            <Button type="button" icon="pi pi-download" text @click="exportNoticeBoardData" />
        </template>
        <Column field="createdBy.name" header="By"></Column>
        <Column field="dateCreated" header="When"></Column>
        <Column field="description" header="Message"></Column>
    </DataTable>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

const db = getFirestore();
const store = useStore();

const messages = ref([]);

onMounted(async () => {
        // A tenant's own record stores the landlord who created it. Scoping by it
        // is what keeps this view from listing every landlord's notices.
        const landlordId = store.state.user?.createdBy;
        if (!landlordId) return;

        const q = query(collection(db, 'noticeboard'), where('landlordId', '==', landlordId));
        const querySnapshot = await getDocs(q);
        messages.value = querySnapshot.docs.map(doc => {
                const data = doc.data();
                // Convert the Timestamp to a JavaScript Date and format it as a string
                data.dateCreated = data.dateCreated.toDate().toLocaleDateString('en-GB');
                return data;
        });
});

const messagesTable = ref(null);

const exportNoticeBoardData = () => {
  messagesTable.value.exportCSV();
}
</script>