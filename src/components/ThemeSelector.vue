<template>
  <div class="theme-selector">
    <button 
      @click="toggleDropdown" 
      class="theme-button"
      :class="{ active: isOpen }"
    >
      <svg class="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="5"/>
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
      </svg>
      <span class="theme-text">{{ getThemeLabel(themeStore.currentTheme) }}</span>
      <svg class="dropdown-arrow" :class="{ rotated: isOpen }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6,9 12,15 18,9"/>
      </svg>
    </button>
    
    <div v-if="isOpen" class="theme-dropdown">
      <button 
        v-for="theme in availableThemes" 
        :key="theme.value"
        @click="selectTheme(theme.value)"
        class="theme-option"
        :class="{ selected: themeStore.currentTheme === theme.value }"
      >
        <div class="theme-preview" :style="getThemePreview(theme.value)"></div>
        <span>{{ theme.label }}</span>
        <svg v-if="themeStore.currentTheme === theme.value" class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20,6 9,17 4,12"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useThemeStore, type ThemeType } from '@/stores/theme'

const themeStore = useThemeStore()
const isOpen = ref(false)

const availableThemes = [
  { value: 'light' as ThemeType, label: 'Light' },
  { value: 'dark' as ThemeType, label: 'Dark' },
  { value: 'dracula' as ThemeType, label: 'Dracula VSCode' }
]

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const selectTheme = (theme: ThemeType) => {
  themeStore.setTheme(theme)
  isOpen.value = false
}

const getThemeLabel = (theme: ThemeType) => {
  return availableThemes.find(t => t.value === theme)?.label || 'Dark'
}

const getThemePreview = (theme: ThemeType) => {
  const themeVars = themeStore.themes[theme]
  return {
    background: `linear-gradient(45deg, ${themeVars['--bg-primary']}, ${themeVars['--bg-secondary']})`,
    border: `1px solid ${themeVars['--border-color']}`
  }
}

// Fechar dropdown ao clicar fora
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.theme-selector')) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.theme-selector {
  position: relative;
  display: inline-block;
}

.theme-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  min-width: 140px;
  user-select: none;
}

.theme-button:hover {
  background: var(--input-bg);
  border-color: var(--accent-primary);
}

.theme-button.active {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 2px var(--accent-glow);
}

.theme-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.theme-text {
  flex: 1;
  text-align: left;
  white-space: nowrap;
  user-select: none;
}

.dropdown-arrow {
  width: 14px;
  height: 14px;
  transition: transform 0.2s ease;
  flex-shrink: 0;
}

.dropdown-arrow.rotated {
  transform: rotate(180deg);
}

.theme-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  overflow: hidden;
}

.theme-option {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px;
  background: transparent;
  border: none;
  color: var(--text-primary);
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-size: 0.9rem;
  user-select: none;
}

.theme-option:hover {
  background: var(--input-bg);
}

.theme-option.selected {
  background: var(--accent-glow);
  color: var(--accent-primary);
}

.theme-preview {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  flex-shrink: 0;
}

.check-icon {
  width: 16px;
  height: 16px;
  color: var(--accent-primary);
  margin-left: auto;
}
</style>