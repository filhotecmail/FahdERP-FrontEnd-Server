<template>
  <div class="currency-widget">
    <div class="widget-header">
      <div class="widget-title">
        <svg class="currency-icon" viewBox="0 0 24 24">
          <path d="M7,15H9C9,16.08 10.37,17 12,17C13.63,17 15,16.08 15,15C15,13.9 13.96,13.5 11.76,12.97C9.64,12.44 7,11.78 7,9C7,7.21 8.47,5.69 10.5,5.18V3H13.5V5.18C15.53,5.69 17,7.21 17,9H15C15,7.92 13.63,7 12,7C10.37,7 9,7.92 9,9C9,10.1 10.04,10.5 12.24,11.03C14.36,11.56 17,12.22 17,15C17,16.79 15.53,18.31 13.5,18.82V21H10.5V18.82C8.47,18.31 7,16.79 7,15Z"/>
        </svg>
        Cotações
      </div>
      <div class="last-update" v-if="lastUpdate">
        {{ formatLastUpdate(lastUpdate) }}
      </div>
    </div>
    
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <span>Carregando cotações...</span>
    </div>
    
    <div v-else-if="error" class="error-state">
      <svg viewBox="0 0 24 24">
        <path d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
      </svg>
      <span>{{ error }}</span>
      <button @click="fetchCurrencyData" class="retry-btn">Tentar Novamente</button>
    </div>
    
    <div v-else-if="currencyData" class="currency-content">
      <div class="currency-item main-currency">
        <div class="currency-info">
          <div class="currency-pair">
            <span class="flag">🇺🇸</span>
            <span class="pair-text">USD/BRL</span>
          </div>
          <div class="currency-name">Dólar Americano</div>
        </div>
        <div class="currency-values">
          <div class="current-price">
            R$ {{ formatPrice(currencyData.USD.buy) }}
          </div>
          <div class="price-change" :class="getPriceChangeClass(currencyData.USD.variation)">
            <svg v-if="currencyData.USD.variation > 0" viewBox="0 0 24 24">
              <path d="M15,20H9V12H4.16L12,4.16L19.84,12H15V20Z"/>
            </svg>
            <svg v-else-if="currencyData.USD.variation < 0" viewBox="0 0 24 24">
              <path d="M9,4H15V12H19.84L12,19.84L4.16,12H9V4Z"/>
            </svg>
            <span>{{ formatVariation(currencyData.USD.variation) }}%</span>
          </div>
        </div>
      </div>
      
      <div class="currency-details">
        <div class="detail-row">
          <span class="label">Compra:</span>
          <span class="value">R$ {{ formatPrice(currencyData.USD.buy) }}</span>
        </div>
        <div class="detail-row">
          <span class="label">Venda:</span>
          <span class="value">R$ {{ formatPrice(currencyData.USD.sell) }}</span>
        </div>
        <div class="detail-row">
          <span class="label">Máxima:</span>
          <span class="value">R$ {{ formatPrice(currencyData.USD.high) }}</span>
        </div>
        <div class="detail-row">
          <span class="label">Mínima:</span>
          <span class="value">R$ {{ formatPrice(currencyData.USD.low) }}</span>
        </div>
      </div>
      
      <div class="other-currencies">
        <div class="currency-item small" v-if="currencyData.EUR">
          <div class="currency-header">
            <span class="flag">🇪🇺</span>
            <span class="pair">EUR/BRL</span>
            <span class="price">R$ {{ formatPrice(currencyData.EUR.buy) }}</span>
          </div>
          <div class="variation" :class="getPriceChangeClass(currencyData.EUR.variation)">
            {{ formatVariation(currencyData.EUR.variation) }}%
          </div>
        </div>
        
        <div class="currency-item small" v-if="currencyData.GBP">
          <div class="currency-header">
            <span class="flag">🇬🇧</span>
            <span class="pair">GBP/BRL</span>
            <span class="price">R$ {{ formatPrice(currencyData.GBP.buy) }}</span>
          </div>
          <div class="variation" :class="getPriceChangeClass(currencyData.GBP.variation)">
            {{ formatVariation(currencyData.GBP.variation) }}%
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface CurrencyInfo {
  buy: number
  sell: number
  variation: number
  high: number
  low: number
}

interface CurrencyData {
  USD: CurrencyInfo
  EUR?: CurrencyInfo
  GBP?: CurrencyInfo
}

const currencyData = ref<CurrencyData | null>(null)
const loading = ref(false)
const error = ref('')
const lastUpdate = ref<Date | null>(null)
let updateInterval: number | null = null

const fetchCurrencyData = async () => {
  try {
    loading.value = true
    error.value = ''
    
    // Para demonstração, vamos usar dados mockados
    // Em produção, você pode usar APIs como:
    // - AwesomeAPI: https://docs.awesomeapi.com.br/api-de-moedas
    // - CurrencyAPI: https://currencyapi.com/
    // - ExchangeRate-API: https://exchangerate-api.com/
    
    await new Promise(resolve => setTimeout(resolve, 800)) // Simular delay da API
    
    // Dados mockados com variação aleatória para simular mercado real
    const baseUSD = 5.25
    const baseEUR = 5.65
    const baseGBP = 6.45
    
    const usdVariation = (Math.random() - 0.5) * 4 // -2% a +2%
    const eurVariation = (Math.random() - 0.5) * 4
    const gbpVariation = (Math.random() - 0.5) * 4
    
    const mockData: CurrencyData = {
      USD: {
        buy: baseUSD + (baseUSD * usdVariation / 100),
        sell: baseUSD + (baseUSD * usdVariation / 100) + 0.05,
        variation: usdVariation,
        high: baseUSD + (baseUSD * Math.abs(usdVariation) / 100) + 0.1,
        low: baseUSD - (baseUSD * Math.abs(usdVariation) / 100) - 0.1
      },
      EUR: {
        buy: baseEUR + (baseEUR * eurVariation / 100),
        sell: baseEUR + (baseEUR * eurVariation / 100) + 0.05,
        variation: eurVariation,
        high: baseEUR + (baseEUR * Math.abs(eurVariation) / 100) + 0.1,
        low: baseEUR - (baseEUR * Math.abs(eurVariation) / 100) - 0.1
      },
      GBP: {
        buy: baseGBP + (baseGBP * gbpVariation / 100),
        sell: baseGBP + (baseGBP * gbpVariation / 100) + 0.05,
        variation: gbpVariation,
        high: baseGBP + (baseGBP * Math.abs(gbpVariation) / 100) + 0.1,
        low: baseGBP - (baseGBP * Math.abs(gbpVariation) / 100) - 0.1
      }
    }
    
    currencyData.value = mockData
    lastUpdate.value = new Date()
    
    /* Para usar API real, descomente este bloco:
    const response = await fetch('https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL,GBP-BRL')
    
    if (!response.ok) {
      throw new Error('Erro ao buscar cotações')
    }
    
    const data = await response.json()
    
    currencyData.value = {
      USD: {
        buy: parseFloat(data.USDBRL.bid),
        sell: parseFloat(data.USDBRL.ask),
        variation: parseFloat(data.USDBRL.pctChange),
        high: parseFloat(data.USDBRL.high),
        low: parseFloat(data.USDBRL.low)
      },
      EUR: {
        buy: parseFloat(data.EURBRL.bid),
        sell: parseFloat(data.EURBRL.ask),
        variation: parseFloat(data.EURBRL.pctChange),
        high: parseFloat(data.EURBRL.high),
        low: parseFloat(data.EURBRL.low)
      },
      GBP: {
        buy: parseFloat(data.GBPBRL.bid),
        sell: parseFloat(data.GBPBRL.ask),
        variation: parseFloat(data.GBPBRL.pctChange),
        high: parseFloat(data.GBPBRL.high),
        low: parseFloat(data.GBPBRL.low)
      }
    }
    
    lastUpdate.value = new Date()
    */
    
  } catch (err) {
    error.value = 'Erro ao carregar cotações'
    console.error('Currency API error:', err)
  } finally {
    loading.value = false
  }
}

const formatPrice = (price: number): string => {
  return price.toFixed(4)
}

const formatVariation = (variation: number): string => {
  return (variation >= 0 ? '+' : '') + variation.toFixed(2)
}

const getPriceChangeClass = (variation: number): string => {
  if (variation > 0) return 'positive'
  if (variation < 0) return 'negative'
  return 'neutral'
}

const formatLastUpdate = (date: Date): string => {
  const now = new Date()
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diff < 60) return 'Agora'
  if (diff < 3600) return `${Math.floor(diff / 60)}min atrás`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h atrás`
  return date.toLocaleDateString('pt-BR')
}

const startAutoUpdate = () => {
  // Atualizar a cada 30 segundos
  updateInterval = setInterval(() => {
    fetchCurrencyData()
  }, 30000)
}

onMounted(() => {
  fetchCurrencyData()
  startAutoUpdate()
})

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval)
  }
})
</script>

<style scoped>
.currency-widget {
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

.currency-icon {
  width: 20px;
  height: 20px;
  fill: var(--accent-primary);
}

.last-update {
  font-size: 12px;
  color: var(--text-secondary);
  user-select: none;
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  text-align: center;
  color: var(--text-secondary);
  gap: 12px;
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

.error-state svg {
  width: 32px;
  height: 32px;
  fill: var(--text-secondary);
}

.retry-btn {
  background: var(--accent-primary);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.retry-btn:hover {
  background: var(--accent-hover);
}

.currency-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.main-currency {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  border: 1px solid var(--border-color);
}

.currency-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.currency-pair {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.flag {
  font-size: 20px;
}

.currency-name {
  font-size: 12px;
  color: var(--text-secondary);
  user-select: none;
}

.currency-values {
  text-align: right;
}

.current-price {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1;
  margin-bottom: 4px;
  user-select: none;
}

.price-change {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  font-size: 14px;
  font-weight: 500;
}

.price-change.positive {
  color: #10b981;
}

.price-change.negative {
  color: #ef4444;
}

.price-change.neutral {
  color: var(--text-secondary);
}

.price-change svg {
  width: 16px;
  height: 16px;
  fill: currentColor;
}

.currency-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 6px;
  font-size: 14px;
}

.detail-row .label {
  color: var(--text-secondary);
  user-select: none;
}

.detail-row .value {
  color: var(--text-primary);
  font-weight: 500;
  user-select: none;
}

.other-currencies {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.currency-item.small {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.currency-header {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.currency-header .pair {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  min-width: 70px;
  user-select: none;
}

.currency-header .price {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-left: auto;
  user-select: none;
}

.variation {
  font-size: 12px;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 4px;
  min-width: 60px;
  text-align: center;
  user-select: none;
}

.variation.positive {
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
}

.variation.negative {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}

.variation.neutral {
  color: var(--text-secondary);
  background: rgba(255, 255, 255, 0.05);
}

@media (max-width: 768px) {
  .main-currency {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
  
  .currency-values {
    text-align: center;
  }
  
  .currency-details {
    grid-template-columns: 1fr;
  }
}
</style>