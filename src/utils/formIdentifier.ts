import type { RouteLocationNormalized } from 'vue-router'
import type { ComponentInternalInstance } from 'vue'
import { useRoute } from 'vue-router'
import { getCurrentInstance, computed } from 'vue'

// Tipos para identificação de formulários
export interface FormIdentifier {
  id: string
  route: string
  component: string
  instanceId?: string
  hash: string
  metadata: {
    routeName?: string
    routeParams: Record<string, string | string[]>
    routeQuery: Record<string, string | string[]>
    componentName: string
    timestamp: number
  }
}

export interface FormIdentifierOptions {
  includeParams?: boolean
  includeQuery?: boolean
  instanceId?: string
  customSuffix?: string
  useHash?: boolean
}

// Classe para gerenciar identificadores de formulários
export class FormIdentifierManager {
  private static instance: FormIdentifierManager
  private identifiers = new Map<string, FormIdentifier>()
  private componentCounter = new Map<string, number>()
  
  static getInstance(): FormIdentifierManager {
    if (!FormIdentifierManager.instance) {
      FormIdentifierManager.instance = new FormIdentifierManager()
    }
    return FormIdentifierManager.instance
  }
  
  // Gerar identificador único para formulário
  generateFormIdentifier(
    route: RouteLocationNormalized,
    componentInstance: ComponentInternalInstance | null,
    options: FormIdentifierOptions = {}
  ): FormIdentifier {
    const {
      includeParams = true,
      includeQuery = false,
      instanceId,
      customSuffix,
      useHash = true
    } = options
    
    // Extrair informações da rota
    const routePath = route.path
    const routeName = route.name?.toString() || 'unknown'
    const routeParams = includeParams ? route.params : {}
    const routeQuery = includeQuery ? Object.fromEntries(
      Object.entries(route.query).map(([key, value]) => [
        key,
        Array.isArray(value) ? value.filter(v => v !== null) : (value ?? '')
      ])
    ) : {}
    
    // Extrair informações do componente
    const componentName = this.extractComponentName(componentInstance)
    
    // Gerar partes do identificador
    const routePart = this.sanitizeForId(routePath)
    const componentPart = this.sanitizeForId(componentName)
    
    // Gerar ID base
    let baseId = `${routePart}:${componentPart}`
    
    // Adicionar parâmetros da rota se incluídos
    if (includeParams && Object.keys(routeParams).length > 0) {
      const paramsPart = Object.entries(routeParams)
        .map(([key, value]) => `${key}=${this.sanitizeForId(String(value))}`)
        .join('&')
      baseId += `:params(${paramsPart})`
    }
    
    // Adicionar query se incluída
    if (includeQuery && Object.keys(routeQuery).length > 0) {
      const queryPart = Object.entries(routeQuery)
        .map(([key, value]) => `${key}=${this.sanitizeForId(String(value))}`)
        .join('&')
      baseId += `:query(${queryPart})`
    }
    
    // Adicionar instanceId se fornecido
    if (instanceId) {
      baseId += `:instance(${this.sanitizeForId(instanceId)})`
    }
    
    // Adicionar sufixo customizado
    if (customSuffix) {
      baseId += `:${this.sanitizeForId(customSuffix)}`
    }
    
    // Gerar hash se solicitado
    const hash = useHash ? this.generateHash(baseId) : ''
    const finalId = useHash ? `${baseId}:${hash}` : baseId
    
    // Criar objeto identificador
    const identifier: FormIdentifier = {
      id: finalId,
      route: routePath,
      component: componentName,
      instanceId,
      hash,
      metadata: {
        routeName,
        routeParams,
        routeQuery,
        componentName,
        timestamp: Date.now()
      }
    }
    
    // Armazenar identificador
    this.identifiers.set(finalId, identifier)
    
    return identifier
  }
  
  // Gerar identificador simples (compatibilidade)
  generateSimpleId(
    routePath: string,
    componentName: string,
    instanceId?: string
  ): string {
    const routePart = this.sanitizeForId(routePath)
    const componentPart = this.sanitizeForId(componentName)
    
    let id = `${routePart}:${componentPart}`
    
    if (instanceId) {
      id += `:${this.sanitizeForId(instanceId)}`
    }
    
    return id
  }
  
  // Gerar identificador único para instância de componente
  generateInstanceId(
    componentName: string,
    route?: RouteLocationNormalized
  ): string {
    const key = route ? `${componentName}:${route.path}` : componentName
    
    if (!this.componentCounter.has(key)) {
      this.componentCounter.set(key, 0)
    }
    
    const count = this.componentCounter.get(key)! + 1
    this.componentCounter.set(key, count)
    
    return `${componentName}_${count}_${Date.now()}`
  }
  
  // Extrair nome do componente
  private extractComponentName(instance: ComponentInternalInstance | null): string {
    if (!instance) return 'UnknownComponent'
    
    // Tentar diferentes formas de obter o nome do componente
    const type = instance.type as { __name?: string; name?: string; __file?: string }
    
    return (
      type.__name ||
      type.name ||
      type.__file?.split('/').pop()?.replace(/\.(vue|ts|js)$/, '') ||
      'UnknownComponent'
    )
  }
  
  // Sanitizar string para uso em ID
  private sanitizeForId(str: string): string {
    return str
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '')
      .toLowerCase()
  }
  
  // Gerar hash simples
  private generateHash(str: string): string {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Converter para 32bit integer
    }
    return Math.abs(hash).toString(36).substring(0, 8)
  }
  
  // Obter identificador por ID
  getIdentifier(id: string): FormIdentifier | undefined {
    return this.identifiers.get(id)
  }
  
  // Listar todos os identificadores
  getAllIdentifiers(): FormIdentifier[] {
    return Array.from(this.identifiers.values())
  }
  
  // Limpar identificadores antigos
  cleanupOldIdentifiers(maxAge: number = 24 * 60 * 60 * 1000): void {
    const now = Date.now()
    
    for (const [id, identifier] of this.identifiers.entries()) {
      if (now - identifier.metadata.timestamp > maxAge) {
        this.identifiers.delete(id)
      }
    }
  }
  
  // Buscar identificadores por critério
  findIdentifiers(criteria: {
    route?: string
    component?: string
    routeName?: string
  }): FormIdentifier[] {
    return Array.from(this.identifiers.values()).filter(identifier => {
      if (criteria.route && identifier.route !== criteria.route) return false
      if (criteria.component && identifier.component !== criteria.component) return false
      if (criteria.routeName && identifier.metadata.routeName !== criteria.routeName) return false
      return true
    })
  }
  
  // Remover identificador
  removeIdentifier(id: string): boolean {
    return this.identifiers.delete(id)
  }
  
  // Limpar todos os identificadores
  clearAll(): void {
    this.identifiers.clear()
    this.componentCounter.clear()
  }
  
  // Estatísticas
  getStats() {
    const identifiers = Array.from(this.identifiers.values())
    const routes = new Set(identifiers.map(i => i.route))
    const components = new Set(identifiers.map(i => i.component))
    
    return {
      totalIdentifiers: identifiers.length,
      uniqueRoutes: routes.size,
      uniqueComponents: components.size,
      oldestTimestamp: Math.min(...identifiers.map(i => i.metadata.timestamp)),
      newestTimestamp: Math.max(...identifiers.map(i => i.metadata.timestamp))
    }
  }
}

// Instância singleton
export const formIdentifierManager = FormIdentifierManager.getInstance()

// Funções utilitárias exportadas
export function generateFormId(
  route: RouteLocationNormalized,
  componentInstance: ComponentInternalInstance | null,
  options?: FormIdentifierOptions
): string {
  return formIdentifierManager.generateFormIdentifier(route, componentInstance, options).id
}

export function generateSimpleFormId(
  routePath: string,
  componentName: string,
  instanceId?: string
): string {
  return formIdentifierManager.generateSimpleId(routePath, componentName, instanceId)
}

export function generateInstanceId(
  componentName: string,
  route?: RouteLocationNormalized
): string {
  return formIdentifierManager.generateInstanceId(componentName, route)
}

// Composable para usar o sistema de identificação
export function useFormIdentifier(
  options: FormIdentifierOptions = {}
) {
  const route = useRoute()
  const instance = getCurrentInstance()
  
  const identifier = computed(() => 
    formIdentifierManager.generateFormIdentifier(route, instance, options)
  )
  
  const formId = computed(() => identifier.value.id)
  
  return {
    identifier,
    formId,
    generateId: (customOptions?: FormIdentifierOptions) => 
      formIdentifierManager.generateFormIdentifier(
        route,
        instance,
        { ...options, ...customOptions }
      ),
    manager: formIdentifierManager
  }
}

// Função para migração de IDs antigos
export function migrateFormId(oldId: string): string {
  // Lógica para migrar IDs antigos para o novo formato
  // Pode ser usado para compatibilidade com sistemas existentes
  
  const parts = oldId.split(':')
  if (parts.length >= 2) {
    const [route, component, ...rest] = parts
    return formIdentifierManager.generateSimpleId(
      route,
      component,
      rest.join(':')
    )
  }
  
  return oldId
}

// Validador de ID de formulário
export function isValidFormId(id: string): boolean {
  // Verificar se o ID segue o padrão esperado
  const pattern = /^[a-z0-9_-]+:[a-z0-9_-]+/i
  return pattern.test(id)
}

// Extrair informações de um ID de formulário
export function parseFormId(id: string): {
  route?: string
  component?: string
  instanceId?: string
  hash?: string
} {
  const parts = id.split(':')
  
  if (parts.length < 2) {
    return {}
  }
  
  const [route, component, ...rest] = parts
  const lastPart = rest[rest.length - 1]
  
  // Verificar se a última parte é um hash (8 caracteres alfanuméricos)
  const hashPattern = /^[a-z0-9]{8}$/i
  const hash = hashPattern.test(lastPart) ? lastPart : undefined
  
  const instanceParts = hash ? rest.slice(0, -1) : rest
  const instanceId = instanceParts.length > 0 ? instanceParts.join(':') : undefined
  
  return {
    route,
    component,
    instanceId,
    hash
  }
}