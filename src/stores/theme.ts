import { defineStore } from 'pinia'
import { ref, watch, computed } from 'vue'

export type ThemeType = 'light' | 'dark' | 'dracula'

export const useThemeStore = defineStore('theme', () => {
  const currentTheme = ref<ThemeType>('dark')
  
  const themes = {
    light: {
      '--bg-primary': '#f8f9fa',
      '--bg-secondary': '#ffffff',
      '--text-primary': '#1a1a1a',
      '--text-secondary': '#666666',
      '--text-muted': '#999999',
      '--border-color': '#e0e0e0',
      '--input-bg': '#ffffff',
      '--accent-primary': '#00cc66',
      '--accent-hover': '#00b359',
      '--accent-glow': 'rgba(0, 204, 102, 0.3)',
      '--chart-primary': '#00cc66',
      '--chart-secondary': '#36a2eb',
      '--chart-tertiary': '#ff6b6b'
    },
    dark: {
      '--bg-primary': '#000000',
      '--bg-secondary': '#1a1a1a',
      '--text-primary': '#ffffff',
      '--text-secondary': '#cccccc',
      '--text-muted': '#888888',
      '--border-color': '#333333',
      '--input-bg': '#2a2a2a',
      '--accent-primary': '#00ff7f',
      '--accent-hover': '#00cc66',
      '--accent-glow': 'rgba(0, 255, 127, 0.3)',
      '--chart-primary': '#00ff88',
      '--chart-secondary': '#36a2eb',
      '--chart-tertiary': '#ff6b6b'
    },
    dracula: {
      '--bg-primary': '#282a36',
      '--bg-secondary': '#44475a',
      '--text-primary': '#f8f8f2',
      '--text-secondary': '#6272a4',
      '--text-muted': '#6272a4',
      '--border-color': '#6272a4',
      '--input-bg': '#44475a',
      '--accent-primary': '#50fa7b',
      '--accent-hover': '#8be9fd',
      '--accent-glow': 'rgba(80, 250, 123, 0.3)',
      '--chart-primary': '#50fa7b',
      '--chart-secondary': '#8be9fd',
      '--chart-tertiary': '#ff79c6'
    }
  }
  
  // Verificar preferência salva ou preferência do sistema
  const initTheme = () => {
    const savedTheme = localStorage.getItem('fahd-erp-theme') as ThemeType
    if (savedTheme && themes[savedTheme]) {
      currentTheme.value = savedTheme
    } else {
      currentTheme.value = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    applyTheme()
  }
  
  // Aplicar tema ao documento
  const applyTheme = () => {
    const root = document.documentElement
    const themeVars = themes[currentTheme.value]
    
    Object.entries(themeVars).forEach(([property, value]) => {
      root.style.setProperty(property, value)
    })
  }
  
  // Definir tema específico
  const setTheme = (theme: ThemeType) => {
    currentTheme.value = theme
    localStorage.setItem('fahd-erp-theme', theme)
    applyTheme()
  }
  
  // Alternar tema (manter compatibilidade)
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