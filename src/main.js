import { createApp } from 'vue';
import App from './App.vue';
import firebaseConfig from './services/firebase-config';
import router from './router';
import { store } from './store';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';

import 'primevue/resources/themes/saga-blue/theme.css' // Theme
import 'primevue/resources/primevue.min.css' // Core CSS
import 'primeicons/primeicons.css' // Icons
import 'primevue/resources/primeflex/primeflex.css'; // If you use PrimeFlex
import 'primevue/components/toast/toast.css';

const app = createApp(App);

app.use(PrimeVue);
app.use(store);
app.use(router);
app.use(ToastService);

app.mount('#app');
