/**
 * Sistema centralizado de rotas backend
 * Gerencia todas as chamadas de API de forma consistente
 */

export interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  status: number
}

export interface AuthResponse {
  Cnpjmaster: string
  IdLoja: number
  cnpjloja: string
  Username: string | null
  Password: string | null
  Master: {
    Id: number
    DocCpfCnpj: string
    ContratoNro: string
    Name: string | null
    Tag: number
  }
  Lojas: {
    IdPk: number
    Cnpj: string
    Fk: number
    XNome: string
    XFant: string
    Im: string
    Cnae: string
    Crt: string
    CrtStr: string
    Ie: string
    Iest: string | null
    Tipo: string
    FilialCnpj: string | null
    TipoStr: string
    Suframa: string | null
    Name: string | null
    Tag: number
  }
  SystemAuth: {
    IdPk: number
    MasterIdPk: number
    CnpjContrato: string
    Username: string | null
    Password: string | null
    Name: string | null
    Tag: number
  }
  SystemAuthUserData: {
    IdPk: number
    FkKey: number
    Nome: string
    Sobrenome: string
    Nascimento: string
    Cpf: string
    Rg: string
    NroCelular: string
    Email: string
    Cargo: string
    Foto: string | null
    Logr: string
    NroLog: string
    Compl: string
    Bairro: string
    Municipio: string
    Uf: string
    Cep: string
    Name: string | null
    Tag: number
  }
  Name: string | null
  Tag: number
  login: {
    idpk: number
    fkmaster: number
    fkloja: number
    fkuser: number
    logdh: string
    token: string
    expireddh: string
    ip: string
    latitude: string | null
    longitude: string | null
    useragent: string | null
  }
}

export class BackendRouter {
  private baseUrl: string

  constructor() {
    this.baseUrl = `http://${import.meta.env.VITE_BACKENDREST}`
  }


  /**
   * Método genérico para fazer requisições HTTP
   */
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`
      console.log('🌐 Fazendo requisição para:', url)

      // Merge headers e anexar Authorization com JWT do localStorage
      const authToken = localStorage.getItem('authToken')
      const headers = new Headers(options.headers as HeadersInit | undefined)
      if (authToken) {
        const existingAuth = headers.get('Authorization') || ''
        const hasBearerScheme = existingAuth.toLowerCase().startsWith('bearer ')
        headers.set('Authorization', hasBearerScheme ? existingAuth : `Bearer ${authToken}`)
      }

      const response = await fetch(url, {
        ...options,
        headers
      })

      console.log('📊 Status da resposta:', response.status)

      let data: unknown
      const contentType = response.headers.get('content-type')
      console.log('📋 Content-Type:', contentType)

      try {
        if (contentType?.includes('application/json')) {
          data = await response.json()
        } else {
          const text = await response.text()
          console.log('📄 Resposta não-JSON recebida:', text)
          data = text
        }
      } catch (parseError) {
        console.error('🚨 Erro ao fazer parse da resposta:', parseError)
        const rawText = await response.text()
        console.log('📄 Resposta bruta:', rawText)
        data = rawText
      }

      if (!response.ok) {
        console.error('❌ Erro na resposta:', data)
        const errMsg = typeof data === 'string'
          ? data
          : (data && typeof data === 'object' && 'error' in (data as Record<string, unknown>)
              ? String((data as Record<string, unknown>).error)
              : 'Erro desconhecido')
        return {
          status: response.status,
          error: errMsg
        }
      }

      console.log('✅ Dados recebidos:', data)
      return {
        status: response.status,
        data: data as T
      }
    } catch (error) {
      console.error('🚨 Erro na requisição:', error)
      return {
        status: 0,
        error: error instanceof Error ? error.message : 'Erro de conexão'
      }
    }
  }

  /**
   * Buscar lojas por CNPJ do contrato
   */
  async getStoresByContract(cnpjContrato: string) {
    const cleanCnpj = cnpjContrato.replace(/\D/g, '')
    return this.makeRequest(`/api/lojas/all?cnpjcpntrato=${cleanCnpj}`)
  }

  /**
   * Autenticar usuário
   */
  async authenticate(params: {
    cnpjLoja: string
    cnpjMaster: string
    username: string
    password: string
  }): Promise<ApiResponse<AuthResponse>> {
    const { cnpjLoja, cnpjMaster, username, password } = params
    const cleanCnpjLoja = cnpjLoja.replace(/\D/g, '')
    const cleanCnpjMaster = cnpjMaster.replace(/\D/g, '')
    
    const endpoint = `/api/auth?cnpjloja=${cleanCnpjLoja}&cnpjmaster=${cleanCnpjMaster}&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
    
    const response = await this.makeRequest<AuthResponse>(endpoint, {
      method: 'POST',
      redirect: 'follow'
    })

    // Se a autenticação foi bem-sucedida, salvar no localStorage
    if (response.status === 200 && response.data) {
      localStorage.setItem('authData', JSON.stringify(response.data))
      localStorage.setItem('authToken', response.data.login?.token || '')
    }

    return response
  }

  /**
   * Método GET genérico
   */
  async get<T>(endpoint: string, params?: Record<string, string | number>, options?: RequestInit) {
    let url = endpoint
    if (params) {
      const searchParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        searchParams.append(key, String(value))
      })
      url += `?${searchParams.toString()}`
    }
    return this.makeRequest<T>(url, options)
  }

  /**
   * Método POST genérico
   */
  async post<T>(endpoint: string, data?: Record<string, unknown>) {
    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  /**
   * Método PUT genérico
   */
  async put<T>(endpoint: string, data?: Record<string, unknown>) {
    return this.makeRequest<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  /**
   * Método DELETE genérico
   */
  async delete<T>(endpoint: string) {
    return this.makeRequest<T>(endpoint, {
      method: 'DELETE',
    })
  }
}

// Instância singleton do BackendRouter
export const backendRouter = new BackendRouter()

// Export default para facilitar importação
export default backendRouter