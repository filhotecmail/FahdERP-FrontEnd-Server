<template>
  <div class="esocial-processing-container">
    <div class="form-container">
      <!-- Card Heading -->
      <ESocialCardHeading 
        title="eSocial S-2200" 
        subtitle="Processamento e Envio - Cadastramento Inicial do Vínculo" 
        badge="Processamento"
        :icon-path="'M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z'"
      />
      
      <div class="esocial-form">
        <!-- Seção: Filtros de Consulta -->
        <div class="form-section">
          <h2 class="section-title">
            <div class="section-title-content">
              <svg class="section-icon" viewBox="0 0 24 24">
                <path d="M14,12V19.88C14.04,20.18 13.94,20.5 13.71,20.71C13.32,21.1 12.69,21.1 12.3,20.71L10.29,18.7C10.06,18.47 9.96,18.16 10,17.87V12H9.97L4.21,4.62C3.87,4.19 3.95,3.56 4.38,3.22C4.57,3.08 4.78,3 5,3V3H19V3C19.22,3 19.43,3.08 19.62,3.22C20.05,3.56 20.13,4.19 19.79,4.62L14.03,12H14Z"/>
              </svg>
              Filtros de Consulta
            </div>
            <button @click="toggleFilters" class="toggle-filters-btn" :title="filtersExpanded ? 'Recolher filtros' : 'Expandir filtros'">
              <svg class="toggle-icon" :class="{ 'rotated': !filtersExpanded }" viewBox="0 0 24 24">
                <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/>
              </svg>
            </button>
          </h2>
          
          <div v-show="filtersExpanded" class="filters-content">
          <div class="form-grid">
            <div class="form-group">
              <label for="filterCpf" class="form-label">CPF do Trabalhador</label>
              <input
                 id="filterCpf"
                 v-model="cpfFilter"
                 type="text"
                 class="form-input"
                 :class="{ 'error': cpfFilterError }"
                 placeholder="000.000.000-00"
                 @input="formatFilterCPF"
                 maxlength="14"
               />
               <span v-if="cpfFilterError" class="error-message">{{ cpfFilterError }}</span>
            </div>

            <div class="form-group">
              <label for="filterMatricula" class="form-label">Matrícula</label>
              <input
                 id="filterMatricula"
                 v-model="matriculaFilter"
                 type="text"
                 class="form-input"
                 :class="{ 'error': matriculaFilterError }"
                 placeholder="Digite a matrícula"
               />
               <span v-if="matriculaFilterError" class="error-message">{{ matriculaFilterError }}</span>
            </div>

            <div class="form-group">
              <label for="filterStatus" class="form-label">Status</label>
              <select
                 id="filterStatus"
                 v-model="statusFilter"
                 class="form-input"
               >
                <option value="">Todos os status</option>
                <option value="pendente">Pendente</option>
                <option value="processando">Processando</option>
                <option value="enviado">Enviado</option>
                <option value="sucesso">Sucesso</option>
                <option value="erro">Erro</option>
                <option value="critica">Crítica</option>
              </select>
            </div>

            <div class="form-group">
              <label for="filterEvento" class="form-label">Evento</label>
              <select
                 id="filterEvento"
                 v-model="eventoFilter"
                 class="form-input"
               >
                <option value="">Todos os eventos</option>
                <option value="S-2200">S-2200 - Cadastramento Inicial</option>
                <option value="S-2300">S-2300 - Trabalhador Sem Vínculo</option>
                <option value="S-2400">S-2400 - Cadastro de Beneficiário</option>
              </select>
            </div>

            <div class="form-group">
              <label for="filterDataInicio" class="form-label">Data Início</label>
              <input
                 id="filterDataInicio"
                 v-model="dataInicioFilter"
                 type="date"
                 class="form-input"
               />
            </div>

            <div class="form-group">
              <label for="filterDataFim" class="form-label">Data Fim</label>
              <input
                 id="filterDataFim"
                 v-model="dataFimFilter"
                 type="date"
                 class="form-input"
               />
            </div>


          </div>

          <div class="form-actions">
            <button @click="applyFilters" type="button" class="btn btn-primary">
              <svg class="btn-icon" viewBox="0 0 24 24">
                <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/>
              </svg>
              Aplicar Filtros
            </button>
            <button @click="clearFilters" type="button" class="btn btn-secondary">
              <svg class="btn-icon" viewBox="0 0 24 24">
                <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
              </svg>
              Limpar Filtros
            </button>
          </div>
          </div>
        </div>

        <!-- Seção: Dados do Processamento -->
        <div class="form-section">
          <h2 class="section-title">
            <svg class="section-icon" viewBox="0 0 24 24">
              <path d="M3,3H21V5H3V3M3,7H21V9H3V7M3,11H21V13H3V11M3,15H21V17H3V15M3,19H21V21H3V19Z"/>
            </svg>
            Dados do Processamento ({{ totalItems }} registros)
          </h2>

          <!-- Controles da tabela -->
          <div class="table-controls">
            <div class="table-controls-left">
              <div class="items-per-page">
                <label for="itemsPerPage" class="control-label">Mostrar:</label>
                <select id="itemsPerPage" v-model="itemsPerPage" class="items-select">
                  <option value="all">Todos</option>
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
                <span class="control-label">registros</span>
              </div>
            </div>
            <div class="table-controls-right">
              <div class="status-filter-container">
                 <div class="radio-group">
                   <label class="radio-item">
                     <input type="radio" v-model="statusFilterRadio" value="all" />
                     <span>Todos os registros</span>
                   </label>
                   <label class="radio-item">
                     <input type="radio" v-model="statusFilterRadio" value="success" />
                     <span>Processados com sucesso</span>
                   </label>
                   <label class="radio-item">
                     <input type="radio" v-model="statusFilterRadio" value="critics" />
                     <span>Criticados pelo eSocial</span>
                   </label>
                   <label class="radio-item">
                     <input type="radio" v-model="statusFilterRadio" value="error" />
                     <span>Com erros</span>
                   </label>
                 </div>
               </div>
              <div class="search-container">
                <svg class="search-icon" viewBox="0 0 24 24">
                  <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/>
                </svg>
                <input
                  id="searchFilter"
                  v-model="searchFilter"
                  type="text"
                  class="search-input"
                  placeholder="Buscar..."
                />
              </div>
            </div>
          </div>

          <!-- Sistema de Abas -->
          <div class="tabs-container">
            <!-- Navegação das Abas -->
            <div class="tabs-navigation">
              <button 
                @click="activeTab = 'grid'" 
                :class="['tab-button', { active: activeTab === 'grid' }]">
                <svg class="tab-icon" viewBox="0 0 24 24">
                  <path d="M3,3H21V5H3V3M3,7H21V9H3V7M3,11H21V13H3V11M3,15H21V17H3V15M3,19H21V21H3V19Z"/>
                </svg>
                Grid de Dados
              </button>
              <button 
                @click="activeTab = 'xml'" 
                :class="['tab-button', { active: activeTab === 'xml' }]">
                <svg class="tab-icon" viewBox="0 0 24 24">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                </svg>
                Visualização XML
              </button>
              <button 
                @click="activeTab = 'stats'" 
                :class="['tab-button', { active: activeTab === 'stats' }]">
                <svg class="tab-icon" viewBox="0 0 24 24">
                  <path d="M11,2V22C5.9,21.5 2,17.2 2,12S5.9,2.5 11,2M13,2V11H22C22,6.8 18.2,3 13,2M13,13V22C18.1,21.5 22,17.2 22,13H13Z"/>
                </svg>
                Estatísticas
              </button>
            </div>

            <!-- Conteúdo das Abas -->
            <div class="tabs-content">
              <!-- Aba 1: Grid de Dados -->
              <div v-show="activeTab === 'grid'" class="tab-panel">
                <div class="table-container" @contextmenu="showContextMenu" @click="hideContextMenu">
                  <table class="data-table">
                    <thead>
                      <tr>
                        <th class="checkbox-column">
                          <input type="checkbox" @change="(event) => toggleSelectAll(event, paginatedData)" />
                        </th>
                        <th>CPF</th>
                        <th>Matrícula</th>
                        <th>Nome</th>
                        <th>Evento</th>
                        <th>Data Processamento</th>
                        <th>Nro do Protocolo</th>
                        <th>Nro do Recibo</th>
                        <th>Nro Recibo Exclusão</th>
                        <th>Ações</th>
                        <th class="loading-column" :class="{ 'visible': processingItems.length > 0 }">Processando</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in paginatedData" :key="item.id" 
                          :class="getRowProcessingClass(item.id)">
                        <td class="checkbox-column">
                          <input type="checkbox" :value="item.id" v-model="selectedItems" />
                        </td>
                        <td>{{ formatCPFDisplay(item.cpf) }}</td>
                        <td>{{ item.matricula }}</td>
                        <td>{{ item.nome }}</td>
                        <td>{{ item.evento }}</td>
                        <td>{{ formatDateTime(item.dataProcessamento) }}</td>
                        <td>{{ item.nroProtocolo || '' }}</td>
                        <td>{{ item.nroRecibo || '' }}</td>
                        <td>{{ item.nroReciboExclusao || '' }}</td>
                        <td>
                          <div class="action-buttons">
                            <button @click="viewXML(item)" class="btn-action" title="Ver XML">
                              <svg viewBox="0 0 24 24">
                                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                              </svg>
                            </button>
                            <button v-if="canRetify(item.status)" @click="retifyData(item)" class="btn-action" title="Retificar">
                              <svg viewBox="0 0 24 24">
                                <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z"/>
                              </svg>
                            </button>
                            <button v-if="canProcess(item.status)" @click="processItem(item)" class="btn-action" title="Processar">
                              <svg viewBox="0 0 24 24">
                                <path d="M8,5.14V19.14L19,12.14L8,5.14Z"/>
                              </svg>
                            </button>
                          </div>
                        </td>
                        <td class="loading-column" :class="{ 'visible': processingItems.length > 0 }">
                          <div v-if="processingItems.includes(item.id)" class="loading-spinner"></div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  
                  <!-- Menu de Contexto -->
                  <div v-if="contextMenuVisible" 
                       class="context-menu" 
                       :style="{ top: contextMenuY + 'px', left: contextMenuX + 'px' }">
                    <ul class="context-menu-list">
                      <li @click="() => selectAllItems(paginatedData)" class="context-menu-item">
                        Selecionar todos
                      </li>
                      <li @click="deselectAllItems" class="context-menu-item">
                        Desmarcar todos
                      </li>
                      <li @click="processSelectedItems" class="context-menu-item" :class="{ disabled: selectedItems.length === 0 }">
                        Processar registros selecionados
                      </li>
                      <li @click="retifySelectedItems" class="context-menu-item" :class="{ disabled: selectedItems.length === 0 }">
                        Retificar registros selecionados
                      </li>
                      <li @click="deleteSelectedItems" class="context-menu-item" :class="{ disabled: selectedItems.length === 0 }">
                        Exclusão, enviar evento S3000 dos arquivos selecionados
                      </li>
                    </ul>
                  </div>
                </div>

                <!-- Paginação -->
                <div class="pagination-container">
                  <div class="pagination-info">
                    <span v-if="itemsPerPage === 'all'">
                      Mostrando todos os {{ totalItems }} registros
                    </span>
                    <span v-else>
                      Mostrando {{ (currentPage - 1) * effectiveItemsPerPage + 1 }} a {{ Math.min(currentPage * effectiveItemsPerPage, totalItems) }} de {{ totalItems }} registros
                    </span>
                  </div>
                  <div class="pagination-controls" v-if="itemsPerPage !== 'all'">
                    <button @click="currentPage = Math.max(1, currentPage - 1)" :disabled="currentPage === 1" class="btn btn-secondary">
                      Anterior
                    </button>
                    <span class="page-info">Página {{ currentPage }} de {{ totalPages }}</span>
                    <button @click="currentPage = Math.min(totalPages, currentPage + 1)" :disabled="currentPage >= totalPages" class="btn btn-secondary">
                      Próxima
                    </button>
                  </div>
                </div>

                <!-- Ações em Lote -->
                <div class="form-actions">
                  <button @click="processSelectedData" :disabled="selectedItems.length === 0" class="btn btn-primary">
                    <svg class="btn-icon" viewBox="0 0 24 24">
                      <path d="M8,5.14V19.14L19,12.14L8,5.14Z"/>
                    </svg>
                    Processar Selecionados ({{ selectedItems.length }})
                  </button>
                  <button @click="generateCriticsReport" class="btn btn-secondary">
                    <svg class="btn-icon" viewBox="0 0 24 24">
                      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                    </svg>
                    Relatório de Críticas
                  </button>
                </div>
              </div>

              <!-- Aba 2: Visualização XML -->
              <div v-show="activeTab === 'xml'" class="tab-panel">
                <div class="xml-viewer-container">
                  <div class="xml-header">
                    <h3 class="xml-title">
                      <svg class="xml-icon" viewBox="0 0 24 24">
                        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                      </svg>
                      Exemplo de XML S-2200 (Admissão de Trabalhador)
                    </h3>
                    <div class="xml-info">
                      <span class="xml-badge">Evento: S-2200</span>
                      <span class="xml-badge">Versão: S_01_02_00</span>
                      <span class="xml-badge">Ambiente: Homologação</span>
                    </div>
                  </div>
                  <div class="xml-content">
                    <pre class="xml-code"><code v-html="formattedXml"></code></pre>
                  </div>
                </div>
              </div>

              <!-- Aba 3: Estatísticas -->
              <div v-show="activeTab === 'stats'" class="tab-panel">
                <div class="stats-container">
                  <div class="stats-header">
                    <h3 class="stats-title">
                      <svg class="stats-icon" viewBox="0 0 24 24">
                        <path d="M16,11.78L20.24,4.45L21.97,5.45L16.74,14.5L10.23,10.75L5.46,19H22V21H2V3H4V17.54L9.5,8L16,11.78Z"/>
                      </svg>
                      Estatísticas de Processamento ao Longo do Tempo
                    </h3>
                  </div>
                  <div class="chart-container-large">
                    <Line :data="chartData" :options="chartOptions" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import ESocialCardHeading from '../components/ESocialCardHeading.vue'
import { useESocialFilters } from '../composables/useESocialFilters'
import { useESocialProcessing } from '../composables/useESocialProcessing'
import { mockData, type ProcessingItem } from '../mock/esocialProcessingData'
import { s2200XmlMock, xmlStats, timeSeriesData } from '../mock/s2200XmlMock'
import { useThemeStore } from '@/stores/theme'

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

// Estado das abas
const activeTab = ref('grid')

// Inicialização dos composables
const {
  // Form fields
  cpfFilter,
  cpfFilterError,
  matriculaFilter,
  matriculaFilterError,
  statusFilter,
  statusFilterError,
  eventoFilter,
  eventoFilterError,
  dataInicioFilter,
  dataInicioFilterError,
  dataFimFilter,
  dataFimFilterError,
  searchFilter,
  searchFilterError,
  // Additional states
  statusFilterRadio,
  filtersExpanded,
  // Computed data
  filteredData,
  // Functions
  formatFilterCPF,
  applyFilters,
  clearFilters,
  toggleFilters,
  getItemVisualStatus
} = useESocialFilters(mockData)

const {
  // Estados
  selectedItems,
  processingItems,
  contextMenuVisible,
  contextMenuX,
  contextMenuY,
  // Funções de seleção
  toggleSelectAll,
  // Funções de menu de contexto
  showContextMenu,
  hideContextMenu,
  selectAllItems,
  deselectAllItems,
  // Funções de processamento
  processSelectedItems,
  retifySelectedItems,
  deleteSelectedItems,
  // Funções utilitárias
  processSelectedData,
  generateCriticsReport,
  viewXML,
  retifyData,
  processItem,
  canRetify,
  canProcess,
  // Funções de formatação e estilo
  getRowProcessingClass,
  formatDateTime,
  formatCPFDisplay,
  getStatusLabel
} = useESocialProcessing(mockData)

// Dados computados para paginação
const currentPage = ref(1)
const itemsPerPage = ref('10')

const totalItems = computed(() => filteredData.value.length)

// Paginação
const effectiveItemsPerPage = computed(() => {
  return itemsPerPage.value === 'all' ? filteredData.value.length : parseInt(itemsPerPage.value)
})

const totalPages = computed(() => {
  if (itemsPerPage.value === 'all') return 1
  return Math.ceil(filteredData.value.length / effectiveItemsPerPage.value)
})

const paginatedData = computed(() => {
  if (itemsPerPage.value === 'all') return filteredData.value
  const start = (currentPage.value - 1) * effectiveItemsPerPage.value
  const end = start + effectiveItemsPerPage.value
  return filteredData.value.slice(start, end)
})

// Watchers
watch(itemsPerPage, () => {
  currentPage.value = 1
})

// Formatação do XML
const formattedXml = computed(() => {
  return s2200XmlMock
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/(&lt;\/?[^&gt;]+&gt;)/g, '<span class="xml-tag">$1</span>')
    .replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="xml-comment">$1</span>')
    .replace(/(="[^"]*")/g, '<span class="xml-attribute">$1</span>')
})

// Dados do gráfico
const chartData = computed(() => ({
  labels: timeSeriesData.labels,
  datasets: timeSeriesData.datasets
}))

const themeStore = useThemeStore()

// Função para obter cores do tema atual
const getThemeColors = () => {
  const root = document.documentElement
  const currentTheme = themeStore.currentTheme
  
  // Definir fallbacks baseados no tema atual
  const fallbacks = {
    light: {
      primary: '#00cc66',
      secondary: '#36a2eb',
      tertiary: '#ff6b6b',
      textPrimary: '#1a1a1a',
      textSecondary: '#666666',
      bgSecondary: '#ffffff'
    },
    dark: {
      primary: '#00ff88',
      secondary: '#36a2eb',
      tertiary: '#ff6b6b',
      textPrimary: '#ffffff',
      textSecondary: '#cccccc',
      bgSecondary: '#1a1a1a'
    },
    dracula: {
      primary: '#50fa7b',
      secondary: '#8be9fd',
      tertiary: '#ff79c6',
      textPrimary: '#f8f8f2',
      textSecondary: '#6272a4',
      bgSecondary: '#44475a'
    }
  }
  
  const themeFallbacks = fallbacks[currentTheme] || fallbacks.dark
  
  return {
    primary: getComputedStyle(root).getPropertyValue('--chart-primary').trim() || themeFallbacks.primary,
    secondary: getComputedStyle(root).getPropertyValue('--chart-secondary').trim() || themeFallbacks.secondary,
    tertiary: getComputedStyle(root).getPropertyValue('--chart-tertiary').trim() || themeFallbacks.tertiary,
    textPrimary: getComputedStyle(root).getPropertyValue('--text-primary').trim() || themeFallbacks.textPrimary,
    textSecondary: getComputedStyle(root).getPropertyValue('--text-secondary').trim() || themeFallbacks.textSecondary,
    bgSecondary: getComputedStyle(root).getPropertyValue('--bg-secondary').trim() || themeFallbacks.bgSecondary
  }
}

// Opções do gráfico
const chartOptions = computed(() => {
  const colors = getThemeColors()
  
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Processamento eSocial ao Longo do Tempo',
        color: colors.textPrimary,
        font: {
          size: 16,
          weight: 'bold' as const
        },
        padding: {
          top: 10,
          bottom: 30
        }
      },
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: colors.textPrimary,
          font: {
            size: 12
          },
          usePointStyle: true,
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: colors.bgSecondary,
        titleColor: colors.textPrimary,
        bodyColor: colors.textPrimary,
        borderColor: colors.primary,
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context: any) {
            const value = context.parsed.y
            return `${context.dataset.label}: ${value.toLocaleString('pt-BR')}`
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: colors.textSecondary.replace('rgb', 'rgba').replace(')', ', 0.1)'),
          drawBorder: false
        },
        ticks: {
          color: colors.textSecondary,
          font: {
            size: 11
          }
        }
      },
      y: {
        grid: {
          color: colors.textSecondary.replace('rgb', 'rgba').replace(')', ', 0.1)'),
          drawBorder: false
        },
        ticks: {
          color: colors.textSecondary,
          font: {
            size: 11
          },
          callback: function(value: any) {
            return value.toLocaleString('pt-BR')
          }
        },
        beginAtZero: true
      }
    },
    interaction: {
      intersect: false,
      mode: 'index' as const
    },
    elements: {
      line: {
        tension: 0.4
      },
      point: {
        hoverRadius: 8
      }
    }
  } as const
})

// Lifecycle
onMounted(() => {
  // Chart.js gerencia automaticamente a renderização
})
</script>

<style scoped>
.esocial-processing-container {
  min-height: 100vh;
  background: var(--bg-primary);
  padding: 0.5rem 1rem 1.5rem;
  user-select: none;
}

.form-container {
  max-width: 1400px;
  margin: 0 auto;
  background: var(--bg-secondary);
  border-radius: 8px;
  box-shadow: var(--shadow-xl);
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.esocial-form {
  padding: 1.5rem;
}

.form-section {
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 1.5rem;
}

.form-section:last-of-type {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1rem;
  user-select: none;
}

.section-icon {
  width: 20px;
  height: 20px;
  fill: var(--accent-primary);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  margin-bottom: 0.75rem;
  max-width: 100%;
  overflow: hidden;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-label {
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  font-size: 0.8rem;
  user-select: none;
}

.form-input {
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 0.85rem;
  transition: all 0.2s ease;
  background: var(--input-bg);
  color: var(--text-primary);
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px var(--accent-glow);
}

.form-input:disabled {
  background-color: var(--bg-primary);
  color: var(--text-muted);
  cursor: not-allowed;
}

.form-input::placeholder {
  color: var(--text-muted);
}

/* Busca */
.search-container {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  fill: var(--text-muted);
  pointer-events: none;
}

.search-input {
  padding-left: 2.5rem;
  padding: 0.5rem 0.5rem 0.5rem 2.5rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 0.85rem;
  transition: all 0.2s ease;
  background: var(--input-bg);
  color: var(--text-primary);
  width: 100%;
  box-sizing: border-box;
}

.search-input:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px var(--accent-glow);
}

/* Tabela */
.table-container {
  overflow-x: auto;
  margin: 1rem 0;
  border: 1px solid var(--border-color);
  border-radius: 6px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
}

.data-table th,
.data-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

.data-table th {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  font-weight: 600;
  position: sticky;
  top: 0;
  z-index: 10;
}

.data-table tr:hover {
  background: rgba(255, 255, 255, 0.03);
}

.checkbox-column {
  width: 40px;
  text-align: center;
}

/* Status badges */
.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
}

.status-pendente { background: #fef3c7; color: #92400e; }
.status-processando { background: #dbeafe; color: #1e40af; }
.status-enviado { background: #e0e7ff; color: #3730a3; }
.status-sucesso { background: #d1fae5; color: #065f46; }
.status-erro { background: #fee2e2; color: #991b1b; }
.status-critica { background: #fde2e7; color: #be185d; }

/* Estilos para linhas com status de processamento */
.row-processing {
  background-color: #f8f9fa !important;
  opacity: 0.8;
}

.row-success {
  background-color: #d4edda !important; /* Verde clarinho */
}

.row-critics {
  background-color: #e3f2fd !important; /* Azul bebê */
}

.row-error {
  background-color: #ffebee !important; /* Vermelho claro */
}

/* Coluna de loading oculta */
.loading-column {
  width: 0;
  padding: 0;
  border: none;
  overflow: hidden;
  opacity: 0;
  transition: all 0.3s ease;
}

.loading-column.visible {
  width: 100px;
  padding: 8px;
  opacity: 1;
  text-align: center;
  font-size: 12px;
  color: #666;
}

/* Estilos para filtro de status por radio buttons */
.status-filter-container {
  margin-right: 20px;
  width: 400px;
  flex-shrink: 0;
}

.radio-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 15px;
  align-items: center;
  max-width: 100%;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  font-size: 13px;
  color: #374151;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.radio-item input[type="radio"] {
  margin: 0;
  cursor: pointer;
}

.radio-item:hover {
  color: #1f2937;
}

.radio-item input[type="radio"]:checked + span {
  font-weight: 600;
  color: #2563eb;
}

/* Menu de contexto */
.context-menu {
  position: fixed;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 280px;
  padding: 8px 0;
}

.context-menu-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.context-menu-item {
  padding: 12px 20px;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid #f5f5f5;
}

.context-menu-item:last-child {
  border-bottom: none;
}

.context-menu-item:hover {
  background-color: #f8f9fa;
}

.context-menu-item.disabled {
  color: #999;
  cursor: not-allowed;
  opacity: 0.6;
}

.context-menu-item.disabled:hover {
  background-color: transparent;
}

/* Conteúdo das células com spinner */
.cell-content {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Loading spinner */
.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  flex-shrink: 0;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Ações */
.action-buttons {
  display: flex;
  gap: 0.25rem;
}

.btn-action {
  padding: 0.25rem;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.btn-action:hover {
  background: var(--bg-tertiary);
}

.btn-action svg {
  width: 16px;
  height: 16px;
  fill: var(--text-secondary);
}

/* Paginação */
.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
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
  gap: 1rem;
}

.page-info {
  font-size: 0.85rem;
  color: var(--text-primary);
}

/* Botões */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

/* Estilos para validação */
.form-input.error {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.error-message {
  display: block;
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  font-weight: 500;
}

/* Controles da tabela */
.table-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
}

.table-controls-left,
.table-controls-right {
  display: flex;
  align-items: center;
}

.items-per-page {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.control-label {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

.items-select {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background: white;
  min-width: 80px;
}

.items-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-container {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  width: 1rem;
  height: 1rem;
  color: #9ca3af;
  fill: currentColor;
}

.search-input {
  padding: 0.5rem 0.75rem 0.5rem 2.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  min-width: 250px;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-input::placeholder {
  color: #9ca3af;
}

.btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  user-select: none;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: var(--accent-primary);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--accent-primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-secondary {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--bg-hover);
}

.btn-icon {
  width: 16px;
  height: 16px;
  fill: currentColor;
}

/* Estilos para o botão de toggle dos filtros */
.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-title-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.toggle-filters-btn {
  background: none;
  border: none;
  padding: 0.25rem;
  border-radius: 4px;
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-filters-btn:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.toggle-icon {
  width: 20px;
  height: 20px;
  fill: currentColor;
  transition: transform 0.3s ease;
}

.toggle-icon.rotated {
  transform: rotate(-90deg);
}

/* Animação suave para o conteúdo dos filtros */
.filters-content {
  transition: all 0.3s ease;
  overflow: hidden;
}

.filters-content[style*="display: none"] {
  max-height: 0;
  opacity: 0;
}

.filters-content:not([style*="display: none"]) {
  max-height: 1000px;
  opacity: 1;
}

/* Estilos das Abas */
.tabs-container {
  margin-top: 1rem;
}

.tabs-navigation {
  display: flex;
  border-bottom: 2px solid var(--border-color);
  margin-bottom: 1.5rem;
  gap: 0.25rem;
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  color: var(--text-secondary);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 6px 6px 0 0;
}

.tab-button:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.tab-button.active {
  background: var(--bg-secondary);
  color: var(--accent-primary);
  border-bottom-color: var(--accent-primary);
}

.tab-icon {
  width: 18px;
  height: 18px;
  fill: currentColor;
}

.tabs-content {
  min-height: 400px;
}

.tab-panel {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Estilos do Visualizador XML */
.xml-viewer-container {
  background: var(--bg-secondary);
  border-radius: 8px;
  border: 1px solid var(--border-color);
  overflow: hidden;
}

.xml-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  color: white;
}

.xml-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.xml-icon {
  width: 24px;
  height: 24px;
  fill: currentColor;
}

.xml-info {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.xml-badge {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}

.xml-content {
  padding: 0;
  max-height: 600px;
  overflow: auto;
}

.xml-code {
  margin: 0;
  padding: 1.5rem;
  background: #1e1e1e;
  color: #d4d4d4;
  font-family: 'Fira Code', 'Consolas', 'Monaco', monospace;
  font-size: 0.875rem;
  line-height: 1.6;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.xml-code .xml-tag {
  color: #569cd6;
  font-weight: 500;
}

.xml-code .xml-attribute {
  color: #9cdcfe;
}

.xml-code .xml-comment {
  color: #6a9955;
  font-style: italic;
}

/* Estilos das Estatísticas */
.stats-container {
  background: var(--bg-secondary);
  border-radius: 8px;
  border: 1px solid var(--border-color);
  overflow: hidden;
}

.stats-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.stats-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0 0 1.5rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
}

.stats-icon {
  width: 24px;
  height: 24px;
  fill: var(--accent-primary);
}

.stats-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.stat-card {
  background: var(--bg-primary);
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  text-align: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.stat-card.success {
  border-color: #10b981;
  background: linear-gradient(135deg, #ecfdf5, #f0fdf4);
}

.stat-card.error {
  border-color: #ef4444;
  background: linear-gradient(135deg, #fef2f2, #fef2f2);
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.stat-card.success .stat-value {
  color: #059669;
}

.stat-card.error .stat-value {
  color: #dc2626;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.chart-container-large {
  position: relative;
  width: 100%;
  height: 400px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(0, 255, 136, 0.2);
  margin: 1rem 0;
}

/* Responsividade */
@media (max-width: 768px) {
  .esocial-processing-container {
    padding: 0.25rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  
  .form-actions {
    flex-direction: column;
    gap: 0.75rem;
  }

  .btn {
    width: 100%;
  }

  .table-container {
    overflow-x: auto;
  }

  .data-table {
    min-width: 800px;
  }
  
  .pagination-container {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .pagination-controls {
    justify-content: center;
  }

  .tabs-navigation {
    flex-direction: column;
  }

  .tab-button {
    justify-content: center;
  }

  .stats-summary {
    grid-template-columns: 1fr;
  }

  .chart-legend {
    flex-direction: column;
    gap: 1rem;
  }

  .xml-info {
    justify-content: center;
  }
  
  .table-container {
    font-size: 0.8rem;
  }
}
</style>