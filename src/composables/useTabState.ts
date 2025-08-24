import { ref, reactive } from 'vue'

// Interface para definir o estado de uma aba
interface TabState {
  [key: string]: any
}

// Armazenamento global do estado das abas
const tabStates = reactive<Record<string, TabState>>({})

/**
 * Composable para gerenciar o estado das abas
 * Permite preservar dados dos formulários durante navegação entre abas
 */
export function useTabState(tabId: string) {
  // Inicializar estado da aba se não existir
  if (!tabStates[tabId]) {
    tabStates[tabId] = {}
  }

  /**
   * Salvar estado de um campo específico
   */
  const saveFieldState = (fieldName: string, value: any) => {
    tabStates[tabId][fieldName] = value
  }

  /**
   * Recuperar estado de um campo específico
   */
  const getFieldState = (fieldName: string, defaultValue: any = '') => {
    return tabStates[tabId][fieldName] ?? defaultValue
  }

  /**
   * Salvar estado completo do formulário
   */
  const saveFormState = (formData: Record<string, any>) => {
    Object.keys(formData).forEach(key => {
      tabStates[tabId][key] = formData[key]
    })
  }

  /**
   * Recuperar estado completo do formulário
   */
  const getFormState = () => {
    return { ...tabStates[tabId] }
  }

  /**
   * Limpar estado da aba
   */
  const clearTabState = () => {
    tabStates[tabId] = {}
  }

  /**
   * Verificar se a aba tem estado salvo
   */
  const hasState = () => {
    return Object.keys(tabStates[tabId]).length > 0
  }

  /**
   * Remover estado da aba (quando aba é fechada)
   */
  const removeTabState = () => {
    delete tabStates[tabId]
  }

  return {
    saveFieldState,
    getFieldState,
    saveFormState,
    getFormState,
    clearTabState,
    hasState,
    removeTabState
  }
}

/**
 * Hook para auto-salvar estado de campos reativos
 */
export function useAutoSaveState(tabId: string, formData: Record<string, any>) {
  const { saveFieldState, getFieldState } = useTabState(tabId)

  // Restaurar estado salvo nos campos
  const restoreState = () => {
    Object.keys(formData).forEach(key => {
      const savedValue = getFieldState(key)
      if (savedValue !== '' && savedValue !== null && savedValue !== undefined) {
        if (formData[key] && typeof formData[key] === 'object' && 'value' in formData[key]) {
          // Para refs
          formData[key].value = savedValue
        } else {
          // Para valores diretos
          formData[key] = savedValue
        }
      }
    })
  }

  // Auto-salvar quando campos mudarem
  const setupAutoSave = () => {
    Object.keys(formData).forEach(key => {
      if (formData[key] && typeof formData[key] === 'object' && 'value' in formData[key]) {
        // Para refs, observar mudanças
        const originalRef = formData[key]
        const saveValue = () => saveFieldState(key, originalRef.value)
        
        // Salvar imediatamente e configurar observador
        saveValue()
        
        // Observar mudanças futuras
        const observer = new Proxy(originalRef, {
          set(target, prop, value) {
            const result = Reflect.set(target, prop, value)
            if (prop === 'value') {
              saveFieldState(key, value)
            }
            return result
          }
        })
        
        formData[key] = observer
      }
    })
  }

  return {
    restoreState,
    setupAutoSave
  }
}