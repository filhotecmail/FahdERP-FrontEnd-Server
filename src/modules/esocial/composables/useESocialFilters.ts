import { computed, ref } from 'vue'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import type { ProcessingItem } from '../mock/esocialProcessingData'

// Schema de validação com Yup
const validationSchema = yup.object({
  cpf: yup.string()
    .default('')
    .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/, 'CPF deve ter formato válido'),
  matricula: yup.string()
    .default('')
    .min(1, 'Matrícula deve ter pelo menos 1 caractere'),
  status: yup.string().default(''),
  evento: yup.string().default(''),
  dataInicio: yup.string()
     .default('')
     .matches(/^\d{4}-\d{2}-\d{2}$/, 'Data de início deve ter formato válido (YYYY-MM-DD)'),
   dataFim: yup.string()
     .default('')
     .matches(/^\d{4}-\d{2}-\d{2}$/, 'Data fim deve ter formato válido (YYYY-MM-DD)')
     .test('data-posterior', 'Data fim deve ser posterior à data de início', function(value) {
       const { dataInicio } = this.parent
       if (!dataInicio || !value) return true
       return new Date(value) >= new Date(dataInicio)
     }),
  searchFilter: yup.string()
    .default('')
    .min(2, 'Busca deve ter pelo menos 2 caracteres')
})

export function useESocialFilters(mockData: ProcessingItem[]) {
  // Configuração do VeeValidate
  const { handleSubmit, resetForm, values } = useForm({
    validationSchema,
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

  // Campos do formulário com VeeValidate
  const { value: cpfFilter, errorMessage: cpfFilterError } = useField<string>('cpf')
  const { value: matriculaFilter, errorMessage: matriculaFilterError } = useField<string>('matricula')
  const { value: statusFilter, errorMessage: statusFilterError } = useField<string>('status')
  const { value: eventoFilter, errorMessage: eventoFilterError } = useField<string>('evento')
  const { value: dataInicioFilter, errorMessage: dataInicioFilterError } = useField<string>('dataInicio')
  const { value: dataFimFilter, errorMessage: dataFimFilterError } = useField<string>('dataFim')
  const { value: searchFilter, errorMessage: searchFilterError } = useField<string>('searchFilter')

  // Estados adicionais para filtros
  const statusFilterRadio = ref('all')
  const filtersExpanded = ref(true)

  // Função auxiliar para determinar o status visual baseado em protocolo e recibo
  const getItemVisualStatus = (item: ProcessingItem) => {
    // Verifica se o item foi processado via menu de contexto
    if ((item as ProcessingItem & { processingResult?: string }).processingResult) {
      return (item as ProcessingItem & { processingResult?: string }).processingResult
    }
    
    const hasProtocolo = item.nroProtocolo && item.nroProtocolo.trim() !== ''
    const hasRecibo = item.nroRecibo && item.nroRecibo.trim() !== ''
    
    if (hasRecibo && hasProtocolo) {
      return 'success' // Verde: com recibo e protocolo
    } else if (hasProtocolo && !hasRecibo) {
      return 'critics' // Azul: com protocolo mas sem recibo
    }
    
    return 'none' // Não pintado: sem recibo
  }

  // Dados computados com filtros aplicados
  const filteredData = computed(() => {
    let data = mockData
    
    // Usar valores do VeeValidate (sempre strings, sem [object Object])
    const cpfValue = String(cpfFilter.value || '').replace(/\D/g, '')
    const matriculaValue = String(matriculaFilter.value || '').toLowerCase()
    const statusValue = String(statusFilter.value || '')
    const eventoValue = String(eventoFilter.value || '')
    const searchValue = String(searchFilter.value || '').toLowerCase()
    
    if (cpfValue) {
      data = data.filter(item => item.cpf.replace(/\D/g, '').includes(cpfValue))
    }
    
    if (matriculaValue) {
      data = data.filter(item => item.matricula.toLowerCase().includes(matriculaValue))
    }
    
    if (statusValue) {
      data = data.filter(item => item.status === statusValue)
    }
    
    if (eventoValue) {
      data = data.filter(item => item.evento === eventoValue)
    }
    
    if (searchValue) {
      data = data.filter(item => 
        item.nome.toLowerCase().includes(searchValue) ||
        item.cpf.includes(searchValue) ||
        item.matricula.toLowerCase().includes(searchValue)
      )
    }
    
    // Filtro por status visual (radio buttons)
    if (statusFilterRadio.value !== 'all') {
      data = data.filter(item => {
        const visualStatus = getItemVisualStatus(item)
        return visualStatus === statusFilterRadio.value
      })
    }
    
    return data
  })

  // Função para formatar CPF durante a digitação
  const formatFilterCPF = (event: Event) => {
    const input = event.target as HTMLInputElement
    let value = input.value.replace(/\D/g, '')
    
    if (value.length <= 11) {
      value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
      cpfFilter.value = value
    }
  }

  // Função para aplicar filtros
  const applyFilters = handleSubmit((values) => {
    console.log('Filtros aplicados:', values)
  })

  // Função para limpar filtros
  const clearFilters = () => {
    resetForm()
    statusFilterRadio.value = 'all'
  }

  // Função para alternar expansão dos filtros
  const toggleFilters = () => {
    filtersExpanded.value = !filtersExpanded.value
  }

  return {
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
    getItemVisualStatus,
    
    // Form utilities
    handleSubmit,
    resetForm,
    values
  }
}