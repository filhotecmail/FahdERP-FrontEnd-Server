<template>
  <div class="weather-widget">
    <!-- Ícones SVG para diferentes condições climáticas -->
    <svg style="display: none;">
      <defs>
        <!-- Sol -->
        <g id="sun-icon">
          <circle cx="12" cy="12" r="5" fill="#FFD700" stroke="#FFA500" stroke-width="2"/>
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="#FFA500" stroke-width="2" stroke-linecap="round"/>
        </g>
        <!-- Nuvem -->
        <g id="cloud-icon">
          <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" fill="#87CEEB" stroke="#4682B4" stroke-width="2"/>
        </g>
        <!-- Chuva -->
        <g id="rain-icon">
          <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" fill="#87CEEB" stroke="#4682B4" stroke-width="2"/>
          <path d="M8 19v2M8 21v2M12 19v2M12 21v2M16 19v2M16 21v2" stroke="#4169E1" stroke-width="2" stroke-linecap="round"/>
        </g>
        <!-- Garoa -->
        <g id="drizzle-icon">
          <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" fill="#87CEEB" stroke="#4682B4" stroke-width="2"/>
          <path d="M8 19v1M12 19v1M16 19v1" stroke="#4169E1" stroke-width="2" stroke-linecap="round"/>
        </g>
        <!-- Tempestade -->
        <g id="thunderstorm-icon">
          <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" fill="#696969" stroke="#2F4F4F" stroke-width="2"/>
          <path d="M13 11l-4 6h3l-1 4 4-6h-3l1-4z" fill="#FFD700" stroke="#FFA500" stroke-width="1"/>
        </g>
        <!-- Neve -->
        <g id="snow-icon">
          <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" fill="#F0F8FF" stroke="#B0C4DE" stroke-width="2"/>
          <circle cx="8" cy="19" r="1" fill="white"/>
          <circle cx="12" cy="21" r="1" fill="white"/>
          <circle cx="16" cy="19" r="1" fill="white"/>
          <circle cx="10" cy="22" r="1" fill="white"/>
          <circle cx="14" cy="20" r="1" fill="white"/>
        </g>
        <!-- Névoa -->
        <g id="mist-icon">
          <path d="M3 15h18M3 9h18M3 12h18" stroke="#D3D3D3" stroke-width="2" stroke-linecap="round"/>
        </g>
        <!-- Neblina -->
        <g id="fog-icon">
          <path d="M3 15h18M3 9h18M3 12h18M3 18h18M3 6h18" stroke="#A9A9A9" stroke-width="2" stroke-linecap="round"/>
        </g>
        <!-- Neblina leve -->
        <g id="haze-icon">
          <path d="M3 15h18M3 9h18M3 12h18" stroke="#D3D3D3" stroke-width="1.5" stroke-linecap="round" opacity="0.7"/>
        </g>
        <!-- Padrão -->
        <g id="default-icon">
          <circle cx="12" cy="12" r="10" fill="none" stroke="#666" stroke-width="2"/>
          <path d="M8 12h8M12 8v8" stroke="#666" stroke-width="2" stroke-linecap="round"/>
        </g>
      </defs>
    </svg>

    <div class="widget-header">
      <div class="widget-title">
        <svg class="weather-icon" viewBox="0 0 24 24">
          <path d="M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L6.76,6.76C6.4,7.55 6.21,8.25 6.21,9H3.34V7M3.34,17H6.21C6.21,15.75 6.4,15.05 6.76,14.24L3.34,17M20.66,7V9H17.79C17.79,8.25 17.6,7.55 17.24,6.76L20.66,7M20.66,17L17.24,14.24C17.6,15.05 17.79,15.75 17.79,17H20.66M12,22L9.61,18.58C10.35,18.85 11.16,19 12,19C12.84,19 13.65,18.85 14.39,18.58L12,22Z"/>
        </svg>
        Clima
      </div>
      <button v-if="!locationPermission" @click="requestLocation" class="location-btn">
        <svg viewBox="0 0 24 24">
          <path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z"/>
        </svg>
      </button>
    </div>
    
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <span>Carregando clima...</span>
    </div>
    
    <div v-else-if="error" class="error-state">
      <svg viewBox="0 0 24 24">
        <path d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
      </svg>
      <span>{{ error }}</span>
    </div>
    
    <div v-else-if="weatherData" class="weather-content">
      <!-- Clima atual - layout horizontal -->
      <div class="current-weather-horizontal">
        <div class="current-left">
          <div class="temperature-main">
            {{ Math.round(weatherData.main.temp) }}°C
          </div>
          <div class="weather-description">{{ weatherData.weather[0].description }}</div>
          <div class="location-info">{{ weatherData.name }}, {{ weatherData.sys.country }}</div>
        </div>
        <div class="current-right">
          <div class="weather-visual-icon" :class="getWeatherIconClass(weatherData.weather[0].main)">
            <svg width="60" height="60" viewBox="0 0 24 24">
              <use :href="'#' + getWeatherIconId(weatherData.weather[0].main)"/>
            </svg>
          </div>
        </div>
      </div>
      
      <div class="weather-details">
        <div class="detail-item">
          <svg viewBox="0 0 24 24">
            <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12C18,14.22 16.79,16.16 15,17.2V19A1,1 0 0,1 14,20H10A1,1 0 0,1 9,19V17.2C7.21,16.16 6,14.22 6,12A6,6 0 0,1 12,6Z"/>
          </svg>
          <span>{{ weatherData.main.humidity }}%</span>
        </div>
        <div class="detail-item">
          <svg viewBox="0 0 24 24">
            <path d="M6,14L8,16L16,8L14,6L8,12L6,10L4,12L6,14M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4Z"/>
          </svg>
          <span>{{ Math.round(weatherData.wind.speed * 3.6) }} km/h</span>
        </div>
        <div class="detail-item">
          <svg viewBox="0 0 24 24">
            <path d="M12,2L13.09,8.26L22,9L13.09,9.74L12,16L10.91,9.74L2,9L10.91,8.26L12,2Z"/>
          </svg>
          <span>{{ weatherData.main.pressure }} hPa</span>
        </div>
        <div class="detail-item">
          <svg viewBox="0 0 24 24">
            <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8Z"/>
          </svg>
          <span>Sensação: {{ Math.round(weatherData.main.feels_like) }}°C</span>
        </div>
      </div>
      
      <!-- Previsão dos próximos dias -->
      <div v-if="forecastData.length > 0" class="forecast-section">
        <h4 class="forecast-title">Próximos Dias</h4>
        <div class="forecast-grid">
          <div 
            v-for="day in forecastData" 
            :key="day.date" 
            class="forecast-day"
          >
            <div class="forecast-day-name">{{ day.dayName }}</div>
            <div class="forecast-icon">
              <svg width="36" height="36" viewBox="0 0 24 24">
                <use :href="'#' + getWeatherIconId(day.weather.main)"/>
              </svg>
            </div>
            <div class="forecast-temps">
              <span class="temp-max">{{ Math.round(day.temp.max) }}°</span>
              <span class="temp-min">{{ Math.round(day.temp.min) }}°</span>
            </div>
            <div class="forecast-details">
              <div class="forecast-humidity">💧 {{ day.humidity }}%</div>
              <div class="forecast-wind">💨 {{ day.wind.speed.toFixed(1) }} km/h</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="no-permission">
      <svg viewBox="0 0 24 24">
        <path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z"/>
      </svg>
      <p>Permita o acesso à localização para ver o clima</p>
      <button @click="requestLocation" class="permission-btn">Permitir Localização</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface WeatherData {
  main: {
    temp: number
    feels_like: number
    humidity: number
    pressure: number
  }
  weather: Array<{
    main: string
    description: string
    icon: string
  }>
  wind: {
    speed: number
  }
  name: string
  sys: {
    country: string
  }
}

interface ForecastDay {
  date: string
  dayName: string
  weather: {
    main: string
    description: string
    icon: string
  }
  temp: {
    min: number
    max: number
  }
  humidity: number
  wind: {
    speed: number
  }
}



const weatherData = ref<WeatherData | null>(null)
const forecastData = ref<ForecastDay[]>([])
const loading = ref(false)
const error = ref('')
const locationPermission = ref(false)
let updateInterval: NodeJS.Timeout | null = null



// Função para obter nome da cidade através de geocodificação reversa
const getCityFromCoordinates = async (lat: number, lon: number): Promise<string> => {
  try {
    // Usando a API gratuita do Nominatim (OpenStreetMap) para geocodificação reversa
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1&accept-language=pt-BR,pt,en`
    )
    
    if (!response.ok) {
      throw new Error('Erro na geocodificação reversa')
    }
    
    const data = await response.json()
    
    // Extrair informações de localização mais específicas
    const address = data.address || {}
    
    // Priorizar cidade/município específico
    const city = address.city || 
                address.town || 
                address.village || 
                address.municipality || 
                address.county || 
                address.state_district || 
                address.state || 
                'Localização Desconhecida'
    
    // Se temos informações mais específicas, usar elas
    if (address.suburb && address.city) {
      return `${address.suburb}, ${address.city}`
    } else if (address.neighbourhood && address.city) {
      return `${address.neighbourhood}, ${address.city}`
    } else if (address.city && address.state) {
      return `${address.city}, ${address.state}`
    }
    
    return city
    
  } catch (error) {
    console.warn('Erro ao obter nome da cidade:', error)
    // Fallback para coordenadas se a geocodificação falhar
    return `Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`
  }
}

const requestLocation = async () => {
  if (!navigator.geolocation) {
    error.value = 'Geolocalização não suportada pelo navegador'
    return
  }
  
  loading.value = true
  error.value = ''
  
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      locationPermission.value = true
      await fetchWeatherData(position.coords.latitude, position.coords.longitude)
    },
    (err) => {
      loading.value = false
      switch (err.code) {
        case err.PERMISSION_DENIED:
          error.value = 'Permissão de localização negada'
          break
        case err.POSITION_UNAVAILABLE:
          error.value = 'Localização indisponível'
          break
        case err.TIMEOUT:
          error.value = 'Timeout na obtenção da localização'
          break
        default:
          error.value = 'Erro desconhecido na localização'
          break
      }
    },
    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 60000 // 1 minuto para maior precisão
    }
  )
}

const fetchWeatherData = async (lat: number, lon: number) => {
  try {
    loading.value = true
    error.value = ''
    
    // Obter nome da cidade através de geocodificação reversa
    const cityName = await getCityFromCoordinates(lat, lon)
    
    // Para demonstração, vamos usar dados mockados
    // Em produção, descomente a linha abaixo e use sua API key
    // const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=pt_br`)
    
    // Dados mockados para demonstração
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simular delay da API
    
    const mockData: WeatherData = {
      main: {
        temp: 25.5,
        feels_like: 27.2,
        humidity: 65,
        pressure: 1013
      },
      weather: [{
        main: 'Clear',
        description: 'céu limpo',
        icon: '01d'
      }],
      wind: {
        speed: 3.2
      },
      name: cityName,
      sys: {
        country: 'BR'
      }
    }
    
    // Dados mockados de previsão para os próximos 5 dias
    const mockForecast: ForecastDay[] = [
      {
        date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        dayName: 'Amanhã',
        weather: { main: 'Clouds', description: 'parcialmente nublado', icon: '02d' },
        temp: { min: 18, max: 28 },
        humidity: 70,
        wind: { speed: 2.8 }
      },
      {
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        dayName: getDayName(2),
        weather: { main: 'Rain', description: 'chuva leve', icon: '10d' },
        temp: { min: 16, max: 22 },
        humidity: 85,
        wind: { speed: 4.1 }
      },
      {
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        dayName: getDayName(3),
        weather: { main: 'Thunderstorm', description: 'tempestade', icon: '11d' },
        temp: { min: 15, max: 20 },
        humidity: 90,
        wind: { speed: 5.5 }
      },
      {
        date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        dayName: getDayName(4),
        weather: { main: 'Clear', description: 'céu limpo', icon: '01d' },
        temp: { min: 19, max: 30 },
        humidity: 55,
        wind: { speed: 3.0 }
      },
      {
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        dayName: getDayName(5),
        weather: { main: 'Clouds', description: 'nublado', icon: '04d' },
        temp: { min: 17, max: 26 },
        humidity: 75,
        wind: { speed: 2.5 }
      }
    ]
    
    weatherData.value = mockData
    forecastData.value = mockForecast
    
    /* Para usar a API real, descomente este bloco:
    if (!response.ok) {
      throw new Error('Erro ao buscar dados do clima')
    }
    
    const data = await response.json()
    weatherData.value = data
    */
    
  } catch (err) {
    error.value = 'Erro ao carregar dados do clima'
    console.error('Weather API error:', err)
  } finally {
    loading.value = false
  }
}

const getWeatherIconClass = (weatherMain: string) => {
  const weatherClasses: { [key: string]: string } = {
    'Clear': 'sunny',
    'Clouds': 'cloudy',
    'Rain': 'rainy',
    'Drizzle': 'drizzle',
    'Thunderstorm': 'thunderstorm',
    'Snow': 'snowy',
    'Mist': 'misty',
    'Fog': 'foggy',
    'Haze': 'hazy'
  }
  return weatherClasses[weatherMain] || 'default'
}

const getWeatherIconId = (weatherMain: string) => {
  const iconIds: { [key: string]: string } = {
    'Clear': 'sun-icon',
    'Clouds': 'cloud-icon',
    'Rain': 'rain-icon',
    'Drizzle': 'drizzle-icon',
    'Thunderstorm': 'thunderstorm-icon',
    'Snow': 'snow-icon',
    'Mist': 'mist-icon',
    'Fog': 'fog-icon',
    'Haze': 'haze-icon'
  }
  return iconIds[weatherMain] || 'default-icon'
}

const getDayName = (daysFromNow: number): string => {
  const date = new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000)
  const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
  return dayNames[date.getDay()]
}



const startAutoUpdate = () => {
  // Atualizar a cada 10 minutos
  updateInterval = setInterval(() => {
    if (locationPermission.value) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherData(position.coords.latitude, position.coords.longitude)
        },
        (err) => {
          console.error('Error getting location for update:', err)
        }
      )
    }
  }, 600000) // 10 minutos
}

onMounted(() => {
  // Verificar se já temos permissão de localização
  if (navigator.permissions) {
    navigator.permissions.query({ name: 'geolocation' }).then((result) => {
      if (result.state === 'granted') {
        requestLocation()
      }
    })
  }
  
  startAutoUpdate()
})

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval)
  }
})
</script>

<style scoped>
.weather-widget {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid var(--border-color);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.widget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.widget-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  user-select: none;
}

.weather-icon {
  width: 20px;
  height: 20px;
  fill: var(--accent-primary);
}

.location-btn {
  background: var(--accent-primary);
  border: none;
  border-radius: 6px;
  padding: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.location-btn:hover {
  background: var(--accent-hover);
}

.location-btn svg {
  width: 16px;
  height: 16px;
  fill: white;
}

.loading-state,
.error-state,
.no-permission {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  text-align: center;
  color: var(--text-secondary);
  gap: 12px;
  user-select: none;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--border-color);
  border-top: 3px solid var(--accent-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-state svg,
.no-permission svg {
  width: 32px;
  height: 32px;
  fill: var(--text-secondary);
}

.weather-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.current-weather-horizontal {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.current-left {
  flex: 1;
}

.temperature-main {
  font-size: 2.2rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1;
  margin-bottom: 4px;
  user-select: none;
}

.weather-description {
  font-size: 0.95rem;
  color: var(--text-secondary);
  text-transform: capitalize;
  margin-bottom: 2px;
  user-select: none;
}

.location-info {
  font-size: 0.8rem;
  color: var(--text-secondary);
  opacity: 0.7;
  user-select: none;
}

.current-right {
  display: flex;
  align-items: center;
  justify-content: center;
}



.weather-visual-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.weather-visual-icon:hover {
  transform: scale(1.05);
  background: rgba(255, 255, 255, 0.15);
}

.weather-visual-icon svg {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

/* Animações específicas para cada tipo de clima */
.weather-visual-icon.sunny {
  background: radial-gradient(circle, rgba(255, 215, 0, 0.2), rgba(255, 165, 0, 0.1));
  animation: sunny-glow 2s ease-in-out infinite alternate;
}

.weather-visual-icon.cloudy {
  background: radial-gradient(circle, rgba(135, 206, 235, 0.2), rgba(70, 130, 180, 0.1));
}

.weather-visual-icon.rainy {
  background: radial-gradient(circle, rgba(65, 105, 225, 0.2), rgba(70, 130, 180, 0.1));
  animation: rainy-pulse 1.5s ease-in-out infinite;
}

.weather-visual-icon.thunderstorm {
  background: radial-gradient(circle, rgba(105, 105, 105, 0.3), rgba(47, 79, 79, 0.2));
  animation: thunderstorm-flash 2s ease-in-out infinite;
}

.weather-visual-icon.snowy {
  background: radial-gradient(circle, rgba(240, 248, 255, 0.3), rgba(176, 196, 222, 0.2));
  animation: snowy-float 3s ease-in-out infinite;
}

@keyframes sunny-glow {
  0% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.3); }
  100% { box-shadow: 0 0 30px rgba(255, 215, 0, 0.5); }
}

@keyframes rainy-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

@keyframes thunderstorm-flash {
  0%, 90%, 100% { background: radial-gradient(circle, rgba(105, 105, 105, 0.3), rgba(47, 79, 79, 0.2)); }
  5%, 10% { background: radial-gradient(circle, rgba(255, 215, 0, 0.4), rgba(255, 165, 0, 0.3)); }
}

@keyframes snowy-float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-3px); }
}

/* Animações específicas para forecast */
@keyframes sunny-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes rainy-bounce {
  0%, 100% { transform: translateY(0px) scale(1); }
  25% { transform: translateY(-2px) scale(1.05); }
  50% { transform: translateY(0px) scale(1); }
  75% { transform: translateY(-1px) scale(1.02); }
}

@keyframes cloudy-drift {
  0% { transform: translateX(0px); }
  100% { transform: translateX(3px); }
}

@keyframes misty-fade {
  0% { opacity: 0.7; }
  100% { opacity: 1; }
}

.weather-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  font-size: 14px;
  color: var(--text-secondary);
  user-select: none;
}

.detail-item svg {
  width: 16px;
  height: 16px;
  fill: var(--accent-primary);
  flex-shrink: 0;
}

.permission-btn {
  background: var(--accent-primary);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.permission-btn:hover {
  background: var(--accent-hover);
  transform: translateY(-1px);
}

.forecast-section {
   margin-top: 12px;
 }
 
 .forecast-title {
   font-size: 13px;
   font-weight: 600;
   color: var(--text-primary);
   margin: 0 0 8px 0;
   opacity: 0.9;
   user-select: none;
 }
 
 .forecast-grid {
   display: flex;
   gap: 8px;
   overflow-x: auto;
   padding: 4px 0;
 }
 
 .forecast-day {
    background: rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    padding: 12px 8px;
    text-align: center;
    transition: all 0.2s ease;
    min-width: 90px;
    flex-shrink: 0;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
 
 .forecast-day:hover {
   background: rgba(255, 255, 255, 0.12);
   transform: translateY(-1px);
 }

.forecast-day-name {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-secondary);
    margin-bottom: 6px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    user-select: none;
  }
 
 .forecast-icon {
   display: flex;
   justify-content: center;
   margin-bottom: 4px;
 }
 
 .forecast-icon svg {
     filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
     width: 36px;
     height: 36px;
     transition: all 0.3s ease;
   }
   
   /* Animações removidas dos ícones de previsão */
 
 .forecast-temps {
   display: flex;
   flex-direction: column;
   gap: 1px;
   margin-bottom: 4px;
 }
 
 .temp-max {
    font-size: 14px;
    font-weight: 700;
    color: var(--text-primary);
    user-select: none;
  }
  
  .temp-min {
    font-size: 12px;
    color: var(--text-secondary);
    opacity: 0.8;
    user-select: none;
  }
 
 .forecast-details {
   display: none;
 }

@media (max-width: 768px) {
   .current-weather-horizontal {
     flex-direction: column;
     text-align: center;
     padding: 12px;
   }
   
   .current-left {
     margin-bottom: 8px;
   }
   
   .temperature-main {
     font-size: 2rem;
   }
   
   .weather-details {
     grid-template-columns: 1fr 1fr;
   }
   
   .forecast-day {
      min-width: 75px;
      padding: 10px 6px;
    }
    
    .forecast-day-name {
      font-size: 10px;
    }
    
    .forecast-icon svg {
      width: 30px;
      height: 30px;
    }
    
    .temp-max {
      font-size: 12px;
    }
    
    .temp-min {
      font-size: 11px;
    }
 }
</style>