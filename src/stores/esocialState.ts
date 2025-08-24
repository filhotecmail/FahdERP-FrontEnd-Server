import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'

// Tipos para os estados das diferentes abas
interface ProcessingFilters {
  cpf: string
  matricula: string
  status: string
  evento: string
  dataInicio: string
  dataFim: string
}

interface ProcessingState {
  filters: ProcessingFilters
  recordsPerPage: string
  searchFilter: string
  currentPage: number
  filtersExpanded: boolean
  selectedRecords: string[]
  activeTab: string
}

interface XmlEnvioState {
  filters: {
    protocolo: string
    status: string
    dataInicio: string
    dataFim: string
  }
  recordsPerPage: string
  searchFilter: string
  currentPage: number
  filtersExpanded: boolean
}

interface VisaoSumarizadaState {
  chartType: string
  dateRange: string
  groupBy: string
  filters: {
    evento: string
    status: string
    dataInicio: string
    dataFim: string
  }
}

interface S3000State {
  filters: {
    competencia: string
    status: string
    dataInicio: string
    dataFim: string
  }
  recordsPerPage: string
  searchFilter: string
  currentPage: number
  filtersExpanded: boolean
}

export const useESocialStateStore = defineStore('esocialState', () => {
  // Estado da aba Processamento
  const processingState = reactive<ProcessingState>({
    filters: {
      cpf: '',
      matricula: '',
      status: '',
      evento: '',
      dataInicio: '',
      dataFim: ''
    },
    recordsPerPage: '20',
    searchFilter: '',
    currentPage: 1,
    filtersExpanded: false,
    selectedRecords: [],
    activeTab: 'processamento'
  })

  // Estado da aba XML de Envio
  const xmlEnvioState = reactive<XmlEnvioState>({
    filters: {
      protocolo: '',
      status: '',
      dataInicio: '',
      dataFim: ''
    },
    recordsPerPage: '20',
    searchFilter: '',
    currentPage: 1,
    filtersExpanded: false
  })

  // Estado da aba Visão Sumarizada
  const visaoSumarizadaState = reactive<VisaoSumarizadaState>({
    chartType: 'line',
    dateRange: '30days',
    groupBy: 'status',
    filters: {
      evento: '',
      status: '',
      dataInicio: '',
      dataFim: ''
    }
  })

  // Estado da aba S3000
  const s3000State = reactive<S3000State>({
    filters: {
      competencia: '',
      status: '',
      dataInicio: '',
      dataFim: ''
    },
    recordsPerPage: '20',
    searchFilter: '',
    currentPage: 1,
    filtersExpanded: false
  })

  // Aba ativa atual
  const activeTab = ref('processamento')

  // Ações para gerenciar o estado do Processamento
  const updateProcessingFilters = (filters: Partial<ProcessingFilters>) => {
    Object.assign(processingState.filters, filters)
  }

  const updateProcessingPagination = (page: number, recordsPerPage: string) => {
    processingState.currentPage = page
    processingState.recordsPerPage = recordsPerPage
  }

  const updateProcessingSearch = (searchTerm: string) => {
    processingState.searchFilter = searchTerm
  }

  const toggleProcessingFilters = () => {
    processingState.filtersExpanded = !processingState.filtersExpanded
  }

  const updateSelectedRecords = (records: string[]) => {
    processingState.selectedRecords = records
  }

  const clearProcessingFilters = () => {
    processingState.filters = {
      cpf: '',
      matricula: '',
      status: '',
      evento: '',
      dataInicio: '',
      dataFim: ''
    }
    processingState.searchFilter = ''
    processingState.currentPage = 1
  }

  // Ações para gerenciar o estado do XML de Envio
  const updateXmlEnvioFilters = (filters: Partial<XmlEnvioState['filters']>) => {
    Object.assign(xmlEnvioState.filters, filters)
  }

  const updateXmlEnvioPagination = (page: number, recordsPerPage: string) => {
    xmlEnvioState.currentPage = page
    xmlEnvioState.recordsPerPage = recordsPerPage
  }

  const updateXmlEnvioSearch = (searchTerm: string) => {
    xmlEnvioState.searchFilter = searchTerm
  }

  const toggleXmlEnvioFilters = () => {
    xmlEnvioState.filtersExpanded = !xmlEnvioState.filtersExpanded
  }

  // Ações para gerenciar o estado da Visão Sumarizada
  const updateVisaoSumarizadaChart = (chartType: string, dateRange: string, groupBy: string) => {
    visaoSumarizadaState.chartType = chartType
    visaoSumarizadaState.dateRange = dateRange
    visaoSumarizadaState.groupBy = groupBy
  }

  const updateVisaoSumarizadaFilters = (filters: Partial<VisaoSumarizadaState['filters']>) => {
    Object.assign(visaoSumarizadaState.filters, filters)
  }

  // Ações para gerenciar o estado do S3000
  const updateS3000Filters = (filters: Partial<S3000State['filters']>) => {
    Object.assign(s3000State.filters, filters)
  }

  const updateS3000Pagination = (page: number, recordsPerPage: string) => {
    s3000State.currentPage = page
    s3000State.recordsPerPage = recordsPerPage
  }

  const updateS3000Search = (searchTerm: string) => {
    s3000State.searchFilter = searchTerm
  }

  const toggleS3000Filters = () => {
    s3000State.filtersExpanded = !s3000State.filtersExpanded
  }

  // Ação para mudar aba ativa
  const setActiveTab = (tab: string) => {
    activeTab.value = tab
  }

  // Função para resetar todos os estados (se necessário)
  const resetAllStates = () => {
    // Reset Processamento
    Object.assign(processingState, {
      filters: {
        cpf: '',
        matricula: '',
        status: '',
        evento: '',
        dataInicio: '',
        dataFim: ''
      },
      recordsPerPage: '20',
      searchFilter: '',
      currentPage: 1,
      filtersExpanded: false,
      selectedRecords: [],
      activeTab: 'processamento'
    })

    // Reset XML Envio
    Object.assign(xmlEnvioState, {
      filters: {
        protocolo: '',
        status: '',
        dataInicio: '',
        dataFim: ''
      },
      recordsPerPage: '20',
      searchFilter: '',
      currentPage: 1,
      filtersExpanded: false
    })

    // Reset Visão Sumarizada
    Object.assign(visaoSumarizadaState, {
      chartType: 'line',
      dateRange: '30days',
      groupBy: 'status',
      filters: {
        evento: '',
        status: '',
        dataInicio: '',
        dataFim: ''
      }
    })

    // Reset S3000
    Object.assign(s3000State, {
      filters: {
        competencia: '',
        status: '',
        dataInicio: '',
        dataFim: ''
      },
      recordsPerPage: '20',
      searchFilter: '',
      currentPage: 1,
      filtersExpanded: false
    })

    activeTab.value = 'processamento'
  }

  return {
    // Estados
    processingState,
    xmlEnvioState,
    visaoSumarizadaState,
    s3000State,
    activeTab,

    // Ações Processamento
    updateProcessingFilters,
    updateProcessingPagination,
    updateProcessingSearch,
    toggleProcessingFilters,
    updateSelectedRecords,
    clearProcessingFilters,

    // Ações XML Envio
    updateXmlEnvioFilters,
    updateXmlEnvioPagination,
    updateXmlEnvioSearch,
    toggleXmlEnvioFilters,

    // Ações Visão Sumarizada
    updateVisaoSumarizadaChart,
    updateVisaoSumarizadaFilters,

    // Ações S3000
    updateS3000Filters,
    updateS3000Pagination,
    updateS3000Search,
    toggleS3000Filters,

    // Ações Gerais
    setActiveTab,
    resetAllStates
  }
})