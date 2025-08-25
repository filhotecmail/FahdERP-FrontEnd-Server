import { useForm, useField } from 'vee-validate'
import { object, string } from 'yup'
import { computed, ref, watch } from 'vue'

// Schema de validação para os filtros do eSocial
const esocialFilterSchema = object({
  cpf: string().default('').ensure(),
  matricula: string().default('').ensure(),
  status: string().default('').ensure(),
  evento: string().default('').ensure(),
  dataInicio: string().default('').ensure(),
  dataFim: string().default('').ensure(),
  searchFilter: string().default('').ensure()
})

export function useESocialForm() {
  // Configuração do formulário com VeeValidate
  const { handleSubmit, resetForm, setValues, values } = useForm({
    validationSchema: esocialFilterSchema,
    initialValues: {
      cpf: '',
      matricula: '',
      status: '',
      evento: '',
      dataInicio: '',
      dataFim: '',
      searchFilter: ''
    }
  })

  // Campos individuais com validação automática
  const cpfField = useField<string>('cpf')
  const matriculaField = useField<string>('matricula')
  const statusField = useField<string>('status')
  const eventoField = useField<string>('evento')
  const dataInicioField = useField<string>('dataInicio')
  const dataFimField = useField<string>('dataFim')
  const searchFilterField = useField<string>('searchFilter')

  // Estados para paginação e seleção
  const selectedItems = ref<string[]>([])
  const currentPage = ref(1)
  const itemsPerPage = ref(10)

  // Dados mockados para demonstração
  const mockData = ref([
    {
      id: '1',
      cpf: '123.456.789-00',
      matricula: 'MAT001',
      nome: 'João Silva',
      status: 'sucesso' as const,
      evento: 'S-2200',
      dataProcessamento: '2024-01-15'
    },
    {
      id: '2',
      cpf: '987.654.321-00',
      matricula: 'MAT002',
      nome: 'Maria Santos',
      status: 'pendente' as const,
      evento: 'S-2300',
      dataProcessamento: '2024-01-16'
    }
  ])

  // Dados filtrados com validação de tipos
  const filteredData = computed(() => {
    const filters = values
    
    return mockData.value.filter(item => {
      // Garante que todos os valores de filtro são strings
      const cpfFilter = String(filters.cpf || '').trim()
      const matriculaFilter = String(filters.matricula || '').trim()
      const statusFilter = String(filters.status || '').trim()
      const eventoFilter = String(filters.evento || '').trim()
      const searchFilter = String(filters.searchFilter || '').trim()
      
      // Aplica os filtros apenas se não estiverem vazios
      if (cpfFilter && !item.cpf.includes(cpfFilter)) return false
      if (matriculaFilter && !item.matricula.includes(matriculaFilter)) return false
      if (statusFilter && item.status !== statusFilter) return false
      if (eventoFilter && item.evento !== eventoFilter) return false
      if (searchFilter) {
        const searchText = searchFilter.toLowerCase()
        const searchableText = `${item.nome} ${item.cpf} ${item.matricula}`.toLowerCase()
        if (!searchableText.includes(searchText)) return false
      }
      
      return true
    })
  })

  // Dados paginados
  const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filteredData.value.slice(start, end)
  })

  // Total de itens para paginação
  const totalItems = computed(() => filteredData.value.length)

  // Função para limpar filtros (sem risco de [object Object])
  const clearFilters = () => {
    resetForm({
      values: {
        cpf: '',
        matricula: '',
        status: '',
        evento: '',
        dataInicio: '',
        dataFim: '',
        searchFilter: ''
      }
    })
    selectedItems.value = []
  }

  // Função para salvar estado no localStorage com sanitização
  const saveState = () => {
    try {
      const state = {
        filters: {
          cpf: String(values.cpf || ''),
          matricula: String(values.matricula || ''),
          status: String(values.status || ''),
          evento: String(values.evento || ''),
          dataInicio: String(values.dataInicio || ''),
          dataFim: String(values.dataFim || ''),
          searchFilter: String(values.searchFilter || '')
        },
        selectedItems: selectedItems.value,
        currentPage: currentPage.value,
        itemsPerPage: itemsPerPage.value
      }
      localStorage.setItem('esocial-processing-state', JSON.stringify(state))
    } catch (error) {
      console.warn('Erro ao salvar estado:', error)
    }
  }

  // Função para carregar estado do localStorage com sanitização robusta
  const loadState = () => {
    try {
      const savedState = localStorage.getItem('esocial-processing-state')
      if (savedState) {
        const state = JSON.parse(savedState)
        
        // Sanitiza e valida cada campo antes de aplicar
        const sanitizedValues = {
          cpf: typeof state.filters?.cpf === 'string' ? state.filters.cpf : '',
          matricula: typeof state.filters?.matricula === 'string' ? state.filters.matricula : '',
          status: typeof state.filters?.status === 'string' ? state.filters.status : '',
          evento: typeof state.filters?.evento === 'string' ? state.filters.evento : '',
          dataInicio: typeof state.filters?.dataInicio === 'string' ? state.filters.dataInicio : '',
          dataFim: typeof state.filters?.dataFim === 'string' ? state.filters.dataFim : '',
          searchFilter: typeof state.filters?.searchFilter === 'string' ? state.filters.searchFilter : ''
        }
        
        // Aplica os valores sanitizados
        setValues(sanitizedValues)
        
        // Restaura outros estados
        if (Array.isArray(state.selectedItems)) {
          selectedItems.value = state.selectedItems
        }
        if (typeof state.currentPage === 'number' && state.currentPage > 0) {
          currentPage.value = state.currentPage
        }
        if (typeof state.itemsPerPage === 'number' && state.itemsPerPage > 0) {
          itemsPerPage.value = state.itemsPerPage
        }
      }
    } catch (error) {
      console.warn('Erro ao carregar estado, usando valores padrão:', error)
      // Em caso de erro, limpa o localStorage corrompido
      localStorage.removeItem('esocial-processing-state')
    }
  }

  // Auto-save quando os valores mudam
  watch(values, saveState, { deep: true })
  watch([selectedItems, currentPage, itemsPerPage], saveState, { deep: true })

  return {
    // Campos do formulário
    filters: {
      cpf: cpfField,
      matricula: matriculaField,
      status: statusField,
      evento: eventoField,
      dataInicio: dataInicioField,
      dataFim: dataFimField,
      searchFilter: searchFilterField
    },
    
    // Estados
    selectedItems,
    currentPage,
    itemsPerPage,
    
    // Dados computados
    filteredData,
    paginatedData,
    totalItems,
    
    // Funções
    clearFilters,
    saveState,
    loadState,
    handleSubmit,
    resetForm,
    setValues,
    
    // Valores do formulário (sempre strings válidas)
    values
  }
}