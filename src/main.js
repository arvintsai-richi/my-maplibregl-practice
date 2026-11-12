import { createApp } from 'vue';
import { setupRouter } from './router';

import { createPinia } from 'pinia';
import App from './App.vue';

// styles
// import '@/styles/reset.css';

const app = createApp(App);

app.use(setupRouter());

app.use(createPinia());

app.mount('#app');
