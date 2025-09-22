import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './assets/styles/main.css';

// Import FontAwesome CSS
import '@fortawesome/fontawesome-free/css/all.css'

// Import auth initialization
import { initializeAuth } from './stores/auth';

const app = createApp(App);

app.use(createPinia());
app.use(router);

// Initialize authentication before mounting
initializeAuth();

app.mount('#app');