<template>
  <div class="esocial-container">
    <!-- Card Heading -->
    <ESocialCardHeading
      title="Editar Usuário"
      subtitle="Atualize as informações do usuário no sistema"
      badge="Usuários"
    />

    <!-- Loading State -->
    <div v-if="loadingUser" class="loading-container">
      <div class="loading-spinner">
        <svg viewBox="0 0 24 24" class="animate-spin">
          <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z"/>
        </svg>
      </div>
      <p>Carregando dados do usuário...</p>
    </div>

    <!-- Formulário -->
    <div v-else class="esocial-form">
      <form @submit.prevent="updateUser">
        <!-- Informações de Acesso -->
        <div class="form-section">
          <h2 class="section-title">
            <svg class="section-icon" viewBox="0 0 24 24">
              <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
            </svg>
            Informações de Acesso
          </h2>
          
          <div class="form-grid">
            <div class="form-group">
              <label for="nome" class="form-label required">Nome Completo</label>
              <input
                id="nome"
                v-model="formData.nome"
                type="text"
                class="form-input"
                :class="{ 'error': errors.nome }"
                placeholder="Digite o nome completo"
                required
              />
              <span v-if="errors.nome" class="error-message">{{ errors.nome }}</span>
            </div>

            <div class="form-group">
              <label for="email" class="form-label required">E-mail</label>
              <input
                id="email"
                v-model="formData.email"
                type="email"
                class="form-input"
                :class="{ 'error': errors.email }"
                placeholder="usuario@exemplo.com"
                required
              />
              <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
            </div>

            <div class="form-group">
              <label for="usuario" class="form-label required">Nome de Usuário</label>
              <input
                id="usuario"
                v-model="formData.usuario"
                type="text"
                class="form-input"
                :class="{ 'error': errors.usuario }"
                placeholder="nome.usuario"
                required
              />
              <span v-if="errors.usuario" class="error-message">{{ errors.usuario }}</span>
            </div>

            <div class="form-group">
              <label for="status" class="form-label">Status</label>
              <select id="status" v-model="formData.status" class="form-select">
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
                <option value="pendente">Pendente</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Alterar Senha -->
        <div class="form-section">
          <h2 class="section-title">
            <svg class="section-icon" viewBox="0 0 24 24">
              <path d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z"/>
            </svg>
            Alterar Senha
          </h2>

          <div class="form-grid">
            <div class="form-group full-width">
              <div class="password-section">
                <div class="password-header">
                  <span>Deseja alterar a senha do usuário?</span>
                  <label class="toggle-switch">
                    <input type="checkbox" v-model="changePassword">
                    <span class="slider"></span>
                  </label>
                </div>
                <p class="password-note">Ative esta opção apenas se desejar alterar a senha do usuário</p>
              </div>
            </div>
          </div>

          <!-- Campos de senha (condicionais) -->
          <div v-if="changePassword" class="form-grid">
            <div class="form-group">
              <label for="senha" class="form-label required">Nova Senha</label>
              <div class="password-input">
                <input
                  id="senha"
                  v-model="formData.senha"
                  :type="showPassword ? 'text' : 'password'"
                  class="form-input"
                  :class="{ 'error': errors.senha }"
                  placeholder="Digite uma nova senha"
                  :required="changePassword"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="password-toggle"
                >
                  <svg v-if="showPassword" viewBox="0 0 24 24">
                    <path d="M11.83,9L15,12.16C15,12.11 15,12.05 15,12A3,3 0 0,0 12,9C11.94,9 11.89,9 11.83,9M7.53,9.8L9.08,11.35C9.03,11.56 9,11.77 9,12A3,3 0 0,0 12,15C12.22,15 12.44,14.97 12.65,14.92L14.2,16.47C13.53,16.8 12.79,17 12,17A5,5 0 0,1 7,12C7,11.21 7.2,10.47 7.53,9.8M2,4.27L4.28,6.55L4.73,7C3.08,8.3 1.78,10 1,12C2.73,16.39 7,19.5 12,19.5C13.55,19.5 15.03,19.2 16.38,18.66L16.81,19.09L19.73,22L21,20.73L3.27,3M12,7A5,5 0 0,1 17,12C17,12.64 16.87,13.26 16.64,13.82L19.57,16.75C21.07,15.5 22.27,13.86 23,12C21.27,7.61 17,4.5 12,4.5C10.6,4.5 9.26,4.75 8,5.2L10.17,7.35C10.76,7.13 11.37,7 12,7Z"/>
                  </svg>
                  <svg v-else viewBox="0 0 24 24">
                    <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z"/>
                  </svg>
                </button>
              </div>
              <span v-if="errors.senha" class="error-message">{{ errors.senha }}</span>
            </div>

            <div class="form-group">
              <label for="confirmarSenha" class="form-label required">Confirmar Nova Senha</label>
              <input
                id="confirmarSenha"
                v-model="formData.confirmarSenha"
                type="password"
                class="form-input"
                :class="{ 'error': errors.confirmarSenha }"
                placeholder="Confirme a nova senha"
                :required="changePassword"
              />
              <span v-if="errors.confirmarSenha" class="error-message">{{ errors.confirmarSenha }}</span>
            </div>
          </div>
        </div>

        <!-- Informações Profissionais -->
        <div class="form-section">
          <h2 class="section-title">
            <svg class="section-icon" viewBox="0 0 24 24">
              <path d="M20,6C20.58,6 21.05,6.2 21.42,6.59C21.8,7 22,7.45 22,8V19C22,19.55 21.8,20 21.42,20.41C21.05,20.8 20.58,21 20,21H4C3.42,21 2.95,20.8 2.58,20.41C2.2,20 2,19.55 2,19V8C2,7.45 2.2,7 2.58,6.59C2.95,6.2 3.42,6 4,6H8V4C8,3.42 8.2,2.95 8.58,2.58C8.95,2.2 9.42,2 10,2H14C14.58,2 15.05,2.2 15.42,2.58C15.8,2.95 16,3.42 16,4V6H20M4,8V19H20V8H4M10,4V6H14V4H10Z"/>
            </svg>
            Informações Profissionais
          </h2>
          
          <div class="form-grid">
            <div class="form-group">
              <label for="cargo" class="form-label">Cargo</label>
              <input
                id="cargo"
                v-model="formData.cargo"
                type="text"
                class="form-input"
                placeholder="Digite o cargo"
              />
            </div>

            <div class="form-group">
              <label for="departamento" class="form-label">Departamento</label>
              <select id="departamento" v-model="formData.departamento" class="form-select">
                <option value="">Selecione o departamento</option>
                <option value="ti">Tecnologia da Informação</option>
                <option value="rh">Recursos Humanos</option>
                <option value="financeiro">Financeiro</option>
                <option value="vendas">Vendas</option>
                <option value="marketing">Marketing</option>
                <option value="operacoes">Operações</option>
              </select>
            </div>

            <div class="form-group">
              <label for="dataAdmissao" class="form-label">Data de Admissão</label>
              <input
                id="dataAdmissao"
                v-model="formData.dataAdmissao"
                type="date"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label for="salario" class="form-label">Salário</label>
              <input
                id="salario"
                v-model="formData.salario"
                type="number"
                step="0.01"
                class="form-input"
                placeholder="0,00"
              />
            </div>

            <div class="form-group">
              <label for="telefone" class="form-label">Telefone</label>
              <input
                id="telefone"
                v-model="formData.telefone"
                type="tel"
                class="form-input"
                placeholder="(11) 99999-9999"
              />
            </div>

            <div class="form-group">
              <label for="cpf" class="form-label">CPF</label>
              <input
                id="cpf"
                v-model="formData.cpf"
                type="text"
                class="form-input"
                placeholder="000.000.000-00"
                maxlength="14"
              />
            </div>
          </div>
        </div>

        <!-- Permissões -->
        <div class="form-section">
          <h2 class="section-title">
            <svg class="section-icon" viewBox="0 0 24 24">
              <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11.5C15.4,11.5 16,12.1 16,12.7V16.2C16,16.8 15.4,17.3 14.8,17.3H9.2C8.6,17.3 8,16.8 8,16.2V12.7C8,12.1 8.6,11.5 9.2,11.5V10C9.2,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.5,8.7 10.5,10V11.5H13.5V10C13.5,8.7 12.8,8.2 12,8.2Z"/>
            </svg>
            Permissões do Sistema
          </h2>
          
          <div class="permissions-container">
            <table class="permissions-table">
              <thead>
                <tr>
                  <th>Módulo</th>
                  <th>Visualizar</th>
                  <th>Criar</th>
                  <th>Editar</th>
                  <th>Excluir</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Dashboard</strong></td>
                  <td>
                    <input
                      type="checkbox"
                      value="dashboard.view"
                      v-model="formData.permissoes"
                    />
                  </td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td><strong>Usuários</strong></td>
                  <td>
                    <input
                      type="checkbox"
                      value="usuarios.view"
                      v-model="formData.permissoes"
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      value="usuarios.create"
                      v-model="formData.permissoes"
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      value="usuarios.edit"
                      v-model="formData.permissoes"
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      value="usuarios.delete"
                      v-model="formData.permissoes"
                    />
                  </td>
                </tr>
                <tr>
                  <td><strong>Vendas</strong></td>
                  <td>
                    <input
                      type="checkbox"
                      value="vendas.view"
                      v-model="formData.permissoes"
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      value="vendas.create"
                      v-model="formData.permissoes"
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      value="vendas.edit"
                      v-model="formData.permissoes"
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      value="vendas.delete"
                      v-model="formData.permissoes"
                    />
                  </td>
                </tr>
                <tr>
                  <td><strong>Estoque</strong></td>
                  <td>
                    <input
                      type="checkbox"
                      value="estoque.view"
                      v-model="formData.permissoes"
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      value="estoque.create"
                      v-model="formData.permissoes"
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      value="estoque.edit"
                      v-model="formData.permissoes"
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      value="estoque.delete"
                      v-model="formData.permissoes"
                    />
                  </td>
                </tr>
                <tr>
                  <td><strong>Financeiro</strong></td>
                  <td>
                    <input
                      type="checkbox"
                      value="financeiro.view"
                      v-model="formData.permissoes"
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      value="financeiro.create"
                      v-model="formData.permissoes"
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      value="financeiro.edit"
                      v-model="formData.permissoes"
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      value="financeiro.delete"
                      v-model="formData.permissoes"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Botões de Ação -->
        <div class="form-actions">
          <button type="button" @click="goBack" class="btn-back">
            <svg class="btn-icon" viewBox="0 0 24 24">
              <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"/>
            </svg>
            Voltar
          </button>
          <div class="action-buttons-right">
            <button type="button" @click="resetForm" class="btn-secondary">
              Restaurar
            </button>
            <button 
              type="submit" 
              :disabled="!isFormValid || loading" 
              class="btn-primary"
            >
              <span v-if="loading">Salvando...</span>
              <span v-else>Salvar Alterações</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ESocialCardHeading from '@/modules/esocial/components/ESocialCardHeading.vue'

// Definir eventos que o componente pode emitir
const emit = defineEmits<{
  'user-updated': [user: {
    id: string
    nome: string
    email: string
    telefone: string
    cpf: string
    usuario: string
    status: string
    cargo: string
    departamento: string
    dataAdmissao: string
    salario: string
    permissoes: string[]
    senha?: string
    confirmarSenha?: string
  }]
  'cancel': []
}>()

const route = useRoute()

// Estados do formulário
const loading = ref(false)
const loadingUser = ref(false)
const changePassword = ref(false)
const showPassword = ref(false)

const formData = ref({
  id: '',
  nome: '',
  email: '',
  telefone: '',
  cpf: '',
  usuario: '',
  status: 'ativo',
  cargo: '',
  departamento: '',
  dataAdmissao: '',
  salario: '',
  permissoes: [] as string[],
  senha: '',
  confirmarSenha: ''
})

const originalData = ref({
  id: '',
  nome: '',
  email: '',
  telefone: '',
  cpf: '',
  usuario: '',
  status: 'ativo',
  cargo: '',
  departamento: '',
  dataAdmissao: '',
  salario: '',
  permissoes: [] as string[]
})

// Erros de validação
const errors = ref({
  nome: '',
  email: '',
  usuario: '',
  senha: '',
  confirmarSenha: ''
})

// Validação do formulário
const isFormValid = computed(() => {
  const basicValidation = formData.value.nome.trim() !== '' &&
         formData.value.email.trim() !== '' &&
         formData.value.usuario.trim() !== '' &&
         !Object.values(errors.value).some(error => error !== '')

  if (changePassword.value) {
    return basicValidation && formData.value.senha && formData.value.confirmarSenha
  }
  
  return basicValidation
})

// Funções de validação
const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validateForm = () => {
  errors.value = {
    nome: '',
    email: '',
    usuario: '',
    senha: '',
    confirmarSenha: ''
  }

  if (!formData.value.nome.trim()) {
    errors.value.nome = 'Nome é obrigatório'
  }

  if (!formData.value.email.trim()) {
    errors.value.email = 'E-mail é obrigatório'
  } else if (!validateEmail(formData.value.email)) {
    errors.value.email = 'E-mail inválido'
  }

  if (!formData.value.usuario.trim()) {
    errors.value.usuario = 'Nome de usuário é obrigatório'
  }

  if (changePassword.value) {
    if (!formData.value.senha) {
      errors.value.senha = 'Nova senha é obrigatória'
    } else if (formData.value.senha.length < 6) {
      errors.value.senha = 'Senha deve ter pelo menos 6 caracteres'
    }

    if (!formData.value.confirmarSenha) {
      errors.value.confirmarSenha = 'Confirmação de senha é obrigatória'
    } else if (formData.value.senha !== formData.value.confirmarSenha) {
      errors.value.confirmarSenha = 'Senhas não coincidem'
    }
  }

  return !Object.values(errors.value).some(error => error)
}

// Funções principais
const loadUser = async () => {
  try {
    loadingUser.value = true
    const userId = route.params.id as string
    
    // Simular carregamento de dados do usuário
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Dados mockados - em produção viria da API
    const userData = {
      id: userId,
      nome: 'João Silva Santos',
      email: 'joao.silva@empresa.com',
      telefone: '(11) 99999-9999',
      cpf: '123.456.789-00',
      usuario: 'joao.silva',
      status: 'ativo',
      cargo: 'Analista de Sistemas',
      departamento: 'ti',
      dataAdmissao: '2023-01-15',
      salario: '5000.00',
      permissoes: ['dashboard.view', 'vendas.view', 'vendas.create']
    }
    
    // Preencher formulário e dados originais
    Object.assign(formData.value, userData)
    Object.assign(originalData.value, userData)
    
  } catch (error) {
    console.error('Erro ao carregar usuário:', error)
  } finally {
    loadingUser.value = false
  }
}

const goBack = () => {
  emit('cancel')
}

const resetForm = () => {
  Object.assign(formData.value, originalData.value)
  changePassword.value = false
  formData.value.senha = ''
  formData.value.confirmarSenha = ''
  errors.value = {
    nome: '',
    email: '',
    usuario: '',
    senha: '',
    confirmarSenha: ''
  }
}

const updateUser = async () => {
  if (!validateForm()) {
    return
  }

  try {
    loading.value = true
    
    // Preparar dados para envio
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let updateData: any = { ...formData.value }
    
    // Se não está alterando senha, remover campos de senha
    if (!changePassword.value) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { senha, confirmarSenha, ...dataWithoutPassword } = updateData
      updateData = dataWithoutPassword
    }
    
    // Simular atualização
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    console.log('Usuário atualizado:', updateData)
    
    // Emitir evento para o componente pai
    emit('user-updated', updateData)
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadUser()
})
</script>

<style scoped>
.esocial-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  margin-bottom: 1rem;
}

.loading-spinner svg {
  width: 100%;
  height: 100%;
  color: #667eea;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.esocial-form {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.form-section {
  padding: 2rem;
  border-bottom: 1px solid #e5e7eb;
}

.form-section:last-child {
  border-bottom: none;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
}

.section-icon {
  width: 24px;
  height: 24px;
  color: #667eea;
  fill: currentColor;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-label {
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.form-label.required::after {
  content: ' *';
  color: #ef4444;
}

.form-input,
.form-select {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  background-color: white;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input.error,
.form-select.error {
  border-color: #ef4444;
}

.error-message {
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.password-section {
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
}

.password-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.password-header span {
  font-weight: 500;
  color: #374151;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #667eea;
}

input:checked + .slider:before {
  transform: translateX(24px);
}

.password-note {
  color: #6b7280;
  font-size: 0.75rem;
  margin: 0;
}

.password-input {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  padding: 0;
  width: 20px;
  height: 20px;
}

.password-toggle svg {
  width: 100%;
  height: 100%;
  fill: currentColor;
}

.permissions-container {
  overflow-x: auto;
}

.permissions-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.permissions-table th,
.permissions-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.permissions-table th {
  background-color: #f9fafb;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
}

.permissions-table td {
  font-size: 0.875rem;
}

.permissions-table input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: #667eea;
  cursor: pointer;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.action-buttons-right {
  display: flex;
  gap: 1rem;
}

.btn-primary,
.btn-secondary,
.btn-back {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-back {
  background-color: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-back:hover {
  background-color: #e5e7eb;
}

.btn-icon {
  width: 16px;
  height: 16px;
  fill: currentColor;
}

.btn-primary {
  background-color: #667eea;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #5a67d8;
}

.btn-primary:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover {
  background-color: #e5e7eb;
}

@media (max-width: 768px) {
  .esocial-container {
    padding: 1rem;
  }
  
  .esocial-form {
    padding: 1rem;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
}
</style>