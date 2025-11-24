import { createApp } from 'vue'
import App from './App.vue'
import './styles/reset.css'
import './styles/global.scss'
import { gapiLoaded, gisLoaded } from './services/googleDrive'

// Set up Google API callbacks before scripts load
const win = window as any
win.gapiLoaded = gapiLoaded
win.gisLoaded = gisLoaded

createApp(App).mount('#app')

