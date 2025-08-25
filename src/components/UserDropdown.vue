<template>
  <div class="user-dropdown" ref="userDropdownRef">
    <div class="user-info" @click="toggleDropdown" :class="{ active: isDropdownOpen }">
      <span class="user-name">{{ userData.nome }}</span>
      <div class="user-avatar">{{ getInitials(userData.nome) }}</div>
      <svg class="dropdown-arrow" :class="{ rotated: isDropdownOpen }" viewBox="0 0 24 24">
        <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/>
      </svg>
    </div>

    <div v-if="isDropdownOpen" class="user-dropdown-menu">
      <div class="user-profile-section">
        <div class="profile-header">
          <div class="profile-avatar">{{ getInitials(userData.nome) }}</div>
          <div class="profile-info">
            <h3 class="profile-name">{{ userData.nome }}</h3>
            <p class="profile-email">{{ userData.email }}</p>
          </div>
        </div>
      </div>

      <div class="dropdown-divider"></div>

      <div class="user-details-section">
        <h4 class="section-title">Informações Pessoais</h4>
        
        <div class="detail-item">
          <svg class="detail-icon" viewBox="0 0 24 24">
            <path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22S19,14.25 19,9A7,7 0 0,0 12,2Z"/>
          </svg>
          <div class="detail-content">
            <span class="detail-label">Endereço</span>
            <span class="detail-value">
              {{ userData.endereco.logradouro }}, {{ userData.endereco.numero }}
              <span v-if="userData.endereco.complemento">, {{ userData.endereco.complemento }}</span>
            </span>
            <span class="detail-sub">{{ userData.endereco.bairro }}, {{ userData.endereco.cidade }}/{{ userData.endereco.estado }} - {{ userData.endereco.cep }}</span>
          </div>
        </div>

        <div class="detail-item" v-for="telefone in userData.telefones_contato" :key="telefone.tipo">
          <svg class="detail-icon" viewBox="0 0 24 24">
            <path d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z"/>
          </svg>
          <div class="detail-content">
            <span class="detail-label">{{ telefone.tipo }}</span>
            <span class="detail-value">{{ formatPhone(telefone.numero) }}</span>
          </div>
        </div>
      </div>

      <div class="dropdown-divider"></div>

      <div class="store-section">
        <h4 class="section-title">Loja Conectada</h4>
        
        <div class="detail-item">
          <svg class="detail-icon" viewBox="0 0 24 24">
            <path d="M19,7H18V6A2,2 0 0,0 16,4H8A2,2 0 0,0 6,6V7H5A1,1 0 0,0 4,8V19A3,3 0 0,0 7,22H17A3,3 0 0,0 20,19V8A1,1 0 0,0 19,7M8,6H16V7H8V6M18,19A1,1 0 0,1 17,20H7A1,1 0 0,1 6,19V9H18V19Z"/>
          </svg>
          <div class="detail-content">
            <span class="detail-label">{{ storeData.tipo_loja }}</span>
            <span class="detail-value">{{ storeData.nome }}</span>
            <span class="detail-sub">ID: {{ storeData.id_loja }}</span>
          </div>
        </div>

        <div class="detail-item">
          <svg class="detail-icon" viewBox="0 0 24 24">
            <path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22S19,14.25 19,9A7,7 0 0,0 12,2Z"/>
          </svg>
          <div class="detail-content">
            <span class="detail-label">Localização</span>
            <span class="detail-value">{{ storeData.endereco.logradouro }}, {{ storeData.endereco.numero }}</span>
            <span class="detail-sub">{{ storeData.endereco.cidade }}/{{ storeData.endereco.estado }}</span>
          </div>
        </div>
      </div>

      <div class="dropdown-divider"></div>

      <div class="session-section">
        <h4 class="section-title">Sessão Atual</h4>
        
        <div class="detail-item">
          <svg class="detail-icon" viewBox="0 0 24 24">
            <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.9L16.2,16.2Z"/>
          </svg>
          <div class="detail-content">
            <span class="detail-label">Login realizado em</span>
            <span class="detail-value">{{ formatLoginDate(sessionData.data_login) }}</span>
            <span class="detail-sub">Conectado há {{ getSessionDuration(sessionData.data_login) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// Estado do dropdown
const isDropdownOpen = ref(false)
const userDropdownRef = ref<HTMLElement | null>(null)

// Dados mock do usuário
const userData = {
  nome: "João da Silva",
  email: "joao.silva@exemplo.com",
  endereco: {
    logradouro: "Rua das Flores",
    numero: "123",
    complemento: "Apto 45",
    bairro: "Centro",
    cidade: "São Paulo",
    estado: "SP",
    cep: "01000-000"
  },
  telefones_contato: [
    {
      tipo: "Celular",
      numero: "5511999998888"
    },
    {
      tipo: "Comercial",
      numero: "551133332222"
    }
  ]
}

const storeData = {
  id_loja: "LOJA-001-MATRIZ",
  nome: "Loja Matriz Central",
  tipo_loja: "Matriz",
  endereco: {
    logradouro: "Avenida Brasil",
    numero: "1000",
    cidade: "São Paulo",
    estado: "SP"
  },
  geolocalizacao: {
    latitude: -23.55052,
    longitude: -46.633308
  }
}

const sessionData = {
  id_sessao: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  data_login: "2025-08-25T19:31:48-03:00"
}

// Funções utilitárias
const getInitials = (name: string): string => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 13) {
    return `+${cleaned.slice(0, 2)} (${cleaned.slice(2, 4)}) ${cleaned.slice(4, 9)}-${cleaned.slice(9)}`
  }
  return phone
}

const formatLoginDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getSessionDuration = (loginDate: string): string => {
  const login = new Date(loginDate)
  const now = new Date()
  const diff = now.getTime() - login.getTime()
  
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  
  if (hours > 0) {
    return `${hours}h ${minutes}min`
  }
  return `${minutes}min`
}

// Controle do dropdown
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const closeDropdown = () => {
  isDropdownOpen.value = false
}

// Fechar dropdown ao clicar fora
const handleClickOutside = (event: MouseEvent) => {
  if (userDropdownRef.value && !userDropdownRef.value.contains(event.target as Node)) {
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
.user-dropdown {
  position: relative;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  user-select: none;
}

.user-info:hover {
  background: rgba(255, 255, 255, 0.1);
}

.user-info.active {
  background: rgba(255, 255, 255, 0.15);
}

.user-name {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.9);
  user-select: none;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--accent-primary);
  color: var(--bg-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
  user-select: none;
}

.dropdown-arrow {
  width: 14px;
  height: 14px;
  fill: rgba(255, 255, 255, 0.7);
  transition: transform 0.2s ease;
  flex-shrink: 0;
}

.dropdown-arrow.rotated {
  transform: rotate(180deg);
}

.user-dropdown-menu {
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
  min-width: 320px;
  max-width: 400px;
  max-height: 80vh;
  overflow-y: auto;
}

.user-profile-section {
  padding: 20px;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.profile-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--accent-primary);
  color: var(--bg-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.profile-info {
  flex: 1;
}

.profile-name {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.profile-email {
  margin: 4px 0 0 0;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.dropdown-divider {
  height: 1px;
  background: var(--border-color);
  margin: 0;
}

.user-details-section,
.store-section,
.session-section {
  padding: 16px 20px;
}

.section-title {
  margin: 0 0 12px 0;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
}

.detail-item:last-child {
  margin-bottom: 0;
}

.detail-icon {
  width: 18px;
  height: 18px;
  fill: var(--accent-primary);
  flex-shrink: 0;
  margin-top: 2px;
}

.detail-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.detail-label {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.detail-value {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-primary);
  line-height: 1.3;
}

.detail-sub {
  font-size: 0.8rem;
  color: var(--text-secondary);
  line-height: 1.2;
}

/* Scrollbar personalizada */
.user-dropdown-menu::-webkit-scrollbar {
  width: 6px;
}

.user-dropdown-menu::-webkit-scrollbar-track {
  background: transparent;
}

.user-dropdown-menu::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 3px;
}

.user-dropdown-menu::-webkit-scrollbar-thumb:hover {
  background: var(--text-secondary);
}
</style>