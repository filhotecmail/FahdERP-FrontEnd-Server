import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import IntroView from '../views/IntroView.vue'
import { moduleSystem, type ModuleDefinition } from '../modules/core/moduleSystem.js'
import { useToast } from 'vue-toastification'

// Base routes
const baseRoutes = [
  {
    path: '/',
    name: 'intro',
    component: IntroView,
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/DashboardView.vue')
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: baseRoutes,
})

// Tratamento global de erros de navegação
router.onError((error) => {
  console.error('Erro de navegação:', error)
  
  // Usar toast para exibir erro
  const toast = useToast()
  toast.error(`Erro de navegação: ${error.message}`, {
    timeout: 6000,
    closeOnClick: true,
    pauseOnHover: true
  })
})

// Function to register module routes dynamically
export function registerModuleRoutes() {
  const modules = moduleSystem.getAllModules()
  
  modules.forEach((module: ModuleDefinition) => {
    if (module.routes) {
      (module.routes as RouteRecordRaw[]).forEach((route: RouteRecordRaw) => {
        router.addRoute(route)
      })
    }
  })
}

export default router
