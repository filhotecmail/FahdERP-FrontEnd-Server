<template>
  <div v-if="isLocked" class="lock-screen-overlay">
    <div class="lock-screen-content">
      <!-- Data e Hora -->
      <div class="datetime-display">
        <div class="time">{{ currentTime }}</div>
        <div class="date">{{ currentDate }}</div>
      </div>

      <!-- Área de Login -->
      <div class="login-area">
        <div class="user-avatar">
          <div class="avatar-circle">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="currentColor"/>
              <path d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z" fill="currentColor"/>
            </svg>
          </div>
        </div>
        
        <div class="user-name">{{ userDisplayName }}</div>
        <div class="user-info">
          <div class="user-store">{{ userStore }}</div>
          <div class="session-status">Sessão bloqueada</div>
        </div>
        
        <div class="password-container">
          <input 
            ref="passwordInput"
            v-model="password" 
            type="password" 
            class="password-input" 
            placeholder="Senha"
            @keyup.enter="unlock"
            @focus="showPasswordField = true"
          />
          <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
        </div>
        
        <button 
          class="unlock-button" 
          @click="unlock"
          :disabled="!password.trim()"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2"/>
          </svg>
          Entrar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch, computed } from 'vue'
import { useAuthStore } from '../stores/auth'

// Props
interface Props {
  isLocked?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isLocked: false
})

// Store de autenticação
const authStore = useAuthStore()

// Dados do usuário computados
const userDisplayName = computed(() => authStore.userDisplayName || 'Usuário')
const userStore = computed(() => authStore.userStore || 'Loja não selecionada')

// Emits
const emit = defineEmits<{
  unlock: []
  lockError: [message: string]
}>()

// Reactive data
const password = ref('')
const errorMessage = ref('')
const showPasswordField = ref(false)
const currentTime = ref('')
const currentDate = ref('')
const passwordInput = ref<HTMLInputElement>()

// Timer para atualizar data/hora
let timeInterval: NodeJS.Timeout | null = null

// Função para atualizar data e hora
const updateDateTime = () => {
  const now = new Date()
  
  // Formato da hora: HH:MM
  currentTime.value = now.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
  
  // Formato da data: Dia da semana, DD de mês
  currentDate.value = now.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  })
}

// Função para desbloquear
const unlock = async () => {
  if (!password.value.trim()) {
    errorMessage.value = 'Digite a senha'
    return
  }
  
  if (authStore.validatePassword(password.value)) {
    errorMessage.value = ''
    password.value = ''
    emit('unlock')
  } else {
    errorMessage.value = 'Senha incorreta'
    password.value = ''
    emit('lockError', 'Senha incorreta')
    
    // Limpar erro após 3 segundos
    setTimeout(() => {
      errorMessage.value = ''
    }, 3000)
  }
}

// Lifecycle hooks
onMounted(() => {
  updateDateTime()
  timeInterval = setInterval(updateDateTime, 1000)
  
  // Focar no input quando a tela de bloqueio aparecer
  if (props.isLocked) {
    nextTick(() => {
      passwordInput.value?.focus()
    })
  }
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})

// Watch para focar no input quando isLocked mudar
watch(() => props.isLocked, (newValue: boolean) => {
  if (newValue) {
    nextTick(() => {
      passwordInput.value?.focus()
    })
  }
})
</script>

<style scoped>
.lock-screen-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease-out;
}

.lock-screen-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
  color: white;
  text-align: center;
}

.datetime-display {
  margin-bottom: 80px;
  user-select: none;
}

.time {
  font-size: 4rem;
  font-weight: 300;
  margin-bottom: 8px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  letter-spacing: -2px;
}

.date {
  font-size: 1.2rem;
  font-weight: 400;
  opacity: 0.9;
  text-transform: capitalize;
  text-shadow: 0 1px 5px rgba(0, 0, 0, 0.3);
}

.login-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  min-width: 320px;
}

.user-avatar {
  margin-bottom: 10px;
}

.avatar-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.user-name {
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 8px;
  opacity: 0.9;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  margin-bottom: 20px;
}

.user-store {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 400;
}

.session-status {
  font-size: 0.8rem;
  color: rgba(255, 204, 102, 0.9);
  font-weight: 500;
  background: rgba(255, 204, 102, 0.1);
  padding: 4px 12px;
  border-radius: 12px;
  border: 1px solid rgba(255, 204, 102, 0.3);
}

.password-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.password-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  outline: none;
  transition: all 0.2s ease;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
}

.password-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.password-input:focus {
  border-color: rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
}

.error-message {
  color: #ff6b6b;
  font-size: 0.9rem;
  text-align: center;
  background: rgba(255, 107, 107, 0.1);
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid rgba(255, 107, 107, 0.3);
}

.unlock-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  min-width: 120px;
}

.unlock-button:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.unlock-button:active:not(:disabled) {
  transform: translateY(0);
}

.unlock-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    backdrop-filter: blur(0px);
    -webkit-backdrop-filter: blur(0px);
  }
  to {
    opacity: 1;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
  }
}

/* Responsividade */
@media (max-width: 768px) {
  .time {
    font-size: 3rem;
  }
  
  .date {
    font-size: 1rem;
  }
  
  .login-area {
    padding: 30px 20px;
    min-width: 280px;
    margin: 0 20px;
  }
  
  .datetime-display {
    margin-bottom: 60px;
  }
}

@media (max-width: 480px) {
  .time {
    font-size: 2.5rem;
  }
  
  .login-area {
    padding: 25px 15px;
    min-width: 260px;
  }
}
</style>