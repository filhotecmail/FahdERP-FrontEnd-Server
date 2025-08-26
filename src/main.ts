import './assets/main.css'
import './assets/toast-custom.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import { configureSweetAlert } from './plugins/sweetalert'

import App from './App.vue'
import router, { registerModuleRoutes } from './router'
import { useThemeStore } from './stores/theme'
import { FormStatePlugin } from './plugins/formStatePlugin'
import { addToGlobalConsole } from './utils/debugFormState'
import { ModuleSystemPlugin, moduleSystem } from './modules/core/moduleSystem.js'
import esocialModule from './modules/esocial/index.js'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

// Registrar módulos antes do router
moduleSystem.registerModule(esocialModule)

// Configurar sistema de módulos
app.use(ModuleSystemPlugin, { router })

// Registrar rotas dos módulos
registerModuleRoutes()

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

// Configurar SweetAlert com tema personalizado
configureSweetAlert()

// Adicionar ferramentas de debug em desenvolvimento
if (import.meta.env.DEV) {
  addToGlobalConsole()
}

// Tratamento global de erros não capturados
app.config.errorHandler = (err, instance, info) => {
  console.error('Erro global capturado:', err, info)
  
  // Usar toast para exibir erro
  import('vue-toastification').then(({ useToast }) => {
    const toast = useToast()
    const error = err as Error
    toast.error(`Erro da aplicação: ${error.message || 'Erro desconhecido'}`, {
      timeout: 8000,
      closeOnClick: true,
      pauseOnHover: true
    })
  })
}

app.mount('#app')
