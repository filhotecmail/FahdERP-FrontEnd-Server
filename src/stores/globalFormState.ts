import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'

/**
 * Campo de formulário com tipo e valor
 */
export interface FormField {
  value: unknown
  type: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'date'
  defaultValue?: unknown
}

/**
 * Estado completo de um formulário incluindo campos e metadados
 */
export interface FormState {
  fields: Record<string, FormField>
  metadata: {
    lastUpdated: Date
    route: string
    component: string
    version: number
  }
}

/**
 * Estado de paginação para listas e tabelas
 */
export interface PaginationState {
  currentPage: number
  itemsPerPage: number
  totalItems: number
  recordsPerPage: number
}

/**
 * Estado de filtros e busca
 */
export interface FilterState {
  searchTerm: string
  filters: Record<string, { value: unknown }>
  expanded: boolean
  sortBy: string
  sortOrder: 'asc' | 'desc'
}

/**
 * Estado de seleção de itens
 */
export interface SelectionState {
  selectedItems: unknown[]
  selectAll: boolean
}

/**
 * Estado da interface do usuário
 */
export interface UIState {
  activeTab: string
  sidebarCollapsed: boolean
  modalStates: Record<string, boolean>
  loadingStates: Record<string, boolean>
}

/**
 * Estado completo de um formulário incluindo todos os sub-estados
 */
export interface CompleteFormState {
  form: FormState
  pagination: PaginationState
  filters: FilterState
  selection: SelectionState
  ui: UIState
}

/**
 * Store global para gerenciamento de estados de formulários
 * 
 * Fornece um sistema centralizado para gerenciar estados de formulários,
 * incluindo campos, paginação, filtros, seleção e interface do usuário.
 * Suporta histórico de mudanças, auto-save e persistência local.
 * 
 * @example
 * ```typescript
 * const formStore = useGlobalFormStateStore()
 * const formId = formStore.generateFormId('/users', 'UserForm')
 * formStore.registerForm(formId, '/users', 'UserForm')
 * formStore.updateField(formId, 'name', 'João Silva', 'string')
 * ```
 * 
 * @since 1.0.0
 */
export const useGlobalFormStateStore = defineStore('globalFormState', () => {
  // Estado principal - mapa de formulários por ID único
  const formStates = ref<Record<string, CompleteFormState>>({})
  
  // Configurações globais
  const config = reactive({
    autoSave: true,
    saveInterval: 1000, // ms
    maxHistorySize: 10,
    persistToLocalStorage: true,
    debugMode: false
  })

  // Histórico de mudanças para undo/redo
  const history = ref<Record<string, CompleteFormState[]>>({})
  const historyIndex = ref<Record<string, number>>({})

  // Computed para estatísticas
  const stats = computed(() => ({
    totalForms: Object.keys(formStates.value).length,
    activeForms: Object.values(formStates.value).filter(state => 
      Date.now() - state.form.metadata.lastUpdated.getTime() < 300000 // 5 min
    ).length,
    totalFields: Object.values(formStates.value).reduce((acc, state) => 
      acc + Object.keys(state.form.fields).length, 0
    )
  }))

  /**
   * Gera um ID único para identificar um formulário
   * 
   * @param route - Rota da página onde o formulário está localizado
   * @param component - Nome do componente do formulário
   * @param instanceId - ID opcional para múltiplas instâncias do mesmo formulário
   * @returns ID único do formulário
   * 
   * @example
   * ```typescript
   * const formId = generateFormId('/users', 'UserForm', 'edit-123')
   * // Resultado: '/users:UserForm:edit-123'
   * ```
   * 
   * @since 1.0.0
   */
  function generateFormId(route: string, component: string, instanceId?: string): string {
    const base = `${route}:${component}`
    return instanceId ? `${base}:${instanceId}` : base
  }

  // Função para criar estado padrão de formulário
  function createDefaultFormState(route: string, component: string): CompleteFormState {
    return {
      form: {
        fields: {},
        metadata: {
          lastUpdated: new Date(),
          route,
          component,
          version: 1
        }
      },
      pagination: {
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 0,
        recordsPerPage: 10
      },
      filters: {
        searchTerm: '',
        filters: {},
        expanded: false,
        sortBy: '',
        sortOrder: 'asc'
      },
      selection: {
        selectedItems: [],
        selectAll: false
      },
      ui: {
        activeTab: '',
        sidebarCollapsed: false,
        modalStates: {},
        loadingStates: {}
      }
    }
  }

  /**
   * Registra um novo formulário no sistema global
   * 
   * @param formId - ID único do formulário
   * @param route - Rota da página
   * @param component - Nome do componente
   * @param initialState - Estado inicial opcional
   * @returns Estado completo do formulário registrado
   * 
   * @since 1.0.0
   */
  function registerForm(formId: string, route: string, component: string, initialState?: Partial<CompleteFormState>) {
    if (!formStates.value[formId]) {
      const defaultState = createDefaultFormState(route, component)
      formStates.value[formId] = initialState ? 
        { ...defaultState, ...initialState } : defaultState
      
      // Inicializar histórico
      history.value[formId] = [JSON.parse(JSON.stringify(formStates.value[formId]))]
      historyIndex.value[formId] = 0
      
      if (config.debugMode) {
        console.log(`[GlobalFormState] Formulário registrado: ${formId}`)
      }
    }
    return formStates.value[formId]
  }

  // Obter estado de um formulário
  function getFormState(formId: string): CompleteFormState | null {
    return formStates.value[formId] || null
  }

  /**
   * Atualiza um campo específico do formulário
   * 
   * @param formId - ID do formulário
   * @param fieldName - Nome do campo
   * @param value - Novo valor do campo
   * @param type - Tipo do campo (padrão: 'string')
   * 
   * @since 1.0.0
   */
  function updateField(formId: string, fieldName: string, value: unknown, type: FormField['type'] = 'string') {
    if (!formStates.value[formId]) return
    
    const field: FormField = {
      value,
      type,
      defaultValue: formStates.value[formId].form.fields[fieldName]?.defaultValue
    }
    
    formStates.value[formId].form.fields[fieldName] = field
    formStates.value[formId].form.metadata.lastUpdated = new Date()
    formStates.value[formId].form.metadata.version++
    
    // Salvar no histórico
    saveToHistory(formId)
    
    // Auto-save se habilitado
    if (config.autoSave && config.persistToLocalStorage) {
      saveToLocalStorage(formId)
    }
  }

  // Atualizar múltiplos campos
  function updateFields(formId: string, fields: Record<string, { value: unknown, type?: FormField['type'] }>) {
    if (!formStates.value[formId]) return
    
    Object.entries(fields).forEach(([fieldName, fieldData]) => {
      const field: FormField = {
        value: fieldData.value,
        type: fieldData.type || 'string',
        defaultValue: formStates.value[formId].form.fields[fieldName]?.defaultValue
      }
      formStates.value[formId].form.fields[fieldName] = field
    })
    
    formStates.value[formId].form.metadata.lastUpdated = new Date()
    formStates.value[formId].form.metadata.version++
    
    saveToHistory(formId)
    
    if (config.autoSave && config.persistToLocalStorage) {
      saveToLocalStorage(formId)
    }
  }

  // Atualizar paginação
  function updatePagination(formId: string, pagination: Partial<PaginationState>) {
    if (!formStates.value[formId]) return
    
    formStates.value[formId].pagination = {
      ...formStates.value[formId].pagination,
      ...pagination
    }
    
    formStates.value[formId].form.metadata.lastUpdated = new Date()
  }

  // Atualizar filtros
  function updateFilters(formId: string, filters: Partial<FilterState>) {
    if (!formStates.value[formId]) return
    
    formStates.value[formId].filters = {
      ...formStates.value[formId].filters,
      ...filters
    }
    
    formStates.value[formId].form.metadata.lastUpdated = new Date()
  }

  // Atualizar seleção
  function updateSelection(formId: string, selection: Partial<SelectionState>) {
    if (!formStates.value[formId]) return
    
    formStates.value[formId].selection = {
      ...formStates.value[formId].selection,
      ...selection
    }
    
    formStates.value[formId].form.metadata.lastUpdated = new Date()
  }

  // Atualizar UI
  function updateUI(formId: string, ui: Partial<UIState>) {
    if (!formStates.value[formId]) return
    
    formStates.value[formId].ui = {
      ...formStates.value[formId].ui,
      ...ui
    }
    
    formStates.value[formId].form.metadata.lastUpdated = new Date()
  }

  // Limpar formulário
  function clearForm(formId: string, keepMetadata = true) {
    if (!formStates.value[formId]) return
    
    const currentState = formStates.value[formId]
    const clearedState = createDefaultFormState(
      currentState.form.metadata.route,
      currentState.form.metadata.component
    )
    
    if (keepMetadata) {
      clearedState.form.metadata = currentState.form.metadata
    }
    
    formStates.value[formId] = clearedState
    saveToHistory(formId)
  }

  // Remover formulário
  function removeForm(formId: string) {
    delete formStates.value[formId]
    delete history.value[formId]
    delete historyIndex.value[formId]
    
    if (config.persistToLocalStorage) {
      localStorage.removeItem(`form_state_${formId}`)
    }
  }

  // Salvar no histórico
  function saveToHistory(formId: string) {
    if (!history.value[formId]) {
      history.value[formId] = []
      historyIndex.value[formId] = 0
    }
    
    const currentState = JSON.parse(JSON.stringify(formStates.value[formId]))
    history.value[formId].push(currentState)
    
    // Limitar tamanho do histórico
    if (history.value[formId].length > config.maxHistorySize) {
      history.value[formId].shift()
    } else {
      historyIndex.value[formId] = history.value[formId].length - 1
    }
  }

  // Undo
  function undo(formId: string) {
    if (!history.value[formId] || historyIndex.value[formId] <= 0) return false
    
    historyIndex.value[formId]--
    formStates.value[formId] = JSON.parse(JSON.stringify(
      history.value[formId][historyIndex.value[formId]]
    ))
    
    return true
  }

  // Redo
  function redo(formId: string) {
    if (!history.value[formId] || 
        historyIndex.value[formId] >= history.value[formId].length - 1) return false
    
    historyIndex.value[formId]++
    formStates.value[formId] = JSON.parse(JSON.stringify(
      history.value[formId][historyIndex.value[formId]]
    ))
    
    return true
  }

  // Salvar no localStorage
  function saveToLocalStorage(formId: string) {
    if (!config.persistToLocalStorage) return
    
    try {
      const state = formStates.value[formId]
      localStorage.setItem(`form_state_${formId}`, JSON.stringify(state))
    } catch (error) {
      console.error(`[GlobalFormState] Erro ao salvar no localStorage: ${formId}`, error)
    }
  }

  // Carregar do localStorage
  function loadFromLocalStorage(formId: string): CompleteFormState | null {
    if (!config.persistToLocalStorage) return null
    
    try {
      const saved = localStorage.getItem(`form_state_${formId}`)
      if (saved) {
        const state = JSON.parse(saved)
        // Converter datas de string para Date
        state.form.metadata.lastUpdated = new Date(state.form.metadata.lastUpdated)
        return state
      }
    } catch (error) {
      console.error(`[GlobalFormState] Erro ao carregar do localStorage: ${formId}`, error)
    }
    
    return null
  }

  // Restaurar formulário do localStorage
  function restoreForm(formId: string, route: string, component: string) {
    const saved = loadFromLocalStorage(formId)
    if (saved) {
      formStates.value[formId] = saved
      history.value[formId] = [JSON.parse(JSON.stringify(saved))]
      historyIndex.value[formId] = 0
      return saved
    }
    
    return registerForm(formId, route, component)
  }

  // Limpar todos os formulários
  function clearAllForms() {
    Object.keys(formStates.value).forEach(formId => {
      clearForm(formId)
    })
  }

  // Exportar estado para backup
  function exportState() {
    return {
      formStates: formStates.value,
      config: config,
      timestamp: new Date().toISOString()
    }
  }

  // Importar estado de backup
  function importState(backup: { formStates?: Record<string, CompleteFormState> }) {
    if (backup.formStates) {
      formStates.value = backup.formStates
      // Reconstruir histórico
      Object.keys(formStates.value).forEach(formId => {
        history.value[formId] = [JSON.parse(JSON.stringify(formStates.value[formId]))]
        historyIndex.value[formId] = 0
      })
    }
  }

  return {
    // Estado
    formStates,
    config,
    stats,
    
    // Métodos principais
    generateFormId,
    registerForm,
    getFormState,
    removeForm,
    
    // Atualização de dados
    updateField,
    updateFields,
    updatePagination,
    updateFilters,
    updateSelection,
    updateUI,
    
    // Gerenciamento
    clearForm,
    clearAllForms,
    
    // Histórico
    undo,
    redo,
    
    // Persistência
    saveToLocalStorage,
    loadFromLocalStorage,
    restoreForm,
    
    // Backup
    exportState,
    importState
  }
})