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
</template>

<script setup>
import { ref } from 'vue';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Textarea from 'primevue/textarea';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const auth = getAuth();
const db = getFirestore();

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

const submitTicket = async () => {
    const newTicket = {
        ...ticket.value,
        dateCreated: new Date(),
        createdBy: {
            name: auth.currentUser.displayName,
            uid: auth.currentUser.uid,
        },
        status: 'Open',
    };

    try {
        await addDoc(collection(db, 'maintenance'), newTicket);
        showDialog.value = false;
        toast.add({severity:'success', summary: 'Success', detail: 'Ticket submitted successfully', life: 3000});
    } catch (e) {
        console.error('Error adding document: ', e);
        toast.add({severity:'error', summary: 'Error', detail: 'Failed to submit ticket', life: 3000});
    }
};
</script>