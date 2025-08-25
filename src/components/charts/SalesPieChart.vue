<template>
  <div class="chart-container">
    <Doughnut :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import { Doughnut } from 'vue-chartjs'
import { computed } from 'vue'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'
import { useThemeStore } from '@/stores/theme'

// Registrar componentes do Chart.js
ChartJS.register(ArcElement, Tooltip, Legend)

interface Props {
  title?: string
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Distribuição de Vendas',
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
    '#9966ff'
  ]
  
  return {
    labels: ['Vendas Online', 'Loja Física', 'Marketplace', 'Atacado', 'Outros'],
    datasets: [
      {
        data: [35, 25, 20, 15, 5],
        backgroundColor: colorPalette,
        borderColor: colorPalette,
        borderWidth: 2,
        hoverOffset: 10,
        hoverBorderWidth: 3
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
          bottom: 20
        }
      },
      legend: {
        display: true,
        position: 'right' as const,
        labels: {
          color: colors.textPrimary,
          font: {
            size: 12
          },
          usePointStyle: true,
          padding: 15,
          generateLabels: function(chart: unknown) {
            const data = (chart as { data: { labels: string[]; datasets: Array<{ data: number[]; backgroundColor: string[]; borderColor: string[]; borderWidth: number }> } }).data
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label: string, i: number) => {
                const dataset = data.datasets[0]
                const value = dataset.data[i]
                const total = dataset.data.reduce((a: number, b: number) => a + b, 0)
                const percentage = ((value / total) * 100).toFixed(1)
                
                return {
                  text: `${label} (${percentage}%)`,
                  fillStyle: dataset.backgroundColor[i],
                  strokeStyle: dataset.borderColor[i],
                  lineWidth: dataset.borderWidth,
                  hidden: false,
                  index: i
                }
              })
            }
            return []
          }
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
           label: function(context: unknown) {
             const label = (context as { label: string; parsed: number; dataset: { data: number[] } }).label || ''
             const value = (context as { label: string; parsed: number; dataset: { data: number[] } }).parsed
             const total = (context as { label: string; parsed: number; dataset: { data: number[] } }).dataset.data.reduce((a: number, b: number) => a + b, 0)
             const percentage = ((value / total) * 100).toFixed(1)
             return `${label}: ${percentage}%`
           }
         }
       }
     },
     cutout: '60%',
     radius: '90%',
     animation: {
       animateRotate: true,
       animateScale: true
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
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>