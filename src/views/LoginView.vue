<template>
  <div class="login-container">
    <div class="solar-background">
      <div class="solar-rays"></div>
      <div class="solar-core"></div>
    </div>
    <div class="login-card">
      <div class="login-header">
        <div class="brand-logo">
          <span class="fahd">Fahd</span><span class="erp">ERP</span>
        </div>
        <p class="login-subtitle">Acesso ao Sistema</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <!-- Container responsivo para CNPJ e Loja -->
        <div class="form-row">
          <div class="form-group cnpj-field">
            <label for="cnpj" class="form-label">CNPJ do Contrato</label>
            <input
              id="cnpj"
              v-model="formData.cnpj.value"
              type="text"
              class="form-input"
              placeholder="Digite o CNPJ do contrato"
              :disabled="isLoading"
              @input="onCnpjChange"
            />
          </div>

          <div v-if="showStoreSelector" class="form-group store-field store-selector">
            <label for="store" class="form-label">Selecione a Loja</label>
            <select
                id="store"
                v-model="formData.selectedStore.value"
                class="form-input"
                required
                :disabled="isLoading"
              >
              <option value="" disabled>Escolha uma loja...</option>
              <option 
                v-for="store in availableStores" 
                :key="store.id" 
                :value="store.id"
              >
                {{ store.name }} - {{ store.cnpj }}
              </option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label for="username" class="form-label">Usuário</label>
          <input
            id="username"
            v-model="formData.username.value"
            type="text"
            class="form-input"
            placeholder="Digite seu usuário"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="password" class="form-label">Senha</label>
          <input
            id="password"
            v-model="formData.password.value"
            type="password"
            class="form-input"
            placeholder="Digite sua senha"
            required
          />
        </div>
        
        <div class="form-options">
          <label class="checkbox-container">
            <input v-model="formData.rememberMe.value" type="checkbox" class="checkbox">
            <span class="checkmark"></span>
            Lembrar-me
          </label>
          
          <button type="button" class="forgot-password" @click="openPasswordRecoveryModal">Esqueci minha senha</button>
        </div>
        
        <button type="submit" class="login-button" :disabled="isLoading">
          <span v-if="!isLoading">Entrar</span>
          <span v-else class="loading-spinner"></span>
        </button>
      </form>
      
      <div class="login-footer">
        <p class="version-info">Versão 1.0.0</p>
      </div>
    </div>
    

    
    <!-- Theme Toggle -->
    <button @click="toggleTheme" class="theme-toggle" :title="isDark ? 'Modo Claro' : 'Modo Escuro'">
      <svg v-if="isDark" class="theme-icon" viewBox="0 0 24 24">
        <path d="M12 18C8.69 18 6 15.31 6 12S8.69 6 12 6 18 8.69 18 12 15.31 18 12 18ZM12 16C14.21 16 16 14.21 16 12S14.21 8 12 8 8 9.79 8 12 9.79 16 12 16ZM12 2L13.09 5.26L16 4L14.74 6.91L18 8L14.74 9.09L16 12L13.09 10.74L12 14L10.91 10.74L8 12L9.26 9.09L6 8L9.26 6.91L8 4L10.91 5.26L12 2Z"/>
      </svg>
      <svg v-else class="theme-icon" viewBox="0 0 24 24">
        <path d="M12 2A10 10 0 0 0 2 12A10 10 0 0 0 12 22A10 10 0 0 0 22 12A10 10 0 0 0 12 2M12 4A8 8 0 0 1 20 12A8 8 0 0 1 12 20V4Z"/>
      </svg>
    </button>

    <!-- Modal de Recuperação de Senha -->
    <PasswordRecoveryModal
      :is-visible="isPasswordRecoveryModalVisible"
      :username="formData.username.value"
      :cnpj-contrato="formData.cnpj.value"
      :cnpj-loja="availableStores.find(s => s.id === formData.selectedStore.value)?.cnpj || formData.cnpj.value"
      @close="closePasswordRecoveryModal"
      @success="onPasswordRecoverySuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToast, POSITION } from 'vue-toastification'
import { useThemeStore } from '../stores/theme'
import { useAuthStore } from '../stores/auth'
import backendRouter from '@/utils/backendRouter'
import PasswordRecoveryModal from '@/components/PasswordRecoveryModal.vue'

const router = useRouter()
const toast = useToast()
const themeStore = useThemeStore()
const authStore = useAuthStore()
const isDark = computed(() => themeStore.isDark)
const isLoading = ref(false)
const isLoadingStores = ref(false)

// Estado do modal de recuperação de senha
const isPasswordRecoveryModalVisible = ref(false)

// Campos do formulário usando ref simples
const formData = {
  username: ref(''),
  password: ref(''),
  cnpj: ref(''),
  selectedStore: ref(''),
  rememberMe: ref(false)
}

// Lista de lojas disponíveis (será populada pela API)
const availableStores = ref<Store[]>([])

// Computed para mostrar/ocultar o combobox de lojas
const showStoreSelector = computed(() => {
  return availableStores.value.length > 0
})

// Função para validar CNPJ
const isValidCNPJ = (cnpj: string): boolean => {
  // Remove caracteres não numéricos
  const cleanCnpj = cnpj.replace(/\D/g, '')
  
  // Verifica se tem 14 dígitos
  if (cleanCnpj.length !== 14) return false
  
  // Verifica se não são todos os dígitos iguais
  if (/^(\d)\1+$/.test(cleanCnpj)) return false
  
  // Validação dos dígitos verificadores
  let soma = 0
  let pos = 5
  
  // Primeiro dígito verificador
  for (let i = 0; i < 12; i++) {
    soma += parseInt(cleanCnpj.charAt(i)) * pos--
    if (pos < 2) pos = 9
  }
  
  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11)
  if (resultado !== parseInt(cleanCnpj.charAt(12))) return false
  
  // Segundo dígito verificador
  soma = 0
  pos = 6
  for (let i = 0; i < 13; i++) {
    soma += parseInt(cleanCnpj.charAt(i)) * pos--
    if (pos < 2) pos = 9
  }
  
  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11)
  return resultado === parseInt(cleanCnpj.charAt(13))
}

// Definir interface para o tipo de loja da API
interface StoreFromAPI {
  idpk: number
  cnpj: string
  fk: number
  xnome: string
  xfant: string
  im: string
  cnae: string
  crt: number
  crtstr: string
  ie: string
  iest: string | null
  tipo: number
  filialcnpj: string | null
  tipostr: string
  suframa: string | null
  alias: string
  id: number
  doccpfcnpj: string
  contratonro: string
}

// Definir interface para o tipo de loja no select
interface Store {
  id: string
  name: string
  cnpj: string
}

// Função para buscar lojas por CNPJ
const fetchStoresByCnpj = async (cnpj: string) => {
  const cleanCnpj = cnpj.replace(/\D/g, '')
  
  if (cleanCnpj.length !== 14) {
    console.warn('⚠️ CNPJ deve ter 14 dígitos')
    return
  }

  isLoadingStores.value = true
  availableStores.value = []

  try {
    console.log('🔍 Buscando lojas para CNPJ:', cleanCnpj)
    
    const response = await backendRouter.getStoresByContract(cleanCnpj)

    if (response.status === 200 && response.data) {
      console.log('✅ Lojas encontradas:', response.data)
      
      // Verificar se response.data é um array antes de mapear
      if (Array.isArray(response.data)) {
        // Mapear dados da API para o formato esperado
        availableStores.value = response.data.map((store: StoreFromAPI) => ({
          id: String(store.id),
          name: store.alias,
          cnpj: store.cnpj
        }))
        
        console.log('📋 Lojas mapeadas:', availableStores.value)
      } else {
        console.error('❌ Dados recebidos não são um array:', response.data)
        toast.error('Formato de dados inválido recebido do servidor', {
          position: POSITION.TOP_RIGHT,
          timeout: 4000
        })
      }
    } else {
      console.error('❌ Erro ao buscar lojas:', response.error)
      toast.error(response.error || 'Erro ao buscar lojas', {
        position: POSITION.TOP_RIGHT,
        timeout: 4000
      })
    }
  } catch (error) {
    console.error('🚨 Erro na requisição:', error)
    toast.error('Erro ao conectar com o servidor', {
      position: POSITION.TOP_RIGHT,
      timeout: 4000
    })
  } finally {
    isLoadingStores.value = false
  }
}

// Função para lidar com mudanças no CNPJ
const onCnpjChange = async () => {
  // Limpar seleção de loja e lista de lojas quando CNPJ for alterado
  formData.selectedStore.value = ''
  availableStores.value = []
  
  const cnpj = formData.cnpj.value
  
  if (!cnpj || cnpj.trim().length === 0) {
    return
  }
  
  // Verificar se o CNPJ está completo e válido
  const cleanCnpj = cnpj.replace(/\D/g, '')
  
  if (cleanCnpj.length === 14) {
    if (isValidCNPJ(cnpj)) {
      await fetchStoresByCnpj(cnpj)
    } else {
      toast.error('CNPJ inválido. Verifique os dígitos digitados.', {
        position: POSITION.TOP_RIGHT,
        timeout: 4000
      })
    }
  }
}

const handleLogin = async () => {
  // Validar se loja foi selecionada quando CNPJ estiver preenchido
  if (showStoreSelector.value && !formData.selectedStore.value) {
    toast.warning('Por favor, selecione uma loja antes de continuar.', {
      position: POSITION.TOP_RIGHT,
      timeout: 4000
    })
    return
  }
  
  isLoading.value = true
  
  try {
    // Obter dados da loja selecionada
    const selectedStore = availableStores.value.find(s => s.id === formData.selectedStore.value)
    
    if (!selectedStore) {
      toast.error('Loja selecionada não encontrada.', {
        position: POSITION.TOP_RIGHT,
        timeout: 4000
      })
      return
    }

    // Preparar parâmetros para autenticação
    const authParams = {
      cnpjLoja: selectedStore.cnpj,
      cnpjMaster: formData.cnpj.value,
      username: formData.username.value,
      password: formData.password.value
    }

    console.log('🔐 Tentando autenticar com:', authParams)

    // Chamar API de autenticação
    const response = await backendRouter.authenticate(authParams)

    if (response.status === 200 && response.data) {
      console.log('✅ Autenticação bem-sucedida:', response.data)
      
      // Salvar dados do usuário no store de autenticação
      authStore.login({
        username: formData.username.value,
        cnpj: formData.cnpj.value,
        selectedStore: formData.selectedStore.value,
        selectedStoreName: selectedStore.name,
        password: formData.password.value,
        rememberMe: formData.rememberMe.value
      })
      
      // Mostrar notificação de sucesso
      toast.success('Login realizado com sucesso! Redirecionando...', {
        position: POSITION.TOP_RIGHT,
        timeout: 2000
      })
      
      // Redirecionar para dashboard após um pequeno delay
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    } else {
      console.error('❌ Falha na autenticação:', response.error)
      toast.error(response.error || 'Credenciais inválidas!', {
        position: POSITION.TOP_RIGHT,
        timeout: 5000
      })
    }
    
  } catch (error) {
    console.error('🚨 Erro no login:', error)
    toast.error('Erro interno do sistema. Tente novamente.', {
      position: POSITION.TOP_RIGHT,
      timeout: 5000
    })
  } finally {
    isLoading.value = false
  }
}

const toggleTheme = () => {
  themeStore.toggleTheme()
}

// Funções do modal de recuperação de senha
const openPasswordRecoveryModal = () => {
  // Validar se os campos necessários estão preenchidos
  if (!formData.cnpj.value.trim()) {
    toast.warning('Por favor, preencha o CNPJ do contrato antes de recuperar a senha.', {
      position: POSITION.TOP_RIGHT,
      timeout: 4000
    })
    return
  }

  if (!formData.selectedStore.value && showStoreSelector.value) {
    toast.warning('Por favor, selecione uma loja antes de recuperar a senha.', {
      position: POSITION.TOP_RIGHT,
      timeout: 4000
    })
    return
  }

  if (!formData.username.value.trim()) {
    toast.warning('Por favor, preencha o usuário antes de recuperar a senha.', {
      position: POSITION.TOP_RIGHT,
      timeout: 4000
    })
    return
  }

  isPasswordRecoveryModalVisible.value = true
}

const closePasswordRecoveryModal = () => {
  isPasswordRecoveryModalVisible.value = false
}

const onPasswordRecoverySuccess = () => {
  toast.success('Senha temporária enviada! Verifique seu email e faça login com a nova senha.', {
    position: POSITION.TOP_RIGHT,
    timeout: 6000
  })
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: var(--bg-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  position: relative;
  transition: background-color 0.3s ease;
  overflow: hidden;
}

.solar-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.solar-core {
  position: absolute;
  width: 300px;
  height: 300px;
  background: radial-gradient(
    circle,
    rgba(0, 255, 127, 0.4) 0%,
    rgba(0, 255, 127, 0.2) 30%,
    rgba(0, 255, 127, 0.1) 60%,
    transparent 100%
  );
  border-radius: 50%;
  animation: solar-pulse 4s ease-in-out infinite;
}

.solar-rays {
  position: absolute;
  width: 800px;
  height: 800px;
  background: conic-gradient(
    from 0deg,
    transparent 0deg,
    rgba(0, 255, 127, 0.1) 10deg,
    transparent 20deg,
    rgba(0, 255, 127, 0.08) 30deg,
    transparent 40deg,
    rgba(0, 255, 127, 0.12) 50deg,
    transparent 60deg,
    rgba(0, 255, 127, 0.06) 70deg,
    transparent 80deg,
    rgba(0, 255, 127, 0.1) 90deg,
    transparent 100deg,
    rgba(0, 255, 127, 0.09) 110deg,
    transparent 120deg,
    rgba(0, 255, 127, 0.11) 130deg,
    transparent 140deg,
    rgba(0, 255, 127, 0.07) 150deg,
    transparent 160deg,
    rgba(0, 255, 127, 0.13) 170deg,
    transparent 180deg,
    rgba(0, 255, 127, 0.08) 190deg,
    transparent 200deg,
    rgba(0, 255, 127, 0.1) 210deg,
    transparent 220deg,
    rgba(0, 255, 127, 0.09) 230deg,
    transparent 240deg,
    rgba(0, 255, 127, 0.12) 250deg,
    transparent 260deg,
    rgba(0, 255, 127, 0.06) 270deg,
    transparent 280deg,
    rgba(0, 255, 127, 0.11) 290deg,
    transparent 300deg,
    rgba(0, 255, 127, 0.08) 310deg,
    transparent 320deg,
    rgba(0, 255, 127, 0.1) 330deg,
    transparent 340deg,
    rgba(0, 255, 127, 0.09) 350deg,
    transparent 360deg
  );
  border-radius: 50%;
  animation: solar-rotation 20s linear infinite;
  opacity: 0.6;
}

.solar-rays::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 600px;
  height: 600px;
  transform: translate(-50%, -50%);
  background: conic-gradient(
    from 45deg,
    transparent 0deg,
    rgba(0, 255, 127, 0.05) 15deg,
    transparent 30deg,
    rgba(0, 255, 127, 0.08) 45deg,
    transparent 60deg,
    rgba(0, 255, 127, 0.06) 75deg,
    transparent 90deg,
    rgba(0, 255, 127, 0.09) 105deg,
    transparent 120deg,
    rgba(0, 255, 127, 0.04) 135deg,
    transparent 150deg,
    rgba(0, 255, 127, 0.07) 165deg,
    transparent 180deg,
    rgba(0, 255, 127, 0.06) 195deg,
    transparent 210deg,
    rgba(0, 255, 127, 0.08) 225deg,
    transparent 240deg,
    rgba(0, 255, 127, 0.05) 255deg,
    transparent 270deg,
    rgba(0, 255, 127, 0.09) 285deg,
    transparent 300deg,
    rgba(0, 255, 127, 0.07) 315deg,
    transparent 330deg,
    rgba(0, 255, 127, 0.06) 345deg,
    transparent 360deg
  );
  border-radius: 50%;
  animation: solar-rotation 15s linear infinite reverse;
}

@keyframes solar-rotation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes solar-pulse {
  0%, 100% {
    opacity: 0.4;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.1);
  }
}



.login-card {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 2.5rem;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
  overflow: hidden;
}

/* Ajuste responsivo da largura do card */
@media (min-width: 768px) {
  .login-card {
    max-width: 600px;
  }
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.brand-logo {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
}

.fahd {
  color: var(--text-primary);
  user-select: none;
}

.erp {
  color: var(--accent-primary);
  text-shadow: 0 0 10px var(--accent-glow);
  user-select: none;
}

.login-subtitle {
  color: var(--text-secondary);
  font-size: 1rem;
  margin: 0;
  font-weight: 400;
  user-select: none;
}

.login-form {
  margin-bottom: 1.5rem;
}

/* Layout responsivo para campos CNPJ e Loja */
.form-row {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

/* Layout horizontal para tablets e desktops */
@media (min-width: 768px) {
  .form-row {
    flex-direction: row;
    align-items: flex-end;
    gap: 1rem;
  }
  
  .cnpj-field {
    flex: 1;
    min-width: 200px;
  }
  
  .store-field {
    flex: 1.2;
    min-width: 250px;
  }
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-row .form-group {
  margin-bottom: 0;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
  font-weight: 500;
  font-size: 0.9rem;
  user-select: none;
}

.form-input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  background: var(--input-bg);
  color: var(--text-primary);
  font-size: 1rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-input select {
  cursor: pointer;
}

.store-selector {
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
    max-height: 0;
  }
  to {
    opacity: 1;
    transform: translateY(0);
    max-height: 100px;
  }
}

/* Animação responsiva para layout horizontal */
@media (min-width: 768px) {
  .store-selector {
    animation: slideInRight 0.3s ease-out;
  }
  
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
}

.form-input:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px var(--accent-glow);
}

.form-input::placeholder {
  color: var(--text-muted);
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.checkbox-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 0.9rem;
  color: var(--text-secondary);
  user-select: none;
}

.checkbox {
  display: none;
}

.checkmark {
  width: 18px;
  height: 18px;
  border: 2px solid var(--border-color);
  border-radius: 4px;
  margin-right: 0.5rem;
  position: relative;
  transition: all 0.3s ease;
}

.checkbox:checked + .checkmark {
  background: var(--accent-primary);
  border-color: var(--accent-primary);
}

.checkbox:checked + .checkmark::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #000;
  font-size: 12px;
  font-weight: bold;
}

.forgot-password {
  background: none;
  border: none;
  color: var(--accent-primary);
  font-size: 0.9rem;
  cursor: pointer;
  text-decoration: none;
  transition: opacity 0.3s ease;
}

.forgot-password:hover {
  opacity: 0.8;
}

.login-button {
  width: 100%;
  padding: 1rem;
  background: var(--accent-primary);
  color: #000;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.login-button:hover:not(:disabled) {
  background: var(--accent-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px var(--accent-glow);
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid #000;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  display: inline-block;
}

.login-footer {
  text-align: center;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.version-info {
  color: var(--text-muted);
  font-size: 0.8rem;
  margin: 0;
  user-select: none;
}

.theme-toggle {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.theme-toggle:hover {
  border-color: var(--accent-primary);
  box-shadow: 0 0 10px var(--accent-glow);
}

.theme-icon {
  width: 24px;
  height: 24px;
  fill: var(--text-primary);
  transition: fill 0.3s ease;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.theme-toggle {
  position: fixed;
  top: 2rem;
  right: 2rem;
  width: 50px;
  height: 50px;
  border: none;
  border-radius: 50%;
  background: var(--bg-secondary);
  color: var(--text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  border: 2px solid var(--border-color);
}

.theme-toggle:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(0, 255, 127, 0.3);
  border-color: var(--accent-primary);
}

.theme-icon {
  width: 24px;
  height: 24px;
  fill: currentColor;
  transition: all 0.3s ease;
}

.theme-toggle:hover .theme-icon {
  fill: var(--accent-primary);
}

/* Responsividade */
@media (max-width: 480px) {
  .login-card {
    padding: 2rem 1.5rem;
  }
  
  .brand-logo {
    font-size: 2rem;
  }
  
  .theme-toggle {
    top: 1rem;
    right: 1rem;
    width: 40px;
    height: 40px;
  }
  
  .theme-icon {
    width: 20px;
    height: 20px;
  }
}
</style>