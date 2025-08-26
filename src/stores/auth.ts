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
  function login(userData: UserData) {
    user.value = userData
    isAuthenticated.value = true
    
    // Salvar no localStorage se "lembrar-me" estiver marcado
    if (userData.rememberMe) {
      localStorage.setItem('fahd_user_data', JSON.stringify(userData))
    }
  }

  function logout() {
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

  function restoreSession() {
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

  function validatePassword(password: string): boolean {
    return user.value?.password === password
  }

  // Funções de gerenciamento do estado de bloqueio
  function lockApp() {
    lockState.value = LockState.LOCKED
    saveLockState()
  }

  function unlockApp() {
    lockState.value = LockState.UNLOCKED
    saveLockState()
  }

  function saveLockState() {
    const lockData: LockStateData = {
      state: lockState.value,
      timestamp: Date.now(),
      userId: user.value?.username
    }
    localStorage.setItem(LOCK_STATE_STORAGE_KEY, JSON.stringify(lockData))
  }

  function restoreLockState() {
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
  function startLockStateMonitoring() {
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