import { computed, ref, watch, onMounted, onUnmounted, getCurrentInstance } from 'vue'
import { useRoute } from 'vue-router'
import { useGlobalFormStateStore, type FormField, type CompleteFormState } from '@/stores/globalFormState'

// Tipos para o composable
export interface UseFormStateOptions {
  formId?: string
  instanceId?: string
  autoSave?: boolean
  persistToLocalStorage?: boolean
  restoreOnMount?: boolean
  clearOnUnmount?: boolean
  debounceMs?: number
}

export interface FormFieldConfig {
  defaultValue?: any
  type?: FormField['type']
  validator?: (value: any) => boolean | string
  transformer?: (value: any) => any
  debounceMs?: number
}

export interface UseFormStateReturn {
  // Estado do formulário
  formId: string
  isRegistered: any
  
  // Campos do formulário
  field: <T = any>(name: string, config?: FormFieldConfig) => {
    value: any
    setValue: (value: T) => void
    reset: () => void
    isValid: any
    error: any
  }
  
  // Campos reativos
  fields: any
  
  // Paginação
  pagination: any
  
  // Filtros
  filters: any
  
  // Seleção
  selection: any
  
  // UI
  ui: any
  
  // Métodos de controle
  save: () => void
  restore: () => void
  clear: () => void
  reset: () => void
  undo: () => boolean
  redo: () => boolean
  
  // Estado e estatísticas
  isDirty: any
  lastUpdated: any
  version: any
  
  // Métodos utilitários
  exportState: () => any
  importState: (state: any) => void
}

// Composable principal
// Função para sanitizar valores e evitar objetos nos campos
function sanitizeValue(value: any, type: FormField['type'] = 'string'): any {
  // Se o valor é null ou undefined, retorna o valor padrão baseado no tipo
  if (value === null || value === undefined) {
    switch (type) {
      case 'string': return ''
      case 'number': return 0
      case 'boolean': return false
      case 'array': return []
      case 'object': return {}
      case 'date': return ''
      default: return ''
    }
  }
  
  // Se o valor é um objeto complexo e o tipo não é 'object' ou 'array', converte para string
  if (typeof value === 'object' && value !== null && type !== 'object' && type !== 'array') {
    console.warn(`[useFormState] Valor objeto detectado para campo tipo '${type}', convertendo para string:`, value)
    return JSON.stringify(value)
  }
  
  // Validação por tipo
  switch (type) {
    case 'string':
      return typeof value === 'string' ? value : String(value)
    case 'number':
      const num = Number(value)
      return isNaN(num) ? 0 : num
    case 'boolean':
      return Boolean(value)
    case 'array':
      return Array.isArray(value) ? value : []
    case 'object':
      return typeof value === 'object' && value !== null ? value : {}
    case 'date':
      return typeof value === 'string' ? value : String(value)
    default:
      return value
  }
}

export function useFormState(options: UseFormStateOptions = {}): UseFormStateReturn {
  const route = useRoute()
  const instance = getCurrentInstance()
  const store = useGlobalFormStateStore()
  
  // Configurações padrão
  const config = {
    autoSave: true,
    persistToLocalStorage: true,
    restoreOnMount: true,
    clearOnUnmount: false,
    debounceMs: 300,
    ...options
  }
  
  // Gerar ID único do formulário
  const componentName = instance?.type.__name || instance?.type.name || 'UnknownComponent'
  const formId = options.formId || store.generateFormId(
    route.path,
    componentName,
    options.instanceId
  )
  
  // Estado local
  const isRegistered = ref(false)
  const fieldConfigs = ref<Record<string, FormFieldConfig>>({})
  const debounceTimers = ref<Record<string, number>>({})
  
  // Registrar formulário
  function registerForm() {
    if (config.restoreOnMount) {
      store.restoreForm(formId, route.path, componentName)
    } else {
      store.registerForm(formId, route.path, componentName)
    }
    isRegistered.value = true
  }
  
  // Obter estado atual
  const currentState = computed(() => store.getFormState(formId))
  
  // Função para criar campo reativo
  function field<T = any>(name: string, config: FormFieldConfig = {}) {
    // Salvar configuração do campo
    fieldConfigs.value[name] = config
    
    // Valor computado reativo
    const value = computed({
      get(): T {
        const state = currentState.value
        if (!state) return sanitizeValue(config.defaultValue, config.type)
        
        const field = state.form.fields[name]
        if (!field) return sanitizeValue(config.defaultValue, config.type)
        
        // Sanitizar o valor lido para corrigir dados corrompidos
        const sanitizedValue = sanitizeValue(field.value, config.type)
        return config.transformer ? config.transformer(sanitizedValue) : sanitizedValue
      },
      set(newValue: T) {
        if (!isRegistered.value) registerForm()
        
        // Sanitizar o valor antes de aplicar transformações
        const sanitizedValue = sanitizeValue(newValue, config.type)
        const finalValue = config.transformer ? config.transformer(sanitizedValue) : sanitizedValue
        
        // Debounce se configurado
        if (config.debounceMs && config.debounceMs > 0) {
          if (debounceTimers.value[name]) {
            clearTimeout(debounceTimers.value[name])
          }
          
          debounceTimers.value[name] = window.setTimeout(() => {
            store.updateField(formId, name, finalValue, config.type)
            delete debounceTimers.value[name]
          }, config.debounceMs)
        } else {
          store.updateField(formId, name, finalValue, config.type)
        }
      }
    })
    
    // Validação
    const isValid = computed(() => {
      if (!config.validator) return true
      const result = config.validator(value.value)
      return result === true
    })
    
    const error = computed(() => {
      if (!config.validator) return null
      const result = config.validator(value.value)
      return typeof result === 'string' ? result : null
    })
    
    return {
      value,
      setValue: (newValue: T) => { value.value = newValue },
      reset: () => { value.value = config.defaultValue },
      isValid,
      error
    }
  }
  
  // Campos como objeto reativo
  const fields = computed(() => {
    const state = currentState.value
    if (!state) return {}
    
    const result: Record<string, any> = {}
    Object.entries(state.form.fields).forEach(([name, field]) => {
      const config = fieldConfigs.value[name]
      result[name] = config?.transformer ? config.transformer(field.value) : field.value
    })
    
    return result
  })
  
  // Paginação
  const pagination = computed(() => {
    const state = currentState.value
    const pag = state?.pagination || {
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: 0,
      recordsPerPage: 10
    }
    
    return {
      ...pag,
      setPage: (page: number) => {
        if (!isRegistered.value) registerForm()
        store.updatePagination(formId, { currentPage: page })
      },
      setItemsPerPage: (items: number) => {
        if (!isRegistered.value) registerForm()
        store.updatePagination(formId, { itemsPerPage: items, recordsPerPage: items })
      },
      setTotalItems: (total: number) => {
        if (!isRegistered.value) registerForm()
        store.updatePagination(formId, { totalItems: total })
      }
    }
  })
  
  // Filtros
  const filters = computed(() => {
    const state = currentState.value
    const filt = state?.filters || {
      searchTerm: '',
      filters: {},
      expanded: false,
      sortBy: '',
      sortOrder: 'asc' as const
    }
    
    return {
      ...filt,
      setSearchTerm: (term: string) => {
        if (!isRegistered.value) registerForm()
        store.updateFilters(formId, { searchTerm: term })
      },
      setFilter: (key: string, value: any) => {
        if (!isRegistered.value) registerForm()
        const currentFilters = { ...filt.filters }
        currentFilters[key] = value
        store.updateFilters(formId, { filters: currentFilters })
      },
      clearFilters: () => {
        if (!isRegistered.value) registerForm()
        store.updateFilters(formId, { 
          searchTerm: '', 
          filters: {},
          sortBy: '',
          sortOrder: 'asc'
        })
      },
      toggleExpanded: () => {
        if (!isRegistered.value) registerForm()
        store.updateFilters(formId, { expanded: !filt.expanded })
      },
      setSorting: (by: string, order: 'asc' | 'desc' = 'asc') => {
        if (!isRegistered.value) registerForm()
        store.updateFilters(formId, { sortBy: by, sortOrder: order })
      }
    }
  })
  
  // Seleção
  const selection = computed(() => {
    const state = currentState.value
    const sel = state?.selection || {
      selectedItems: [],
      selectAll: false
    }
    
    return {
      ...sel,
      setSelectedItems: (items: any[]) => {
        if (!isRegistered.value) registerForm()
        store.updateSelection(formId, { selectedItems: items })
      },
      toggleSelectAll: () => {
        if (!isRegistered.value) registerForm()
        store.updateSelection(formId, { selectAll: !sel.selectAll })
      },
      selectItem: (item: any) => {
        if (!isRegistered.value) registerForm()
        const items = [...sel.selectedItems]
        if (!items.find(i => JSON.stringify(i) === JSON.stringify(item))) {
          items.push(item)
          store.updateSelection(formId, { selectedItems: items })
        }
      },
      deselectItem: (item: any) => {
        if (!isRegistered.value) registerForm()
        const items = sel.selectedItems.filter(i => JSON.stringify(i) !== JSON.stringify(item))
        store.updateSelection(formId, { selectedItems: items })
      },
      clearSelection: () => {
        if (!isRegistered.value) registerForm()
        store.updateSelection(formId, { selectedItems: [], selectAll: false })
      }
    }
  })
  
  // UI
  const ui = computed(() => {
    const state = currentState.value
    const uiState = state?.ui || {
      activeTab: '',
      sidebarCollapsed: false,
      modalStates: {},
      loadingStates: {}
    }
    
    return {
      ...uiState,
      setActiveTab: (tab: string) => {
        if (!isRegistered.value) registerForm()
        store.updateUI(formId, { activeTab: tab })
      },
      toggleSidebar: () => {
        if (!isRegistered.value) registerForm()
        store.updateUI(formId, { sidebarCollapsed: !uiState.sidebarCollapsed })
      },
      setModalState: (modal: string, state: boolean) => {
        if (!isRegistered.value) registerForm()
        const modalStates = { ...uiState.modalStates }
        modalStates[modal] = state
        store.updateUI(formId, { modalStates })
      },
      setLoadingState: (key: string, state: boolean) => {
        if (!isRegistered.value) registerForm()
        const loadingStates = { ...uiState.loadingStates }
        loadingStates[key] = state
        store.updateUI(formId, { loadingStates })
      }
    }
  })
  
  // Estado e estatísticas
  const isDirty = computed(() => {
    const state = currentState.value
    return state ? state.form.metadata.version > 1 : false
  })
  
  const lastUpdated = computed(() => {
    const state = currentState.value
    return state ? state.form.metadata.lastUpdated : null
  })
  
  const version = computed(() => {
    const state = currentState.value
    return state ? state.form.metadata.version : 0
  })
  
  // Métodos de controle
  function save() {
    if (config.persistToLocalStorage) {
      store.saveToLocalStorage(formId)
    }
  }
  
  function restore() {
    store.restoreForm(formId, route.path, componentName)
  }
  
  function clear() {
    store.clearForm(formId)
  }
  
  function reset() {
    store.clearForm(formId, false)
  }
  
  function undo(): boolean {
    return store.undo(formId)
  }
  
  function redo(): boolean {
    return store.redo(formId)
  }
  
  function exportState() {
    return currentState.value
  }
  
  function importState(state: CompleteFormState) {
    if (!isRegistered.value) registerForm()
    store.formStates[formId] = state
  }
  
  // Lifecycle hooks
  onMounted(() => {
    if (config.restoreOnMount || config.autoSave) {
      registerForm()
    }
  })
  
  onUnmounted(() => {
    // Limpar timers de debounce
    Object.values(debounceTimers.value).forEach(timer => {
      if (timer) window.clearTimeout(timer)
    })
    
    if (config.clearOnUnmount) {
      store.removeForm(formId)
    } else if (config.persistToLocalStorage) {
      save()
    }
  })
  
  return {
    formId,
    isRegistered,
    field,
    fields,
    pagination,
    filters,
    selection,
    ui,
    save,
    restore,
    clear,
    reset,
    undo,
    redo,
    isDirty,
    lastUpdated,
    version,
    exportState,
    importState
  }
}

// Composable simplificado para casos básicos
export function useSimpleFormState(fields: Record<string, any> = {}) {
  const formState = useFormState()
  
  // Criar campos reativos automaticamente
  const reactiveFields: Record<string, any> = {}
  
  Object.entries(fields).forEach(([name, defaultValue]) => {
    const fieldType = typeof defaultValue === 'number' ? 'number' : 
                     typeof defaultValue === 'boolean' ? 'boolean' :
                     Array.isArray(defaultValue) ? 'array' :
                     typeof defaultValue === 'object' ? 'object' : 'string'
    
    const fieldInstance = formState.field(name, {
      defaultValue,
      type: fieldType
    })
    
    reactiveFields[name] = fieldInstance.value
  })
  
  return {
    ...formState,
    ...reactiveFields
  }
}

// Hook para formulários de lista/tabela
export function useListFormState<T = any>(options: UseFormStateOptions = {}) {
  const formState = useFormState(options)
  
  // Campos específicos para listas
  const searchTerm = formState.field('searchTerm', { defaultValue: '', type: 'string' })
  const selectedItems = formState.field<T[]>('selectedItems', { defaultValue: [], type: 'array' })
  
  return {
    ...formState,
    searchTerm: searchTerm.value,
    selectedItems: selectedItems.value,
    setSearchTerm: searchTerm.setValue,
    setSelectedItems: selectedItems.setValue
  }
}