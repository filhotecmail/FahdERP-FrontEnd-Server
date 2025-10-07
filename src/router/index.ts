import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import IntroView from '../views/IntroView.vue'
import { moduleSystem, type ModuleDefinition } from '../modules/core/moduleSystem.js'
import { useToast } from 'vue-toastification'
import { useRBACAuth, type RBACAuthConfig } from '@/composables/useRBACAuth'
import '@/types/router' // Importar tipos estendidos

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
    meta: {
      rbac_auth: {
        auth_module:'PRINCIPAL',
        auth_submodule:'DASHBOARD',
        auth_action:'v'
      }
    },
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
  // Usar toast para exibir erro
  const toast = useToast()
  toast.error(`Erro de navegação: ${error.message}`, {
    timeout: 6000,
    closeOnClick: true,
    pauseOnHover: true
  })
})

// Guard de navegação RBAC
router.beforeEach(async (to, from, next) => {
  // Verificar se a rota tem configuração RBAC
  const rbacConfig = to.meta?.rbac_auth

  if (rbacConfig) {
    // Verificar se o usuário está autenticado
    const authData = localStorage.getItem('authData')
    if (!authData) {
      const toast = useToast()
      toast.error('Você precisa estar logado para acessar esta página', {
        timeout: 5000,
        closeOnClick: true,
        pauseOnHover: true
      })
      next('/login')
      return
    }

    try {
      // Usar o composable RBAC para verificar permissões
      const { checkPermission } = useRBACAuth()
      const permission = await checkPermission(rbacConfig as RBACAuthConfig, to.name as string)

      if (permission) {
        // Salvar permissões no meta da rota para uso posterior
        to.meta.rbacPermissions = permission
        next()
      } else {
        const toast = useToast()
        toast.error('Você não tem permissão para acessar essa rota com suas credenciais, solicite permissão ao administrador', {
          timeout: 5000,
          closeOnClick: true,
          pauseOnHover: true
        })
        // Redirecionar para página anterior ou dashboard
        next(from.path !== to.path ? from.path : '/dashboard')
      }
    } catch {
      const toast = useToast()
      toast.error('Erro ao verificar permissões. Tente novamente.', {
        timeout: 5000,
        closeOnClick: true,
        pauseOnHover: true
      })
      next(false) // Cancelar navegação
    }
  } else {
    // Rota sem RBAC, permitir acesso
    next()
  }
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
