<template>
  <div class="processing-page-container">
    <div class="page-header">
      <button type="button" @click="$emit('back')" class="btn btn-back">
        <svg class="btn-icon" viewBox="0 0 24 24">
          <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"/>
        </svg>
        Voltar
      </button>
      
      <h2 class="page-title">
        <svg class="title-icon" viewBox="0 0 24 24">
          <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z"/>
        </svg>
        Processamento e Seleção de Dados
      </h2>
    </div>

    <!-- Estatísticas -->
    <div class="stats-section">
      <div class="stat-card">
        <div class="stat-icon success">
          <svg viewBox="0 0 24 24">
            <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.ready }}</div>
          <div class="stat-label">Prontos para Processar</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon warning">
          <svg viewBox="0 0 24 24">
            <path d="M12,2L13.09,8.26L22,9L17.22,13.78L18.18,22L12,18.27L5.82,22L6.78,13.78L2,9L10.91,8.26L12,2Z"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.selected }}</div>
          <div class="stat-label">Selecionados</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon info">
          <svg viewBox="0 0 24 24">
            <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.total }}</div>
          <div class="stat-label">Total de Registros</div>
        </div>
      </div>
    </div>

    <!-- Filtros Avançados -->
    <div class="advanced-filters">
      <h3 class="section-title">
        <svg class="section-icon" viewBox="0 0 24 24">
          <path d="M14,12V19.88C14.04,20.18 13.94,20.5 13.71,20.71C13.32,21.1 12.69,21.1 12.3,20.71L10.29,18.7C10.06,18.47 9.96,18.16 10,17.87V12H9.97L4.21,4.62C3.87,4.19 3.95,3.56 4.38,3.22C4.57,3.08 4.78,3 5,3V3H19V3C19.22,3 19.43,3.08 19.62,3.22C20.05,3.56 20.13,4.19 19.79,4.62L14.03,12H14Z"/>
        </svg>
        Filtros Avançados
      </h3>
      
      <div class="filters-grid">
        <div class="form-group">
          <label class="form-label">Período de Admissão</label>
          <div class="date-range">
            <input
              v-model="advancedFilters.admissaoInicio"
              type="date"
              class="form-input"
              placeholder="Data início"
            />
            <span class="date-separator">até</span>
            <input
              v-model="advancedFilters.admissaoFim"
              type="date"
              class="form-input"
              placeholder="Data fim"
            />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Tipo de Contrato</label>
          <select v-model="advancedFilters.tipoContrato" class="form-select">
            <option value="">Todos os Tipos</option>
            <option value="CLT">CLT</option>
            <option value="ESTATUTARIO">Estatutário</option>
            <option value="TEMPORARIO">Temporário</option>
            <option value="ESTAGIARIO">Estagiário</option>
            <option value="TERCEIRIZADO">Terceirizado</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Departamento</label>
          <select v-model="advancedFilters.departamento" class="form-select">
            <option value="">Todos os Departamentos</option>
            <option value="RH">Recursos Humanos</option>
            <option value="TI">Tecnologia da Informação</option>
            <option value="FINANCEIRO">Financeiro</option>
            <option value="VENDAS">Vendas</option>
            <option value="PRODUCAO">Produção</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Situação Cadastral</label>
          <select v-model="advancedFilters.situacao" class="form-select">
            <option value="">Todas as Situações</option>
            <option value="ATIVO">Ativo</option>
            <option value="INATIVO">Inativo</option>
            <option value="AFASTADO">Afastado</option>
            <option value="LICENCA">Licença</option>
          </select>
        </div>
      </div>

      <div class="filters-actions">
        <button type="button" @click="applyAdvancedFilters" class="btn btn-primary">
          <svg class="btn-icon" viewBox="0 0 24 24">
            <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/>
          </svg>
          Aplicar Filtros
        </button>
        <button type="button" @click="clearAdvancedFilters" class="btn btn-secondary">
          <svg class="btn-icon" viewBox="0 0 24 24">
            <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
          </svg>
          Limpar
        </button>
      </div>
    </div>

    <!-- Lista de Dados para Processamento -->
    <div class="data-selection-section">
      <div class="section-header">
        <h3 class="section-title">
          <svg class="section-icon" viewBox="0 0 24 24">
            <path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,5V19H5V5H19Z"/>
          </svg>
          Dados Disponíveis para Processamento ({{ filteredProcessingData.length }})
        </h3>
        
        <div class="selection-actions">
          <button 
            type="button" 
            @click="selectAllVisible"
            class="btn btn-outline"
          >
            Selecionar Todos Visíveis
          </button>
          
          <button 
            type="button" 
            @click="clearSelection"
            class="btn btn-outline"
          >
            Limpar Seleção
          </button>
        </div>
      </div>

      <div class="data-cards-container">
        <div 
          v-for="item in paginatedProcessingData" 
          :key="item.id"
          class="data-card"
          :class="{ 'selected': selectedForProcessing.includes(item.id) }"
          @click="toggleSelection(item.id)"
        >
          <div class="card-header">
            <div class="card-checkbox">
              <input 
                type="checkbox" 
                :checked="selectedForProcessing.includes(item.id)"
                @click.stop
                @change="toggleSelection(item.id)"
              />
            </div>
            
            <div class="card-status">
              <span class="status-badge" :class="`status-${item.status}`">
                {{ getStatusLabel(item.status) }}
              </span>
            </div>
          </div>

          <div class="card-content">
            <div class="card-main-info">
              <h4 class="employee-name">{{ item.nomeCompleto }}</h4>
              <p class="employee-details">
                <span class="detail-item">
                  <strong>CPF:</strong> {{ formatCPF(item.cpf) }}
                </span>
                <span class="detail-item">
                  <strong>Matrícula:</strong> {{ item.matricula }}
                </span>
              </p>
            </div>

            <div class="card-additional-info">
              <div class="info-row">
                <span class="info-label">Admissão:</span>
                <span class="info-value">{{ formatDate(item.dataAdmissao) }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Cargo:</span>
                <span class="info-value">{{ item.cargo }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Departamento:</span>
                <span class="info-value">{{ item.departamento }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Tipo Contrato:</span>
                <span class="info-value">{{ item.tipoContrato }}</span>
              </div>
            </div>
          </div>

          <div class="card-actions">
            <button 
              type="button" 
              @click.stop="viewEmployeeDetails(item)"
              class="btn-card-action btn-view"
              title="Ver Detalhes"
            >
              <svg viewBox="0 0 24 24">
                <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z"/>
              </svg>
            </button>
            
            <button 
              type="button" 
              @click.stop="editEmployeeData(item)"
              class="btn-card-action btn-edit"
              title="Editar Dados"
            >
              <svg viewBox="0 0 24 24">
                <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Paginação -->
      <div class="pagination-container" v-if="totalProcessingPages > 1">
        <div class="pagination-info">
          Mostrando {{ startProcessingIndex + 1 }} a {{ endProcessingIndex }} de {{ filteredProcessingData.length }} registros
        </div>
        
        <div class="pagination-controls">
          <button 
            type="button" 
            @click="currentProcessingPage = 1"
            :disabled="currentProcessingPage === 1"
            class="btn btn-pagination"
          >
            ««
          </button>
          
          <button 
            type="button" 
            @click="currentProcessingPage--"
            :disabled="currentProcessingPage === 1"
            class="btn btn-pagination"
          >
            ‹
          </button>
          
          <span class="pagination-current">
            {{ currentProcessingPage }} de {{ totalProcessingPages }}
          </span>
          
          <button 
            type="button" 
            @click="currentProcessingPage++"
            :disabled="currentProcessingPage === totalProcessingPages"
            class="btn btn-pagination"
          >
            ›
          </button>
          
          <button 
            type="button" 
            @click="currentProcessingPage = totalProcessingPages"
            :disabled="currentProcessingPage === totalProcessingPages"
            class="btn btn-pagination"
          >
            »»
          </button>
        </div>
      </div>
    </div>

    <!-- Ações de Processamento -->
    <div class="processing-actions">
      <div class="actions-summary">
        <h4>{{ selectedForProcessing.length }} registros selecionados para processamento</h4>
        <p v-if="selectedForProcessing.length > 0">
          Os dados selecionados serão validados e enviados para o eSocial.
        </p>
      </div>
      
      <div class="actions-buttons">
        <button 
          type="button" 
          @click="validateSelectedData"
          class="btn btn-secondary btn-large"
          :disabled="selectedForProcessing.length === 0"
        >
          <svg class="btn-icon" viewBox="0 0 24 24">
            <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z"/>
          </svg>
          Validar Dados
        </button>
        
        <button 
          type="button" 
          @click="processSelectedData"
          class="btn btn-primary btn-large"
          :disabled="selectedForProcessing.length === 0 || isProcessing"
        >
          <svg v-if="!isProcessing" class="btn-icon" viewBox="0 0 24 24">
            <path d="M8,5.14V19.14L19,12.14L8,5.14Z"/>
          </svg>
          <div v-else class="loading-spinner"></div>
          {{ isProcessing ? 'Processando...' : 'Processar e Enviar' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watchEffect } from 'vue'

// Interfaces
interface ProcessingDataItem {
  id: string
  nomeCompleto: string
  cpf: string
  matricula: string
  dataAdmissao: string
  cargo: string
  departamento: string
  tipoContrato: string
  status: 'ready' | 'processing' | 'error' | 'validated'
  situacao: string
}

interface AdvancedFilters {
  admissaoInicio: string
  admissaoFim: string
  tipoContrato: string
  departamento: string
  situacao: string
}

// Emits
defineEmits<{
  back: []
}>()

// Estado reativo
const advancedFilters = ref<AdvancedFilters>({
  admissaoInicio: '',
  admissaoFim: '',
  tipoContrato: '',
  departamento: '',
  situacao: ''
})

const selectedForProcessing = ref<string[]>([])
const currentProcessingPage = ref(1)
const itemsPerProcessingPage = ref(12)
const isProcessing = ref(false)

// Dados mockados
const processingData = ref<ProcessingDataItem[]>([
  {
    id: '1',
    nomeCompleto: 'João Silva Santos',
    cpf: '12345678901',
    matricula: '001234',
    dataAdmissao: '2024-01-15',
    cargo: 'Desenvolvedor Frontend',
    departamento: 'TI',
    tipoContrato: 'CLT',
    status: 'ready',
    situacao: 'ATIVO'
  },
  {
    id: '2',
    nomeCompleto: 'Maria Oliveira Costa',
    cpf: '12345678902',
    matricula: '001235',
    dataAdmissao: '2024-01-16',
    cargo: 'Analista de RH',
    departamento: 'RH',
    tipoContrato: 'CLT',
    status: 'ready',
    situacao: 'ATIVO'
  },
  {
    id: '3',
    nomeCompleto: 'Pedro Almeida Ferreira',
    cpf: '12345678903',
    matricula: '001236',
    dataAdmissao: '2024-01-17',
    cargo: 'Contador',
    departamento: 'FINANCEIRO',
    tipoContrato: 'CLT',
    status: 'validated',
    situacao: 'ATIVO'
  },
  {
    id: '4',
    nomeCompleto: 'Ana Carolina Souza',
    cpf: '12345678904',
    matricula: '001237',
    dataAdmissao: '2024-01-18',
    cargo: 'Vendedora',
    departamento: 'VENDAS',
    tipoContrato: 'CLT',
    status: 'ready',
    situacao: 'ATIVO'
  },
  {
    id: '5',
    nomeCompleto: 'Carlos Eduardo Lima',
    cpf: '12345678905',
    matricula: '001238',
    dataAdmissao: '2024-01-19',
    cargo: 'Operador de Produção',
    departamento: 'PRODUCAO',
    tipoContrato: 'CLT',
    status: 'error',
    situacao: 'ATIVO'
  },
  {
    id: '6',
    nomeCompleto: 'Fernanda Rodrigues Silva',
    cpf: '12345678906',
    matricula: '001239',
    dataAdmissao: '2024-01-20',
    cargo: 'Estagiária de TI',
    departamento: 'TI',
    tipoContrato: 'ESTAGIARIO',
    status: 'ready',
    situacao: 'ATIVO'
  }
])

// Computed properties
const stats = computed(() => {
  const ready = processingData.value.filter(item => item.status === 'ready').length
  const selected = selectedForProcessing.value.length
  const total = processingData.value.length
  
  return { ready, selected, total }
})

const filteredProcessingData = computed(() => {
  let data = processingData.value
  
  if (advancedFilters.value.admissaoInicio) {
    data = data.filter(item => item.dataAdmissao >= advancedFilters.value.admissaoInicio)
  }
  
  if (advancedFilters.value.admissaoFim) {
    data = data.filter(item => item.dataAdmissao <= advancedFilters.value.admissaoFim)
  }
  
  if (advancedFilters.value.tipoContrato) {
    data = data.filter(item => item.tipoContrato === advancedFilters.value.tipoContrato)
  }
  
  if (advancedFilters.value.departamento) {
    data = data.filter(item => item.departamento === advancedFilters.value.departamento)
  }
  
  if (advancedFilters.value.situacao) {
    data = data.filter(item => item.situacao === advancedFilters.value.situacao)
  }
  
  return data
})

const totalProcessingPages = computed(() => 
  Math.ceil(filteredProcessingData.value.length / itemsPerProcessingPage.value)
)

const startProcessingIndex = computed(() => 
  (currentProcessingPage.value - 1) * itemsPerProcessingPage.value
)

const endProcessingIndex = computed(() => 
  Math.min(startProcessingIndex.value + itemsPerProcessingPage.value, filteredProcessingData.value.length)
)

const paginatedProcessingData = computed(() => {
  return filteredProcessingData.value.slice(startProcessingIndex.value, endProcessingIndex.value)
})

// Métodos
const formatCPF = (cpf: string) => {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('pt-BR')
}

const getStatusLabel = (status: string) => {
  const labels = {
    ready: 'Pronto',
    processing: 'Processando',
    error: 'Erro',
    validated: 'Validado'
  }
  return labels[status as keyof typeof labels] || status
}

const toggleSelection = (id: string) => {
  const index = selectedForProcessing.value.indexOf(id)
  if (index > -1) {
    selectedForProcessing.value.splice(index, 1)
  } else {
    selectedForProcessing.value.push(id)
  }
}

const selectAllVisible = () => {
  paginatedProcessingData.value.forEach(item => {
    if (!selectedForProcessing.value.includes(item.id)) {
      selectedForProcessing.value.push(item.id)
    }
  })
}

const clearSelection = () => {
  selectedForProcessing.value = []
}

const applyAdvancedFilters = () => {
  currentProcessingPage.value = 1
  // Os filtros são aplicados automaticamente via computed property
}

const clearAdvancedFilters = () => {
  advancedFilters.value = {
    admissaoInicio: '',
    admissaoFim: '',
    tipoContrato: '',
    departamento: '',
    situacao: ''
  }
  currentProcessingPage.value = 1
}

const viewEmployeeDetails = (item: ProcessingDataItem) => {
  console.log('Visualizando detalhes do funcionário:', item.id)
  alert(`Detalhes de ${item.nomeCompleto}\nCPF: ${formatCPF(item.cpf)}\nMatrícula: ${item.matricula}`)
}

const editEmployeeData = (item: ProcessingDataItem) => {
  console.log('Editando dados do funcionário:', item.id)
  alert(`Editando dados de ${item.nomeCompleto}`)
}

const validateSelectedData = () => {
  if (selectedForProcessing.value.length === 0) {
    alert('Selecione pelo menos um registro para validar.')
    return
  }
  
  console.log('Validando dados selecionados:', selectedForProcessing.value)
  alert(`Validando ${selectedForProcessing.value.length} registros...`)
}

const processSelectedData = async () => {
  if (selectedForProcessing.value.length === 0) {
    alert('Selecione pelo menos um registro para processar.')
    return
  }
  
  isProcessing.value = true
  
  try {
    // Simular processamento
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    console.log('Processando dados selecionados:', selectedForProcessing.value)
    alert(`${selectedForProcessing.value.length} registros processados com sucesso!`)
    
    // Limpar seleção após processamento
    selectedForProcessing.value = []
  } catch (error) {
    console.error('Erro no processamento:', error)
    alert('Erro durante o processamento. Tente novamente.')
  } finally {
    isProcessing.value = false
  }
}

// Watcher para resetar paginação quando filtros são alterados
watchEffect(() => {
  // Observa mudanças nos filtros avançados
  const filterValues = [
    advancedFilters.value.admissaoInicio,
    advancedFilters.value.admissaoFim,
    advancedFilters.value.tipoContrato,
    advancedFilters.value.departamento,
    advancedFilters.value.situacao
  ]
  
  // Reseta para primeira página quando filtros mudam (exceto na primeira execução)
  if (currentProcessingPage.value > 1) {
    currentProcessingPage.value = 1
  }
})

// Lifecycle
onMounted(() => {
  // Carregar dados iniciais se necessário
})
</script>

<style scoped>
.processing-page-container {
  padding: 1.5rem;
  max-width: 1600px;
  margin: 0 auto;
}

/* Header */
.page-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--border-color);
}

.btn-back {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: var(--secondary-color);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-back:hover {
  background: var(--secondary-color-hover);
}

.page-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.title-icon {
  width: 28px;
  height: 28px;
  fill: var(--accent-primary);
}

/* Estatísticas */
.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon svg {
  width: 24px;
  height: 24px;
  fill: white;
}

.stat-icon.success {
  background: var(--success-color);
}

.stat-icon.warning {
  background: var(--warning-color);
}

.stat-icon.info {
  background: var(--info-color);
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
}

/* Filtros Avançados */
.advanced-filters {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid var(--border-color);
  margin-bottom: 2rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 1.5rem 0;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid var(--accent-primary);
}

.section-icon {
  width: 20px;
  height: 20px;
  fill: var(--accent-primary);
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.form-input,
.form-select {
  padding: 0.75rem;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  background: var(--input-bg);
  color: var(--text-primary);
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px var(--accent-glow);
}

.date-range {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.date-separator {
  font-size: 0.9rem;
  color: var(--text-secondary);
  white-space: nowrap;
}

.filters-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

/* Seção de Dados */
.data-selection-section {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid var(--border-color);
  margin-bottom: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.selection-actions {
  display: flex;
  gap: 1rem;
}

/* Cards de Dados */
.data-cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.data-card {
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.data-card:hover {
  border-color: var(--accent-primary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.data-card.selected {
  border-color: var(--accent-primary);
  background: rgba(var(--accent-primary-rgb), 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.card-checkbox input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
}

.status-ready {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
}

.status-processing {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
}

.status-error {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.status-validated {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
}

.card-content {
  margin-bottom: 1rem;
}

.employee-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
}

.employee-details {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 0 0 1rem 0;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.detail-item {
  display: flex;
  gap: 0.25rem;
}

.card-additional-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
}

.info-label {
  color: var(--text-secondary);
  font-weight: 500;
}

.info-value {
  color: var(--text-primary);
  font-weight: 600;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.btn-card-action {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-card-action svg {
  width: 16px;
  height: 16px;
  fill: currentColor;
}

.btn-view {
  background: var(--info-color);
  color: white;
}

.btn-view:hover {
  background: var(--info-color-hover);
}

.btn-edit {
  background: var(--warning-color);
  color: white;
}

.btn-edit:hover {
  background: var(--warning-color-hover);
}

/* Paginação */
.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.pagination-info {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pagination-current {
  padding: 0.5rem 1rem;
  font-weight: 500;
  color: var(--text-primary);
}

/* Ações de Processamento */
.processing-actions {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid var(--border-color);
  text-align: center;
}

.actions-summary h4 {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
}

.actions-summary p {
  color: var(--text-secondary);
  margin: 0 0 2rem 0;
}

.actions-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* Botões */
.btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--primary-color-hover);
}

.btn-secondary {
  background: var(--secondary-color);
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: var(--secondary-color-hover);
}

.btn-outline {
  background: transparent;
  color: var(--accent-primary);
  border: 2px solid var(--accent-primary);
}

.btn-outline:hover {
  background: var(--accent-primary);
  color: white;
}

.btn-pagination {
  padding: 0.5rem 0.75rem;
  font-size: 0.8rem;
}

.btn-large {
  padding: 1rem 2rem;
  font-size: 1rem;
}

.btn-icon {
  width: 16px;
  height: 16px;
  fill: currentColor;
}

.loading-spinner {
  width: 16px;
  height: 16px;
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

/* Responsividade */
@media (max-width: 1200px) {
  .data-cards-container {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
}

@media (max-width: 768px) {
  .processing-page-container {
    padding: 1rem;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .stats-section {
    grid-template-columns: 1fr;
  }
  
  .filters-grid {
    grid-template-columns: 1fr;
  }
  
  .date-range {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filters-actions {
    justify-content: stretch;
  }
  
  .filters-actions .btn {
    flex: 1;
    justify-content: center;
  }
  
  .section-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .selection-actions {
    justify-content: stretch;
  }
  
  .selection-actions .btn {
    flex: 1;
    justify-content: center;
  }
  
  .data-cards-container {
    grid-template-columns: 1fr;
  }
  
  .card-additional-info {
    grid-template-columns: 1fr;
  }
  
  .pagination-container {
    flex-direction: column;
    gap: 1rem;
  }
  
  .actions-buttons {
    flex-direction: column;
  }
  
  .actions-buttons .btn {
    justify-content: center;
  }
}
</style>