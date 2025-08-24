// Script de depuração para o sistema de estado de formulários

// Função para limpar todos os dados de formulário do localStorage
export function clearAllFormData() {
  const keys = Object.keys(localStorage)
  const formKeys = keys.filter(key => key.startsWith('form_state_'))
  
  console.log('🧹 Limpando dados de formulário do localStorage...')
  console.log('Chaves encontradas:', formKeys)
  
  formKeys.forEach(key => {
    localStorage.removeItem(key)
    console.log(`✅ Removido: ${key}`)
  })
  
  console.log('✨ Limpeza concluída!')
}

// Função para inspecionar dados de formulário no localStorage
export function inspectFormData() {
  const keys = Object.keys(localStorage)
  const formKeys = keys.filter(key => key.startsWith('form_state_'))
  
  console.log('🔍 Inspecionando dados de formulário...')
  
  formKeys.forEach(key => {
    try {
      const data = localStorage.getItem(key)
      const parsed = JSON.parse(data || '{}')
      
      console.log(`📋 ${key}:`)
      console.log('  Campos:', Object.keys(parsed.form?.fields || {}))
      
      // Verificar se há objetos nos valores dos campos
      Object.entries(parsed.form?.fields || {}).forEach(([fieldName, field]: [string, any]) => {
        if (typeof field.value === 'object' && field.value !== null) {
          console.warn(`⚠️  Campo ${fieldName} contém objeto:`, field.value)
        }
      })
      
    } catch (error) {
      console.error(`❌ Erro ao analisar ${key}:`, error)
    }
  })
}

// Função para corrigir dados corrompidos
export function fixCorruptedFormData() {
  const keys = Object.keys(localStorage)
  const formKeys = keys.filter(key => key.startsWith('form_state_'))
  
  console.log('🔧 Corrigindo dados corrompidos...')
  
  formKeys.forEach(key => {
    try {
      const data = localStorage.getItem(key)
      const parsed = JSON.parse(data || '{}')
      
      let hasChanges = false
      
      // Corrigir campos com objetos
      Object.entries(parsed.form?.fields || {}).forEach(([fieldName, field]: [string, any]) => {
        if (typeof field.value === 'object' && field.value !== null) {
          console.log(`🔧 Corrigindo campo ${fieldName} em ${key}`)
          field.value = '' // Resetar para string vazia
          hasChanges = true
        }
      })
      
      if (hasChanges) {
        localStorage.setItem(key, JSON.stringify(parsed))
        console.log(`✅ Corrigido: ${key}`)
      }
      
    } catch (error) {
      console.error(`❌ Erro ao corrigir ${key}:`, error)
      // Se não conseguir corrigir, remove o item
      localStorage.removeItem(key)
      console.log(`🗑️  Removido item corrompido: ${key}`)
    }
  })
  
  console.log('✨ Correção concluída!')
}

// Função para adicionar ao console global (para uso no DevTools)
export function addToGlobalConsole() {
  if (typeof window !== 'undefined') {
    (window as any).debugFormState = {
      clear: clearAllFormData,
      inspect: inspectFormData,
      fix: fixCorruptedFormData
    }
    
    console.log('🛠️  Ferramentas de debug adicionadas ao console:')
    console.log('  - debugFormState.clear() - Limpar todos os dados')
    console.log('  - debugFormState.inspect() - Inspecionar dados')
    console.log('  - debugFormState.fix() - Corrigir dados corrompidos')
  }
}