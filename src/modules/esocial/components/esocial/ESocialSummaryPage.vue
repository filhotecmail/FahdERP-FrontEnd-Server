<template>
  <div class="summary-page-container">
    <div class="page-header">
      <button type="button" @click="$emit('back')" class="btn btn-back">
        <svg class="btn-icon" viewBox="0 0 24 24">
          <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"/>
        </svg>
        Voltar
      </button>
      
      <h2 class="page-title">
        <svg class="title-icon" viewBox="0 0 24 24">
          <path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,19H5V5H19V19Z"/>
        </svg>
        Sumário de Processamento - eSocial
      </h2>
    </div>

    <!-- Informações do Lote -->
    <div class="batch-info-section">
      <div class="batch-card">
        <div class="batch-header">
          <div class="batch-title">
            <svg class="batch-icon" viewBox="0 0 24 24">
              <path d="M19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M19,19H5V5H19V19Z"/>
            </svg>
            <div>
              <h3>Lote de Processamento #{{ batchInfo.id }}</h3>
              <p class="batch-subtitle">{{ batchInfo.description }}</p>
            </div>
          </div>
          
          <div class="batch-status">
            <span class="status-badge" :class="`status-${batchInfo.status}`">
              {{ getBatchStatusLabel(batchInfo.status) }}
            </span>
          </div>
        </div>
        
        <div class="batch-details">
          <div class="detail-grid">
            <div class="detail-item">
              <span class="detail-label">Data/Hora de Início:</span>
              <span class="detail-value">{{ formatDateTime(batchInfo.startTime) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Data/Hora de Conclusão:</span>
              <span class="detail-value">{{ formatDateTime(batchInfo.endTime) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Tempo de Processamento:</span>
              <span class="detail-value">{{ formatDuration(batchInfo.duration) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Protocolo eSocial:</span>
              <span class="detail-value protocol">{{ batchInfo.protocol || 'N/A' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Cards de Resultados Principais -->
    <div class="main-results-section">
      <div class="results-grid">
        <!-- Card de Sucesso -->
        <div class="result-card success-card">
          <div class="card-header">
            <div class="card-icon success">
              <svg viewBox="0 0 24 24">
                <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z"/>
              </svg>
            </div>
            <div class="card-title">
              <h3>Enviados com Sucesso</h3>
              <p>Registros processados e aceitos pelo eSocial</p>
            </div>
          </div>
          
          <div class="card-content">
            <div class="main-number success">{{ results.success.count }}</div>
            <div class="percentage">{{ results.success.percentage }}% do total</div>
            
            <div class="card-details">
              <div class="detail-row">
                <span>Protocolos gerados:</span>
                <span class="value">{{ results.success.protocols }}</span>
              </div>
              <div class="detail-row">
                <span>Tempo médio por registro:</span>
                <span class="value">{{ results.success.avgTime }}s</span>
              </div>
            </div>
          </div>
          
          <div class="card-actions">
            <button type="button" @click="viewSuccessDetails" class="btn btn-card-primary">
              <svg class="btn-icon" viewBox="0 0 24 24">
                <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z"/>
              </svg>
              Ver Detalhes
            </button>
            <button type="button" @click="downloadSuccessReport" class="btn btn-card-secondary">
              <svg class="btn-icon" viewBox="0 0 24 24">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
              </svg>
              Relatório
            </button>
          </div>
        </div>

        <!-- Card de Críticas -->
        <div class="result-card warning-card">
          <div class="card-header">
            <div class="card-icon warning">
              <svg viewBox="0 0 24 24">
                <path d="M12,2L13.09,8.26L22,9L17.22,13.78L18.18,22L12,18.27L5.82,22L6.78,13.78L2,9L10.91,8.26L12,2Z"/>
              </svg>
            </div>
            <div class="card-title">
              <h3>Com Críticas</h3>
              <p>Registros enviados mas com observações</p>
            </div>
          </div>
          
          <div class="card-content">
            <div class="main-number warning">{{ results.warnings.count }}</div>
            <div class="percentage">{{ results.warnings.percentage }}% do total</div>
            
            <div class="card-details">
              <div class="detail-row">
                <span>Críticas mais comuns:</span>
                <span class="value">{{ results.warnings.commonIssue }}</span>
              </div>
              <div class="detail-row">
                <span>Requer atenção:</span>
                <span class="value">{{ results.warnings.requiresAttention }}</span>
              </div>
            </div>
          </div>
          
          <div class="card-actions">
            <button type="button" @click="viewWarningDetails" class="btn btn-card-primary">
              <svg class="btn-icon" viewBox="0 0 24 24">
                <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z"/>
              </svg>
              Ver Críticas
            </button>
            <button type="button" @click="downloadWarningsReport" class="btn btn-card-secondary">
              <svg class="btn-icon" viewBox="0 0 24 24">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
              </svg>
              Relatório
            </button>
          </div>
        </div>

        <!-- Card de Erros -->
        <div class="result-card error-card">
          <div class="card-header">
            <div class="card-icon error">
              <svg viewBox="0 0 24 24">
                <path d="M12,2L13.09,8.26L22,9L17.22,13.78L18.18,22L12,18.27L5.82,22L6.78,13.78L2,9L10.91,8.26L12,2Z"/>
              </svg>
            </div>
            <div class="card-title">
              <h3>Com Erros</h3>
              <p>Registros rejeitados pelo eSocial</p>
            </div>
          </div>
          
          <div class="card-content">
            <div class="main-number error">{{ results.errors.count }}</div>
            <div class="percentage">{{ results.errors.percentage }}% do total</div>
            
            <div class="card-details">
              <div class="detail-row">
                <span>Erro mais comum:</span>
                <span class="value">{{ results.errors.commonError }}</span>
              </div>
              <div class="detail-row">
                <span>Requer correção:</span>
                <span class="value">{{ results.errors.requiresCorrection }}</span>
              </div>
            </div>
          </div>
          
          <div class="card-actions">
            <button type="button" @click="viewErrorDetails" class="btn btn-card-primary">
              <svg class="btn-icon" viewBox="0 0 24 24">
                <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z"/>
              </svg>
              Ver Erros
            </button>
            <button type="button" @click="downloadErrorsReport" class="btn btn-card-secondary">
              <svg class="btn-icon" viewBox="0 0 24 24">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
              </svg>
              Relatório
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Gráfico de Resultados -->
    <div class="chart-section">
      <div class="chart-card">
        <div class="chart-header">
          <h3 class="chart-title">
            <svg class="chart-icon" viewBox="0 0 24 24">
              <path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,19H5V5H19V19Z"/>
            </svg>
            Distribuição dos Resultados
          </h3>
        </div>
        
        <div class="chart-content">
          <div class="chart-container">
            <div class="donut-chart">
              <svg viewBox="0 0 200 200" class="donut-svg">
                <!-- Círculo de fundo -->
                <circle 
                  cx="100" 
                  cy="100" 
                  r="80" 
                  fill="none" 
                  stroke="var(--border-color)" 
                  stroke-width="20"
                />
                
                <!-- Segmento de Sucesso -->
                <circle 
                  cx="100" 
                  cy="100" 
                  r="80" 
                  fill="none" 
                  stroke="var(--success-color)" 
                  stroke-width="20"
                  :stroke-dasharray="`${successArc} ${circumference - successArc}`"
                  stroke-dashoffset="0"
                  transform="rotate(-90 100 100)"
                  class="chart-segment success"
                />
                
                <!-- Segmento de Críticas -->
                <circle 
                  cx="100" 
                  cy="100" 
                  r="80" 
                  fill="none" 
                  stroke="var(--warning-color)" 
                  stroke-width="20"
                  :stroke-dasharray="`${warningArc} ${circumference - warningArc}`"
                  :stroke-dashoffset="-successArc"
                  transform="rotate(-90 100 100)"
                  class="chart-segment warning"
                />
                
                <!-- Segmento de Erros -->
                <circle 
                  cx="100" 
                  cy="100" 
                  r="80" 
                  fill="none" 
                  stroke="var(--error-color)" 
                  stroke-width="20"
                  :stroke-dasharray="`${errorArc} ${circumference - errorArc}`"
                  :stroke-dashoffset="-(successArc + warningArc)"
                  transform="rotate(-90 100 100)"
                  class="chart-segment error"
                />
                
                <!-- Texto central -->
                <text x="100" y="95" text-anchor="middle" class="chart-total-number">
                  {{ totalRecords }}
                </text>
                <text x="100" y="115" text-anchor="middle" class="chart-total-label">
                  Total
                </text>
              </svg>
            </div>
            
            <div class="chart-legend">
              <div class="legend-item">
                <div class="legend-color success"></div>
                <span class="legend-label">Sucesso ({{ results.success.count }})</span>
                <span class="legend-percentage">{{ results.success.percentage }}%</span>
              </div>
              <div class="legend-item">
                <div class="legend-color warning"></div>
                <span class="legend-label">Críticas ({{ results.warnings.count }})</span>
                <span class="legend-percentage">{{ results.warnings.percentage }}%</span>
              </div>
              <div class="legend-item">
                <div class="legend-color error"></div>
                <span class="legend-label">Erros ({{ results.errors.count }})</span>
                <span class="legend-percentage">{{ results.errors.percentage }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Detalhes por Departamento -->
    <div class="department-section">
      <div class="department-card">
        <div class="department-header">
          <h3 class="department-title">
            <svg class="department-icon" viewBox="0 0 24 24">
              <path d="M12,5.5A3.5,3.5 0 0,1 15.5,9A3.5,3.5 0 0,1 12,12.5A3.5,3.5 0 0,1 8.5,9A3.5,3.5 0 0,1 12,5.5M5,8C5.56,8 6.08,8.15 6.53,8.42C6.38,9.85 6.8,11.27 7.66,12.38C7.16,13.34 6.16,14 5,14A3,3 0 0,1 2,11A3,3 0 0,1 5,8M19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14C17.84,14 16.84,13.34 16.34,12.38C17.2,11.27 17.62,9.85 17.47,8.42C17.92,8.15 18.44,8 19,8M5.5,18.25C5.5,16.18 8.41,14.5 12,14.5C15.59,14.5 18.5,16.18 18.5,18.25V20H5.5V18.25M0,20V18.5C0,17.11 1.89,15.94 4.45,15.6C3.86,16.28 3.5,17.22 3.5,18.25V20H0M24,20H20.5V18.25C20.5,17.22 20.14,16.28 19.55,15.6C22.11,15.94 24,17.11 24,18.5V20Z"/>
            </svg>
            Resultados por Departamento
          </h3>
        </div>
        
        <div class="department-content">
          <div class="department-table">
            <div class="table-header">
              <div class="header-cell">Departamento</div>
              <div class="header-cell">Total</div>
              <div class="header-cell">Sucesso</div>
              <div class="header-cell">Críticas</div>
              <div class="header-cell">Erros</div>
              <div class="header-cell">Taxa de Sucesso</div>
            </div>
            
            <div 
              v-for="dept in departmentResults" 
              :key="dept.name"
              class="table-row"
            >
              <div class="table-cell department-name">
                <div class="dept-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M12,5.5A3.5,3.5 0 0,1 15.5,9A3.5,3.5 0 0,1 12,12.5A3.5,3.5 0 0,1 8.5,9A3.5,3.5 0 0,1 12,5.5M5,8C5.56,8 6.08,8.15 6.53,8.42C6.38,9.85 6.8,11.27 7.66,12.38C7.16,13.34 6.16,14 5,14A3,3 0 0,1 2,11A3,3 0 0,1 5,8M19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14C17.84,14 16.84,13.34 16.34,12.38C17.2,11.27 17.62,9.85 17.47,8.42C17.92,8.15 18.44,8 19,8M5.5,18.25C5.5,16.18 8.41,14.5 12,14.5C15.59,14.5 18.5,16.18 18.5,18.25V20H5.5V18.25M0,20V18.5C0,17.11 1.89,15.94 4.45,15.6C3.86,16.28 3.5,17.22 3.5,18.25V20H0M24,20H20.5V18.25C20.5,17.22 20.14,16.28 19.55,15.6C22.11,15.94 24,17.11 24,18.5V20Z"/>
                  </svg>
                </div>
                {{ dept.name }}
              </div>
              <div class="table-cell">{{ dept.total }}</div>
              <div class="table-cell success">{{ dept.success }}</div>
              <div class="table-cell warning">{{ dept.warnings }}</div>
              <div class="table-cell error">{{ dept.errors }}</div>
              <div class="table-cell">
                <div class="success-rate" :class="getSuccessRateClass(dept.successRate)">
                  {{ dept.successRate }}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Ações Finais -->
    <div class="final-actions">
      <div class="actions-card">
        <div class="actions-header">
          <h3 class="actions-title">
            <svg class="actions-icon" viewBox="0 0 24 24">
              <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
            </svg>
            Próximas Ações
          </h3>
        </div>
        
        <div class="actions-content">
          <div class="actions-grid">
            <button type="button" @click="reprocessErrors" class="btn btn-action-primary">
              <svg class="btn-icon" viewBox="0 0 24 24">
                <path d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z"/>
              </svg>
              Reprocessar Erros
            </button>
            
            <button type="button" @click="generateFullReport" class="btn btn-action-secondary">
              <svg class="btn-icon" viewBox="0 0 24 24">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
              </svg>
              Relatório Completo
            </button>
            
            <button type="button" @click="exportToExcel" class="btn btn-action-secondary">
              <svg class="btn-icon" viewBox="0 0 24 24">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
              </svg>
              Exportar Excel
            </button>
            
            <button type="button" @click="scheduleNewBatch" class="btn btn-action-primary">
              <svg class="btn-icon" viewBox="0 0 24 24">
                <path d="M19,19H5V8H19M16,1V3H8V1H6V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3H18V1M17,12H12V17H17V12Z"/>
              </svg>
              Agendar Novo Lote
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// Interfaces
interface BatchInfo {
  id: string
  description: string
  status: 'completed' | 'partial' | 'failed'
  startTime: string
  endTime: string
  duration: number
  protocol?: string
}

interface Results {
  success: {
    count: number
    percentage: number
    protocols: number
    avgTime: number
  }
  warnings: {
    count: number
    percentage: number
    commonIssue: string
    requiresAttention: number
  }
  errors: {
    count: number
    percentage: number
    commonError: string
    requiresCorrection: number
  }
}

interface DepartmentResult {
  name: string
  total: number
  success: number
  warnings: number
  errors: number
  successRate: number
}

// Emits
defineEmits<{
  back: []
}>()

// Estado reativo
const batchInfo = ref<BatchInfo>({
  id: 'BATCH-2024-001-S2200',
  description: 'Processamento de Admissões S-2200 - Janeiro 2024',
  status: 'completed',
  startTime: '2024-01-15T08:30:00',
  endTime: '2024-01-15T08:45:30',
  duration: 930, // segundos
  protocol: '1.2.202401.0000000000000001234'
})

const results = ref<Results>({
  success: {
    count: 142,
    percentage: 85.5,
    protocols: 142,
    avgTime: 2.3
  },
  warnings: {
    count: 18,
    percentage: 10.8,
    commonIssue: 'CPF não validado na Receita',
    requiresAttention: 5
  },
  errors: {
    count: 6,
    percentage: 3.6,
    commonError: 'Data de admissão inválida',
    requiresCorrection: 6
  }
})

const departmentResults = ref<DepartmentResult[]>([
  {
    name: 'Tecnologia da Informação',
    total: 45,
    success: 42,
    warnings: 2,
    errors: 1,
    successRate: 93.3
  },
  {
    name: 'Recursos Humanos',
    total: 32,
    success: 28,
    warnings: 3,
    errors: 1,
    successRate: 87.5
  },
  {
    name: 'Financeiro',
    total: 28,
    success: 25,
    warnings: 2,
    errors: 1,
    successRate: 89.3
  },
  {
    name: 'Vendas',
    total: 35,
    success: 30,
    warnings: 4,
    errors: 1,
    successRate: 85.7
  },
  {
    name: 'Produção',
    total: 26,
    success: 17,
    warnings: 7,
    errors: 2,
    successRate: 65.4
  }
])

// Computed properties
const totalRecords = computed(() => {
  return results.value.success.count + results.value.warnings.count + results.value.errors.count
})

const circumference = computed(() => {
  return 2 * Math.PI * 80 // raio = 80
})

const successArc = computed(() => {
  return (results.value.success.percentage / 100) * circumference.value
})

const warningArc = computed(() => {
  return (results.value.warnings.percentage / 100) * circumference.value
})

const errorArc = computed(() => {
  return (results.value.errors.percentage / 100) * circumference.value
})

// Métodos
const formatDateTime = (dateTime: string) => {
  return new Date(dateTime).toLocaleString('pt-BR')
}

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}m ${remainingSeconds}s`
}

const getBatchStatusLabel = (status: string) => {
  const labels = {
    completed: 'Concluído',
    partial: 'Parcial',
    failed: 'Falhou'
  }
  return labels[status as keyof typeof labels] || status
}

const getSuccessRateClass = (rate: number) => {
  if (rate >= 90) return 'excellent'
  if (rate >= 80) return 'good'
  if (rate >= 70) return 'fair'
  return 'poor'
}

// Ações dos cards
const viewSuccessDetails = () => {
  console.log('Visualizando detalhes de sucesso')
  alert('Abrindo detalhes dos registros enviados com sucesso...')
}

const viewWarningDetails = () => {
  console.log('Visualizando detalhes de críticas')
  alert('Abrindo detalhes dos registros com críticas...')
}

const viewErrorDetails = () => {
  console.log('Visualizando detalhes de erros')
  alert('Abrindo detalhes dos registros com erros...')
}

const downloadSuccessReport = () => {
  console.log('Baixando relatório de sucessos')
  alert('Gerando relatório de registros enviados com sucesso...')
}

const downloadWarningsReport = () => {
  console.log('Baixando relatório de críticas')
  alert('Gerando relatório de registros com críticas...')
}

const downloadErrorsReport = () => {
  console.log('Baixando relatório de erros')
  alert('Gerando relatório de registros com erros...')
}

// Ações finais
const reprocessErrors = () => {
  console.log('Reprocessando erros')
  alert('Iniciando reprocessamento dos registros com erro...')
}

const generateFullReport = () => {
  console.log('Gerando relatório completo')
  alert('Gerando relatório completo do processamento...')
}

const exportToExcel = () => {
  console.log('Exportando para Excel')
  alert('Exportando dados para planilha Excel...')
}

const scheduleNewBatch = () => {
  console.log('Agendando novo lote')
  alert('Abrindo agendamento de novo lote de processamento...')
}

// Lifecycle
onMounted(() => {
  // Carregar dados do sumário se necessário
})
</script>

<style scoped>
.summary-page-container {
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

/* Informações do Lote */
.batch-info-section {
  margin-bottom: 2rem;
}

.batch-card {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  overflow: hidden;
}

.batch-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: var(--accent-primary);
}

.batch-title {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: white;
}

.batch-icon {
  width: 32px;
  height: 32px;
  fill: white;
}

.batch-title h3 {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
}

.batch-subtitle {
  font-size: 0.9rem;
  opacity: 0.9;
  margin: 0.25rem 0 0 0;
}

.batch-status .status-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
}

.status-completed {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
}

.status-partial {
  background: rgba(251, 191, 36, 0.2);
  color: #fbbf24;
}

.status-failed {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.batch-details {
  padding: 1.5rem;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: var(--bg-secondary);
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.detail-label {
  font-weight: 500;
  color: var(--text-secondary);
}

.detail-value {
  font-weight: 600;
  color: var(--text-primary);
}

.detail-value.protocol {
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  color: var(--accent-primary);
}

/* Cards de Resultados */
.main-results-section {
  margin-bottom: 2rem;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
}

.result-card {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  overflow: hidden;
  transition: all 0.3s ease;
}

.result-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.card-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.card-icon svg {
  width: 24px;
  height: 24px;
  fill: white;
}

.card-icon.success {
  background: var(--success-color);
}

.card-icon.warning {
  background: var(--warning-color);
}

.card-icon.error {
  background: var(--error-color);
}

.card-title h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.card-title p {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin: 0.25rem 0 0 0;
}

.card-content {
  padding: 1.5rem;
  text-align: center;
}

.main-number {
  font-size: 3rem;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 0.5rem;
}

.main-number.success {
  color: var(--success-color);
}

.main-number.warning {
  color: var(--warning-color);
}

.main-number.error {
  color: var(--error-color);
}

.percentage {
  font-size: 1rem;
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

.card-details {
  text-align: left;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--border-color);
  font-size: 0.9rem;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-row .value {
  font-weight: 600;
  color: var(--text-primary);
}

.card-actions {
  display: flex;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.02);
  border-top: 1px solid var(--border-color);
}

.btn-card-primary {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-card-primary:hover {
  background: var(--primary-color-hover);
}

.btn-card-secondary {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: var(--secondary-color);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-card-secondary:hover {
  background: var(--secondary-color-hover);
}

/* Gráfico */
.chart-section {
  margin-bottom: 2rem;
}

.chart-card {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.chart-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.chart-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.chart-icon {
  width: 20px;
  height: 20px;
  fill: var(--accent-primary);
}

.chart-content {
  padding: 2rem;
}

.chart-container {
  display: flex;
  align-items: center;
  gap: 3rem;
  justify-content: center;
}

.donut-chart {
  position: relative;
}

.donut-svg {
  width: 200px;
  height: 200px;
}

.chart-segment {
  transition: all 0.3s ease;
}

.chart-segment:hover {
  stroke-width: 25;
}

.chart-total-number {
  font-size: 2rem;
  font-weight: 700;
  fill: var(--text-primary);
}

.chart-total-label {
  font-size: 0.9rem;
  fill: var(--text-secondary);
}

.chart-legend {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
}

.legend-color.success {
  background: var(--success-color);
}

.legend-color.warning {
  background: var(--warning-color);
}

.legend-color.error {
  background: var(--error-color);
}

.legend-label {
  flex: 1;
  font-size: 0.9rem;
  color: var(--text-primary);
}

.legend-percentage {
  font-weight: 600;
  color: var(--text-primary);
}

/* Departamentos */
.department-section {
  margin-bottom: 2rem;
}

.department-card {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.department-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.department-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.department-icon {
  width: 20px;
  height: 20px;
  fill: var(--accent-primary);
}

.department-content {
  padding: 1.5rem;
}

.department-table {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr;
  gap: 0;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.table-header {
  display: contents;
}

.header-cell {
  padding: 1rem;
  background: var(--accent-primary);
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  text-align: center;
  border-right: 1px solid rgba(255, 255, 255, 0.2);
}

.header-cell:last-child {
  border-right: none;
}

.table-row {
  display: contents;
}

.table-row:nth-child(even) .table-cell {
  background: rgba(255, 255, 255, 0.02);
}

.table-cell {
  padding: 1rem;
  border-right: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
  text-align: center;
  font-size: 0.9rem;
}

.table-cell:last-child {
  border-right: none;
}

.table-cell.department-name {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-align: left;
  font-weight: 500;
}

.dept-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.dept-icon svg {
  width: 100%;
  height: 100%;
  fill: var(--accent-primary);
}

.table-cell.success {
  color: var(--success-color);
  font-weight: 600;
}

.table-cell.warning {
  color: var(--warning-color);
  font-weight: 600;
}

.table-cell.error {
  color: var(--error-color);
  font-weight: 600;
}

.success-rate {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.8rem;
}

.success-rate.excellent {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
}

.success-rate.good {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
}

.success-rate.fair {
  background: rgba(251, 191, 36, 0.2);
  color: #fbbf24;
}

.success-rate.poor {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

/* Ações Finais */
.final-actions {
  margin-bottom: 2rem;
}

.actions-card {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.actions-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.actions-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.actions-icon {
  width: 20px;
  height: 20px;
  fill: var(--accent-primary);
}

.actions-content {
  padding: 2rem;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.btn-action-primary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-action-primary:hover {
  background: var(--primary-color-hover);
  transform: translateY(-2px);
}

.btn-action-secondary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: var(--secondary-color);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-action-secondary:hover {
  background: var(--secondary-color-hover);
  transform: translateY(-2px);
}

.btn-icon {
  width: 16px;
  height: 16px;
  fill: currentColor;
}

/* Responsividade */
@media (max-width: 1200px) {
  .results-grid {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }
  
  .chart-container {
    flex-direction: column;
    gap: 2rem;
  }
  
  .department-table {
    grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .summary-page-container {
    padding: 1rem;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .batch-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .detail-grid {
    grid-template-columns: 1fr;
  }
  
  .detail-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .results-grid {
    grid-template-columns: 1fr;
  }
  
  .card-actions {
    flex-direction: column;
  }
  
  .chart-container {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .donut-svg {
    width: 150px;
    height: 150px;
  }
  
  .department-table {
    grid-template-columns: 1fr;
    gap: 1px;
  }
  
  .header-cell,
  .table-cell {
    border-right: none;
    text-align: left;
  }
  
  .table-cell {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .table-cell::before {
    content: attr(data-label);
    font-weight: 600;
    color: var(--text-secondary);
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
  }
}
</style>