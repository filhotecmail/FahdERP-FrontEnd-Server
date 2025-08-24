<template>
  <div class="crypto-widget">
    <div class="widget-header">
      <div class="widget-title">
        <svg class="crypto-icon" viewBox="0 0 24 24">
          <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M7,9H17V11H7V9M7,13H17V15H7V13Z"/>
        </svg>
        Criptomoedas
      </div>
      <div class="last-update" v-if="lastUpdate">
        {{ formatLastUpdate(lastUpdate) }}
      </div>
    </div>
    
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <span>Carregando criptomoedas...</span>
    </div>
    
    <div v-else-if="error" class="error-state">
      <svg viewBox="0 0 24 24">
        <path d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
      </svg>
      <span>{{ error }}</span>
      <button @click="fetchCryptoData" class="retry-btn">Tentar Novamente</button>
    </div>
    
    <div v-else-if="cryptoData" class="crypto-content">
      <div class="crypto-item featured" v-if="cryptoData.bitcoin">
        <div class="crypto-header">
          <div class="crypto-info">
            <div class="crypto-symbol">₿</div>
            <div class="crypto-details">
              <div class="crypto-name">Bitcoin</div>
              <div class="crypto-code">BTC</div>
            </div>
          </div>
          <div class="crypto-values">
            <div class="current-price">
              ${{ formatPrice(cryptoData.bitcoin.price) }}
            </div>
            <div class="price-change" :class="getPriceChangeClass(cryptoData.bitcoin.change24h)">
              <svg v-if="cryptoData.bitcoin.change24h > 0" viewBox="0 0 24 24">
                <path d="M15,20H9V12H4.16L12,4.16L19.84,12H15V20Z"/>
              </svg>
              <svg v-else-if="cryptoData.bitcoin.change24h < 0" viewBox="0 0 24 24">
                <path d="M9,4H15V12H19.84L12,19.84L4.16,12H9V4Z"/>
              </svg>
              <span>{{ formatVariation(cryptoData.bitcoin.change24h) }}%</span>
            </div>
          </div>
        </div>
        <div class="crypto-stats">
          <div class="stat-item">
            <span class="label">Market Cap:</span>
            <span class="value">${{ cryptoData.bitcoin.marketCap ? formatMarketCap(cryptoData.bitcoin.marketCap) : 'N/A' }}</span>
          </div>
          <div class="stat-item">
            <span class="label">Volume 24h:</span>
            <span class="value">${{ cryptoData.bitcoin.volume24h ? formatMarketCap(cryptoData.bitcoin.volume24h) : 'N/A' }}</span>
          </div>
        </div>
      </div>
      
      <div class="crypto-list">
        <div class="crypto-item" v-if="cryptoData.ethereum">
          <div class="crypto-basic">
            <div class="crypto-left">
              <span class="crypto-symbol">Ξ</span>
              <div class="crypto-name-small">
                <span class="name">Ethereum</span>
                <span class="code">ETH</span>
              </div>
            </div>
            <div class="crypto-right">
              <div class="price">${{ formatPrice(cryptoData.ethereum.price) }}</div>
              <div class="change" :class="getPriceChangeClass(cryptoData.ethereum.change24h)">
                {{ formatVariation(cryptoData.ethereum.change24h) }}%
              </div>
            </div>
          </div>
        </div>
        
        <div class="crypto-item" v-if="cryptoData.binancecoin">
          <div class="crypto-basic">
            <div class="crypto-left">
              <span class="crypto-symbol bnb">B</span>
              <div class="crypto-name-small">
                <span class="name">BNB</span>
                <span class="code">BNB</span>
              </div>
            </div>
            <div class="crypto-right">
              <div class="price">${{ formatPrice(cryptoData.binancecoin.price) }}</div>
              <div class="change" :class="getPriceChangeClass(cryptoData.binancecoin.change24h)">
                {{ formatVariation(cryptoData.binancecoin.change24h) }}%
              </div>
            </div>
          </div>
        </div>
        
        <div class="crypto-item" v-if="cryptoData.cardano">
          <div class="crypto-basic">
            <div class="crypto-left">
              <span class="crypto-symbol ada">₳</span>
              <div class="crypto-name-small">
                <span class="name">Cardano</span>
                <span class="code">ADA</span>
              </div>
            </div>
            <div class="crypto-right">
              <div class="price">${{ formatPrice(cryptoData.cardano.price) }}</div>
              <div class="change" :class="getPriceChangeClass(cryptoData.cardano.change24h)">
                {{ formatVariation(cryptoData.cardano.change24h) }}%
              </div>
            </div>
          </div>
        </div>
        
        <div class="crypto-item" v-if="cryptoData.solana">
          <div class="crypto-basic">
            <div class="crypto-left">
              <span class="crypto-symbol sol">◎</span>
              <div class="crypto-name-small">
                <span class="name">Solana</span>
                <span class="code">SOL</span>
              </div>
            </div>
            <div class="crypto-right">
              <div class="price">${{ formatPrice(cryptoData.solana.price) }}</div>
              <div class="change" :class="getPriceChangeClass(cryptoData.solana.change24h)">
                {{ formatVariation(cryptoData.solana.change24h) }}%
              </div>
            </div>
          </div>
        </div>
        
        <div class="crypto-item" v-if="cryptoData.dogecoin">
          <div class="crypto-basic">
            <div class="crypto-left">
              <span class="crypto-symbol doge">Ð</span>
              <div class="crypto-name-small">
                <span class="name">Dogecoin</span>
                <span class="code">DOGE</span>
              </div>
            </div>
            <div class="crypto-right">
              <div class="price">${{ formatPrice(cryptoData.dogecoin.price) }}</div>
              <div class="change" :class="getPriceChangeClass(cryptoData.dogecoin.change24h)">
                {{ formatVariation(cryptoData.dogecoin.change24h) }}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface CryptoInfo {
  price: number
  change24h: number
  marketCap?: number
  volume24h?: number
}

interface CryptoData {
  bitcoin?: CryptoInfo
  ethereum?: CryptoInfo
  binancecoin?: CryptoInfo
  cardano?: CryptoInfo
  solana?: CryptoInfo
  dogecoin?: CryptoInfo
}

const cryptoData = ref<CryptoData | null>(null)
const loading = ref(false)
const error = ref('')
const lastUpdate = ref<Date | null>(null)
let updateInterval: number | null = null

const fetchCryptoData = async () => {
  try {
    loading.value = true
    error.value = ''
    
    // Para demonstração, vamos usar dados mockados
    // Em produção, você pode usar APIs como:
    // - CoinGecko: https://www.coingecko.com/en/api
    // - CoinMarketCap: https://coinmarketcap.com/api/
    // - Binance API: https://binance-docs.github.io/apidocs/
    
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simular delay da API
    
    // Dados mockados com variação aleatória para simular mercado real
    const generateCryptoData = (basePrice: number, baseCap?: number, baseVolume?: number): CryptoInfo => {
      const variation = (Math.random() - 0.5) * 20 // -10% a +10%
      const price = basePrice + (basePrice * variation / 100)
      
      return {
        price,
        change24h: variation,
        marketCap: baseCap ? baseCap + (baseCap * variation / 100) : undefined,
        volume24h: baseVolume ? baseVolume + (baseVolume * (variation * 0.5) / 100) : undefined
      }
    }
    
    const mockData: CryptoData = {
      bitcoin: generateCryptoData(43250, 850000000000, 25000000000),
      ethereum: generateCryptoData(2650, 320000000000, 15000000000),
      binancecoin: generateCryptoData(315, 48000000000, 1200000000),
      cardano: generateCryptoData(0.52, 18000000000, 450000000),
      solana: generateCryptoData(98, 42000000000, 2100000000),
      dogecoin: generateCryptoData(0.085, 12000000000, 850000000)
    }
    
    cryptoData.value = mockData
    lastUpdate.value = new Date()
    
    /* Para usar API real (CoinGecko), descomente este bloco:
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,cardano,solana,dogecoin&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true'
    )
    
    if (!response.ok) {
      throw new Error('Erro ao buscar dados das criptomoedas')
    }
    
    const data = await response.json()
    
    cryptoData.value = {
      bitcoin: {
        price: data.bitcoin.usd,
        change24h: data.bitcoin.usd_24h_change,
        marketCap: data.bitcoin.usd_market_cap,
        volume24h: data.bitcoin.usd_24h_vol
      },
      ethereum: {
        price: data.ethereum.usd,
        change24h: data.ethereum.usd_24h_change,
        marketCap: data.ethereum.usd_market_cap,
        volume24h: data.ethereum.usd_24h_vol
      },
      binancecoin: {
        price: data.binancecoin.usd,
        change24h: data.binancecoin.usd_24h_change,
        marketCap: data.binancecoin.usd_market_cap,
        volume24h: data.binancecoin.usd_24h_vol
      },
      cardano: {
        price: data.cardano.usd,
        change24h: data.cardano.usd_24h_change,
        marketCap: data.cardano.usd_market_cap,
        volume24h: data.cardano.usd_24h_vol
      },
      solana: {
        price: data.solana.usd,
        change24h: data.solana.usd_24h_change,
        marketCap: data.solana.usd_market_cap,
        volume24h: data.solana.usd_24h_vol
      },
      dogecoin: {
        price: data.dogecoin.usd,
        change24h: data.dogecoin.usd_24h_change,
        marketCap: data.dogecoin.usd_market_cap,
        volume24h: data.dogecoin.usd_24h_vol
      }
    }
    
    lastUpdate.value = new Date()
    */
    
  } catch (err) {
    error.value = 'Erro ao carregar dados das criptomoedas'
    console.error('Crypto API error:', err)
  } finally {
    loading.value = false
  }
}

const formatPrice = (price: number): string => {
  if (price >= 1000) {
    return price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
  } else if (price >= 1) {
    return price.toFixed(2)
  } else {
    return price.toFixed(4)
  }
}

const formatMarketCap = (value: number): string => {
  if (value >= 1e12) {
    return (value / 1e12).toFixed(2) + 'T'
  } else if (value >= 1e9) {
    return (value / 1e9).toFixed(2) + 'B'
  } else if (value >= 1e6) {
    return (value / 1e6).toFixed(2) + 'M'
  } else {
    return value.toLocaleString()
  }
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
    fetchCryptoData()
  }, 30000)
}

onMounted(() => {
  fetchCryptoData()
  startAutoUpdate()
})

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval)
  }
})
</script>

<style scoped>
.crypto-widget {
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

.crypto-icon {
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

.crypto-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.crypto-item.featured {
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  border: 1px solid var(--border-color);
}

.crypto-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.crypto-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.crypto-symbol {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f7931a, #ff6b35);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  color: white;
}

.crypto-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.crypto-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  user-select: none;
}

.crypto-code {
  font-size: 12px;
  color: var(--text-secondary);
  user-select: none;
}

.crypto-values {
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

.crypto-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 6px;
  font-size: 12px;
}

.stat-item .label {
  color: var(--text-secondary);
  user-select: none;
}

.stat-item .value {
  color: var(--text-primary);
  font-weight: 500;
  user-select: none;
}

.crypto-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.crypto-item:not(.featured) {
  padding: 12px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  border: 1px solid var(--border-color);
  transition: all 0.2s ease;
}

.crypto-item:not(.featured):hover {
  background: rgba(255, 255, 255, 0.08);
}

.crypto-basic {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.crypto-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.crypto-item:not(.featured) .crypto-symbol {
  width: 32px;
  height: 32px;
  font-size: 16px;
}

.crypto-symbol.bnb {
  background: linear-gradient(135deg, #f3ba2f, #f0b90b);
}

.crypto-symbol.ada {
  background: linear-gradient(135deg, #0033ad, #1e88e5);
}

.crypto-symbol.sol {
  background: linear-gradient(135deg, #9945ff, #14f195);
}

.crypto-symbol.doge {
  background: linear-gradient(135deg, #c2a633, #d4af37);
}

.crypto-name-small {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.crypto-name-small .name {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  user-select: none;
}

.crypto-name-small .code {
  font-size: 11px;
  color: var(--text-secondary);
  user-select: none;
}

.crypto-right {
  text-align: right;
}

.crypto-right .price {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 2px;
  user-select: none;
}

.crypto-right .change {
  font-size: 12px;
  font-weight: 500;
  padding: 2px 6px;
  border-radius: 4px;
}

.change.positive {
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
}

.change.negative {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}

.change.neutral {
  color: var(--text-secondary);
  background: rgba(255, 255, 255, 0.05);
}

@media (max-width: 768px) {
  .crypto-header {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
  
  .crypto-values {
    text-align: center;
  }
  
  .crypto-stats {
    grid-template-columns: 1fr;
  }
}
</style>