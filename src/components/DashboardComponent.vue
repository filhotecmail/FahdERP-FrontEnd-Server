<template>
  <div class="dashboard-content">
    <div class="dashboard-header">
      <h2 title="Painel principal com métricas e indicadores">Dashboard Executivo</h2>
      <div class="date-filter">
        <DatePicker 
          v-model="selectedDate" 
          placeholder="Selecione uma data"
          @change="onDateChange"
        />
      </div>
    </div>

    <!-- Cards de Métricas -->
    <div class="metrics-grid">
      <div class="metric-card sales" title="Total de vendas realizadas hoje">
        <div class="metric-icon">
          <svg viewBox="0 0 24 24">
            <path d="M7,15H9C9,16.08 10.37,17 12,17C13.63,17 15,16.08 15,15C15,13.9 13.96,13.5 11.76,12.97C9.64,12.44 7,11.78 7,9C7,7.21 8.47,5.69 10.5,5.18V3H13.5V5.18C15.53,5.69 17,7.21 17,9H15C15,7.92 13.63,7 12,7C10.37,7 9,7.92 9,9C9,10.1 10.04,10.5 12.24,11.03C14.36,11.56 17,12.22 17,15C17,16.79 15.53,18.31 13.5,18.82V21H10.5V18.82C8.47,18.31 7,16.79 7,15Z"/>
          </svg>
        </div>
        <div class="metric-content">
          <h3>Vendas do Dia</h3>
          <div class="metric-value">R$ {{ formatCurrency(dailyMetrics.sales) }}</div>
          <div class="metric-change positive">+12.5% vs ontem</div>
        </div>
      </div>

      <div class="metric-card orders" title="Número de pedidos processados hoje">
        <div class="metric-icon">
          <svg viewBox="0 0 24 24">
            <path d="M19,7H22V9H19V12H17V9H14V7H17V4H19V7M12,2C13.1,2 14,2.9 14,4C14,5.1 13.1,6 12,6C10.9,6 10,5.1 10,4C10,2.9 10.9,2 12,2M21,9V20C21,21.1 20.1,22 19,22H5C3.9,22 3,21.1 3,20V9C3,7.9 3.9,7 5,7H7.53C7.85,7.47 8.32,7.85 8.87,8.11C9.42,8.36 10.2,8.5 12,8.5C13.8,8.5 14.58,8.36 15.13,8.11C15.68,7.85 16.15,7.47 16.47,7H19C20.1,7 21,7.9 21,9Z"/>
          </svg>
        </div>
        <div class="metric-content">
          <h3>Pedidos</h3>
          <div class="metric-value">{{ dailyMetrics.orders }}</div>
          <div class="metric-change positive">+8.2% vs ontem</div>
        </div>
      </div>

      <div class="metric-card customers" title="Novos clientes cadastrados hoje">
        <div class="metric-icon">
          <svg viewBox="0 0 24 24">
            <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
          </svg>
        </div>
        <div class="metric-content">
          <h3>Novos Clientes</h3>
          <div class="metric-value">{{ dailyMetrics.newCustomers }}</div>
          <div class="metric-change positive">+15.3% vs ontem</div>
        </div>
      </div>

      <div class="metric-card revenue" title="Receita total do mês">
        <div class="metric-icon">
          <svg viewBox="0 0 24 24">
            <path d="M3,6H21V18H3V6M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M7,8A2,2 0 0,1 5,10V14A2,2 0 0,1 7,16H17A2,2 0 0,1 19,14V10A2,2 0 0,1 17,8H7Z"/>
          </svg>
        </div>
        <div class="metric-content">
          <h3>Receita Mensal</h3>
          <div class="metric-value">R$ {{ formatCurrency(dailyMetrics.monthlyRevenue) }}</div>
          <div class="metric-change positive">+22.1% vs mês anterior</div>
        </div>
      </div>
    </div>

    <!-- Grid Principal do Dashboard -->
    <div class="dashboard-grid">
      <!-- Gráfico de Vendas -->
      <div class="chart-section">
        <h3>Vendas dos Últimos 7 Dias</h3>
        <SalesLineChart />
      </div>

      <!-- Gráfico de Barras -->
      <div class="chart-section">
        <h3>Vendas por Categoria</h3>
        <SalesBarChart />
      </div>

      <!-- Gráfico de Pizza -->
      <div class="chart-section">
        <h3>Canais de Venda</h3>
        <SalesPieChart title="Canais de Venda" />
      </div>

      <!-- Agenda do Dia -->
      <div class="agenda-section">
        <h3>Agenda do Dia</h3>
        <div class="agenda-list">
          <div class="agenda-item">
            <div class="appointment-time">09:00</div>
            <div class="appointment-details">
              <div class="appointment-title">Reunião com Cliente</div>
              <div class="appointment-client">Empresa ABC Ltda</div>
            </div>
            <div class="appointment-status confirmed">Confirmado</div>
          </div>
          <div class="agenda-item">
            <div class="appointment-time">14:30</div>
            <div class="appointment-details">
              <div class="appointment-title">Apresentação de Proposta</div>
              <div class="appointment-client">XYZ Comércio</div>
            </div>
            <div class="appointment-status pending">Pendente</div>
          </div>
          <div class="agenda-item">
            <div class="appointment-time">16:00</div>
            <div class="appointment-details">
              <div class="appointment-title">Follow-up Vendas</div>
              <div class="appointment-client">Diversos clientes</div>
            </div>
            <div class="appointment-status completed">Concluído</div>
          </div>
        </div>
        <button class="add-appointment-btn">+ Adicionar Compromisso</button>
      </div>
    </div>

    <!-- Seção de Widgets -->
    <div class="widgets-section">
      <h3>Informações em Tempo Real</h3>
      <div class="widgets-grid">
        <div class="widget-container">
          <WeatherWidget />
        </div>
        <div class="widget-container">
          <CurrencyWidget />
        </div>
        <div class="widget-container">
          <CryptoWidget />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import SalesLineChart from '@/components/charts/SalesLineChart.vue'
import SalesBarChart from '@/components/charts/SalesBarChart.vue'
import SalesPieChart from '@/components/charts/SalesPieChart.vue'
import WeatherWidget from '@/components/widgets/WeatherWidget.vue'
import CurrencyWidget from '@/components/widgets/CurrencyWidget.vue'
import CryptoWidget from '@/components/widgets/CryptoWidget.vue'
import DatePicker from '@/components/DatePicker.vue'

const selectedDate = ref(new Date().toISOString().split('T')[0])

// Métricas do dashboard
const dailyMetrics = reactive({
  sales: 15420.50,
  orders: 47,
  newCustomers: 12,
  monthlyRevenue: 284750.25
})

const onDateChange = (newDate: string) => {
  console.log('Data selecionada:', newDate)
  // Aqui você pode adicionar lógica para filtrar dados baseado na data
}

const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}
</script>

<style scoped>
/* Dashboard */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.dashboard-header h2 {
  margin: 0;
  color: var(--text-primary);
  font-size: 2rem;
  font-weight: 600;
  user-select: none;
}

.date-filter {
  min-width: 200px;
}

/* Métricas */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.metric-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.metric-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--accent-primary);
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.metric-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 255, 127, 0.1);
  flex-shrink: 0;
}

.metric-icon svg {
  width: 32px;
  height: 32px;
  fill: var(--accent-primary);
}

.metric-content {
  flex: 1;
}

.metric-content h3 {
  margin: 0 0 0.5rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  user-select: none;
}

.metric-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
  user-select: none;
}

.metric-change {
  font-size: 0.8rem;
  font-weight: 500;
  user-select: none;
}

.metric-change.positive {
  color: #10b981;
}

.metric-change.negative {
  color: #ef4444;
}

/* Dashboard Grid */
.dashboard-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

@media (max-width: 1200px) {
  .dashboard-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

.chart-section,
.agenda-section {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
}

.chart-section h3,
.agenda-section h3 {
  margin: 0 0 1rem;
  color: var(--text-primary);
  font-size: 1.2rem;
  user-select: none;
}

/* Agenda */
.agenda-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
}

.agenda-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(0, 255, 127, 0.05);
  border-radius: 6px;
  border-left: 4px solid var(--accent-primary);
}

.appointment-time {
  font-weight: 600;
  color: var(--accent-primary);
  min-width: 50px;
  user-select: none;
}

.appointment-details {
  flex: 1;
}

.appointment-title {
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
  user-select: none;
}

.appointment-client {
  font-size: 0.9rem;
  color: var(--text-secondary);
  user-select: none;
}

.appointment-status {
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  user-select: none;
}

.appointment-status.confirmed {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
}

.appointment-status.pending {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
}

.appointment-status.completed {
  background: rgba(107, 114, 128, 0.2);
  color: #6b7280;
}

.add-appointment-btn {
  width: 100%;
  padding: 0.75rem;
  background: transparent;
  border: 2px dashed var(--border-color);
  border-radius: 6px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
}

.add-appointment-btn:hover {
  border-color: var(--accent-primary);
  color: var(--accent-primary);
}

/* Widgets Section */
.widgets-section {
  margin-top: 2rem;
}

.widgets-section h3 {
  margin: 0 0 1.5rem;
  color: var(--text-primary);
  font-size: 1.5rem;
  font-weight: 600;
  user-select: none;
}

.widgets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.widget-container {
  min-height: 400px;
  display: flex;
  flex-direction: column;
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .metrics-grid {
    grid-template-columns: 1fr;
  }
  
  .widgets-grid {
    grid-template-columns: 1fr;
  }
  
  .widget-container {
    min-height: 350px;
  }
}

@media (max-width: 480px) {
  .metric-card {
    flex-direction: column;
    text-align: center;
  }
}
</style>