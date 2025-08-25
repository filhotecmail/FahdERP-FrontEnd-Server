import { ref } from 'vue'
import Swal from 'sweetalert2'
import type { ProcessingItem } from '../mock/esocialProcessingData'

export function useESocialProcessing(mockData: ProcessingItem[]) {
  // Estados para seleção e processamento
  const selectedItems = ref<string[]>([])
  const processingItems = ref<string[]>([])
  
  // Estados para menu de contexto
  const contextMenuVisible = ref(false)
  const contextMenuX = ref(0)
  const contextMenuY = ref(0)

  // Função para alternar seleção de todos os itens
  const toggleSelectAll = (event: Event, paginatedData: ProcessingItem[]) => {
    const target = event.target as HTMLInputElement
    if (target.checked) {
      selectedItems.value = paginatedData.map(item => item.id)
    } else {
      selectedItems.value = []
    }
  }

  // Funções do menu de contexto
  const showContextMenu = (event: MouseEvent) => {
    event.preventDefault()
    contextMenuX.value = event.clientX
    contextMenuY.value = event.clientY
    contextMenuVisible.value = true
  }

  const hideContextMenu = () => {
    contextMenuVisible.value = false
  }

  const selectAllItems = (paginatedData: ProcessingItem[]) => {
    selectedItems.value = paginatedData.map(item => item.id)
    hideContextMenu()
  }

  const deselectAllItems = () => {
    selectedItems.value = []
    hideContextMenu()
  }

  // Função para simular processamento
  const simulateProcessing = async (itemIds: string[]) => {
    const processedItems: {[key: string]: string} = {}
    
    for (const itemId of itemIds) {
      // Adiciona o item à lista de processamento
      processingItems.value.push(itemId)
      
      // Simula tempo de processamento (1-3 segundos)
      const processingTime = Math.random() * 2000 + 1000
      await new Promise(resolve => setTimeout(resolve, processingTime))
      
      // Remove o item da lista de processamento
      processingItems.value = processingItems.value.filter(id => id !== itemId)
      
      // Simula resultado aleatório
      const outcomes = ['success', 'critics', 'error']
      const outcome = outcomes[Math.floor(Math.random() * outcomes.length)]
      processedItems[itemId] = outcome
      
      // Atualiza a classe da linha
      const itemIndex = mockData.findIndex(item => item.id === itemId)
      if (itemIndex !== -1) {
        // Adiciona uma propriedade temporária para controlar a cor da linha
        (mockData[itemIndex] as ProcessingItem & { processingResult?: string }).processingResult = outcome
      }
    }
    
    // Mostra resultado final
    const successCount = Object.values(processedItems).filter(result => result === 'success').length
    const criticsCount = Object.values(processedItems).filter(result => result === 'critics').length
    const errorCount = Object.values(processedItems).filter(result => result === 'error').length
    
    let message = `Operação concluída:\n`
    if (successCount > 0) message += `✅ ${successCount} processado(s) com sucesso\n`
    if (criticsCount > 0) message += `⚠️ ${criticsCount} com críticas\n`
    if (errorCount > 0) message += `❌ ${errorCount} com erro(s)`
    
    await Swal.fire({
      title: 'Processamento Concluído',
      text: message,
      icon: errorCount > 0 ? 'warning' : 'success',
      confirmButtonText: 'OK'
    })
    
    // Limpa seleção
    selectedItems.value = []
  }

  // Funções de processamento em lote
  const processSelectedItems = async () => {
    if (selectedItems.value.length === 0) return
    hideContextMenu()
    
    const result = await Swal.fire({
      title: 'Processar Registros',
      text: `Deseja processar ${selectedItems.value.length} registro(s) selecionado(s)?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      confirmButtonColor: '#007bff',
      cancelButtonColor: '#6c757d'
    })
    
    if (result.isConfirmed) {
      await simulateProcessing(selectedItems.value)
    }
  }

  const retifySelectedItems = async () => {
    if (selectedItems.value.length === 0) return
    hideContextMenu()
    
    const result = await Swal.fire({
      title: 'Retificar Registros',
      text: `Deseja retificar ${selectedItems.value.length} registro(s) selecionado(s)?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      confirmButtonColor: '#007bff',
      cancelButtonColor: '#6c757d'
    })
    
    if (result.isConfirmed) {
      await simulateProcessing(selectedItems.value)
    }
  }

  const deleteSelectedItems = async () => {
    if (selectedItems.value.length === 0) return
    hideContextMenu()
    
    const result = await Swal.fire({
      title: 'Enviar Evento S3000',
      text: `Deseja enviar evento S3000 para ${selectedItems.value.length} registro(s) selecionado(s)?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d'
    })
    
    if (result.isConfirmed) {
      await simulateProcessing(selectedItems.value)
    }
  }

  // Funções utilitárias
  const processSelectedData = () => {
    if (selectedItems.value.length === 0) return
    alert(`Processando ${selectedItems.value.length} itens selecionados`)
  }

  const generateCriticsReport = () => {
    alert('Gerando relatório de críticas...')
  }



  const retifyData = (item: ProcessingItem) => {
    alert(`Retificando dados do item ${item.id}`)
  }

  const processItem = (item: ProcessingItem) => {
    alert(`Processando item ${item.id}`)
  }

  const canRetify = (status: string) => {
    return ['erro', 'critica'].includes(status)
  }

  const canProcess = (status: string) => {
    return ['pendente', 'erro'].includes(status)
  }

  // Função para obter classe de processamento da linha
  const getRowProcessingClass = (itemId: string) => {
    if (processingItems.value.includes(itemId)) {
      return 'row-processing'
    }
    
    const item = mockData.find(item => item.id === itemId)
    if (item && (item as ProcessingItem & { processingResult?: string }).processingResult) {
      const result = (item as ProcessingItem & { processingResult?: string }).processingResult
      switch (result) {
        case 'success':
          return 'row-success'
        case 'critics':
          return 'row-critics'
        case 'error':
          return 'row-error'
        default:
          return ''
      }
    }
    
    // Lógica original baseada em protocolo e recibo
    if (item) {
      const hasProtocolo = item.nroProtocolo && item.nroProtocolo.trim() !== ''
      const hasRecibo = item.nroRecibo && item.nroRecibo.trim() !== ''
      
      if (hasRecibo && hasProtocolo) {
        return 'row-success' // Verde: com recibo e protocolo
      } else if (hasProtocolo && !hasRecibo) {
        return 'row-critics' // Azul: com protocolo mas sem recibo
      }
      // Não pintado: sem recibo (independente do protocolo)
    }
    
    return ''
  }

  // Funções de formatação
  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('pt-BR')
  }

  const formatCPFDisplay = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pendente: 'Pendente',
      processando: 'Processando',
      enviado: 'Enviado',
      sucesso: 'Sucesso',
      erro: 'Erro',
      critica: 'Crítica'
    }
    return labels[status] || status
  }

  return {
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
    simulateProcessing,
    
    // Funções utilitárias
    processSelectedData,
    generateCriticsReport,
    retifyData,
    processItem,
    canRetify,
    canProcess,
    
    // Funções de formatação e estilo
    getRowProcessingClass,
    formatDateTime,
    formatCPFDisplay,
    getStatusLabel
  }
}