import { defineStore } from 'pinia'
import { ref, watch, computed } from 'vue'

/**
 * Tipos de tema disponíveis na aplicação
 */
export type ThemeType = 'light' | 'dark' | 'dracula'

/**
 * Store para gerenciamento de temas da aplicação
 * 
 * Fornece funcionalidades para alternar entre temas (light, dark, dracula),
 * persistir preferências do usuário e aplicar variáveis CSS dinamicamente.
 * Suporta detecção automática de preferência do sistema.
 * 
 * @example
 * ```typescript
 * const themeStore = useThemeStore()
 * themeStore.initTheme() // Inicializa com preferência salva ou do sistema
 * themeStore.setTheme('dark') // Define tema específico
 * themeStore.toggleTheme() // Alterna entre os temas disponíveis
 * ```
 * 
 * @since 1.0.0
 */
export const useThemeStore = defineStore('theme', () => {
  const currentTheme = ref<ThemeType>('dark')
  
  const themes = {
    light: {
      '--bg-primary': '#f8f9fa',
      '--bg-secondary': '#ffffff',
      '--bg-tertiary': '#f1f3f4',
      '--text-primary': '#1a1a1a',
      '--text-secondary': '#666666',
      '--text-muted': '#999999',
      '--border-color': '#e0e0e0',
      '--input-bg': '#ffffff',
      '--hover-bg': 'rgba(0, 0, 0, 0.05)',
      '--success-bg': 'rgba(34, 197, 94, 0.1)',
      '--accent-primary': '#00cc66',
      '--accent-hover': '#00b359',
      '--accent-glow': 'rgba(0, 204, 102, 0.3)',
      '--shadow-sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
      '--shadow-md': '0 4px 6px rgba(0, 0, 0, 0.1)',
      '--shadow-lg': '0 10px 15px rgba(0, 0, 0, 0.1)',
      '--chart-primary': '#00cc66',
      '--chart-secondary': '#36a2eb',
      '--chart-tertiary': '#ff6b6b'
    },
    dark: {
      '--bg-primary': '#000000',
      '--bg-secondary': '#1a1a1a',
      '--bg-tertiary': '#2a2a2a',
      '--text-primary': '#ffffff',
      '--text-secondary': '#cccccc',
      '--text-muted': '#888888',
      '--border-color': '#333333',
      '--input-bg': '#2a2a2a',
      '--hover-bg': 'rgba(255, 255, 255, 0.05)',
      '--success-bg': 'rgba(34, 197, 94, 0.15)',
      '--accent-primary': '#00ff7f',
      '--accent-hover': '#00cc66',
      '--accent-glow': 'rgba(0, 255, 127, 0.3)',
      '--shadow-sm': '0 2px 4px rgba(0, 0, 0, 0.3)',
      '--shadow-md': '0 4px 8px rgba(0, 0, 0, 0.4)',
      '--shadow-lg': '0 8px 16px rgba(0, 0, 0, 0.5)',
      '--chart-primary': '#00ff88',
      '--chart-secondary': '#36a2eb',
      '--chart-tertiary': '#ff6b6b'
    },
    dracula: {
      '--bg-primary': '#282a36',
      '--bg-secondary': '#44475a',
      '--bg-tertiary': '#6272a4',
      '--text-primary': '#f8f8f2',
      '--text-secondary': '#6272a4',
      '--text-muted': '#6272a4',
      '--border-color': '#6272a4',
      '--input-bg': '#44475a',
      '--hover-bg': 'rgba(98, 114, 164, 0.2)',
      '--success-bg': 'rgba(80, 250, 123, 0.15)',
      '--accent-primary': '#50fa7b',
      '--accent-hover': '#8be9fd',
      '--accent-glow': 'rgba(80, 250, 123, 0.3)',
      '--shadow-sm': '0 2px 4px rgba(0, 0, 0, 0.4)',
      '--shadow-md': '0 4px 8px rgba(0, 0, 0, 0.5)',
      '--shadow-lg': '0 8px 16px rgba(0, 0, 0, 0.6)',
      '--chart-primary': '#50fa7b',
      '--chart-secondary': '#8be9fd',
      '--chart-tertiary': '#ff79c6'
    }
  }
  
  /**
   * Inicializa o tema da aplicação
   * 
   * Verifica se existe uma preferência salva no localStorage,
   * caso contrário, usa a preferência do sistema operacional.
   * 
   * @since 1.0.0
   */
  const initTheme = () => {
    const savedTheme = localStorage.getItem('fahd-erp-theme') as ThemeType
    if (savedTheme && themes[savedTheme]) {
      currentTheme.value = savedTheme
    } else {
      currentTheme.value = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    applyTheme()
  }
  
  /**
   * Aplica as variáveis CSS do tema atual ao documento
   * 
   * Define as propriedades CSS customizadas no elemento raiz
   * para que sejam aplicadas em toda a aplicação.
   * 
   * @since 1.0.0
   */
  const applyTheme = () => {
    const root = document.documentElement
    const themeVars = themes[currentTheme.value]

    // Setar atributo para seletores baseados em data-theme (dark/dracula)
    root.setAttribute('data-theme', currentTheme.value)

    Object.entries(themeVars).forEach(([property, value]) => {
      root.style.setProperty(property, value)
    })
  }
  
  /**
   * Define um tema específico
   * 
   * @param theme - Tipo do tema a ser aplicado
   * 
   * @example
   * ```typescript
   * setTheme('dark') // Aplica o tema escuro
   * setTheme('light') // Aplica o tema claro
   * ```
   * 
   * @since 1.0.0
   */
  const setTheme = (theme: ThemeType) => {
    currentTheme.value = theme
    localStorage.setItem('fahd-erp-theme', theme)
    applyTheme()
  }
  
  /**
   * Alterna entre os temas disponíveis em sequência
   * 
   * Cicla entre light → dark → dracula → light...
   * 
   * @since 1.0.0
   */
  const toggleTheme = () => {
    const themes: ThemeType[] = ['light', 'dark', 'dracula']
    const currentIndex = themes.indexOf(currentTheme.value)
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex])
  }
  
  // Computed para compatibilidade
  const isDark = computed(() => currentTheme.value === 'dark')
  
  // Salvar preferência quando mudar
  watch(currentTheme, (newValue) => {
    localStorage.setItem('fahd-erp-theme', newValue)
    applyTheme()
  })
  
  return {
    currentTheme,
    isDark,
    initTheme,
    toggleTheme,
    setTheme,
    applyTheme,
    themes
  }
})