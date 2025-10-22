<template>
  <div class="view-user-view">
    <!-- Cabeçalho -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <button @click="goBack" class="back-button" title="Voltar">
            <svg viewBox="0 0 24 24">
              <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"/>
            </svg>
          </button>
          <div class="header-info">
            <h1>Visualizar Usuário</h1>
            <p>Informações detalhadas do usuário {{ userData.nome || 'Carregando...' }}</p>
          </div>
        </div>
        <div class="header-actions">
          <button @click="editUser" class="btn-primary" type="button">
            <svg viewBox="0 0 24 24">
              <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"/>
            </svg>
            Editar Usuário
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner">
        <svg viewBox="0 0 24 24" class="animate-spin">
          <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z"/>
        </svg>
      </div>
      <p>Carregando dados do usuário...</p>
    </div>

    <!-- Conteúdo -->
    <div v-else class="content-container">
      <!-- Informações Pessoais -->
      <div class="info-section">
        <div class="section-header">
          <h2>
            <svg viewBox="0 0 24 24">
              <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
            </svg>
            Informações Pessoais
          </h2>
        </div>
        <div class="info-grid">
          <div class="info-item">
            <label>Nome Completo</label>
            <span>{{ userData.nome || 'N/A' }}</span>
          </div>
          <div class="info-item">
            <label>E-mail</label>
            <span>{{ userData.email || 'N/A' }}</span>
          </div>
          <div class="info-item">
            <label>Telefone</label>
            <span>{{ userData.telefone || 'N/A' }}</span>
          </div>
          <div class="info-item">
            <label>CPF</label>
            <span>{{ userData.cpf || 'N/A' }}</span>
          </div>
        </div>
      </div>

      <!-- Informações de Acesso -->
      <div class="info-section">
        <div class="section-header">
          <h2>
            <svg viewBox="0 0 24 24">
              <path d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z"/>
            </svg>
            Informações de Acesso
          </h2>
        </div>
        <div class="info-grid">
          <div class="info-item">
            <label>Nome de Usuário</label>
            <span>{{ userData.usuario || 'N/A' }}</span>
          </div>
          <div class="info-item">
            <label>Status</label>
            <span class="status-badge" :class="getStatusClass(userData.status)">
              {{ getStatusText(userData.status) }}
            </span>
          </div>
          <div class="info-item">
            <label>Último Acesso</label>
            <span>{{ formatDate(userData.ultimoAcesso) }}</span>
          </div>
          <div class="info-item">
            <label>Tentativas de Login</label>
            <span>{{ userData.tentativasLogin || '0' }}</span>
          </div>
        </div>
      </div>

      <!-- Informações Profissionais -->
      <div class="info-section">
        <div class="section-header">
          <h2>
            <svg viewBox="0 0 24 24">
              <path d="M20,6H16V4A2,2 0 0,0 14,2H10A2,2 0 0,0 8,4V6H4A2,2 0 0,0 2,8V19A2,2 0 0,0 4,21H20A2,2 0 0,0 22,19V8A2,2 0 0,0 20,6M10,4H14V6H10V4Z"/>
            </svg>
            Informações Profissionais
          </h2>
        </div>
        <div class="info-grid">
          <div class="info-item">
            <label>Cargo</label>
            <span>{{ userData.cargo || 'N/A' }}</span>
          </div>
          <div class="info-item">
            <label>Departamento</label>
            <span>{{ getDepartmentName(userData.departamento) }}</span>
          </div>
          <div class="info-item">
            <label>Data de Admissão</label>
            <span>{{ formatDate(userData.dataAdmissao) }}</span>
          </div>
          <div class="info-item">
            <label>Salário</label>
            <span>{{ formatCurrency(userData.salario) }}</span>
          </div>
        </div>
      </div>

      <!-- Permissões -->
      <div class="info-section">
        <div class="section-header">
          <h2>
            <svg viewBox="0 0 24 24">
              <path d="M12,12H19C18.47,16.11 15.72,19.78 12,20.92V12H5V6.3L12,3.19M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1Z"/>
            </svg>
            Permissões do Sistema
          </h2>
        </div>
        <div class="permissions-container">
          <div v-if="!userData.permissoes || userData.permissoes.length === 0" class="no-permissions">
            <svg viewBox="0 0 24 24">
              <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z"/>
            </svg>
            <p>Nenhuma permissão atribuída</p>
          </div>
          <div v-else class="permissions-grid">
            <div v-for="module in getPermissionsByModule()" :key="module.name" class="permission-module">
              <h3>{{ module.name }}</h3>
              <div class="permission-list">
                <span
                  v-for="permission in module.permissions"
                  :key="permission"
                  class="permission-tag"
                  :class="getPermissionClass(permission)"
                >
                  {{ getPermissionText(permission) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Informações do Sistema -->
      <div class="info-section">
        <div class="section-header">
          <h2>
            <svg viewBox="0 0 24 24">
              <path d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
            </svg>
            Informações do Sistema
          </h2>
        </div>
        <div class="info-grid">
          <div class="info-item">
            <label>Data de Criação</label>
            <span>{{ formatDate(userData.dataCriacao) }}</span>
          </div>
          <div class="info-item">
            <label>Criado por</label>
            <span>{{ userData.criadoPor || 'N/A' }}</span>
          </div>
          <div class="info-item">
            <label>Última Modificação</label>
            <span>{{ formatDate(userData.ultimaModificacao) }}</span>
          </div>
          <div class="info-item">
            <label>Modificado por</label>
            <span>{{ userData.modificadoPor || 'N/A' }}</span>
          </div>
        </div>
      </div>

      <!-- Atividade Recente -->
      <div class="info-section">
        <div class="section-header">
          <h2>
            <svg viewBox="0 0 24 24">
              <path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z"/>
            </svg>
            Atividade Recente
          </h2>
        </div>
        <div class="activity-list">
          <div v-if="!userData.atividadeRecente || userData.atividadeRecente.length === 0" class="no-activity">
            <svg viewBox="0 0 24 24">
              <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4Z"/>
            </svg>
            <p>Nenhuma atividade recente registrada</p>
          </div>
          <div v-else class="activity-items">
            <div v-for="activity in userData.atividadeRecente" :key="activity.id" class="activity-item">
              <div class="activity-icon" :class="getActivityIconClass(activity.tipo)">
                <svg viewBox="0 0 24 24">
                  <path :d="getActivityIconPath(activity.tipo)"/>
                </svg>
              </div>
              <div class="activity-content">
                <p class="activity-description">{{ activity.descricao }}</p>
                <span class="activity-date">{{ formatDate(activity.data) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// Estado dos dados
const userData = ref({
  id: '',
  nome: '',
  email: '',
  telefone: '',
  cpf: '',
  usuario: '',
  status: '',
  cargo: '',
  departamento: '',
  dataAdmissao: '',
  salario: '',
  permissoes: [] as string[],
  dataCriacao: '',
  ultimoAcesso: '',
  criadoPor: '',
  ultimaModificacao: '',
  modificadoPor: '',
  tentativasLogin: 0,
  atividadeRecente: [] as Array<{
    id: string
    tipo: string
    descricao: string
    data: string
  }>
})

// Estado da interface
const loading = ref(true)

// Mapeamento de departamentos
const departmentMap = {
  'ti': 'Tecnologia da Informação',
  'rh': 'Recursos Humanos',
  'financeiro': 'Financeiro',
  'vendas': 'Vendas',
  'marketing': 'Marketing',
  'operacoes': 'Operações'
}

// Mapeamento de módulos
const moduleMap = {
  'dashboard': 'Dashboard',
  'vendas': 'Vendas',
  'estoque': 'Estoque',
  'financeiro': 'Financeiro',
  'rh': 'Recursos Humanos',
  'fiscal': 'Fiscal',
  'usuarios': 'Usuários'
}

// Funções utilitárias
const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleString('pt-BR')
}

const formatCurrency = (value: string | number) => {
  if (!value) return 'N/A'
  const numValue = typeof value === 'string' ? parseFloat(value) : value
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(numValue)
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'ativo': return 'status-active'
    case 'inativo': return 'status-inactive'
    case 'pendente': return 'status-pending'
    default: return 'status-unknown'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'ativo': return 'Ativo'
    case 'inativo': return 'Inativo'
    case 'pendente': return 'Pendente'
    default: return 'Desconhecido'
  }
}

const getDepartmentName = (departmentKey: string) => {
  return departmentMap[departmentKey as keyof typeof departmentMap] || departmentKey || 'N/A'
}

const getPermissionsByModule = () => {
  if (!userData.value.permissoes || userData.value.permissoes.length === 0) {
    return []
  }

  const modulePermissions: Record<string, string[]> = {}
  
  userData.value.permissoes.forEach(permission => {
    const [module, action] = permission.split(':')
    if (!modulePermissions[module]) {
      modulePermissions[module] = []
    }
    modulePermissions[module].push(action)
  })

  return Object.entries(modulePermissions).map(([moduleKey, permissions]) => ({
    name: moduleMap[moduleKey as keyof typeof moduleMap] || moduleKey,
    permissions
  }))
}

const getPermissionClass = (permission: string) => {
  switch (permission) {
    case 'view': return 'permission-view'
    case 'create': return 'permission-create'
    case 'edit': return 'permission-edit'
    case 'delete': return 'permission-delete'
    default: return 'permission-default'
  }
}

const getPermissionText = (permission: string) => {
  switch (permission) {
    case 'view': return 'Visualizar'
    case 'create': return 'Criar'
    case 'edit': return 'Editar'
    case 'delete': return 'Excluir'
    default: return permission
  }
}

const getActivityIconClass = (tipo: string) => {
  switch (tipo) {
    case 'login': return 'activity-login'
    case 'logout': return 'activity-logout'
    case 'create': return 'activity-create'
    case 'edit': return 'activity-edit'
    case 'delete': return 'activity-delete'
    default: return 'activity-default'
  }
}

const getActivityIconPath = (tipo: string) => {
  switch (tipo) {
    case 'login': return 'M10,17V14H3V10H10V7L15,12L10,17M10,2H19A2,2 0 0,1 21,4V20A2,2 0 0,1 19,22H10A2,2 0 0,1 8,20V18H10V20H19V4H10V6H8V4A2,2 0 0,1 10,2Z'
    case 'logout': return 'M14,12L19,17V14H26V10H19V7L14,12M10,2H19A2,2 0 0,1 21,4V20A2,2 0 0,1 19,22H10A2,2 0 0,1 8,20V18H10V20H19V4H10V6H8V4A2,2 0 0,1 10,2Z'
    case 'create': return 'M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z'
    case 'edit': return 'M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z'
    case 'delete': return 'M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z'
    default: return 'M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z'
  }
}

// Funções principais
const loadUser = async () => {
  try {
    loading.value = true
    const userId = route.params.id as string
    
    // Simular carregamento de dados do usuário
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Dados mockados - em produção viria da API
    userData.value = {
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
      permissoes: ['dashboard:view', 'vendas:view', 'vendas:create', 'estoque:view', 'usuarios:view'],
      dataCriacao: '2023-01-15T09:00:00Z',
      ultimoAcesso: '2024-01-15T14:30:00Z',
      criadoPor: 'Admin Sistema',
      ultimaModificacao: '2024-01-10T16:45:00Z',
      modificadoPor: 'Maria Santos',
      tentativasLogin: 0,
      atividadeRecente: [
        {
          id: '1',
          tipo: 'login',
          descricao: 'Login realizado com sucesso',
          data: '2024-01-15T14:30:00Z'
        },
        {
          id: '2',
          tipo: 'edit',
          descricao: 'Dados pessoais atualizados',
          data: '2024-01-10T16:45:00Z'
        },
        {
          id: '3',
          tipo: 'create',
          descricao: 'Novo registro de venda criado',
          data: '2024-01-08T10:15:00Z'
        }
      ]
    }
    
  } catch (error) {
    console.error('Erro ao carregar usuário:', error)
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.push('/gerenciamento-usuarios')
}

const editUser = () => {
  router.push(`/editar-usuario/${userData.value.id}`)
}

onMounted(() => {
  loadUser()
})
</script>

<style scoped>
.view-user-view {
  min-height: 100vh;
  background-color: #f8fafc;
}

.page-header {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 1.5rem 2rem;
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.back-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.back-button:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.back-button svg {
  width: 20px;
  height: 20px;
  fill: currentColor;
}

.header-info h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
}

.header-info p {
  margin: 0.25rem 0 0 0;
  color: #64748b;
  font-size: 0.875rem;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid;
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.btn-primary:hover {
  background: #2563eb;
  border-color: #2563eb;
}

.btn-primary svg {
  width: 16px;
  height: 16px;
  fill: currentColor;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 1rem;
}

.loading-spinner svg {
  width: 40px;
  height: 40px;
  color: #3b82f6;
  fill: currentColor;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.info-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
}

.section-header {
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #f1f5f9;
}

.section-header h2 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-header svg {
  width: 20px;
  height: 20px;
  color: #3b82f6;
  fill: currentColor;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-item label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.info-item span {
  font-size: 0.875rem;
  color: #374151;
  font-weight: 500;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.status-active {
  background: #dcfce7;
  color: #166534;
}

.status-inactive {
  background: #fee2e2;
  color: #991b1b;
}

.status-pending {
  background: #fef3c7;
  color: #92400e;
}

.status-unknown {
  background: #f1f5f9;
  color: #64748b;
}

.permissions-container {
  min-height: 100px;
}

.no-permissions, .no-activity {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #64748b;
  text-align: center;
}

.no-permissions svg, .no-activity svg {
  width: 48px;
  height: 48px;
  color: #cbd5e1;
  fill: currentColor;
  margin-bottom: 0.5rem;
}

.permissions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.permission-module h3 {
  margin: 0 0 0.75rem 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.permission-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.permission-tag {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.permission-view {
  background: #dbeafe;
  color: #1e40af;
}

.permission-create {
  background: #dcfce7;
  color: #166534;
}

.permission-edit {
  background: #fef3c7;
  color: #92400e;
}

.permission-delete {
  background: #fee2e2;
  color: #991b1b;
}

.permission-default {
  background: #f1f5f9;
  color: #64748b;
}

.activity-list {
  min-height: 100px;
}

.activity-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 1px solid #f1f5f9;
  border-radius: 8px;
  transition: all 0.2s;
}

.activity-item:hover {
  background: #f8fafc;
  border-color: #e2e8f0;
}

.activity-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  flex-shrink: 0;
}

.activity-icon svg {
  width: 16px;
  height: 16px;
  fill: currentColor;
}

.activity-login {
  background: #dcfce7;
  color: #166534;
}

.activity-logout {
  background: #fee2e2;
  color: #991b1b;
}

.activity-create {
  background: #dbeafe;
  color: #1e40af;
}

.activity-edit {
  background: #fef3c7;
  color: #92400e;
}

.activity-delete {
  background: #fee2e2;
  color: #991b1b;
}

.activity-default {
  background: #f1f5f9;
  color: #64748b;
}

.activity-content {
  flex: 1;
  min-width: 0;
}

.activity-description {
  margin: 0 0 0.25rem 0;
  font-size: 0.875rem;
  color: #374151;
  font-weight: 500;
}

.activity-date {
  font-size: 0.75rem;
  color: #64748b;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .header-left {
    justify-content: flex-start;
  }

  .header-actions {
    justify-content: flex-end;
  }

  .content-container {
    padding: 1rem;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .permissions-grid {
    grid-template-columns: 1fr;
  }
}
</style>