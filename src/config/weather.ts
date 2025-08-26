// Configurações do sistema de previsão do tempo

export interface WeatherConfig {
  apiKey: string
  apiBaseUrl: string
  updateInterval: number // em milissegundos
  defaultLocation: string
  timeout: number
  enableGeolocation: boolean
  maxAge: number // cache de localização em milissegundos
  gemini: {
    apiKey: string
    baseUrl: string
    timeout: number
  }
}

// Configuração padrão do sistema de clima
export const weatherConfig: WeatherConfig = {
  // IMPORTANTE: Substitua 'YOUR_WEATHER_API_KEY' pela sua chave real da WeatherAPI.com
  // Para obter uma chave gratuita, acesse: https://www.weatherapi.com/signup.aspx
  apiKey: import.meta.env.VITE_WEATHER_API_KEY || 'YOUR_WEATHER_API_KEY',
  
  // URL base da API WeatherAPI.com
  apiBaseUrl: 'https://api.weatherapi.com/v1',
  
  // Intervalo de atualização automática (1 hora = 3600000ms)
  updateInterval: 3600000,
  
  // Localização padrão caso a geolocalização falhe
  defaultLocation: 'São Paulo, Brazil',
  
  // Timeout para requisições de geolocalização (15 segundos para maior precisão)
  timeout: 15000,
  
  // Habilitar detecção automática de localização
  enableGeolocation: true,
  
  // Tempo máximo para cache de localização (30 segundos para dados mais atuais)
  maxAge: 30000,
  
  // Configuração do Google Gemini AI como fallback
  gemini: {
    apiKey: 'AIzaSyCvv2LOyCQM7GkdkMo9b0ssEyT_pTK9PuY',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
    timeout: 15000
  }
}

// Função para obter dados meteorológicos usando apenas Gemini AI
export const getWeatherFromGemini = async (lat: number, lon: number): Promise<WeatherResponse> => {
  const prompt = `Você é um assistente meteorológico especializado. Com base nas coordenadas latitude ${lat} e longitude ${lon}, forneça informações meteorológicas atuais precisas para esta localização.

Retorne APENAS um objeto JSON válido com a seguinte estrutura exata:
{
  "location": {
    "name": "Nome da cidade",
    "region": "Estado/Região",
    "country": "País",
    "lat": ${lat},
    "lon": ${lon},
    "tz_id": "Fuso horário",
    "localtime_epoch": timestamp_atual,
    "localtime": "Data e hora local"
  },
  "current": {
    "last_updated_epoch": timestamp_atual,
    "last_updated": "Data e hora da última atualização",
    "temp_c": temperatura_celsius,
    "temp_f": temperatura_fahrenheit,
    "is_day": 1_ou_0,
    "condition": {
      "text": "Descrição do clima",
      "icon": "//cdn.weatherapi.com/weather/64x64/day/116.png",
      "code": codigo_condicao
    },
    "wind_mph": velocidade_vento_mph,
    "wind_kph": velocidade_vento_kph,
    "wind_degree": direcao_vento_graus,
    "wind_dir": "Direção do vento",
    "pressure_mb": pressao_mb,
    "pressure_in": pressao_polegadas,
    "precip_mm": precipitacao_mm,
    "precip_in": precipitacao_polegadas,
    "humidity": umidade_percentual,
    "cloud": cobertura_nuvens_percentual,
    "feelslike_c": sensacao_termica_celsius,
    "feelslike_f": sensacao_termica_fahrenheit,
    "vis_km": visibilidade_km,
    "vis_miles": visibilidade_milhas,
    "uv": indice_uv,
    "gust_mph": rajada_vento_mph,
    "gust_kph": rajada_vento_kph
  }
}

Use dados meteorológicos realistas e atuais para a localização fornecida. Não inclua texto adicional, apenas o JSON.`

  try {
    const response = await fetch(`${weatherConfig.gemini.baseUrl}?key=${weatherConfig.gemini.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      }),
      signal: AbortSignal.timeout(weatherConfig.gemini.timeout)
    })

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    const weatherText = data.candidates?.[0]?.content?.parts?.[0]?.text
    
    if (!weatherText) {
      throw new Error('Resposta inválida do Gemini AI')
    }

    // Extrai o JSON da resposta
    const jsonMatch = weatherText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('JSON não encontrado na resposta do Gemini')
    }

    const weatherData = JSON.parse(jsonMatch[0])
    return weatherData
  } catch (error) {
    console.error('Erro ao obter dados do Gemini:', error)
    throw error
  }
}

// Tipos para a resposta da API
export interface WeatherLocation {
  name: string
  region: string
  country: string
  lat: number
  lon: number
  tz_id: string
  localtime_epoch: number
  localtime: string
}

export interface WeatherCondition {
  text: string
  icon: string
  code: number
}

export interface CurrentWeather {
  last_updated_epoch: number
  last_updated: string
  temp_c: number
  temp_f: number
  is_day: number
  condition: WeatherCondition
  wind_mph: number
  wind_kph: number
  wind_degree: number
  wind_dir: string
  pressure_mb: number
  pressure_in: number
  precip_mm: number
  precip_in: number
  humidity: number
  cloud: number
  feelslike_c: number
  feelslike_f: number
  vis_km: number
  vis_miles: number
  uv: number
  gust_mph: number
  gust_kph: number
}

export interface WeatherResponse {
  location: WeatherLocation
  current: CurrentWeather
}

// Função utilitária para formatar temperatura
export const formatTemperature = (temp: number, unit: 'C' | 'F' = 'C'): string => {
  return `${Math.round(temp)}°${unit}`
}

// Função para obter localização do usuário
export const getUserLocation = (): Promise<{ lat: number; lon: number }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocalização não suportada pelo navegador'))
      return
    }

    let attempts = 0
    const maxAttempts = 3
    const targetAccuracy = 50 // metros
    let bestPosition: GeolocationPosition | null = null

    const tryGetLocation = () => {
      attempts++
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Armazenar a melhor posição encontrada
          if (!bestPosition || position.coords.accuracy < bestPosition.coords.accuracy) {
            bestPosition = position
          }

          // Se conseguiu precisão excelente ou esgotou tentativas
          if (position.coords.accuracy <= targetAccuracy || attempts >= maxAttempts) {
            resolve({
              lat: parseFloat(position.coords.latitude.toFixed(8)),
              lon: parseFloat(position.coords.longitude.toFixed(8))
            })
          } else {
            // Tentar novamente após um pequeno delay
            setTimeout(tryGetLocation, 1000)
          }
        },
        (error) => {
          if (attempts >= maxAttempts) {
            if (bestPosition) {
              // Usar a melhor posição encontrada
              resolve({
                lat: parseFloat(bestPosition.coords.latitude.toFixed(8)),
                lon: parseFloat(bestPosition.coords.longitude.toFixed(8))
              })
            } else {
              reject(new Error(`Erro de geolocalização após ${maxAttempts} tentativas: ${error.message}`))
            }
          } else {
            // Tentar novamente
            setTimeout(tryGetLocation, 1000)
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0 // Sempre buscar nova localização
        }
      )
    }

    // Iniciar primeira tentativa
    tryGetLocation()
  })
}

// Função removida - usando getWeatherFromGemini acima

// Função para determinar o ícone do clima baseado na condição
export const getWeatherIcon = (condition: string): string => {
  const conditionLower = condition.toLowerCase()
  
  if (conditionLower.includes('sun') || conditionLower.includes('clear') || conditionLower.includes('sol')) {
    return '☀️'
  }
  if (conditionLower.includes('cloud') || conditionLower.includes('nuvem') || conditionLower.includes('overcast')) {
    return '☁️'
  }
  if (conditionLower.includes('rain') || conditionLower.includes('chuva') || conditionLower.includes('drizzle')) {
    return '🌧️'
  }
  if (conditionLower.includes('storm') || conditionLower.includes('thunder') || conditionLower.includes('tempestade') || conditionLower.includes('trovão')) {
    return '⛈️'
  }
  if (conditionLower.includes('snow') || conditionLower.includes('neve')) {
    return '❄️'
  }
  if (conditionLower.includes('fog') || conditionLower.includes('mist') || conditionLower.includes('névoa')) {
    return '🌫️'
  }
  
  // Ícone padrão para condições não mapeadas
  return '🌤️'
}

// Função utilitária para formatar velocidade do vento
export const formatWindSpeed = (speed: number, unit: 'kph' | 'mph' = 'kph'): string => {
  return `${Math.round(speed)} ${unit}`
}

// Função utilitária para determinar se é dia ou noite
export const isDayTime = (isDay: number): boolean => {
  return isDay === 1
}

// Função para detectar período do dia baseado no horário local
export const getTimePeriod = (localtime: string): 'morning' | 'afternoon' | 'evening' | 'night' => {
  const date = new Date(localtime)
  const hour = date.getHours()
  
  if (hour >= 6 && hour < 12) {
    return 'morning' // Manhã: 6h às 11h59
  } else if (hour >= 12 && hour < 18) {
    return 'afternoon' // Tarde: 12h às 17h59
  } else if (hour >= 18 && hour < 21) {
    return 'evening' // Início da noite/pôr do sol: 18h às 20h59
  } else {
    return 'night' // Noite: 21h às 5h59
  }
}

// Função para obter ícone baseado no período do dia
export const getTimePeriodIcon = (localtime: string): string => {
  const period = getTimePeriod(localtime)
  
  switch (period) {
    case 'morning':
      return '/src/assets/sunrise.svg'
    case 'afternoon':
      return '/src/assets/sun.svg'
    case 'evening':
      return '/src/assets/sunset.svg'
    case 'night':
      return '/src/assets/moon.svg'
    default:
      return '/src/assets/sun.svg'
  }
}

// Função para obter descrição do período do dia
export const getTimePeriodDescription = (localtime: string): string => {
  const period = getTimePeriod(localtime)
  
  switch (period) {
    case 'morning':
      return 'Manhã'
    case 'afternoon':
      return 'Tarde'
    case 'evening':
      return 'Início da Noite'
    case 'night':
      return 'Noite'
    default:
      return 'Dia'
  }
}