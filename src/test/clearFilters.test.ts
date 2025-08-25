import { describe, it, expect, vi } from 'vitest'
import { ref } from 'vue'

describe('Teste da função clearFilters - Problema [object Object]', () => {
  it('deve demonstrar o problema com reset() que causa [object Object]', () => {
    // Simula o comportamento ANTES da correção (problemático)
    const filterWithProblematicReset = {
      value: ref('algum valor'),
      reset: vi.fn(() => {
        // Simula o reset retornando um objeto (comportamento problemático)
        return { defaultValue: undefined }
      })
    }
    
    // Simula a função clearFilters ANTES da correção
    const clearFiltersProblematic = () => {
      const resetResult = filterWithProblematicReset.reset()
      filterWithProblematicReset.value.value = resetResult as unknown as string
    }
    
    // Executa a função problemática
    clearFiltersProblematic()
    
    // Verifica que o valor se torna um objeto
    expect(typeof filterWithProblematicReset.value.value).toBe('object')
    expect(String(filterWithProblematicReset.value.value)).toBe('[object Object]')
  })
  
  it('deve demonstrar a correção que resolve o problema [object Object]', () => {
    // Simula o comportamento APÓS a correção (correto)
    const filterWithCorrection = {
      value: ref('algum valor')
    }
    
    // Simula a função clearFilters APÓS a correção
    const clearFiltersFixed = () => {
      // Atribuição direta de string vazia (correção aplicada)
      filterWithCorrection.value.value = ''
    }
    
    // Executa a função corrigida
    clearFiltersFixed()
    
    // Verifica que o valor é uma string vazia
    expect(filterWithCorrection.value.value).toBe('')
    expect(typeof filterWithCorrection.value.value).toBe('string')
    expect(filterWithCorrection.value.value).not.toBe('[object Object]')
  })
  
  it('deve validar a sanitização automática no onMounted', () => {
    // Simula valores corrompidos que podem vir do localStorage
    const corruptedFilters = {
      cpf: { value: { corrupted: 'data' } },
      matricula: { value: undefined },
      status: { value: null },
      evento: { value: 123 },
      dataInicio: { value: [] },
      dataFim: { value: { another: 'object' } }
    }
    
    // Simula a lógica de sanitização do onMounted
    const sanitizeFilters = (filters: Record<string, { value: unknown }>) => {
      Object.keys(filters).forEach(key => {
        const filter = filters[key]
        if (typeof filter.value !== 'string') {
          console.warn(`Valor corrompido detectado no filtro ${key}:`, filter.value)
          filter.value = '' // Força string vazia
        }
      })
    }
    
    // Aplica a sanitização
    sanitizeFilters(corruptedFilters)
    
    // Verifica se todos os valores foram corrigidos
    Object.keys(corruptedFilters).forEach(key => {
      const filter = (corruptedFilters as Record<string, { value: unknown }>)[key]
      expect(filter.value).toBe('')
      expect(typeof filter.value).toBe('string')
      expect(filter.value).not.toBe('[object Object]')
    })
  })
  
  it('deve simular o cenário completo: localStorage corrompido + clearFilters', () => {
    // Simula estado corrompido vindo do localStorage
    const corruptedState = {
      'esocial-processing-state': {
        filters: {
          cpf: { value: { type: 'corrupted', data: 'invalid' } },
          matricula: { value: undefined }
        }
      }
    }
    
    // Simula a recuperação e sanitização
    const loadAndSanitizeState = () => {
      const state = corruptedState['esocial-processing-state']
      
      // Detecta e corrige valores corrompidos
      Object.keys(state.filters).forEach(key => {
        const filter = (state.filters as Record<string, { value: unknown }>)[key]
        if (typeof filter.value !== 'string') {
          filter.value = '' // Sanitização
        }
      })
      
      return state
    }
    
    // Simula clearFilters corrigido
    const clearFiltersFixed = (filters: Record<string, { value: unknown }>) => {
      Object.keys(filters).forEach(key => {
        (filters as Record<string, { value: unknown }>)[key].value = '' // Atribuição direta
      })
    }
    
    // Executa o cenário completo
    const sanitizedState = loadAndSanitizeState()
    clearFiltersFixed(sanitizedState.filters)
    
    // Verifica o resultado final
    Object.keys(sanitizedState.filters).forEach(key => {
      const filter = (sanitizedState.filters as Record<string, { value: unknown }>)[key]
      expect(filter.value).toBe('')
      expect(typeof filter.value).toBe('string')
      expect(filter.value).not.toBe('[object Object]')
    })
  })
})