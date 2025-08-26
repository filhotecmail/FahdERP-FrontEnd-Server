<script setup lang="ts">
import { RouterView } from 'vue-router'
import { provide, onMounted, onBeforeUnmount } from 'vue'
import { useAuthStore } from './stores/auth'
import { useSecurityKeys } from './composables/useSecurityKeys'
import LockScreen from './components/LockScreen.vue'

// Store de autenticação
const authStore = useAuthStore()

// Composable de segurança
const { enableSecurityKeys, disableSecurityKeys } = useSecurityKeys()

// Função para bloquear a tela
const lockScreen = () => {
  authStore.lockApp()
}

// Função para desbloquear a tela
const unlockScreen = () => {
  authStore.unlockApp()
}

// Prover as funções para toda a aplicação
provide('lockScreen', lockScreen)
provide('unlockScreen', unlockScreen)
provide('isScreenLocked', authStore.isLocked)

// Atalho de teclado para bloquear (Ctrl + L) - apenas quando não estiver bloqueado
const handleKeydown = (event: KeyboardEvent) => {
  if (event.ctrlKey && event.key === 'l' && !authStore.isLocked) {
    event.preventDefault()
    lockScreen()
  }
}

// Lifecycle hooks
onMounted(() => {
  // Restaurar estado de bloqueio ao inicializar
  authStore.restoreLockState()
  
  // Iniciar monitoramento assíncrono
  authStore.startLockStateMonitoring()
  
  // Restaurar sessão do usuário
  authStore.restoreSession()
  
  // Adicionar listener de teclado
  window.addEventListener('keydown', handleKeydown)
  
  // Ativar teclas de segurança
  enableSecurityKeys()
})

onBeforeUnmount(() => {
  // Remover listener de teclado
  window.removeEventListener('keydown', handleKeydown)
  
  // Desativar teclas de segurança
  disableSecurityKeys()
})
</script>

<template>
  <div id="app">
    <RouterView />
    
    <!-- Tela de Bloqueio -->
    <LockScreen 
      :is-locked="authStore.isLocked" 
      @unlock="unlockScreen"
      @lock-error="(message) => console.warn('Erro de bloqueio:', message)"
    />
  </div>
</template>

<style>
#app {
  position: relative;
  min-height: 100vh;
}
</style>
