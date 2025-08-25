<template>
  <div class="dashboard-content">
    <!-- Dashboard Header -->
    <div class="dashboard-header">
      <h2>Dashboard</h2>
      <div class="date-filter">
        <input 
          type="date" 
          v-model="currentDate" 
          class="date-picker"
        />
      </div>
    </div>

    <!-- Metrics Grid -->
    <div class="metrics-grid">
      <div class="metric-card sales">
        <div class="metric-icon">
          <svg viewBox="0 0 24 24">
            <path d="M7,15H9C9,16.08 10.37,17 12,17C13.63,17 15,16.08 15,15C15,13.9 13.96,13.5 11.76,12.97C9.64,12.44 7,11.78 7,9C7,7.21 8.47,5.69 10.5,5.18V3H13.5V5.18C15.53,5.69 17,7.21 17,9H15C15,7.92 13.63,7 12,7C10.37,7 9,7.92 9,9C9,10.1 10.04,10.5 12.24,11.03C14.36,11.56 17,12.22 17,15C17,16.79 15.53,18.31 13.5,18.82V21H10.5V18.82C8.47,18.31 7,16.79 7,15Z"/>
          </svg>
        </div>
        <div class="metric-content">
          <h3>Vendas do Mês</h3>
          <div class="metric-value">R$ 45.230</div>
          <div class="metric-change positive">+12.5%</div>
        </div>
      </div>

      <div class="metric-card products">
        <div class="metric-icon">
          <svg viewBox="0 0 24 24">
            <path d="M12,2L2,7L12,12L22,7L12,2M2,17L12,22L22,17M2,12L12,17L22,12"/>
          </svg>
        </div>
        <div class="metric-content">
          <h3>Produtos em Estoque</h3>
          <div class="metric-value">1.234</div>
          <div class="metric-change negative">-2.3%</div>
        </div>
      </div>

      <div class="metric-card profit">
        <div class="metric-icon">
          <svg viewBox="0 0 24 24">
            <path d="M3,3V21H21V19H5V3H3M9,17H7V10H9V17M13,17H11V7H13V17M17,17H15V13H17V17Z"/>
          </svg>
        </div>
        <div class="metric-content">
          <h3>Lucro Líquido</h3>
          <div class="metric-value">R$ 12.450</div>
          <div class="metric-change positive">+8.2%</div>
        </div>
      </div>

      <div class="metric-card revenue">
        <div class="metric-icon">
          <svg viewBox="0 0 24 24">
            <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
          </svg>
        </div>
        <div class="metric-content">
          <h3>Clientes Ativos</h3>
          <div class="metric-value">892</div>
          <div class="metric-change positive">+5.7%</div>
        </div>
      </div>
    </div>

    <!-- Dashboard Grid -->
    <div class="dashboard-grid">
      <div class="chart-section">
        <h3>Vendas dos Últimos 7 Dias</h3>
        <div class="chart-placeholder">
          <div class="chart-bars">
            <div class="bar" style="height: 60%">
              <span class="bar-value">R$ 2.1k</span>
              <span class="bar-label">Seg</span>
            </div>
            <div class="bar" style="height: 80%">
              <span class="bar-value">R$ 2.8k</span>
              <span class="bar-label">Ter</span>
            </div>
            <div class="bar" style="height: 45%">
              <span class="bar-value">R$ 1.6k</span>
              <span class="bar-label">Qua</span>
            </div>
            <div class="bar" style="height: 90%">
              <span class="bar-value">R$ 3.2k</span>
              <span class="bar-label">Qui</span>
            </div>
            <div class="bar" style="height: 70%">
              <span class="bar-value">R$ 2.5k</span>
              <span class="bar-label">Sex</span>
            </div>
            <div class="bar" style="height: 55%">
              <span class="bar-value">R$ 1.9k</span>
              <span class="bar-label">Sáb</span>
            </div>
            <div class="bar" style="height: 35%">
              <span class="bar-value">R$ 1.2k</span>
              <span class="bar-label">Dom</span>
            </div>
          </div>
        </div>
      </div>

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
              <div class="appointment-title">Revisão de Estoque</div>
              <div class="appointment-client">Interno</div>
            </div>
            <div class="appointment-status completed">Concluído</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const currentDate = ref(new Date().toISOString().split('T')[0])
</script>

<style scoped>
.dashboard-content {
  padding: 2rem;
  max-width: 100%;
  overflow-x: auto;
}

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
  user-select: none;
}

.date-filter {
  display: flex;
  align-items: center;
  min-width: 280px;
}

.date-picker {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--input-bg);
  color: var(--text-primary);
}

/* Cards de Métricas */
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
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 255, 127, 0.1);
}

.metric-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.metric-card.sales .metric-icon {
  background: rgba(0, 255, 127, 0.2);
}

.metric-card.products .metric-icon {
  background: rgba(54, 162, 235, 0.2);
}

.metric-card.profit .metric-icon {
  background: rgba(255, 206, 86, 0.2);
}

.metric-card.revenue .metric-icon {
  background: rgba(153, 102, 255, 0.2);
}

.metric-icon svg {
  width: 24px;
  height: 24px;
  fill: var(--accent-primary);
}

.metric-content h3 {
  margin: 0 0 0.5rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 500;
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
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

@media (max-width: 1200px) {
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

/* Gráfico Simples */
.chart-placeholder {
  height: 200px;
  display: flex;
  align-items: end;
  justify-content: center;
}

.chart-bars {
  display: flex;
  align-items: end;
  gap: 1rem;
  height: 100%;
}

.bar {
  width: 40px;
  background: linear-gradient(to top, var(--accent-primary), rgba(0, 255, 127, 0.6));
  border-radius: 4px 4px 0 0;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: end;
  align-items: center;
  transition: all 0.3s ease;
}

.bar:hover {
  transform: scale(1.05);
}

.bar-label {
  position: absolute;
  bottom: -25px;
  font-size: 0.8rem;
  color: var(--text-secondary);
  user-select: none;
}

.bar-value {
  position: absolute;
  top: -25px;
  font-size: 0.7rem;
  color: var(--text-primary);
  background: var(--bg-primary);
  padding: 2px 4px;
  border-radius: 4px;
  white-space: nowrap;
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

@media (max-width: 768px) {
  .dashboard-content {
    padding: 1rem;
  }
  
  .metrics-grid {
    grid-template-columns: 1fr;
  }
  
  .metric-card {
    flex-direction: column;
    text-align: center;
  }
}
</style>