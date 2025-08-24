import './assets/main.css'
import './assets/toast-custom.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

import App from './App.vue'
import router from './router'
import { useThemeStore } from './stores/theme'
import { FormStatePlugin } from './plugins/formStatePlugin'
import { addToGlobalConsole } from './utils/debugFormState'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(FormStatePlugin, {
  enablePersistence: true,
  defaultDebounce: 500,
  debug: import.meta.env.DEV,
  cleanupTimeout: 30 * 60 * 1000 // 30 minutos
})
app.use(Toast, {
  position: 'top-right',
  timeout: 4000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false
})

// Inicializar tema
const themeStore = useThemeStore()
themeStore.initTheme()

// Adicionar ferramentas de debug em desenvolvimento
if (import.meta.env.DEV) {
  addToGlobalConsole()
}

app.mount('#app')
