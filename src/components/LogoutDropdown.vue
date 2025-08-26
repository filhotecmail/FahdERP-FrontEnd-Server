<template>
  <div class="logout-dropdown" ref="logoutDropdownRef">
    <button @click="toggleDropdown" class="logout-btn" :class="{ active: isDropdownOpen }" title="Opções de saída">
      <svg viewBox="0 0 24 24" class="logout-icon">
        <path d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z"/>
      </svg>
    </button>

    <div v-if="isDropdownOpen" class="logout-dropdown-menu">
      <!-- Alerta de abas abertas -->
      <div v-if="hasOpenTabs" class="warning-section">
        <div class="warning-header">
          <svg class="warning-icon" viewBox="0 0 24 24">
            <path d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
          </svg>
          <span class="warning-title">Atenção!</span>
        </div>
        <p class="warning-message">
          Você tem <strong>{{ openTabsCount }} aba(s)</strong> aberta(s). Ao sair da aplicação, você pode perder todo o trabalho não salvo.
        </p>
      </div>

      <div class="dropdown-divider" v-if="hasOpenTabs"></div>

      <!-- Opções de logout -->
      <div class="logout-options">
        <button @click="handleLogout" class="logout-option danger">
          <div class="option-icon">
            <svg viewBox="0 0 24 24">
              <path d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z"/>
            </svg>
          </div>
          <div class="option-content">
            <span class="option-title">Sair da aplicação</span>
            <span class="option-description">Encerra a sessão e retorna à tela de login</span>
          </div>
        </button>

        <button @click="handleLock" class="logout-option warning">
          <div class="option-icon">
            <svg viewBox="0 0 24 24">
              <path d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z"/>
            </svg>
          </div>
          <div class="option-content">
            <span class="option-title">Bloquear aplicação</span>
            <span class="option-description">Bloqueia a tela mantendo a sessão ativa</span>
          </div>
        </button>

        <button @click="handleStayConnected" class="logout-option success">
          <div class="option-icon">
            <svg viewBox="0 0 24 24">
              <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,16.5L6.5,12L7.91,10.59L11,13.67L16.59,8.09L18,9.5L11,16.5Z"/>
            </svg>
          </div>
          <div class="option-content">
            <span class="option-title">Continuar conectado</span>
            <span class="option-description">Mantém a sessão ativa e fecha este menu</span>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Props e injeções
const router = useRouter()
const authStore = useAuthStore()
const tabCache = inject('tabCache') as { tabs?: { value?: unknown[] }, clearAllTabs?: () => void } | undefined

// Estado do dropdown
const isDropdownOpen = ref(false)
const logoutDropdownRef = ref<HTMLElement | null>(null)

// Computed para verificar abas abertas
const hasOpenTabs = computed(() => {
  return (tabCache?.tabs?.value?.length ?? 0) > 0
})

const openTabsCount = computed(() => {
  return tabCache?.tabs?.value?.length ?? 0
})

// Controle do dropdown
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const closeDropdown = () => {
  isDropdownOpen.value = false
}

// Handlers das opções
const handleLogout = () => {
  closeDropdown()
  
  // Limpar cache de abas se existir
  if (tabCache?.clearAllTabs) {
    tabCache.clearAllTabs()
  }
  
  // Fazer logout usando o store
  authStore.logout()
  
  // Redirecionar para login
  router.push('/login')
}

const handleLock = () => {
  closeDropdown()
  
  // Bloquear a tela usando o store
  authStore.lockApp()
}

const handleStayConnected = () => {
  closeDropdown()
  // Apenas fecha o dropdown, mantém tudo como está
}

// Fechar dropdown ao clicar fora
const handleClickOutside = (event: MouseEvent) => {
  if (logoutDropdownRef.value && !logoutDropdownRef.value.contains(event.target as Node)) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.logout-dropdown {
  position: relative;
}

.logout-btn {
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.logout-btn.active {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
}

.logout-icon {
  width: 18px;
  height: 18px;
  fill: white;
  transition: all 0.3s ease;
}

.logout-btn:hover .logout-icon {
  fill: rgba(255, 255, 255, 0.9);
}

.logout-dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  overflow: hidden;
  backdrop-filter: blur(20px);
  min-width: 280px;
  max-width: 350px;
}

.warning-section {
  padding: 16px 20px;
  background: rgba(255, 193, 7, 0.1);
  border-bottom: 1px solid rgba(255, 193, 7, 0.2);
}

.warning-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.warning-icon {
  width: 20px;
  height: 20px;
  fill: #ffc107;
  flex-shrink: 0;
}

.warning-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #ffc107;
}

.warning-message {
  margin: 0;
  font-size: 0.85rem;
  color: var(--text-primary);
  line-height: 1.4;
}

.dropdown-divider {
  height: 1px;
  background: var(--border-color);
  margin: 0;
}

.logout-options {
  padding: 8px;
}

.logout-option {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  margin-bottom: 4px;
}

.logout-option:last-child {
  margin-bottom: 0;
}

.logout-option:hover {
  background: var(--hover-bg);
  transform: translateX(2px);
}

.logout-option.danger:hover {
  background: rgba(220, 53, 69, 0.1);
  border-left: 3px solid #dc3545;
  padding-left: 9px;
}

.logout-option.warning:hover {
  background: rgba(255, 193, 7, 0.1);
  border-left: 3px solid #ffc107;
  padding-left: 9px;
}

.logout-option.success:hover {
  background: rgba(40, 167, 69, 0.1);
  border-left: 3px solid #28a745;
  padding-left: 9px;
}

.option-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.option-icon svg {
  width: 20px;
  height: 20px;
  fill: var(--text-secondary);
  transition: fill 0.2s ease;
}

.logout-option.danger:hover .option-icon svg {
  fill: #dc3545;
}

.logout-option.warning:hover .option-icon svg {
  fill: #ffc107;
}

.logout-option.success:hover .option-icon svg {
  fill: #28a745;
}

.option-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.option-title {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-primary);
}

.option-description {
  font-size: 0.8rem;
  color: var(--text-secondary);
  line-height: 1.2;
}
</style>