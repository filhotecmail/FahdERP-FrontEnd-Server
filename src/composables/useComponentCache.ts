import { ref, shallowRef, markRaw, type Component } from 'vue'

// Interface para definir um item do cache
interface CacheItem {
  component: Component
  props?: Record<string, any>
  timestamp: number
  accessCount: number
}

// Interface para configurações do cache
interface CacheConfig {
  maxSize?: number
  ttl?: number // Time to live em milliseconds
  enableLRU?: boolean // Least Recently Used eviction
}

// Cache global de componentes
const componentCache = new Map<string, CacheItem>()
const cacheConfig = ref<CacheConfig>({
  maxSize: 50,
  ttl: 5 * 60 * 1000, // 5 minutos
  enableLRU: true
})

/**
 * Composable para gerenciar cache de componentes Vue
 * Evita re-renderização desnecessária mantendo componentes em cache
 */
export function useComponentCache(config?: Partial<CacheConfig>) {
  // Atualizar configuração se fornecida
  if (config) {
    Object.assign(cacheConfig.value, config)
  }

  /**
   * Gera uma chave única para o cache baseada no nome do componente e props
   */
  const generateCacheKey = (componentName: string, props?: Record<string, any>): string => {
    const propsKey = props ? JSON.stringify(props, Object.keys(props).sort()) : ''
    return `${componentName}:${propsKey}`
  }

  /**
   * Verifica se um item do cache ainda é válido
   */
  const isValidCacheItem = (item: CacheItem): boolean => {
    if (!cacheConfig.value.ttl) return true
    return Date.now() - item.timestamp < cacheConfig.value.ttl
  }

  /**
   * Remove itens expirados do cache
   */
  const cleanExpiredItems = (): void => {
    const now = Date.now()
    for (const [key, item] of componentCache.entries()) {
      if (!isValidCacheItem(item)) {
        componentCache.delete(key)
      }
    }
  }

  /**
   * Implementa estratégia LRU (Least Recently Used)
   */
  const evictLRU = (): void => {
    if (!cacheConfig.value.enableLRU || !cacheConfig.value.maxSize) return
    
    if (componentCache.size >= cacheConfig.value.maxSize) {
      // Encontra o item menos usado
      let lruKey = ''
      let lruItem: CacheItem | null = null
      
      for (const [key, item] of componentCache.entries()) {
        if (!lruItem || item.accessCount < lruItem.accessCount) {
          lruKey = key
          lruItem = item
        }
      }
      
      if (lruKey) {
        componentCache.delete(lruKey)
      }
    }
  }

  /**
   * Adiciona um componente ao cache
   */
  const cacheComponent = (
    componentName: string, 
    component: Component, 
    props?: Record<string, any>
  ): void => {
    cleanExpiredItems()
    evictLRU()
    
    const key = generateCacheKey(componentName, props)
    const cacheItem: CacheItem = {
      component: markRaw(component),
      props,
      timestamp: Date.now(),
      accessCount: 0
    }
    
    componentCache.set(key, cacheItem)
  }

  /**
   * Recupera um componente do cache
   */
  const getCachedComponent = (
    componentName: string, 
    props?: Record<string, any>
  ): Component | null => {
    const key = generateCacheKey(componentName, props)
    const item = componentCache.get(key)
    
    if (!item || !isValidCacheItem(item)) {
      if (item) componentCache.delete(key)
      return null
    }
    
    // Incrementa contador de acesso para LRU
    item.accessCount++
    item.timestamp = Date.now() // Atualiza timestamp de acesso
    
    return item.component
  }

  /**
   * Verifica se um componente está em cache
   */
  const hasComponent = (
    componentName: string, 
    props?: Record<string, any>
  ): boolean => {
    const key = generateCacheKey(componentName, props)
    const item = componentCache.get(key)
    return item ? isValidCacheItem(item) : false
  }

  /**
   * Remove um componente específico do cache
   */
  const removeComponent = (
    componentName: string, 
    props?: Record<string, any>
  ): boolean => {
    const key = generateCacheKey(componentName, props)
    return componentCache.delete(key)
  }

  /**
   * Limpa todo o cache
   */
  const clearCache = (): void => {
    componentCache.clear()
  }

  /**
   * Obtém estatísticas do cache
   */
  const getCacheStats = () => {
    return {
      size: componentCache.size,
      maxSize: cacheConfig.value.maxSize,
      ttl: cacheConfig.value.ttl,
      enableLRU: cacheConfig.value.enableLRU,
      items: Array.from(componentCache.entries()).map(([key, item]) => ({
        key,
        timestamp: item.timestamp,
        accessCount: item.accessCount,
        age: Date.now() - item.timestamp
      }))
    }
  }

  /**
   * Hook para usar componente com cache
   * Retorna o componente do cache ou null se não estiver disponível
   */
  const useCachedComponent = (
    componentName: string,
    componentFactory: () => Component,
    props?: Record<string, any>
  ) => {
    const cachedComponent = shallowRef<Component | null>(null)
    
    // Tenta recuperar do cache primeiro
    let component = getCachedComponent(componentName, props)
    
    if (!component) {
      // Se não estiver em cache, cria e adiciona ao cache
      component = componentFactory()
      cacheComponent(componentName, component, props)
    }
    
    cachedComponent.value = component
    
    return {
      component: cachedComponent,
      isFromCache: hasComponent(componentName, props)
    }
  }

  return {
    cacheComponent,
    getCachedComponent,
    hasComponent,
    removeComponent,
    clearCache,
    getCacheStats,
    useCachedComponent,
    cleanExpiredItems
  }
}

/**
 * Composable para auto-limpeza do cache
 * Executa limpeza periódica de itens expirados
 */
export function useAutoCacheCleanup(intervalMs: number = 60000) {
  const { cleanExpiredItems } = useComponentCache()
  
  let cleanupInterval: number | null = null
  
  const startCleanup = () => {
    if (cleanupInterval) return
    
    cleanupInterval = setInterval(() => {
      cleanExpiredItems()
    }, intervalMs)
  }
  
  const stopCleanup = () => {
    if (cleanupInterval) {
      clearInterval(cleanupInterval)
      cleanupInterval = null
    }
  }
  
  return {
    startCleanup,
    stopCleanup
  }
}