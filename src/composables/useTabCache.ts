import { ref, shallowRef, computed, watch, onUnmounted, nextTick, markRaw, type Component } from 'vue'
import { useComponentCache } from './useComponentCache'
import { useTabState } from './useTabState'

// Interface para definir uma aba
interface TabItem {
  id: string
  title: string
  component: string
  props?: Record<string, any>
  closable?: boolean
  cached?: boolean
  lastAccessed?: number
}

// Interface para configurações do sistema de abas
interface TabCacheConfig {
  maxTabs?: number
  enableCache?: boolean
  persistTabs?: boolean
  autoCloseInactive?: boolean
  inactiveTimeout?: number // em milliseconds
}

/**
 * Composable para gerenciar abas com cache de componentes
 * Integra o sistema de cache com o gerenciamento de abas
 */
export function useTabCache(config?: TabCacheConfig) {
  const defaultConfig: TabCacheConfig = {
    maxTabs: 10,
    enableCache: true,
    persistTabs: true,
    autoCloseInactive: false,
    inactiveTimeout: 10 * 60 * 1000 // 10 minutos
  }
  
  const tabConfig = ref({ ...defaultConfig, ...config })
  const { 
    cacheComponent, 
    getCachedComponent, 
    hasComponent, 
    removeComponent,
    clearCache,
    getCacheStats
  } = useComponentCache()
  
  // Estado das abas
  const tabs = ref<TabItem[]>([])
  const activeTabId = ref<string>('')
  const tabComponents = new Map<string, Component>()
  
  // Sistema de preservação de estado das abas
  const tabStateManager = useTabState('tab-manager')
  
  /**
   * Carrega abas persistidas do localStorage
   */
  const loadPersistedTabs = () => {
    if (!tabConfig.value.persistTabs) return
    
    const savedTabs = tabStateManager.getFieldState('tabs', [])
    const savedActiveTab = tabStateManager.getFieldState('activeTab', '')
    
    if (Array.isArray(savedTabs) && savedTabs.length > 0) {
      tabs.value = savedTabs.map(tab => ({
        ...tab,
        lastAccessed: tab.lastAccessed || Date.now()
      }))
      activeTabId.value = savedActiveTab
    }
  }
  
  /**
   * Persiste abas no localStorage
   */
  const persistTabs = () => {
    if (!tabConfig.value.persistTabs) return
    
    tabStateManager.saveFieldState('tabs', tabs.value)
    tabStateManager.saveFieldState('activeTab', activeTabId.value)
  }
  
  /**
   * Registra um componente para uso nas abas
   */
  const registerTabComponent = (name: string, component: Component) => {
    // Usar markRaw para evitar que o Vue faça proxy do componente
    const rawComponent = markRaw(component)
    tabComponents.set(name, rawComponent)
    
    if (tabConfig.value.enableCache) {
      cacheComponent(name, rawComponent)
    }
  }
  
  /**
   * Obtém um componente registrado
   */
  const getTabComponent = (name: string, props?: Record<string, any>): Component | null => {
    try {
      if (!name) return null
      
      if (tabConfig.value.enableCache) {
        const cached = getCachedComponent(name, props)
        if (cached) return cached
      }
      
      const component = tabComponents.get(name)
      return component || null
    } catch (error) {
      console.error('Erro ao obter componente da aba:', error)
      return null
    }
  }
  
  /**
   * Adiciona uma nova aba
   */
  const addTab = async (tab: Omit<TabItem, 'id' | 'lastAccessed'> & { id?: string }) => {
    try {
      if (!tab || !tab.component) {
        console.error('Dados da aba inválidos')
        return ''
      }
      
      // Verifica se o componente está registrado
      if (!tabComponents.has(tab.component)) {
        console.error(`Componente '${tab.component}' não está registrado`)
        return ''
      }
      
      // Gera ID único se não fornecido
      const tabId = tab.id || `tab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      
      // Verifica se a aba já existe
      const existingTab = tabs.value.find(t => t.id === tabId)
      if (existingTab) {
        await switchToTab(tabId)
        return tabId
      }
      
      // Verifica limite máximo de abas
      if (tabConfig.value.maxTabs && tabs.value.length >= tabConfig.value.maxTabs) {
        // Remove a aba menos recentemente acessada
        const oldestTab = tabs.value
          .filter(t => t.closable !== false)
          .reduce((oldest, current) => 
            (current.lastAccessed || 0) < (oldest.lastAccessed || 0) ? current : oldest
          )
        if (oldestTab) {
          closeTab(oldestTab.id)
        }
      }
      
      const newTab: TabItem = {
        ...tab,
        id: tabId,
        lastAccessed: Date.now(),
        closable: tab.closable !== false,
        cached: tabConfig.value.enableCache
      }
      
      // Adicionar a aba de forma mais segura
      tabs.value.push(newTab)
      
      // Aguardar um tick antes de ativar
      await nextTick()
      
      // Ativar a nova aba
      activeTabId.value = tabId
      
      // Aguardar outro tick antes de atualizar o componente
      await nextTick()
      await updateActiveComponent()
      
      // Persistir mudanças
      persistTabs()
      
      return tabId
    } catch (error) {
      console.error('Erro ao adicionar aba:', error)
      return ''
    }
  }
  
  /**
   * Remove uma aba
   */
  const closeTab = async (tabId: string) => {
    const tabIndex = tabs.value.findIndex(t => t.id === tabId)
    if (tabIndex === -1) return
    
    const tab = tabs.value[tabIndex]
    
    // Remove do cache se estiver habilitado
    if (tabConfig.value.enableCache && tab.component) {
      removeComponent(tab.component, tab.props)
    }
    
    // Remove a aba
    tabs.value.splice(tabIndex, 1)
    
    // Se era a aba ativa, ativa outra
    if (activeTabId.value === tabId) {
      if (tabs.value.length > 0) {
        const newActiveIndex = Math.min(tabIndex, tabs.value.length - 1)
        await switchToTab(tabs.value[newActiveIndex].id)
      } else {
        activeTabId.value = ''
      }
    }
    
    persistTabs()
  }
  
  /**
   * Alterna para uma aba específica
   */
  const switchToTab = async (tabId: string) => {
    try {
      if (!tabId) return
      
      const tab = tabs.value.find(t => t.id === tabId)
      if (!tab) return
      
      activeTabId.value = tabId
      tab.lastAccessed = Date.now()
      
      // Aguardar a atualização do componente ativo
      await updateActiveComponent()
      
      persistTabs()
    } catch (error) {
      console.error('Erro ao alternar para aba:', error)
    }
  }
  
  /**
   * Obtém a aba ativa
   */
  const activeTab = computed(() => 
    tabs.value.find(t => t.id === activeTabId.value) || null
  )
  
  /**
   * Obtém o componente da aba ativa
   */
  const activeTabComponent = shallowRef<Component | null>(null)
  
  // Função para atualizar o componente ativo de forma segura
  const updateActiveComponent = async () => {
    try {
      // Aguardar um tick antes de atualizar o componente
      await nextTick()
      
      if (!activeTab.value || !activeTab.value.component) {
        activeTabComponent.value = null
        return
      }
      
      const component = getTabComponent(activeTab.value.component, activeTab.value.props)
      
      // Verificar se o componente é válido antes de definir
      if (!component || typeof component !== 'object') {
        console.warn('Componente inválido para aba:', activeTab.value.component)
        activeTabComponent.value = null
        return
      }
      
      // Verificar se o componente tem as propriedades necessárias do Vue
      if (!component.render && !component.setup && !component.template) {
        console.warn('Componente não possui render, setup ou template:', activeTab.value.component)
        activeTabComponent.value = null
        return
      }
      
      // Usar markRaw para evitar que o Vue faça proxy do componente
      const rawComponent = markRaw(component)
      
      // Aguardar outro tick antes de definir o componente
      await nextTick()
      activeTabComponent.value = rawComponent
    } catch (error) {
      console.error('Erro ao obter componente da aba ativa:', error)
      activeTabComponent.value = null
    }
  }
  
  // Observar mudanças na aba ativa e atualizar o componente
  watch(activeTab, updateActiveComponent, { immediate: true })
  
  /**
   * Fecha todas as abas
   */
  const closeAllTabs = () => {
    tabs.value.forEach(tab => {
      if (tabConfig.value.enableCache && tab.component) {
        removeComponent(tab.component, tab.props)
      }
    })
    
    tabs.value = []
    activeTabId.value = ''
    persistTabs()
  }
  
  /**
   * Fecha todas as abas exceto a especificada
   */
  const closeOtherTabs = async (keepTabId: string) => {
    const tabsToClose = tabs.value.filter(t => t.id !== keepTabId)
    
    tabsToClose.forEach(tab => {
      if (tabConfig.value.enableCache && tab.component) {
        removeComponent(tab.component, tab.props)
      }
    })
    
    tabs.value = tabs.value.filter(t => t.id === keepTabId)
    await switchToTab(keepTabId)
  }
  
  /**
   * Limpa abas inativas automaticamente
   */
  const cleanupInactiveTabs = () => {
    if (!tabConfig.value.autoCloseInactive || !tabConfig.value.inactiveTimeout) return
    
    const now = Date.now()
    const tabsToClose = tabs.value.filter(tab => 
      tab.id !== activeTabId.value && 
      tab.closable !== false &&
      (now - (tab.lastAccessed || 0)) > tabConfig.value.inactiveTimeout!
    )
    
    tabsToClose.forEach(tab => closeTab(tab.id))
  }
  
  /**
   * Obtém estatísticas das abas e cache
   */
  const getTabStats = () => {
    return {
      totalTabs: tabs.value.length,
      activeTab: activeTabId.value,
      cachedTabs: tabs.value.filter(t => t.cached).length,
      cacheStats: getCacheStats(),
      config: tabConfig.value
    }
  }
  
  // Watchers para auto-limpeza
  let cleanupInterval: number | null = null
  
  if (tabConfig.value.autoCloseInactive) {
    cleanupInterval = setInterval(cleanupInactiveTabs, 60000) // Verifica a cada minuto
  }
  
  // Cleanup ao desmontar
  onUnmounted(() => {
    if (cleanupInterval) {
      clearInterval(cleanupInterval)
    }
  })
  
  // Carrega abas persistidas na inicialização
  loadPersistedTabs()
  
  // Observa mudanças nas abas para persistir
  watch([tabs, activeTabId], persistTabs, { deep: true })
  
  return {
    // Estado
    tabs: computed(() => tabs.value),
    activeTabId: computed(() => activeTabId.value),
    activeTab,
    activeTabComponent: computed(() => activeTabComponent.value),
    
    // Métodos
    registerTabComponent,
    addTab,
    closeTab,
    switchToTab,
    closeAllTabs,
    closeOtherTabs,
    cleanupInactiveTabs,
    getTabStats,
    
    // Cache
    clearCache,
    getCacheStats
  }
}