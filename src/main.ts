import { registerPlugins } from '@/plugins'
import { createPinia } from 'pinia';

import App from './App.vue'

import { createApp } from 'vue'

const app = createApp(App)

registerPlugins(app)

const pinia = createPinia();
app.use(pinia);
app.mount('#app')
