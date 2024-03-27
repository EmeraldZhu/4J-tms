<script setup>
import { ref, computed } from 'vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { useStore } from 'vuex';

const store = useStore();
const tenantDetails = computed(() => store.state.user);

const auth = getAuth();
const db = getFirestore();
</script>

<template>
    <div class="p-grid p-justify-center p-align-center p-mt-4" v-if="tenantDetails">
        <div class="p-col-12">
            <h1>Welcome</h1>
        </div>
        <div class="p-col-12 p-md-6 p-lg-4 p-text-center">
            <div class="p-grid">
                <div class="p-col-12">
                    <!-- Assume fullNames contains the full name -->
                    <h2>{{ tenantDetails.fullNames }}</h2>
                </div>
                <div class="p-col-12">
                    <!-- Assume idNumber contains the national ID number -->
                    <h3>Tenant ID: {{ tenantDetails.idNumber }}</h3>
                </div>
            </div>
        </div>
    </div>
    <div v-else>
        <p>Loading tenant details...</p>
    </div>
</template>