<template>
  <div class="chart-container">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import { computed } from 'vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { useThemeStore } from '@/stores/theme'

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface Props {
  title?: string
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Vendas por Categoria',
  height: 300
})

const themeStore = useThemeStore()

// Função para obter cores do tema atual
const getThemeColors = () => {
  const root = document.documentElement
  const currentTheme = themeStore.currentTheme
  
  // Definir fallbacks baseados no tema atual
  const fallbacks = {
    light: {
      primary: '#00cc66',
      secondary: '#36a2eb',
      tertiary: '#ff6b6b',
      textPrimary: '#1a1a1a',
      textSecondary: '#666666',
      bgSecondary: '#ffffff'
    },
    dark: {
      primary: '#00ff88',
      secondary: '#36a2eb',
      tertiary: '#ff6b6b',
      textPrimary: '#ffffff',
      textSecondary: '#cccccc',
      bgSecondary: '#1a1a1a'
    },
    dracula: {
      primary: '#50fa7b',
      secondary: '#8be9fd',
      tertiary: '#ff79c6',
      textPrimary: '#f8f8f2',
      textSecondary: '#6272a4',
      bgSecondary: '#44475a'
    }
  }
  
  const themeFallbacks = fallbacks[currentTheme] || fallbacks.dark
  
  return {
    primary: getComputedStyle(root).getPropertyValue('--chart-primary').trim() || themeFallbacks.primary,
    secondary: getComputedStyle(root).getPropertyValue('--chart-secondary').trim() || themeFallbacks.secondary,
    tertiary: getComputedStyle(root).getPropertyValue('--chart-tertiary').trim() || themeFallbacks.tertiary,
    textPrimary: getComputedStyle(root).getPropertyValue('--text-primary').trim() || themeFallbacks.textPrimary,
    textSecondary: getComputedStyle(root).getPropertyValue('--text-secondary').trim() || themeFallbacks.textSecondary,
    bgSecondary: getComputedStyle(root).getPropertyValue('--bg-secondary').trim() || themeFallbacks.bgSecondary
  }
}

// Dados mockados para demonstração
const chartData = computed(() => {
  const colors = getThemeColors()
  const colorPalette = [
    colors.primary,
    colors.tertiary,
    colors.secondary,
    '#ffce56',
    '#9966ff',
    '#ff9f40'
  ]
  
  return {
    labels: ['Eletrônicos', 'Roupas', 'Casa & Jardim', 'Esportes', 'Livros', 'Beleza'],
    datasets: [
      {
        label: 'Vendas (R$)',
        data: [45600, 32400, 28900, 19800, 15200, 22100],
        backgroundColor: colorPalette.map(color => color.replace('rgb', 'rgba').replace(')', ', 0.8)')),
        borderColor: colorPalette,
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
        hoverBackgroundColor: colorPalette
      }
    ]
  }
})

const chartOptions = computed(() => {
  const colors = getThemeColors()
  
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: props.title,
        color: colors.textPrimary,
        font: {
          size: 16,
          weight: 'bold' as const
        },
        padding: {
          top: 10,
          bottom: 30
        }
      },
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: colors.bgSecondary,
        titleColor: colors.textPrimary,
        bodyColor: colors.textPrimary,
        borderColor: colors.primary,
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context: any) {
            const value = context.parsed.y
            return `Vendas: R$ ${value.toLocaleString('pt-BR')}`
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: colors.textPrimary,
          font: {
            size: 11
          },
          maxRotation: 45,
          minRotation: 0
        }
      },
      y: {
        grid: {
          color: colors.textSecondary.replace('rgb', 'rgba').replace(')', ', 0.1)'),
          drawBorder: false
        },
        ticks: {
          color: colors.textPrimary,
          font: {
            size: 11
          },
          callback: function(value: any) {
            return 'R$ ' + value.toLocaleString('pt-BR')
          }
        },
        beginAtZero: true
      }
    },
    interaction: {
      intersect: false,
      mode: 'index' as const
    }
  } as const
})
</script>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: 300px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(0, 255, 136, 0.2);
}
</style>