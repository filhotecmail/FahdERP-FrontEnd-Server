import type { App } from 'vue'
import { useGlobalFormStateStore } from '@/stores/globalFormState'
import { FormIdentifierManager } from '@/utils/formIdentifier'

// Tipos para configuração do plugin
export interface FormStatePluginOptions {
  // Prefixo para identificadores de formulário
  idPrefix?: string
  // Tempo de debounce padrão para salvamento automático (ms)
  defaultDebounce?: number
  // Habilitar persistência no localStorage
  enablePersistence?: boolean
  // Chave do localStorage para persistência
  storageKey?: string
  // Habilitar logs de debug
  debug?: boolean
  // Formulários a serem excluídos do auto-registro
  excludeRoutes?: string[]
  // Tempo limite para limpeza automática de estados inativos (ms)
  cleanupTimeout?: number
}

// Configuração padrão do plugin
const defaultOptions: Required<FormStatePluginOptions> = {
  idPrefix: 'form',
  defaultDebounce: 500,
  enablePersistence: true,
  storageKey: 'fahd_form_states',
  debug: false,
  excludeRoutes: ['/login', '/logout', '/404', '/500'],
  cleanupTimeout: 30 * 60 * 1000 // 30 minutos
}

// Plugin principal
export const FormStatePlugin = {
  install(app: App, options: FormStatePluginOptions = {}) {
    const config = { ...defaultOptions, ...options }
    
    // Registrar configuração global
    app.config.globalProperties.$formStateConfig = config
    app.provide('formStateConfig', config)
    
    // Inicializar gerenciador de identificadores
    const identifierManager = FormIdentifierManager.getInstance()
    
    // Inicializar store global
    const globalStore = useGlobalFormStateStore()
    
    // Configurar persistência se habilitada
    if (config.enablePersistence) {
      // Carregar estados salvos do localStorage
      try {
        const savedStates = localStorage.getItem(config.storageKey)
        if (savedStates) {
          const parsed = JSON.parse(savedStates)
          Object.keys(parsed).forEach(formId => {
            const state = parsed[formId]
            globalStore.registerForm(formId, state.form.metadata.route, state.form.metadata.component, state)
          })
          
          if (config.debug) {
            console.log('[FormStatePlugin] Estados carregados do localStorage:', Object.keys(parsed))
          }
        }
      } catch (error) {
        if (config.debug) {
          console.warn('[FormStatePlugin] Erro ao carregar estados do localStorage:', error)
        }
      }
      
      // Configurar salvamento automático
      let saveTimeout: number | null = null
      
      const saveToStorage = () => {
        try {
          const allStates = globalStore.formStates
          localStorage.setItem(config.storageKey, JSON.stringify(allStates))
          
          if (config.debug) {
            console.log('[FormStatePlugin] Estados salvos no localStorage:', Object.keys(allStates))
          }
        } catch (error) {
          if (config.debug) {
            console.warn('[FormStatePlugin] Erro ao salvar estados no localStorage:', error)
          }
        }
      }
      
      // Debounced save function
      const debouncedSave = () => {
        if (saveTimeout) {
          window.clearTimeout(saveTimeout)
        }
        saveTimeout = window.setTimeout(saveToStorage, config.defaultDebounce)
      }
      
      // Observar mudanças no store e salvar automaticamente
      globalStore.$subscribe(() => {
        debouncedSave()
      })
      
      // Salvar antes de sair da página
      window.addEventListener('beforeunload', saveToStorage)
    }
    
    // Configurar limpeza automática de estados inativos
    if (config.cleanupTimeout > 0) {
      setInterval(() => {
        const now = Date.now()
        const allStates = globalStore.formStates
        
        Object.keys(allStates).forEach(formId => {
          const state = allStates[formId]
          if (state.form.metadata.lastUpdated && (now - new Date(state.form.metadata.lastUpdated).getTime()) > config.cleanupTimeout) {
            globalStore.removeForm(formId)
            
            if (config.debug) {
              console.log(`[FormStatePlugin] Estado inativo removido: ${formId}`)
            }
          }
        })
      }, config.cleanupTimeout)
    }
    
    // Mixin global para auto-registro de formulários
    app.mixin({
      beforeCreate() {
        // Verificar se o componente deve ser registrado
        const route = this.$route
        if (!route || config.excludeRoutes.includes(route.path)) {
          return
        }
        
        // Gerar ID único para o formulário
        const formId = identifierManager.generateSimpleId(
          route.path,
          this.$options.name || this.$options.__name || 'anonymous'
        )
        
        // Registrar formulário no store se ainda não existir
        if (!globalStore.formStates[formId]) {
          globalStore.registerForm(
            formId,
            route.path,
            this.$options.name || this.$options.__name || 'anonymous'
          )
          
          if (config.debug) {
            console.log(`[FormStatePlugin] Formulário auto-registrado: ${formId}`)
          }
        }
        
        // Disponibilizar ID do formulário para o componente
        this._formStateId = formId
      },
      
      beforeUnmount() {
        // Opcional: marcar formulário como inativo
        if (this._formStateId && config.debug) {
          console.log(`[FormStatePlugin] Componente desmontado: ${this._formStateId}`)
        }
      }
    })
    
    // Métodos globais disponíveis em todos os componentes
    app.config.globalProperties.$getFormState = (formId?: string) => {
      const id = formId || app.config.globalProperties._formStateId
      return id ? globalStore.getFormState(id) : null
    }
    
    app.config.globalProperties.$updateFormState = (updates: {
      fields?: Record<string, { value: unknown, type?: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'date' }>,
      pagination?: Partial<{ currentPage: number, itemsPerPage: number, totalItems: number, recordsPerPage: number }>,
      filters?: Partial<{ searchTerm: string, filters: Record<string, { value: unknown }>, expanded: boolean, sortBy: string, sortOrder: 'asc' | 'desc' }>,
      selection?: Partial<{ selectedItems: unknown[], selectAll: boolean }>,
      ui?: Partial<{ activeTab: string, sidebarCollapsed: boolean, modalStates: Record<string, boolean>, loadingStates: Record<string, boolean> }>
    }, formId?: string) => {
      const id = formId || app.config.globalProperties._formStateId
      if (id && globalStore.formStates[id]) {
        // Atualizar campos se fornecidos
        if (updates.fields) {
          globalStore.updateFields(id, updates.fields)
        }
        // Atualizar paginação se fornecida
        if (updates.pagination) {
          globalStore.updatePagination(id, updates.pagination)
        }
        // Atualizar filtros se fornecidos
        if (updates.filters) {
          globalStore.updateFilters(id, updates.filters)
        }
        // Atualizar seleção se fornecida
        if (updates.selection) {
          globalStore.updateSelection(id, updates.selection)
        }
        // Atualizar UI se fornecida
        if (updates.ui) {
          globalStore.updateUI(id, updates.ui)
        }
      }
    }
    
    app.config.globalProperties.$clearFormState = (formId?: string) => {
      const id = formId || app.config.globalProperties._formStateId
      if (id) {
        globalStore.clearForm(id)
      }
    }
    
    if (config.debug) {
      console.log('[FormStatePlugin] Plugin instalado com configuração:', config)
    }
  }
}

// Função helper para usar o plugin
export function createFormStatePlugin(options?: FormStatePluginOptions) {
  return {
    install: FormStatePlugin.install,
    options
  }
}

// Export do tipo para TypeScript já declarado acima

// Export padrão
export default FormStatePlugin