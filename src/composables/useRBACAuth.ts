import { ref } from 'vue'

export interface RBACAuthConfig {
  auth_module: string
  auth_submodule: string
  auth_action: string
}

export interface RBACPermissionResponse {
  cnpjcontrato: string
  cnpjloja: string
  username: string
  auth_module: string
  auth_submodule: string
  auth_action: string
  routename: string
  user_id: number
  Status: boolean
  perm_view: boolean
  perm_update: boolean
  perm_insert: boolean
  perm_delete: boolean
  Name: string | null
  Tag: number
}

export interface RBACErrorResponse {
  title: string
  error: string
}

export function useRBACAuth() {
  const isLoading = ref(false)
  const lastError = ref<string | null>(null)

  /**
   * Verifica permissões RBAC com o servidor
   * 
   * @param config Configuração RBAC da rota
   * @param routeName Nome da rota
   * @returns Promise com a resposta de permissões ou null se erro
   */
  async function checkPermission(
    config: RBACAuthConfig, 
    routeName: string
  ): Promise<RBACPermissionResponse | null> {
    isLoading.value = true
    lastError.value = null

    try {
      // Obter dados de autenticação do localStorage
      const authData = localStorage.getItem('authData')
      if (!authData) {
        lastError.value = 'Dados de autenticação não encontrados'
        return null
      }

      const parsedAuthData = JSON.parse(authData)
      
      // Extrair informações necessárias da estrutura correta
      const cnpjloja = parsedAuthData.Lojas?.Cnpj || parsedAuthData.cnpjloja
      const cnpjcontrato = parsedAuthData.SystemAuth?.CnpjContrato || parsedAuthData.Cnpjmaster
      
      // Tentar obter o username real dos dados do store de autenticação primeiro
      let username = null
      
      // Primeiro, tentar obter do store de autenticação (dados reais do login)
      try {
        const fahdUserData = localStorage.getItem('fahd_user_data')
        if (fahdUserData) {
          const userData = JSON.parse(fahdUserData)
          username = userData.username
        }
      } catch {
        // Silently handle error
      }
      
      // Se não encontrou no store, tentar nas outras fontes (fallback)
      if (!username) {
        if (parsedAuthData.SystemAuth?.Username) {
          username = parsedAuthData.SystemAuth.Username
        } else if (parsedAuthData.Username) {
          username = parsedAuthData.Username
        } else if (parsedAuthData.SystemAuthUserData?.Email) {
          username = parsedAuthData.SystemAuthUserData.Email
        }
      }

      if (!cnpjloja || !username) {
        lastError.value = 'Informações de autenticação incompletas'
        return null
      }

      // Construir URL com parâmetros
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8940'
      const url = new URL('/api/auth/checkauthpermission', baseUrl)
      
      url.searchParams.append('cnpjloja', cnpjloja)
      url.searchParams.append('cnpjcontrato', cnpjcontrato)
      url.searchParams.append('username', username)
      url.searchParams.append('auth_module', config.auth_module)
      url.searchParams.append('auth_submodule', config.auth_submodule)
      url.searchParams.append('auth_action', config.auth_action)
      url.searchParams.append('routename', routeName)

      const response = await fetch(url.toString(), {
        method: 'POST',
        redirect: 'follow'
      })

      if (response.status === 401) {
        const errorData: RBACErrorResponse = await response.json()
        lastError.value = errorData.error || 'Não autorizado'
        return null
      }

      if (!response.ok) {      
        try {
          const errorData = await response.json()
          lastError.value = errorData.error || errorData.message || `Erro ${response.status}`
        } catch {
          lastError.value = `Erro ${response.status}: ${response.statusText}`
        }
        return null
      }

      const permissionData: RBACPermissionResponse = await response.json()
      
      if (!permissionData.Status) {
        lastError.value = 'Permissão negada pelo servidor'
        return null
      }

      return permissionData

    } catch (error) {
      lastError.value = error instanceof Error ? error.message : 'Erro desconhecido'
      return null
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Verifica se o usuário tem uma permissão específica
   * 
   * @param permission Dados de permissão retornados pelo servidor
   * @param action Ação a verificar ('view', 'update', 'insert', 'delete')
   * @returns boolean indicando se tem a permissão
   */
  function hasPermission(permission: RBACPermissionResponse, action: 'view' | 'update' | 'insert' | 'delete'): boolean {
    switch (action) {
      case 'view':
        return permission.perm_view
      case 'update':
        return permission.perm_update
      case 'insert':
        return permission.perm_insert
      case 'delete':
        return permission.perm_delete
      default:
        return false
    }
  }

  /**
   * Limpa o último erro
   */
  function clearError() {
    lastError.value = null
  }

  return {
    isLoading,
    lastError,
    checkPermission,
    hasPermission,
    clearError
  }
}