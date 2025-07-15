import { createApp } from 'vue'
import App from './App.vue'
import { router } from './config/router'
import './style.css'
import '@sciux/theme-default/styles/main.css'

createApp(App).use(router).mount('#app')
