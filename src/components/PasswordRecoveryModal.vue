<template>
  <div v-if="isVisible" class="modal-overlay" @click="closeModal">
    <div class="modal-container" @click.stop>
      <div class="modal-header">
        <h2 class="modal-title">Recuperação de Senha</h2>
        <button @click="closeModal" class="close-button" type="button">
          <svg viewBox="0 0 24 24" class="close-icon">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>

      <div class="modal-body">
        <div class="step-indicator">
          <div class="step" :class="{ active: currentStep === 1 }">
            <span class="step-number">1</span>
            <span class="step-label">Confirmação</span>
          </div>
          <div class="step-divider"></div>
          <div class="step" :class="{ active: currentStep === 2 }">
            <span class="step-number">2</span>
            <span class="step-label">Código</span>
          </div>
        </div>

        <!-- Etapa 1: Confirmação -->
        <div v-if="currentStep === 1" class="step-content">
          <div class="confirmation-content">
            <div class="confirmation-icon">
              <svg viewBox="0 0 24 24" class="icon">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H11V21H5V3H13V9H21ZM14 10V12H16V10H14ZM16 13H14V15H16V13ZM20.5 18.08L19.42 17L18.5 17.92L20.5 19.92L24.5 15.92L23.58 15L20.5 18.08Z"/>
              </svg>
            </div>
            <h3>Deseja recuperar sua senha?</h3>
            <p>Um código de verificação será enviado para o email cadastrado em sua conta.</p>
            <div class="user-info">
              <p><strong>Usuário:</strong> {{ username }}</p>
              <p><strong>Email:</strong> {{ maskedEmail }}</p>
            </div>
          </div>
          
          <div class="modal-actions">
            <button @click="closeModal" class="btn-secondary" type="button">
              Cancelar
            </button>
            <button @click="requestRecoveryCode" class="btn-primary" :disabled="isLoading" type="button">
              <span v-if="!isLoading">Enviar Código</span>
              <span v-else class="loading-spinner"></span>
            </button>
          </div>
        </div>

        <!-- Etapa 2: Inserir Código -->
        <div v-if="currentStep === 2" class="step-content">
          <div class="code-content">
            <div class="code-icon">
              <svg viewBox="0 0 24 24" class="icon">
                <path d="M12 17C10.89 17 10 16.1 10 15C10 13.89 10.89 13 12 13C13.11 13 14 13.89 14 15C14 16.1 13.11 17 12 17ZM18 8C18 5.79 16.21 4 14 4H10C7.79 4 6 5.79 6 8V10C4.89 10 4 10.89 4 12V20C4 21.11 4.89 22 6 22H18C19.11 22 20 21.11 20 20V12C20 10.89 19.11 10 18 10V8ZM8 8C8 6.9 8.9 6 10 6H14C15.1 6 16 6.9 16 8V10H8V8Z"/>
              </svg>
            </div>
            <h3>Digite o código de verificação</h3>
            <p>Insira o código que foi enviado para seu email.</p>
            
            <form @submit.prevent="verifyCode" class="code-form">
              <div class="form-group">
                <label for="verification-code" class="form-label">Código de Verificação</label>
                <input
                  id="verification-code"
                  v-model="verificationCode"
                  type="text"
                  class="form-input code-input"
                  placeholder="Digite o código"
                  maxlength="12"
                  required
                  :disabled="isLoading"
                  @input="formatCode"
                />
              </div>

              <div class="resend-section">
                <p class="resend-text">Não recebeu o código?</p>
                <button 
                  @click="resendCode" 
                  type="button" 
                  class="resend-button"
                  :disabled="isResending || resendCooldown > 0"
                >
                  <span v-if="!isResending && resendCooldown === 0">Reenviar código</span>
                  <span v-else-if="isResending" class="loading-spinner-small"></span>
                  <span v-else>Reenviar em {{ resendCooldown }}s</span>
                </button>
              </div>

              <div class="modal-actions">
                <button @click="goBackToConfirmation" class="btn-secondary" type="button">
                  Voltar
                </button>
                <button type="submit" class="btn-primary" :disabled="isLoading || !verificationCode.trim()">
                  <span v-if="!isLoading">Resetar Senha</span>
                  <span v-else class="loading-spinner"></span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { usePasswordRecovery, type PasswordRecoveryParams } from '@/composables/usePasswordRecovery'

interface Props {
  isVisible: boolean
  username: string
  cnpjContrato: string
  cnpjLoja: string
}

interface Emits {
  (e: 'close'): void
  (e: 'success'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { isLoading, isResending, requestPasswordRecovery, verifyCodeAndResetPassword, resendCode: resendCodeAPI } = usePasswordRecovery()

const currentStep = ref(1)
const verificationCode = ref('')
const resendCooldown = ref(0)
let cooldownInterval: NodeJS.Timeout | null = null

// Computed para mascarar o email (simulado baseado no username)
const maskedEmail = computed(() => {
  const email = props.username.includes('@') ? props.username : `${props.username}@empresa.com`
  const [localPart, domain] = email.split('@')
  const maskedLocal = localPart.length > 2 
    ? `${localPart.substring(0, 2)}${'*'.repeat(localPart.length - 2)}`
    : localPart
  return `${maskedLocal}@${domain}`
})

// Formatar código conforme o usuário digita
const formatCode = () => {
  verificationCode.value = verificationCode.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
}

// Solicitar código de recuperação
const requestRecoveryCode = async () => {
  const params: PasswordRecoveryParams = {
    cnpjcontrato: props.cnpjContrato,
    cnpjloja: props.cnpjLoja,
    username: props.username
  }

  const success = await requestPasswordRecovery(params)
  if (success) {
    currentStep.value = 2
    startResendCooldown()
  }
}

// Verificar código
const verifyCode = async () => {
  const params = {
    cnpjcontrato: props.cnpjContrato,
    cnpjloja: props.cnpjLoja,
    username: props.username,
    codegen: verificationCode.value
  }

  const success = await verifyCodeAndResetPassword(params)
  if (success) {
    emit('success')
    closeModal()
  }
}

// Reenviar código
const resendCode = async () => {
  const params: PasswordRecoveryParams = {
    cnpjcontrato: props.cnpjContrato,
    cnpjloja: props.cnpjLoja,
    username: props.username
  }

  const success = await resendCodeAPI(params)
  if (success) {
    startResendCooldown()
  }
}

// Iniciar cooldown para reenvio
const startResendCooldown = () => {
  resendCooldown.value = 60
  cooldownInterval = setInterval(() => {
    resendCooldown.value--
    if (resendCooldown.value <= 0) {
      clearInterval(cooldownInterval!)
      cooldownInterval = null
    }
  }, 1000)
}

// Voltar para confirmação
const goBackToConfirmation = () => {
  currentStep.value = 1
  verificationCode.value = ''
}

// Fechar modal
const closeModal = () => {
  currentStep.value = 1
  verificationCode.value = ''
  if (cooldownInterval) {
    clearInterval(cooldownInterval)
    cooldownInterval = null
  }
  resendCooldown.value = 0
  emit('close')
}

// Limpar interval quando componente for desmontado
watch(() => props.isVisible, (newValue) => {
  if (!newValue && cooldownInterval) {
    clearInterval(cooldownInterval)
    cooldownInterval = null
    resendCooldown.value = 0
  }
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-container {
  background: var(--bg-primary);
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid var(--border-color);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
}

.close-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.close-button:hover {
  background: var(--bg-secondary);
}

.close-icon {
  width: 20px;
  height: 20px;
  fill: var(--text-secondary);
}

.modal-body {
  padding: 1.5rem;
}

.step-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.step-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--bg-secondary);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.3s;
}

.step.active .step-number {
  background: var(--accent-primary);
  color: white;
}

.step-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.step.active .step-label {
  color: var(--accent-primary);
}

.step-divider {
  width: 60px;
  height: 2px;
  background: var(--border-color);
  margin: 0 1rem;
}

.step-content {
  text-align: center;
}

.confirmation-content,
.code-content {
  margin-bottom: 2rem;
}

.confirmation-icon,
.code-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 1rem;
  background: var(--accent-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon {
  width: 32px;
  height: 32px;
  fill: white;
}

.confirmation-content h3,
.code-content h3 {
  margin: 0 0 0.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
}

.confirmation-content p,
.code-content p {
  margin: 0 0 1rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

.user-info {
  background: var(--bg-secondary);
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
  text-align: left;
}

.user-info p {
  margin: 0.25rem 0;
  font-size: 0.875rem;
}

.code-form {
  text-align: left;
}

.form-group {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-primary);
  font-size: 0.875rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px var(--accent-glow);
}

.code-input {
  text-align: center;
  font-family: monospace;
  font-size: 1.125rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.resend-section {
  text-align: center;
  margin: 1.5rem 0;
}

.resend-text {
  margin: 0 0 0.5rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.resend-button {
  background: none;
  border: none;
  color: var(--accent-primary);
  cursor: pointer;
  font-size: 0.875rem;
  text-decoration: underline;
  padding: 0.25rem;
  transition: opacity 0.2s;
}

.resend-button:hover:not(:disabled) {
  color: var(--accent-hover);
  opacity: 0.8;
}

.resend-button:disabled {
  color: var(--text-secondary);
  cursor: not-allowed;
  text-decoration: none;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.btn-primary,
.btn-secondary {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background: var(--accent-primary);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--accent-hover);
}

.btn-primary:disabled {
  background: var(--bg-secondary);
  color: var(--text-secondary);
  cursor: not-allowed;
}

.btn-secondary {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background: var(--bg-tertiary);
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-spinner-small {
  width: 12px;
  height: 12px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 640px) {
  .modal-container {
    width: 95%;
    margin: 1rem;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .btn-primary,
  .btn-secondary {
    width: 100%;
    justify-content: center;
  }
}
</style>