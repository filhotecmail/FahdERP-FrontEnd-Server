<template>
  <div class="user-dropdown" ref="userDropdownRef">
    <div class="user-info" @click="toggleDropdown" :class="{ active: isDropdownOpen }">
      <span class="user-name">{{ userData?.nome || 'Usuário' }}</span>
      <div class="user-avatar">{{ getInitials(userData?.nome || 'Usuário') }}</div>
      <svg class="dropdown-arrow" :class="{ rotated: isDropdownOpen }" viewBox="0 0 24 24">
        <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/>
      </svg>
    </div>

    <div v-if="isDropdownOpen && userData && storeData && sessionData" class="user-dropdown-menu">
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
        
        <div class="detail-item" v-if="userData.cpf">
          <svg class="detail-icon" viewBox="0 0 24 24">
            <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
          </svg>
          <div class="detail-content">
            <span class="detail-label">CPF</span>
            <span class="detail-value">{{ formatCpf(userData.cpf) }}</span>
          </div>
        </div>

        <div class="detail-item" v-if="userData.cargo">
          <svg class="detail-icon" viewBox="0 0 24 24">
            <path d="M14,6V4H10V6H14M20,8A2,2 0 0,1 22,10V19A2,2 0 0,1 20,21H4A2,2 0 0,1 2,19V10C2,8.89 2.9,8 4,8H20Z"/>
          </svg>
          <div class="detail-content">
            <span class="detail-label">Cargo</span>
            <span class="detail-value">{{ userData.cargo }}</span>
          </div>
        </div>
        
        <div class="detail-item" v-if="userData.endereco.logradouro">
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

        <div class="detail-item" v-for="telefone in validTelefones" :key="telefone.tipo">
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

        <div class="detail-item" v-if="storeData.fantasia">
          <svg class="detail-icon" viewBox="0 0 24 24">
            <path d="M12,2L13.09,8.26L22,9L13.09,9.74L12,16L10.91,9.74L2,9L10.91,8.26L12,2Z"/>
          </svg>
          <div class="detail-content">
            <span class="detail-label">Nome Fantasia</span>
            <span class="detail-value">{{ storeData.fantasia }}</span>
          </div>
        </div>

        <div class="detail-item" v-if="storeData.cnpj">
          <svg class="detail-icon" viewBox="0 0 24 24">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
          </svg>
          <div class="detail-content">
            <span class="detail-label">CNPJ</span>
            <span class="detail-value">{{ formatCnpj(storeData.cnpj) }}</span>
          </div>
        </div>

        <div class="detail-item" v-if="storeData.crt">
          <svg class="detail-icon" viewBox="0 0 24 24">
            <path d="M9,12L11,14L15,10L13.59,8.58L11,11.17L9.41,9.59L9,12M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2Z"/>
          </svg>
          <div class="detail-content">
            <span class="detail-label">Regime Tributário</span>
            <span class="detail-value">{{ storeData.crt }}</span>
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

        <div class="detail-item" v-if="sessionData.ip">
          <svg class="detail-icon" viewBox="0 0 24 24">
            <path d="M4,6H20V16H4M20,18A2,2 0 0,0 22,16V6C22,4.89 21.1,4 20,4H4C2.89,4 2,4.89 2,6V16A2,2 0 0,0 4,18H0V20H24V18H20Z"/>
          </svg>
          <div class="detail-content">
            <span class="detail-label">IP de Acesso</span>
            <span class="detail-value">{{ sessionData.ip }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Fallback quando não há dados de autenticação -->
    <div v-else-if="isDropdownOpen" class="user-dropdown-menu">
      <div class="user-profile-section">
        <div class="profile-header">
          <div class="profile-avatar">U</div>
          <div class="profile-info">
            <h3 class="profile-name">Usuário não autenticado</h3>
            <p class="profile-email">Faça login para ver suas informações</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

// Estado do dropdown
const isDropdownOpen = ref(false)
const userDropdownRef = ref<HTMLElement | null>(null)

// Dados computados baseados na resposta de autenticação
const authData = computed(() => {
  try {
    const data = localStorage.getItem('authData')
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error('Erro ao carregar dados de autenticação:', error)
    return null
  }
})

const userData = computed(() => {
  const data = authData.value
  if (!data) return null
  
  return {
    nome: `${data.SystemAuthUserData.Nome} ${data.SystemAuthUserData.Sobrenome}`,
    email: data.SystemAuthUserData.Email,
    endereco: {
      logradouro: data.SystemAuthUserData.Logr,
      numero: data.SystemAuthUserData.NroLog,
      complemento: data.SystemAuthUserData.Compl,
      bairro: data.SystemAuthUserData.Bairro,
      cidade: data.SystemAuthUserData.Municipio,
      estado: data.SystemAuthUserData.Uf,
      cep: data.SystemAuthUserData.Cep
    },
    telefones_contato: [
      {
        tipo: "Celular",
        numero: data.SystemAuthUserData.NroCelular
      }
    ],
    cpf: data.SystemAuthUserData.Cpf,
    rg: data.SystemAuthUserData.Rg,
    cargo: data.SystemAuthUserData.Cargo,
    nascimento: data.SystemAuthUserData.Nascimento
  }
})

const storeData = computed(() => {
  const data = authData.value
  if (!data) return null
  
  return {
    id_loja: `LOJA-${data.Lojas.IdPk.toString().padStart(3, '0')}-${data.Lojas.TipoStr}`,
    nome: data.Lojas.XNome,
    fantasia: data.Lojas.XFant,
    tipo_loja: data.Lojas.TipoStr,
    cnpj: data.Lojas.Cnpj,
    ie: data.Lojas.Ie,
    cnae: data.Lojas.Cnae,
    crt: data.Lojas.CrtStr
  }
})

const sessionData = computed(() => {
  const data = authData.value
  if (!data) return null
  
  return {
    id_sessao: data.login.idpk.toString(),
    data_login: data.login.logdh,
    token_expira: data.login.expireddh,
    ip: data.login.ip
  }
})

// Computed property para telefones válidos
const validTelefones = computed(() => {
  if (!userData.value?.telefones_contato) return []
  return userData.value.telefones_contato.filter(telefone => telefone.numero)
})

// Funções utilitárias
const getInitials = (name: string): string => {
  if (!name) return 'U'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const formatPhone = (phone: string): string => {
  if (!phone) return ''
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`
  }
  return phone
}

const formatCpf = (cpf: string): string => {
  if (!cpf) return ''
  const cleaned = cpf.replace(/\D/g, '')
  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9)}`
  }
  return cpf
}

const formatCnpj = (cnpj: string): string => {
  if (!cnpj) return ''
  const cleaned = cnpj.replace(/\D/g, '')
  if (cleaned.length === 14) {
    return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}/${cleaned.slice(8, 12)}-${cleaned.slice(12)}`
  }
  return cnpj
}

const formatLoginDate = (dateString: string): string => {
  if (!dateString) return ''
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
  if (!loginDate) return ''
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