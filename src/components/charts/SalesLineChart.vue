<template>
  <div class="chart-container">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import { Line } from 'vue-chartjs'
import { computed } from 'vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { useThemeStore } from '@/stores/theme'

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface Props {
  title?: string
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Vendas dos Últimos 7 Dias',
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
      textPrimary: '#1a1a1a',
      textSecondary: '#666666',
      bgSecondary: '#ffffff'
    },
    dark: {
      primary: '#00ff88',
      secondary: '#36a2eb', 
      textPrimary: '#ffffff',
      textSecondary: '#cccccc',
      bgSecondary: '#1a1a1a'
    },
    dracula: {
      primary: '#50fa7b',
      secondary: '#8be9fd',
      textPrimary: '#f8f8f2',
      textSecondary: '#6272a4',
      bgSecondary: '#44475a'
    }
  }
  
  const themeFallbacks = fallbacks[currentTheme] || fallbacks.dark
  
  return {
    primary: getComputedStyle(root).getPropertyValue('--chart-primary').trim() || themeFallbacks.primary,
    secondary: getComputedStyle(root).getPropertyValue('--chart-secondary').trim() || themeFallbacks.secondary,
    textPrimary: getComputedStyle(root).getPropertyValue('--text-primary').trim() || themeFallbacks.textPrimary,
    textSecondary: getComputedStyle(root).getPropertyValue('--text-secondary').trim() || themeFallbacks.textSecondary,
    bgSecondary: getComputedStyle(root).getPropertyValue('--bg-secondary').trim() || themeFallbacks.bgSecondary
  }
}

// Dados mockados para demonstração
const chartData = computed(() => {
  const colors = getThemeColors()
  return {
    labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
    datasets: [
      {
        label: 'Vendas (R$)',
        data: [12500, 19300, 15800, 22100, 18900, 25600, 21400],
        borderColor: colors.primary,
        backgroundColor: colors.primary.replace('rgb', 'rgba').replace(')', ', 0.1)'),
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: colors.primary,
        pointBorderColor: colors.textPrimary,
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: colors.primary,
        pointHoverBorderColor: colors.textPrimary,
        pointHoverBorderWidth: 3
      },
      {
        label: 'Meta (R$)',
        data: [15000, 15000, 15000, 15000, 15000, 15000, 15000],
        borderColor: colors.secondary,
        backgroundColor: colors.secondary.replace('rgb', 'rgba').replace(')', ', 0.05)'),
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false,
        tension: 0,
        pointRadius: 0,
        pointHoverRadius: 0
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
        display: true,
        position: 'top' as const,
        labels: {
          color: colors.textPrimary,
          font: {
            size: 12
          },
          usePointStyle: true,
          padding: 20
        }
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
            return `${context.dataset.label}: R$ ${value.toLocaleString('pt-BR')}`
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: colors.textSecondary.replace('rgb', 'rgba').replace(')', ', 0.1)'),
          drawBorder: false
        },
        ticks: {
          color: colors.textSecondary,
          font: {
            size: 11
          }
        }
      },
      y: {
        grid: {
          color: colors.textSecondary.replace('rgb', 'rgba').replace(')', ', 0.1)'),
          drawBorder: false
        },
        ticks: {
          color: colors.textSecondary,
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
    },
    elements: {
      point: {
        hoverRadius: 8
      }
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