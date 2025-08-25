import type { App } from 'vue'
import type { Router } from 'vue-router'

// Interface para definição de módulos
export interface ModuleDefinition {
  name: string
  install: (app: App, options?: { router?: Router }) => void
  navigation?: {
    title: string
    icon: string
    items: NavigationItem[]
  }
  viewComponents?: Record<string, unknown>
  routes?: unknown[]
  components?: Record<string, unknown>
}

export interface NavigationItem {
  id: string
  title: string
  component?: string
  route?: string
  icon: string
  children?: NavigationItem[]
}

// Sistema de gerenciamento de módulos
export class ModuleSystem {
  private modules: Map<string, ModuleDefinition> = new Map()
  private app: App | null = null
  private router: Router | null = null

  constructor(app?: App, router?: Router) {
    this.app = app || null
    this.router = router || null
  }

  // Registrar um módulo
  registerModule(module: ModuleDefinition): void {
    if (this.modules.has(module.name)) {
      console.warn(`Módulo '${module.name}' já está registrado`)
      return
    }

    this.modules.set(module.name, module)

    // Se o app já foi inicializado, instalar o módulo imediatamente
    if (this.app) {
      this.installModule(module)
    }
  }

  // Instalar um módulo específico
  private installModule(module: ModuleDefinition): void {
    if (!this.app) {
      throw new Error('App não foi inicializado')
    }

    try {
      module.install(this.app, { router: this.router || undefined })
      console.log(`Módulo '${module.name}' instalado com sucesso`)
    } catch (error) {
      console.error(`Erro ao instalar módulo '${module.name}':`, error)
    }
  }

  // Instalar todos os módulos registrados
  installAllModules(app: App, router?: Router): void {
    this.app = app
    this.router = router || null

    this.modules.forEach(module => {
      this.installModule(module)
    })
  }

  // Obter módulo por nome
  getModule(name: string): ModuleDefinition | undefined {
    return this.modules.get(name)
  }

  // Obter todos os módulos
  getAllModules(): ModuleDefinition[] {
    return Array.from(this.modules.values())
  }

  // Obter navegação de todos os módulos
  getNavigation(): NavigationItem[] {
    const navigation: NavigationItem[] = []

    this.modules.forEach(module => {
      if (module.navigation) {
        navigation.push({
          id: module.name,
          title: module.navigation.title,
          icon: module.navigation.icon,
          component: '',
          children: module.navigation.items
        })
      }
    })

    return navigation
  }

  // Obter componentes de view de todos os módulos
  getViewComponents(): Record<string, unknown> {
    const viewComponents: Record<string, unknown> = {}

    this.modules.forEach(module => {
      if (module.viewComponents) {
        Object.assign(viewComponents, module.viewComponents)
      }
    })

    return viewComponents
  }

  // Desregistrar um módulo
  unregisterModule(name: string): boolean {
    return this.modules.delete(name)
  }

  // Limpar todos os módulos
  clear(): void {
    this.modules.clear()
  }
}

// Instância global do sistema de módulos
export const moduleSystem = new ModuleSystem()

// Plugin Vue para o sistema de módulos
export const ModuleSystemPlugin = {
  install(app: App, options: { router?: Router } = {}) {
    // Disponibilizar o sistema de módulos globalmente
    app.config.globalProperties.$moduleSystem = moduleSystem
    app.provide('moduleSystem', moduleSystem)

    // Instalar todos os módulos registrados
    moduleSystem.installAllModules(app, options.router)
  }
}