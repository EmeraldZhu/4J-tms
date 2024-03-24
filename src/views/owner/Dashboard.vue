<template>
    <div class="grid">
        <div class="col-6 border-round">
            <h3>Your Properties</h3>
            <div class="properties-datatable">
                <DataTable :value="properties">
                <!-- Define your columns here -->
                </DataTable>
            </div>
        </div>
        <div class="col-6 border-round">
            <h3>Your Units</h3>
            <div class="property-selector">
                <Dropdown v-model="selectedProperty" :options="landlordProperties" optionLabel="label" placeholder="Select a property" />
            </div>
            <div class="units-datatable">
                <DataTable :value="units">
                <!-- Define your columns here -->
                </DataTable>
            </div> 
        </div>
    </div>
</template>

<script setup>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
</script>