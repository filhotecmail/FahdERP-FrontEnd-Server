<template>
  <div v-if="hasGeolocationPermission && (weatherData || loading)" class="weather-widget" ref="weatherWidget">
    <!-- Ícone compacto na navbar -->
    <div 
      class="weather-icon" 
      @click="toggleDropdown"
      :class="{ 'loading': loading }"
    >
      <div v-if="loading" class="loading-spinner">
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" stroke-dasharray="31.416" stroke-dashoffset="31.416">
            <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
            <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
          </circle>
        </svg>
      </div>
      
      <div v-else-if="weatherData" class="weather-display">
        <span class="weather-emoji">{{ getWeatherIcon(weatherData.current.condition.text) }}</span>
        <span class="temperature">{{ formatTemperature(weatherData.current.temp_c) }}</span>
      </div>
    </div>

    <!-- Dropdown com informações detalhadas -->
    <div v-if="showDropdown" class="weather-dropdown" @click.stop>
      <div class="weather-card">
        <div v-if="loading" class="loading-state">
          <i class="fas fa-spinner fa-spin"></i>
          <p>Carregando dados meteorológicos...</p>
        </div>
        
        <div v-else-if="error" class="error-state">
          <i class="fas fa-exclamation-triangle"></i>
          <p>{{ error }}</p>
          <button @click="fetchWeatherData" class="retry-btn">
            <i class="fas fa-redo"></i> Tentar novamente
          </button>
        </div>

        <div v-else-if="weatherData" class="weather-content">
          <!-- Header com localização -->
          <div class="weather-header">
            <h3>{{ weatherData.location.name }}</h3>
            <p class="location-details">
              {{ weatherData.location.region }}, {{ weatherData.location.country }}
            </p>
            <p class="last-updated">
              Atualizado: {{ formatTime(weatherData.current.last_updated) }}
            </p>
          </div>

          <!-- Temperatura atual e condição -->
          <div class="current-weather">
            <div class="temp-section">
              <img 
                :src="weatherData.current.condition.icon" 
                :alt="weatherData.current.condition.text"
                class="condition-icon"
              />
              <div class="temp-info">
                <span class="current-temp">{{ formatTemperature(weatherData.current.temp_c) }}</span>
                <span class="feels-like">Sensação: {{ formatTemperature(weatherData.current.feelslike_c) }}</span>
                <span class="condition-text">{{ weatherData.current.condition.text }}</span>
              </div>
            </div>
          </div>

          <!-- Detalhes meteorológicos -->
          <div class="weather-details">
            <div class="detail-row">
              <div class="detail-item">
                <i class="fas fa-eye"></i>
                <span class="label">Visibilidade</span>
                <span class="value">{{ weatherData.current.vis_km }} km</span>
              </div>
              <div class="detail-item">
                <i class="fas fa-tint"></i>
                <span class="label">Umidade</span>
                <span class="value">{{ weatherData.current.humidity }}%</span>
              </div>
            </div>
            <div class="detail-row">
              <div class="detail-item">
                <i class="fas fa-wind"></i>
                <span class="label">Vento</span>
                <span class="value">{{ weatherData.current.wind_kph }} km/h {{ weatherData.current.wind_dir }}</span>
              </div>
              <div class="detail-item">
                <i class="fas fa-thermometer-half"></i>
                <span class="label">Pressão</span>
                <span class="value">{{ weatherData.current.pressure_mb }} mb</span>
              </div>
            </div>
            <div class="detail-row">
              <div class="detail-item">
                <i class="fas fa-sun"></i>
                <span class="label">Índice UV</span>
                <span class="value">{{ weatherData.current.uv }}</span>
              </div>
              <div class="detail-item">
                <i class="fas fa-cloud"></i>
                <span class="label">Nuvens</span>
                <span class="value">{{ weatherData.current.cloud }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useToast } from 'vue-toastification'
import { 
  weatherConfig, 
  formatTemperature,
  getUserLocation,
  getWeatherFromGemini,
  getWeatherIcon
} from '../config/weather'

const toast = useToast()

const weatherWidget = ref(null)
const showDropdown = ref(false)
const weatherData = ref(null)
const loading = ref(false)
const error = ref(null)
const updateInterval = ref(null)
const hasGeolocationPermission = ref(false)

// A função getUserLocation já está importada do weather.ts

// Função para verificar permissão de geolocalização
const checkGeolocationPermission = async () => {
  try {
    if (!navigator.geolocation) {
      hasGeolocationPermission.value = false
      return false
    }
    
    // Verificar se já temos permissão
    const permission = await navigator.permissions.query({ name: 'geolocation' })
    
    if (permission.state === 'granted') {
      hasGeolocationPermission.value = true
      return true
    } else if (permission.state === 'denied') {
      hasGeolocationPermission.value = false
      return false
    }
    
    // Se for 'prompt', tentar obter localização para solicitar permissão
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        () => {
          hasGeolocationPermission.value = true
          resolve(true)
        },
        () => {
          hasGeolocationPermission.value = false
          resolve(false)
        },
        { timeout: 5000 }
      )
    })
  } catch (err) {
    hasGeolocationPermission.value = false
    return false
  }
}

// Função para buscar dados meteorológicos usando apenas Gemini AI
const fetchWeatherData = async () => {
  if (loading.value) return
  
  // Verificar permissão de geolocalização primeiro
  const hasPermission = await checkGeolocationPermission()
  if (!hasPermission) {
    console.log('Permissão de geolocalização negada - sistema de clima desabilitado')
    return
  }
  
  loading.value = true
  error.value = null
  
  try {
    // Solicitar permissão de geolocalização
    const coords = await getUserLocation()
    
    // Buscar dados meteorológicos via Gemini AI
    const data = await getWeatherFromGemini(coords.lat, coords.lon)
    weatherData.value = data
    
    console.log('Dados meteorológicos obtidos via Gemini AI:', data)
    
  } catch (err) {
    // Tratamento silencioso de erros - não exibir toasts nem travar a aplicação
    console.warn('Sistema de clima indisponível:', err)
    error.value = 'Sistema de clima temporariamente indisponível'
    weatherData.value = null
  } finally {
    loading.value = false
  }
}

// Funções removidas - usando apenas getWeatherFromGemini

// Função para alternar dropdown
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

// Função para fechar dropdown ao clicar fora
const handleClickOutside = (event) => {
  if (weatherWidget.value && !weatherWidget.value.contains(event.target)) {
    showDropdown.value = false
  }
}

// Função para formatar horário
const formatTime = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Inicializar atualização automática
const startAutoUpdate = async () => {
  // Verificar permissão de geolocalização primeiro
  const hasPermission = await checkGeolocationPermission()
  if (!hasPermission) {
    console.log('Sistema de clima não iniciado - permissão de geolocalização necessária')
    return
  }
  
  // Buscar dados imediatamente
  fetchWeatherData()
  
  // Configurar atualização automática
  updateInterval.value = setInterval(() => {
    fetchWeatherData()
  }, weatherConfig.updateInterval)
}

// Parar atualização automática
const stopAutoUpdate = () => {
  if (updateInterval.value) {
    clearInterval(updateInterval.value)
    updateInterval.value = null
  }
}

onMounted(() => {
  startAutoUpdate()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  stopAutoUpdate()
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.weather-widget {
  position: relative;
  display: inline-block;
}

.weather-icon {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  min-width: 80px;
  justify-content: center;
}

.weather-icon:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.weather-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.weather-emoji {
  font-size: 1.2rem;
  line-height: 1;
}

.temperature {
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.loading-spinner {
  width: 20px;
  height: 20px;
  color: white;
}

.loading-spinner svg {
  width: 100%;
  height: 100%;
}

.weather-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  z-index: 1001;
  min-width: 320px;
  max-width: 400px;
}

.weather-card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.loading-state,
.error-state {
  padding: 24px;
  text-align: center;
  color: #666;
}

.loading-state i {
  font-size: 24px;
  color: #007bff;
  margin-bottom: 12px;
}

.error-state i {
  font-size: 24px;
  color: #dc3545;
  margin-bottom: 12px;
}

.retry-btn {
  margin-top: 12px;
  padding: 8px 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease;
}

.retry-btn:hover {
  background: #0056b3;
}

.weather-content {
  padding: 20px;
}

.weather-header {
  text-align: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 16px;
}

.weather-header h3 {
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.location-details {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #666;
}

.last-updated {
  margin: 0;
  font-size: 12px;
  color: #999;
}

.current-weather {
  margin-bottom: 20px;
}

.temp-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.condition-icon {
  width: 64px;
  height: 64px;
  object-fit: contain;
}

.temp-info {
  flex: 1;
}

.current-temp {
  display: block;
  font-size: 32px;
  font-weight: 700;
  color: #333;
  line-height: 1;
}

.feels-like {
  display: block;
  font-size: 14px;
  color: #666;
  margin: 4px 0;
}

.condition-text {
  display: block;
  font-size: 16px;
  color: #555;
  font-weight: 500;
}

.weather-details {
  border-top: 1px solid #eee;
  padding-top: 16px;
}

.detail-row {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
}

.detail-row:last-child {
  margin-bottom: 0;
}

.detail-item {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 6px;
}

.detail-item i {
  color: #007bff;
  width: 16px;
  text-align: center;
}

.detail-item .label {
  font-size: 12px;
  color: #666;
  flex: 1;
}

.detail-item .value {
  font-size: 13px;
  font-weight: 500;
  color: #333;
}

/* Responsividade */
@media (max-width: 768px) {
  .weather-dropdown {
    right: -10px;
    left: -10px;
    min-width: auto;
  }
  
  .weather-card {
    margin: 0 10px;
  }
}
</style>