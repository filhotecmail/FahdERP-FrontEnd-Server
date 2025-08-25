import { config } from '@vue/test-utils'
import { vi } from 'vitest'

// Mock do useThemeStore - deve ser definido antes de qualquer importação
vi.mock('@/stores/theme', () => {
  const mockThemeStore = {
    currentTheme: 'light',
    toggleTheme: vi.fn(),
    setTheme: vi.fn(),
    themes: {
      light: {
        '--chart-primary': '#00cc66',
        '--chart-secondary': '#36a2eb',
        '--text-primary': '#1a1a1a'
      }
    }
  }
  
  return {
    useThemeStore: () => mockThemeStore
  }
})

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