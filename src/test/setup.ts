import { config } from '@vue/test-utils'
import { vi } from 'vitest'

// Configurações globais para os testes
config.global.stubs = {
  // Stub para componentes que podem causar problemas nos testes
  'router-link': true,
  'router-view': true
}

// Mock do localStorage para testes
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
})

// Mock do console para capturar logs nos testes
Object.defineProperty(window, 'console', {
  value: {
    log: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
  writable: true,
})