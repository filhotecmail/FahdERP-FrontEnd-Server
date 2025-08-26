import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { LockState, LOCK_STATE_STORAGE_KEY, type LockStateData } from '@/types/lockState'

export interface UserData {
  username: string
  cnpj: string
  selectedStore: string
  selectedStoreName: string
  password: string
  rememberMe: boolean
}

export const useAuthStore = defineStore('auth', () => {
  // Estado do usuário
  const user = ref<UserData | null>(null)
  const isAuthenticated = ref(false)
  
  // Estado de bloqueio
  const lockState = ref<LockState>(LockState.UNLOCKED)
  const isLocked = computed(() => lockState.value === LockState.LOCKED)

  // Getters computados
  const currentUser = computed(() => user.value)
  const userDisplayName = computed(() => {
    if (!user.value) return ''
    return user.value.username
  })
  const userStore = computed(() => {
    if (!user.value) return ''
    return user.value.selectedStoreName || 'Loja não selecionada'
  })
  const userCnpj = computed(() => {
    if (!user.value) return ''
    return user.value.cnpj
  })

  // Ações
  /**
   * Realiza o login do usuário na aplicação.
   * 
   * Esta função autentica o usuário, define o estado de autenticação como verdadeiro
   * e opcionalmente salva os dados no localStorage se a opção "lembrar-me" estiver ativada.
   * 
   * @param {UserData} userData - Dados completos do usuário para autenticação
   * @param {string} userData.username - Nome de usuário
   * @param {string} userData.cnpj - CNPJ da empresa
   * @param {string} userData.selectedStore - ID da loja selecionada
   * @param {string} userData.selectedStoreName - Nome da loja selecionada
   * @param {string} userData.password - Senha do usuário
   * @param {boolean} userData.rememberMe - Se deve lembrar os dados do usuário
   * 
   * @example
   * ```typescript
   * const userData = {
   *   username: 'admin',
   *   cnpj: '12.345.678/0001-90',
   *   selectedStore: '001',
   *   selectedStoreName: 'Loja Principal',
   *   password: 'senha123',
   *   rememberMe: true
   * }
   * login(userData)
   * ```
   * 
   * @since 1.0.0
   */
  function login(userData: UserData): void {
    user.value = userData
    isAuthenticated.value = true
    
    // Salvar no localStorage se "lembrar-me" estiver marcado
    if (userData.rememberMe) {
      localStorage.setItem('fahd_user_data', JSON.stringify(userData))
    }
  }

  /**
   * Realiza o logout do usuário e limpa todos os dados da aplicação.
   * 
   * Esta função remove o usuário autenticado, limpa o estado de autenticação
   * e remove todos os dados relacionados à aplicação do localStorage e sessionStorage,
   * incluindo dados de abas, formulários e componentes.
   * 
   * @example
   * ```typescript
   * logout()
   * console.log('Usuário deslogado e dados limpos')
   * ```
   * 
   * @since 1.0.0
   */
  function logout(): void {
    user.value = null
    isAuthenticated.value = false
    
    // Limpar todos os dados do localStorage relacionados à aplicação
    localStorage.removeItem('fahd_user_data')
    localStorage.removeItem(LOCK_STATE_STORAGE_KEY)
    
    // Limpar cache de abas e componentes
    localStorage.removeItem('tab-manager-tabs')
    localStorage.removeItem('tab-manager-activeTab')
    
    // Limpar todos os estados de formulários salvos
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('tab-') || key.startsWith('form-') || key.startsWith('component-')) {
        localStorage.removeItem(key)
      }
    })
    
    // Limpar sessionStorage também
    sessionStorage.clear()
  }

  /**
   * Restaura a sessão do usuário a partir dos dados salvos no localStorage.
   * 
   * Esta função tenta recuperar os dados do usuário previamente salvos no localStorage
   * e restaurar o estado de autenticação da aplicação. Se os dados forem encontrados
   * e válidos, o usuário será automaticamente autenticado.
   * 
   * @returns {boolean} `true` se a sessão foi restaurada com sucesso, `false` caso contrário
   * 
   * @example
   * ```typescript
   * const sessionRestored = restoreSession()
   * if (sessionRestored) {
   *   console.log('Usuário logado automaticamente')
   * } else {
   *   console.log('Nenhuma sessão válida encontrada')
   * }
   * ```
   * 
   * @throws {Error} Remove dados corrompidos do localStorage em caso de erro de parsing
   * 
   * @since 1.0.0
   */
  function restoreSession(): boolean {
    try {
      const savedData = localStorage.getItem('fahd_user_data')
      if (savedData) {
        const userData = JSON.parse(savedData)
        user.value = userData
        isAuthenticated.value = true
        return true
      }
    } catch (error) {
      console.error('Erro ao restaurar sessão:', error)
      localStorage.removeItem('fahd_user_data')
    }
    return false
  }

  /**
   * Valida se a senha fornecida corresponde à senha do usuário autenticado.
   * 
   * Esta função compara a senha fornecida com a senha do usuário atualmente
   * autenticado na aplicação.
   * 
   * @param {string} password - Senha a ser validada
   * @returns {boolean} `true` se a senha estiver correta, `false` caso contrário
   * 
   * @example
   * ```typescript
   * const isValid = validatePassword('minhasenha')
   * if (isValid) {
   *   console.log('Senha correta')
   * } else {
   *   console.log('Senha incorreta')
   * }
   * ```
   * 
   * @since 1.0.0
   */
  function validatePassword(password: string): boolean {
    return user.value?.password === password
  }

  // Funções de gerenciamento do estado de bloqueio
  /**
   * Bloqueia a aplicação definindo o estado como LOCKED.
   * 
   * Esta função altera o estado da aplicação para bloqueado e salva
   * automaticamente o estado no localStorage para persistência.
   * 
   * @example
   * ```typescript
   * lockApp()
   * console.log('Aplicação bloqueada')
   * ```
   * 
   * @since 1.0.0
   */
  function lockApp(): void {
    lockState.value = LockState.LOCKED
    saveLockState()
  }

  /**
   * Desbloqueia a aplicação definindo o estado como UNLOCKED.
   * 
   * Esta função altera o estado da aplicação para desbloqueado e salva
   * automaticamente o estado no localStorage para persistência.
   * 
   * @example
   * ```typescript
   * unlockApp()
   * console.log('Aplicação desbloqueada')
   * ```
   * 
   * @since 1.0.0
   */
  function unlockApp(): void {
    lockState.value = LockState.UNLOCKED
    saveLockState()
  }

  /**
   * Salva o estado atual de bloqueio no localStorage.
   * 
   * Esta função cria um objeto com o estado de bloqueio atual, timestamp
   * e ID do usuário, salvando-o no localStorage para persistência entre sessões.
   * 
   * @example
   * ```typescript
   * saveLockState()
   * console.log('Estado de bloqueio salvo')
   * ```
   * 
   * @since 1.0.0
   */
  function saveLockState(): void {
    const lockData: LockStateData = {
      state: lockState.value,
      timestamp: Date.now(),
      userId: user.value?.username
    }
    localStorage.setItem(LOCK_STATE_STORAGE_KEY, JSON.stringify(lockData))
  }

  /**
   * Restaura o estado de bloqueio a partir dos dados salvos no localStorage.
   * 
   * Esta função tenta recuperar o estado de bloqueio previamente salvo no localStorage
   * e aplicá-lo à aplicação atual. Se os dados estiverem corrompidos, eles são removidos.
   * 
   * @returns {boolean} `true` se o estado foi restaurado com sucesso, `false` caso contrário
   * 
   * @example
   * ```typescript
   * const restored = restoreLockState()
   * if (restored) {
   *   console.log('Estado de bloqueio restaurado')
   * } else {
   *   console.log('Nenhum estado de bloqueio encontrado')
   * }
   * ```
   * 
   * @throws {Error} Remove dados corrompidos do localStorage em caso de erro de parsing
   * 
   * @since 1.0.0
   */
  function restoreLockState(): boolean {
    try {
      const savedLockData = localStorage.getItem(LOCK_STATE_STORAGE_KEY)
      if (savedLockData) {
        const lockData: LockStateData = JSON.parse(savedLockData)
        lockState.value = lockData.state
        return true
      }
    } catch (error) {
      console.error('Erro ao restaurar estado de bloqueio:', error)
      localStorage.removeItem(LOCK_STATE_STORAGE_KEY)
    }
    return false
  }

  // Monitoramento assíncrono do estado de bloqueio
  /**
   * Inicia o monitoramento assíncrono do estado de bloqueio da aplicação.
   * 
   * Esta função configura dois mecanismos de sincronização:
   * 1. Event listener para mudanças no localStorage de outras abas/janelas
   * 2. Verificação periódica (a cada segundo) do estado no localStorage
   * 
   * Isso garante que o estado de bloqueio seja sincronizado entre múltiplas
   * abas/janelas da mesma aplicação.
   * 
   * @example
   * ```typescript
   * startLockStateMonitoring()
   * console.log('Monitoramento de estado de bloqueio iniciado')
   * ```
   * 
   * @since 1.0.0
   */
  function startLockStateMonitoring(): void {
    // Monitora mudanças no localStorage de outras abas/janelas
    window.addEventListener('storage', (event) => {
      if (event.key === LOCK_STATE_STORAGE_KEY && event.newValue) {
        try {
          const lockData: LockStateData = JSON.parse(event.newValue)
          lockState.value = lockData.state
        } catch (error) {
          console.error('Erro ao sincronizar estado de bloqueio:', error)
        }
      }
    })

    // Verifica periodicamente o estado no localStorage
    setInterval(() => {
      const savedLockData = localStorage.getItem(LOCK_STATE_STORAGE_KEY)
      if (savedLockData) {
        try {
          const lockData: LockStateData = JSON.parse(savedLockData)
          if (lockData.state !== lockState.value) {
            lockState.value = lockData.state
          }
        } catch (error) {
          console.error('Erro na verificação periódica do estado de bloqueio:', error)
        }
      }
    }, 1000) // Verifica a cada segundo
  }

  // Watcher para salvar automaticamente mudanças no estado de bloqueio
  watch(lockState, () => {
    saveLockState()
  })

  return {
    // Estado
    user: currentUser,
    isAuthenticated,
    lockState,
    isLocked,
    
    // Getters
    userDisplayName,
    userStore,
    userCnpj,
    
    // Ações
    login,
    logout,
    restoreSession,
    validatePassword,
    lockApp,
    unlockApp,
    restoreLockState,
    startLockStateMonitoring
  }
})