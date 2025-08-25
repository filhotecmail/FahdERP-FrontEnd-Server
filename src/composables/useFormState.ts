import { computed, ref, onMounted, onUnmounted, getCurrentInstance, type ComputedRef, type Ref } from 'vue'
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
  defaultValue?: unknown
  type?: FormField['type']
  validator?: (value: unknown) => boolean | string
  transformer?: (value: unknown) => unknown
  debounceMs?: number
}

export interface UseFormStateReturn {
  // Identificação
  formId: string
  isRegistered: ComputedRef<boolean> | Ref<boolean>

  // Campos
  field: <T = unknown>(name: string, config?: FormFieldConfig) => {
    value: ComputedRef<T>
    setValue: (value: T) => void
    reset: () => void
    isValid: ComputedRef<boolean>
    error: ComputedRef<string | null>
  }

  // Estado dos campos
  fields: ComputedRef<Record<string, unknown>>

  // Paginação
  pagination: ComputedRef<{
    currentPage: number
    itemsPerPage: number
    totalItems: number
    totalPages?: number
    recordsPerPage?: number
    setPage?: (page: number) => void
    setCurrentPage?: (page: number) => void
    setItemsPerPage?: (items: number) => void
    setTotalItems?: (total: number) => void
    nextPage?: () => void
    prevPage?: () => void
  }>

  // Filtros
  filters: ComputedRef<{
    searchTerm: string
    filters: Record<string, unknown>
    sortBy: string
    sortOrder: 'asc' | 'desc'
    expanded: boolean
    setSearchTerm?: (term: string) => void
    setFilter?: (key: string, value: unknown) => void
    clearFilters?: () => void
    toggleExpanded?: () => void
    setSorting?: (by: string, order?: 'asc' | 'desc') => void
  }>

  // Seleção
  selection: ComputedRef<{
    selectedItems: unknown[]
    selectAll: boolean
    setSelectedItems?: (items: unknown[]) => void
    toggleSelectAll?: () => void
    selectItem?: (item: unknown) => void
    deselectItem?: (item: unknown) => void
  }>

  // UI
  ui: ComputedRef<Record<string, unknown>>
  
  // Métodos de controle
  save: () => void
  restore: () => void
  clear: () => void
  reset: () => void
  undo: () => boolean
  redo: () => boolean
  
  // Estado e estatísticas
  isDirty: ComputedRef<boolean>
  lastUpdated: ComputedRef<Date | null>
  version: ComputedRef<number>
  
  // Métodos utilitários
  exportState: () => CompleteFormState | null
  importState: (state: CompleteFormState) => void
}

// Composable principal
// Função para sanitizar valores e evitar objetos nos campos
function sanitizeValue(value: unknown, type: FormField['type'] = 'string'): unknown {
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
  function field<T = unknown>(name: string, config: FormFieldConfig = {}) {
    // Salvar configuração do campo
    fieldConfigs.value[name] = config
    
    // Valor computado reativo
    const value = computed({
      get(): T {
        const state = currentState.value
        if (!state) return sanitizeValue(config.defaultValue, config.type) as T
        
        const field = state.form.fields[name]
        if (!field) return sanitizeValue(config.defaultValue, config.type) as T
        
        // Sanitizar o valor lido para corrigir dados corrompidos
        const sanitizedValue = sanitizeValue(field.value, config.type)
        return config.transformer ? config.transformer(sanitizedValue) as T : sanitizedValue as T
      },
      set(newValue: T) {
        if (!isRegistered.value) registerForm()
        
        // Sanitizar o valor antes de aplicar transformações
        const sanitizedValue = sanitizeValue(newValue, config.type)
        const finalValue = config.transformer ? config.transformer(sanitizedValue) as T : sanitizedValue as T
        
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
      reset: () => { value.value = config.defaultValue as T },
      isValid,
      error
    }
  }
  
  // Campos como objeto reativo
  const fields = computed(() => {
    const state = currentState.value
    if (!state) return {}
    
    const result: Record<string, unknown> = {}
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
      setFilter: (key: string, value: unknown) => {
        if (!isRegistered.value) registerForm()
        const currentFilters = { ...filt.filters }
        currentFilters[key] = { value }
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
      setSelectedItems: (items: unknown[]) => {
        if (!isRegistered.value) registerForm()
        store.updateSelection(formId, { selectedItems: items })
      },
      toggleSelectAll: () => {
        if (!isRegistered.value) registerForm()
        store.updateSelection(formId, { selectAll: !sel.selectAll })
      },
      selectItem: (item: unknown) => {
        if (!isRegistered.value) registerForm()
        const items = [...sel.selectedItems]
        if (!items.find(i => JSON.stringify(i) === JSON.stringify(item))) {
          items.push(item)
          store.updateSelection(formId, { selectedItems: items })
        }
      },
      deselectItem: (item: unknown) => {
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
export function useSimpleFormState(fields: Record<string, unknown> = {}) {
  const formState = useFormState()
  
  // Criar campos reativos automaticamente
  const reactiveFields: Record<string, unknown> = {}
  
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
export function useListFormState<T = unknown>(options: UseFormStateOptions = {}) {
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