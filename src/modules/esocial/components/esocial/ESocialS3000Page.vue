<template>
  <div class="s3000-page-container">
    <div class="page-header">
      <button type="button" @click="$emit('back')" class="btn btn-back">
        <svg class="btn-icon" viewBox="0 0 24 24">
          <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"/>
        </svg>
        Voltar
      </button>
      
      <h2 class="page-title">
        <svg class="title-icon" viewBox="0 0 24 24">
          <path d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z"/>
        </svg>
        Exclusões S-3000 - eSocial
      </h2>
    </div>

    <!-- Informações Gerais -->
    <div class="info-section">
      <div class="info-card">
        <div class="info-header">
          <div class="info-title">
            <svg class="info-icon" viewBox="0 0 24 24">
              <path d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
            </svg>
            <div>
              <h3>Evento S-3000 - Exclusão de Eventos</h3>
              <p class="info-subtitle">Registros de exclusão enviados ao eSocial</p>
            </div>
          </div>
        </div>
        
        <div class="info-content">
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-number">{{ totalExclusions }}</div>
              <div class="stat-label">Total de Exclusões</div>
            </div>
            <div class="stat-item">
              <div class="stat-number success">{{ successfulExclusions }}</div>
              <div class="stat-label">Exclusões Processadas</div>
            </div>
            <div class="stat-item">
              <div class="stat-number error">{{ failedExclusions }}</div>
              <div class="stat-label">Exclusões Rejeitadas</div>
            </div>
            <div class="stat-item">
              <div class="stat-number warning">{{ pendingExclusions }}</div>
              <div class="stat-label">Aguardando Retorno</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtros -->
    <div class="filters-section">
      <div class="filters-card">
        <div class="filters-header">
          <h3 class="filters-title">
            <svg class="filters-icon" viewBox="0 0 24 24">
              <path d="M14,12V19.88C14.04,20.18 13.94,20.5 13.71,20.71C13.32,21.1 12.69,21.1 12.3,20.71L10.29,18.7C10.06,18.47 9.96,18.16 10,17.87V12H9.97L4.21,4.62C3.87,4.19 3.95,3.56 4.38,3.22C4.57,3.08 4.78,3 5,3V3H19V3C19.22,3 19.43,3.08 19.62,3.22C20.05,3.56 20.13,4.19 19.79,4.62L14.03,12H14Z"/>
            </svg>
            Filtros de Pesquisa
          </h3>
          <button type="button" @click="clearFilters" class="btn btn-clear">
            <svg class="btn-icon" viewBox="0 0 24 24">
              <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
            </svg>
            Limpar
          </button>
        </div>
        
        <div class="filters-content">
          <div class="filters-grid">
            <div class="filter-group">
              <label class="filter-label">CPF do Trabalhador</label>
              <input 
                v-model="filters.cpf" 
                type="text" 
                class="filter-input"
                placeholder="000.000.000-00"
                @input="formatCPF"
              />
            </div>
            
            <div class="filter-group">
              <label class="filter-label">Matrícula</label>
              <input 
                v-model="filters.matricula" 
                type="text" 
                class="filter-input"
                placeholder="Digite a matrícula"
              />
            </div>
            
            <div class="filter-group">
              <label class="filter-label">Status da Exclusão</label>
              <select v-model="filters.status" class="filter-select">
                <option value="">Todos os Status</option>
                <option value="processado">Processado</option>
                <option value="rejeitado">Rejeitado</option>
                <option value="pendente">Pendente</option>
              </select>
            </div>
            
            <div class="filter-group">
              <label class="filter-label">Evento Original</label>
              <select v-model="filters.originalEvent" class="filter-select">
                <option value="">Todos os Eventos</option>
                <option value="S-2200">S-2200 - Admissão</option>
                <option value="S-2205">S-2205 - Alteração Dados Cadastrais</option>
                <option value="S-2206">S-2206 - Alteração Contrato</option>
                <option value="S-2230">S-2230 - Afastamento Temporário</option>
                <option value="S-2298">S-2298 - Reintegração</option>
                <option value="S-2299">S-2299 - Desligamento</option>
              </select>
            </div>
            
            <div class="filter-group">
              <label class="filter-label">Data de Exclusão - De</label>
              <input 
                v-model="filters.dateFrom" 
                type="date" 
                class="filter-input"
              />
            </div>
            
            <div class="filter-group">
              <label class="filter-label">Data de Exclusão - Até</label>
              <input 
                v-model="filters.dateTo" 
                type="date" 
                class="filter-input"
              />
            </div>
          </div>
          
          <div class="filters-actions">
            <button type="button" @click="applyFilters" class="btn btn-primary">
              <svg class="btn-icon" viewBox="0 0 24 24">
                <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/>
              </svg>
              Filtrar
            </button>
            
            <button type="button" @click="exportData" class="btn btn-secondary">
              <svg class="btn-icon" viewBox="0 0 24 24">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
              </svg>
              Exportar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Grid de Exclusões -->
    <div class="exclusions-section">
      <div class="exclusions-card">
        <div class="exclusions-header">
          <h3 class="exclusions-title">
            <svg class="exclusions-icon" viewBox="0 0 24 24">
              <path d="M3,3H21V5H3V3M3,7H21V9H3V7M3,11H21V13H3V11M3,15H21V17H3V15M3,19H21V21H3V19Z"/>
            </svg>
            Registros de Exclusão ({{ filteredExclusions.length }})
          </h3>
          
          <div class="exclusions-actions">
            <button 
              type="button" 
              @click="reprocessSelected" 
              :disabled="selectedItems.length === 0"
              class="btn btn-action"
            >
              <svg class="btn-icon" viewBox="0 0 24 24">
                <path d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z"/>
              </svg>
              Reprocessar Selecionados ({{ selectedItems.length }})
            </button>
          </div>
        </div>
        
        <div class="exclusions-content">
          <div class="table-container">
            <table class="exclusions-table">
              <thead>
                <tr>
                  <th class="checkbox-col">
                    <input 
                      type="checkbox" 
                      :checked="allSelected" 
                      @change="toggleSelectAll"
                      class="table-checkbox"
                    />
                  </th>
                  <th>Data/Hora</th>
                  <th>CPF</th>
                  <th>Nome</th>
                  <th>Matrícula</th>
                  <th>Evento Original</th>
                  <th>Motivo da Exclusão</th>
                  <th>Status</th>
                  <th>Protocolo</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="exclusion in paginatedExclusions" 
                  :key="exclusion.id"
                  class="table-row"
                  :class="{ 'selected': selectedItems.includes(exclusion.id) }"
                >
                  <td class="checkbox-col">
                    <input 
                      type="checkbox" 
                      :checked="selectedItems.includes(exclusion.id)"
                      @change="toggleSelect(exclusion.id)"
                      class="table-checkbox"
                    />
                  </td>
                  <td class="datetime-col">
                    <div class="datetime-info">
                      <div class="date">{{ formatDate(exclusion.exclusionDate) }}</div>
                      <div class="time">{{ formatTime(exclusion.exclusionDate) }}</div>
                    </div>
                  </td>
                  <td class="cpf-col">
                    <span class="cpf">{{ formatCPFDisplay(exclusion.cpf) }}</span>
                  </td>
                  <td class="name-col">
                    <div class="employee-info">
                      <div class="name">{{ exclusion.employeeName }}</div>
                      <div class="department">{{ exclusion.department }}</div>
                    </div>
                  </td>
                  <td class="matricula-col">
                    <span class="matricula">{{ exclusion.matricula }}</span>
                  </td>
                  <td class="event-col">
                    <div class="event-info">
                      <span class="event-code">{{ exclusion.originalEvent }}</span>
                      <span class="event-desc">{{ getEventDescription(exclusion.originalEvent) }}</span>
                    </div>
                  </td>
                  <td class="reason-col">
                    <div class="reason-info">
                      <span class="reason-title">{{ exclusion.exclusionReason }}</span>
                      <span class="reason-desc" v-if="exclusion.exclusionDescription">
                        {{ exclusion.exclusionDescription }}
                      </span>
                    </div>
                  </td>
                  <td class="status-col">
                    <span class="status-badge" :class="`status-${exclusion.status}`">
                      {{ getStatusLabel(exclusion.status) }}
                    </span>
                  </td>
                  <td class="protocol-col">
                    <span class="protocol" v-if="exclusion.protocol">
                      {{ exclusion.protocol }}
                    </span>
                    <span class="no-protocol" v-else>-</span>
                  </td>
                  <td class="actions-col">
                    <div class="row-actions">
                      <button 
                        type="button" 
                        @click="viewXML(exclusion)"
                        class="btn btn-row-action"
                        title="Ver XML"
                      >
                        <svg class="btn-icon" viewBox="0 0 24 24">
                          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                        </svg>
                      </button>
                      
                      <button 
                        type="button" 
                        @click="viewDetails(exclusion)"
                        class="btn btn-row-action"
                        title="Ver Detalhes"
                      >
                        <svg class="btn-icon" viewBox="0 0 24 24">
                          <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z"/>
                        </svg>
                      </button>
                      
                      <button 
                        v-if="exclusion.status === 'rejeitado'"
                        type="button" 
                        @click="reprocessItem(exclusion)"
                        class="btn btn-row-action warning"
                        title="Reprocessar"
                      >
                        <svg class="btn-icon" viewBox="0 0 24 24">
                          <path d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Paginação -->
          <div class="pagination-section" v-if="totalPages > 1">
            <div class="pagination-info">
              Mostrando {{ startItem }} a {{ endItem }} de {{ filteredExclusions.length }} registros
            </div>
            
            <div class="pagination-controls">
              <button 
                type="button" 
                @click="currentPage = 1"
                :disabled="currentPage === 1"
                class="btn btn-pagination"
              >
                <svg class="btn-icon" viewBox="0 0 24 24">
                  <path d="M18.41,16.59L13.82,12L18.41,7.41L17,6L11,12L17,18L18.41,16.59M6,6H8V18H6V6Z"/>
                </svg>
              </button>
              
              <button 
                type="button" 
                @click="currentPage--"
                :disabled="currentPage === 1"
                class="btn btn-pagination"
              >
                <svg class="btn-icon" viewBox="0 0 24 24">
                  <path d="M15.41,16.59L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.59Z"/>
                </svg>
              </button>
              
              <span class="pagination-current">
                {{ currentPage }} de {{ totalPages }}
              </span>
              
              <button 
                type="button" 
                @click="currentPage++"
                :disabled="currentPage === totalPages"
                class="btn btn-pagination"
              >
                <svg class="btn-icon" viewBox="0 0 24 24">
                  <path d="M8.59,16.59L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.59Z"/>
                </svg>
              </button>
              
              <button 
                type="button" 
                @click="currentPage = totalPages"
                :disabled="currentPage === totalPages"
                class="btn btn-pagination"
              >
                <svg class="btn-icon" viewBox="0 0 24 24">
                  <path d="M5.59,7.41L10.18,12L5.59,16.59L7,18L13,12L7,6L5.59,7.41M16,6H18V18H16V6Z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// Interfaces
interface ExclusionRecord {
  id: string
  cpf: string
  employeeName: string
  matricula: string
  department: string
  originalEvent: string
  exclusionDate: string
  exclusionReason: string
  exclusionDescription?: string
  status: 'processado' | 'rejeitado' | 'pendente'
  protocol?: string
  errorMessage?: string
}

interface Filters {
  cpf: string
  matricula: string
  status: string
  originalEvent: string
  dateFrom: string
  dateTo: string
}

// Emits
defineEmits<{
  back: []
}>()

// Estado reativo
const filters = ref<Filters>({
  cpf: '',
  matricula: '',
  status: '',
  originalEvent: '',
  dateFrom: '',
  dateTo: ''
})

const selectedItems = ref<string[]>([])
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Dados mockados
const exclusions = ref<ExclusionRecord[]>([
  {
    id: '1',
    cpf: '12345678901',
    employeeName: 'João Silva Santos',
    matricula: 'MAT001',
    department: 'Tecnologia da Informação',
    originalEvent: 'S-2200',
    exclusionDate: '2024-01-15T10:30:00',
    exclusionReason: 'Dados Incorretos',
    exclusionDescription: 'CPF informado não confere com documentação',
    status: 'processado',
    protocol: '1.2.202401.0000000000000001235'
  },
  {
    id: '2',
    cpf: '98765432109',
    employeeName: 'Maria Oliveira Costa',
    matricula: 'MAT002',
    department: 'Recursos Humanos',
    originalEvent: 'S-2206',
    exclusionDate: '2024-01-15T11:15:00',
    exclusionReason: 'Duplicidade',
    exclusionDescription: 'Registro duplicado no sistema',
    status: 'rejeitado',
    errorMessage: 'Evento não encontrado na base do eSocial'
  },
  {
    id: '3',
    cpf: '11122233344',
    employeeName: 'Pedro Almeida Ferreira',
    matricula: 'MAT003',
    department: 'Financeiro',
    originalEvent: 'S-2299',
    exclusionDate: '2024-01-15T14:20:00',
    exclusionReason: 'Cancelamento',
    exclusionDescription: 'Desligamento cancelado por decisão judicial',
    status: 'pendente'
  },
  {
    id: '4',
    cpf: '55566677788',
    employeeName: 'Ana Carolina Souza',
    matricula: 'MAT004',
    department: 'Vendas',
    originalEvent: 'S-2230',
    exclusionDate: '2024-01-15T15:45:00',
    exclusionReason: 'Erro de Sistema',
    exclusionDescription: 'Afastamento registrado incorretamente',
    status: 'processado',
    protocol: '1.2.202401.0000000000000001236'
  },
  {
    id: '5',
    cpf: '99988877766',
    employeeName: 'Carlos Eduardo Lima',
    matricula: 'MAT005',
    department: 'Produção',
    originalEvent: 'S-2205',
    exclusionDate: '2024-01-15T16:30:00',
    exclusionReason: 'Retificação',
    exclusionDescription: 'Dados cadastrais alterados incorretamente',
    status: 'rejeitado',
    errorMessage: 'Período de exclusão expirado'
  }
])

// Computed properties
const totalExclusions = computed(() => exclusions.value.length)
const successfulExclusions = computed(() => 
  exclusions.value.filter(e => e.status === 'processado').length
)
const failedExclusions = computed(() => 
  exclusions.value.filter(e => e.status === 'rejeitado').length
)
const pendingExclusions = computed(() => 
  exclusions.value.filter(e => e.status === 'pendente').length
)

const filteredExclusions = computed(() => {
  let filtered = exclusions.value
  
  if (filters.value.cpf) {
    filtered = filtered.filter(e => 
      e.cpf.includes(filters.value.cpf.replace(/\D/g, ''))
    )
  }
  
  if (filters.value.matricula) {
    filtered = filtered.filter(e => 
      e.matricula.toLowerCase().includes(filters.value.matricula.toLowerCase())
    )
  }
  
  if (filters.value.status) {
    filtered = filtered.filter(e => e.status === filters.value.status)
  }
  
  if (filters.value.originalEvent) {
    filtered = filtered.filter(e => e.originalEvent === filters.value.originalEvent)
  }
  
  if (filters.value.dateFrom) {
    filtered = filtered.filter(e => 
      new Date(e.exclusionDate) >= new Date(filters.value.dateFrom)
    )
  }
  
  if (filters.value.dateTo) {
    filtered = filtered.filter(e => 
      new Date(e.exclusionDate) <= new Date(filters.value.dateTo + 'T23:59:59')
    )
  }
  
  return filtered
})

const totalPages = computed(() => 
  Math.ceil(filteredExclusions.value.length / itemsPerPage.value)
)

const paginatedExclusions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredExclusions.value.slice(start, end)
})

const startItem = computed(() => 
  (currentPage.value - 1) * itemsPerPage.value + 1
)

const endItem = computed(() => 
  Math.min(currentPage.value * itemsPerPage.value, filteredExclusions.value.length)
)

const allSelected = computed(() => {
  return paginatedExclusions.value.length > 0 && 
    paginatedExclusions.value.every(e => selectedItems.value.includes(e.id))
})

// Métodos
const formatCPF = () => {
  let value = filters.value.cpf.replace(/\D/g, '')
  value = value.replace(/(\d{3})(\d)/, '$1.$2')
  value = value.replace(/(\d{3})(\d)/, '$1.$2')
  value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  filters.value.cpf = value
}

const formatCPFDisplay = (cpf: string) => {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

const formatDate = (dateTime: string) => {
  return new Date(dateTime).toLocaleDateString('pt-BR')
}

const formatTime = (dateTime: string) => {
  return new Date(dateTime).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getEventDescription = (eventCode: string) => {
  const descriptions = {
    'S-2200': 'Admissão',
    'S-2205': 'Alteração Dados Cadastrais',
    'S-2206': 'Alteração Contrato',
    'S-2230': 'Afastamento Temporário',
    'S-2298': 'Reintegração',
    'S-2299': 'Desligamento'
  }
  return descriptions[eventCode as keyof typeof descriptions] || eventCode
}

const getStatusLabel = (status: string) => {
  const labels = {
    processado: 'Processado',
    rejeitado: 'Rejeitado',
    pendente: 'Pendente'
  }
  return labels[status as keyof typeof labels] || status
}

const clearFilters = () => {
  filters.value = {
    cpf: '',
    matricula: '',
    status: '',
    originalEvent: '',
    dateFrom: '',
    dateTo: ''
  }
  currentPage.value = 1
}

const applyFilters = () => {
  currentPage.value = 1
  console.log('Aplicando filtros:', filters.value)
}

const exportData = () => {
  console.log('Exportando dados de exclusões')
  alert('Exportando dados das exclusões S-3000...')
}

const toggleSelect = (id: string) => {
  const index = selectedItems.value.indexOf(id)
  if (index > -1) {
    selectedItems.value.splice(index, 1)
  } else {
    selectedItems.value.push(id)
  }
}

const toggleSelectAll = () => {
  if (allSelected.value) {
    selectedItems.value = selectedItems.value.filter(id => 
      !paginatedExclusions.value.some(e => e.id === id)
    )
  } else {
    const pageIds = paginatedExclusions.value.map(e => e.id)
    selectedItems.value = [...new Set([...selectedItems.value, ...pageIds])]
  }
}

const reprocessSelected = () => {
  console.log('Reprocessando itens selecionados:', selectedItems.value)
  alert(`Reprocessando ${selectedItems.value.length} exclusões selecionadas...`)
}

const viewXML = (exclusion: ExclusionRecord) => {
  console.log('Visualizando XML da exclusão:', exclusion.id)
  alert(`Abrindo XML da exclusão para ${exclusion.employeeName}...`)
}

const viewDetails = (exclusion: ExclusionRecord) => {
  console.log('Visualizando detalhes da exclusão:', exclusion.id)
  alert(`Abrindo detalhes da exclusão para ${exclusion.employeeName}...`)
}

const reprocessItem = (exclusion: ExclusionRecord) => {
  console.log('Reprocessando exclusão:', exclusion.id)
  alert(`Reprocessando exclusão para ${exclusion.employeeName}...`)
}

// Lifecycle
onMounted(() => {
  // Carregar dados das exclusões se necessário
})
</script>

<style scoped>
.s3000-page-container {
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
  fill: var(--error-color);
}

/* Informações Gerais */
.info-section {
  margin-bottom: 2rem;
}

.info-card {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  overflow: hidden;
}

.info-header {
  padding: 1.5rem;
  background: var(--error-color);
}

.info-title {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: white;
}

.info-icon {
  width: 32px;
  height: 32px;
  fill: white;
}

.info-title h3 {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
}

.info-subtitle {
  font-size: 0.9rem;
  opacity: 0.9;
  margin: 0.25rem 0 0 0;
}

.info-content {
  padding: 1.5rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.stat-item {
  text-align: center;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.stat-number.success {
  color: var(--success-color);
}

.stat-number.error {
  color: var(--error-color);
}

.stat-number.warning {
  color: var(--warning-color);
}

.stat-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-weight: 500;
}

/* Filtros */
.filters-section {
  margin-bottom: 2rem;
}

.filters-card {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.filters-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.filters-icon {
  width: 18px;
  height: 18px;
  fill: var(--accent-primary);
}

.btn-clear {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--secondary-color);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-clear:hover {
  background: var(--secondary-color-hover);
}

.filters-content {
  padding: 1.5rem;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-label {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.filter-input,
.filter-select {
  padding: 0.75rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-primary);
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.filter-input:focus,
.filter-select:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.filters-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: var(--primary-color-hover);
}

.btn-secondary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--secondary-color);
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: var(--secondary-color-hover);
}

/* Grid de Exclusões */
.exclusions-section {
  margin-bottom: 2rem;
}

.exclusions-card {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.exclusions-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.exclusions-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.exclusions-icon {
  width: 18px;
  height: 18px;
  fill: var(--accent-primary);
}

.exclusions-actions {
  display: flex;
  gap: 1rem;
}

.btn-action {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: var(--warning-color);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-action:hover:not(:disabled) {
  background: var(--warning-color-hover);
}

.btn-action:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.exclusions-content {
  padding: 1.5rem;
}

.table-container {
  overflow-x: auto;
  margin-bottom: 1.5rem;
}

.exclusions-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--bg-secondary);
  border-radius: 8px;
  overflow: hidden;
}

.exclusions-table th {
  background: var(--accent-primary);
  color: white;
  padding: 1rem 0.75rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.85rem;
  white-space: nowrap;
}

.exclusions-table td {
  padding: 1rem 0.75rem;
  border-bottom: 1px solid var(--border-color);
  font-size: 0.85rem;
  vertical-align: top;
}

.table-row:hover {
  background: rgba(255, 255, 255, 0.02);
}

.table-row.selected {
  background: rgba(59, 130, 246, 0.1);
}

.checkbox-col {
  width: 40px;
  text-align: center;
}

.table-checkbox {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.datetime-col {
  min-width: 120px;
}

.datetime-info .date {
  font-weight: 500;
  color: var(--text-primary);
}

.datetime-info .time {
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
}

.cpf-col {
  min-width: 120px;
}

.cpf {
  font-family: 'Courier New', monospace;
  font-weight: 500;
  color: var(--text-primary);
}

.name-col {
  min-width: 180px;
}

.employee-info .name {
  font-weight: 500;
  color: var(--text-primary);
}

.employee-info .department {
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
}

.matricula-col {
  min-width: 100px;
}

.matricula {
  font-family: 'Courier New', monospace;
  font-weight: 500;
  color: var(--accent-primary);
}

.event-col {
  min-width: 140px;
}

.event-info .event-code {
  font-weight: 600;
  color: var(--text-primary);
  display: block;
}

.event-info .event-desc {
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
}

.reason-col {
  min-width: 160px;
}

.reason-info .reason-title {
  font-weight: 500;
  color: var(--text-primary);
  display: block;
}

.reason-info .reason-desc {
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
  line-height: 1.3;
}

.status-col {
  min-width: 100px;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  white-space: nowrap;
}

.status-processado {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
}

.status-rejeitado {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.status-pendente {
  background: rgba(251, 191, 36, 0.2);
  color: #fbbf24;
}

.protocol-col {
  min-width: 140px;
}

.protocol {
  font-family: 'Courier New', monospace;
  font-size: 0.8rem;
  color: var(--accent-primary);
  word-break: break-all;
}

.no-protocol {
  color: var(--text-secondary);
  font-style: italic;
}

.actions-col {
  min-width: 120px;
}

.row-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-row-action {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: var(--secondary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-row-action:hover {
  background: var(--secondary-color-hover);
}

.btn-row-action.warning {
  background: var(--warning-color);
}

.btn-row-action.warning:hover {
  background: var(--warning-color-hover);
}

.btn-icon {
  width: 14px;
  height: 14px;
  fill: currentColor;
}

/* Paginação */
.pagination-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.pagination-info {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: var(--secondary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-pagination:hover:not(:disabled) {
  background: var(--secondary-color-hover);
}

.btn-pagination:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-current {
  padding: 0 1rem;
  font-size: 0.85rem;
  color: var(--text-primary);
  font-weight: 500;
}

/* Responsividade */
@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .filters-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .s3000-page-container {
    padding: 1rem;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .filters-grid {
    grid-template-columns: 1fr;
  }
  
  .filters-actions {
    flex-direction: column;
  }
  
  .exclusions-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .exclusions-actions {
    width: 100%;
  }
  
  .btn-action {
    width: 100%;
    justify-content: center;
  }
  
  .table-container {
    overflow-x: scroll;
  }
  
  .pagination-section {
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }
}

@media (max-width: 480px) {
  .exclusions-table {
    font-size: 0.8rem;
  }
  
  .exclusions-table th,
  .exclusions-table td {
    padding: 0.5rem 0.25rem;
  }
  
  .row-actions {
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .btn-row-action {
    width: 28px;
    height: 28px;
  }
}
</style>