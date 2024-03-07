import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import firebaseConfig from './services/firebase-config';
import PrimeVue from 'primevue/config';

import 'primevue/resources/themes/saga-blue/theme.css' // Theme
import 'primevue/resources/primevue.min.css' // Core CSS
import 'primeicons/primeicons.css' // Icons

const app = createApp(App);

app.use(PrimeVue);
app.use(router);

app.mount('#app');
