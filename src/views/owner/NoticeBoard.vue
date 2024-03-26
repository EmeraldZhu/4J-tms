<template>
        <Toast />
        <div class="p-grid p-justify-between p-align-center p-mb-3">
                <h1 class="p-col-fixed">Notice Board</h1>
        </div>
        <div class="p-fluid">
                <div class="p-field">
                        <label for="description">Messages will be sent to all tenants</label>
                        <br><br>
                        <Textarea id="description" v-model="noticeboard.description" rows="5"
                                placeholder="Type your message here" />
                </div>
        </div>
        <br>
        <div class="p-d-flex p-jc-between p-mt-3">
                <Button label="Send Message" @click="submitMessage" />
        </div>
        <br>
        <DataTable :value="messages" paginator :rows="5" ref="messagesTable">
                <template #paginatorend>
                        <Button type="button" icon="pi pi-download" text @click="exportNoticeBoardData" />
                </template>
                <Column field="dateCreated" header="When"></Column>
                <Column field="description" header="Message"></Column>
        </DataTable>
</template>

<script setup>
import { ref, watchEffect, onMounted } from 'vue';
import { useStore } from 'vuex';
import Button from 'primevue/button';
import Textarea from 'primevue/textarea';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, query, where, getDocs } from "firebase/firestore";

const auth = getAuth();
const db = getFirestore();
const store = useStore();

const toast = useToast();

const noticeboard = ref({
        description: '',
});

watchEffect(() => {
        const userData = store.state.user;
        if (userData) {
                name = userData.firstName + ' ' + userData.lastName;
        }
});

const submitMessage = async () => {
        const newMessage = {
                ...noticeboard.value,
                dateCreated: new Date(),
                createdBy: {
                        name: name,
                        uid: auth.currentUser.uid,
                },
        };

        try {
                await addDoc(collection(db, 'noticeboard'), newMessage);
                toast.add({ severity: 'success', summary: 'Success', detail: 'Message sent successfully', life: 3000 });

                // Reset the form fields
                noticeboard.value = {
                        description: '',
                };
        } catch (e) {
                console.error('Error adding document: ', e);
                toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to send message', life: 3000 });
        }
};

const messages = ref([]);

onMounted(async () => {
        const q = query(collection(db, 'noticeboard'), where('createdBy.uid', '==', auth.currentUser.uid));
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