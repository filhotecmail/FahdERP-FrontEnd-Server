<template>
  <div class="esocial-s1000-container">
    <div class="form-container">
      <!-- Card Heading -->
      <ESocialCardHeading 
        title="eSocial S-1000" 
        subtitle="Informações do Empregador/Contribuinte/Órgão Público" 
      />
      
      <form @submit.prevent="handleSubmit" class="esocial-form">
        <!-- Seção: Identificação do Empregador -->
        <div class="form-section">
          <h2 class="section-title">
            <svg class="section-icon" viewBox="0 0 24 24">
              <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
            </svg>
            Identificação do Empregador
          </h2>
          
          <div class="form-grid">
            <div class="form-group">
              <label for="tpInsc" class="form-label">Tipo de Inscrição *</label>
              <select 
                id="tpInsc" 
                v-model="formData.tpInsc.value" 
                class="form-input" 
                required
                :disabled="isLoading"
              >
                <option value="">Selecione...</option>
                <option 
                  v-for="opcao in getOpcoesSelect('tiposInscricao')" 
                  :key="opcao.value" 
                  :value="opcao.value"
                >
                  {{ opcao.label }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="nrInsc" class="form-label">
                {{ formData.tpInsc.value === '1' ? 'CNPJ' : formData.tpInsc.value === '2' ? 'CPF' : 'Número de Inscrição' }} *
              </label>
              <input
                id="nrInsc"
                v-model="formData.nrInsc.value"
                type="text"
                class="form-input"
                :placeholder="formData.tpInsc.value === '1' ? '00.000.000/0000-00' : formData.tpInsc.value === '2' ? '000.000.000-00' : 'Digite o número'"
                required
                :disabled="isLoading"
                @input="formatInscricao"
              />
            </div>

            <div class="form-group half-width">
              <label for="nmRazao" class="form-label">Razão Social / Nome *</label>
              <input
                id="nmRazao"
                v-model="formData.nmRazao.value"
                type="text"
                class="form-input"
                placeholder="Digite a razão social ou nome"
                required
                :disabled="isLoading"
                maxlength="115"
              />
            </div>

            <div class="form-group half-width">
              <label for="nmFantasia" class="form-label">Nome Fantasia</label>
              <input
                id="nmFantasia"
                v-model="formData.nmFantasia.value"
                type="text"
                class="form-input"
                placeholder="Digite o nome fantasia"
                :disabled="isLoading"
                maxlength="60"
              />
            </div>

            <div class="form-group">
              <label for="classTrib" class="form-label">Classificação Tributária *</label>
              <select 
                id="classTrib" 
                v-model="formData.classTrib.value" 
                class="form-input" 
                required
                :disabled="isLoading"
              >
                <option value="">Selecione...</option>
                <option 
                  v-for="opcao in getOpcoesSelect('classificacaoTributaria')" 
                  :key="opcao.value" 
                  :value="opcao.value"
                >
                  {{ opcao.label }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="natJurid" class="form-label">Natureza Jurídica *</label>
              <select 
                id="natJurid" 
                v-model="formData.natJurid.value" 
                class="form-input" 
                required
                :disabled="isLoading"
              >
                <option value="">Selecione...</option>
                <option 
                  v-for="opcao in getOpcoesSelect('naturezaJuridica')" 
                  :key="opcao.value" 
                  :value="opcao.value"
                >
                  {{ opcao.label }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- Seção: Informações Complementares -->
        <div class="form-section">
          <h2 class="section-title">
            <svg class="section-icon" viewBox="0 0 24 24">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
            </svg>
            Informações Complementares
          </h2>
          
          <div class="form-grid">
            <div class="form-group">
              <label for="indCoop" class="form-label">Indicativo de Cooperativa</label>
              <select id="indCoop" v-model="formData.indCoop.value" class="form-input" :disabled="isLoading">
                <option value="">Selecione...</option>
                <option value="0">Não é cooperativa</option>
                <option value="1">Cooperativa de trabalho</option>
                <option value="2">Cooperativa de produção</option>
                <option value="3">Outras cooperativas</option>
              </select>
            </div>

            <div class="form-group">
              <label for="indConstr" class="form-label">Indicativo de Construção Civil</label>
              <select id="indConstr" v-model="formData.indConstr.value" class="form-input" :disabled="isLoading">
                <option value="">Selecione...</option>
                <option value="0">Não é empresa de construção civil</option>
                <option value="1">Empresa de construção civil</option>
              </select>
            </div>

            <div class="form-group">
              <label for="indDesFolha" class="form-label">Indicativo de Desoneração da Folha</label>
              <select id="indDesFolha" v-model="formData.indDesFolha.value" class="form-input" :disabled="isLoading">
                <option value="">Selecione...</option>
                <option value="0">Não aplicável</option>
                <option value="1">Empresa enquadrada no regime de desoneração</option>
              </select>
            </div>

            <div class="form-group">
              <label for="indOptRegEletron" class="form-label">Opção pelo Registro Eletrônico</label>
              <select id="indOptRegEletron" v-model="formData.indOptRegEletron.value" class="form-input" :disabled="isLoading">
                <option value="">Selecione...</option>
                <option value="0">Não optou pelo registro eletrônico</option>
                <option value="1">Optou pelo registro eletrônico</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Seção: Contato Responsável -->
        <div class="form-section">
          <h2 class="section-title">
            <svg class="section-icon" viewBox="0 0 24 24">
              <path d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z"/>
            </svg>
            Contato Responsável
          </h2>
          
          <div class="form-grid">
            <div class="form-group">
              <label for="nmCtt" class="form-label">Nome do Contato</label>
              <input
                id="nmCtt"
                v-model="formData.nmCtt.value"
                type="text"
                class="form-input"
                placeholder="Nome do responsável"
                :disabled="isLoading"
                maxlength="70"
              />
            </div>

            <div class="form-group">
              <label for="cpfCtt" class="form-label">CPF do Contato</label>
              <input
                id="cpfCtt"
                v-model="formData.cpfCtt.value"
                type="text"
                class="form-input"
                placeholder="000.000.000-00"
                :disabled="isLoading"
                @input="formatCPF"
              />
            </div>

            <div class="form-group">
              <label for="foneFixo" class="form-label">Telefone Fixo</label>
              <input
                id="foneFixo"
                v-model="formData.foneFixo.value"
                type="text"
                class="form-input"
                placeholder="(00) 0000-0000"
                :disabled="isLoading"
                @input="formatTelefone"
              />
            </div>

            <div class="form-group">
              <label for="foneCel" class="form-label">Telefone Celular</label>
              <input
                id="foneCel"
                v-model="formData.foneCel.value"
                type="text"
                class="form-input"
                placeholder="(00) 00000-0000"
                :disabled="isLoading"
                @input="formatCelular"
              />
            </div>

            <div class="form-group full-width">
              <label for="email" class="form-label">E-mail</label>
              <input
                id="email"
                v-model="formData.email.value"
                type="email"
                class="form-input"
                placeholder="contato@empresa.com.br"
                :disabled="isLoading"
                maxlength="60"
              />
            </div>
          </div>
        </div>

        <!-- Seção: Período de Validade -->
        <div class="form-section">
          <h2 class="section-title">
            <svg class="section-icon" viewBox="0 0 24 24">
              <path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,19H5V8H19V19M19,6H5V5H19V6Z"/>
            </svg>
            Período de Validade
          </h2>
          
          <div class="form-grid">
            <div class="form-group">
              <label for="iniValid" class="form-label">Início da Validade *</label>
              <input
                id="iniValid"
                v-model="formData.iniValid.value"
                type="date"
                class="form-input"
                required
                :disabled="isLoading"
              />
            </div>

            <div class="form-group">
              <label for="fimValid" class="form-label">Fim da Validade</label>
              <input
                id="fimValid"
                v-model="formData.fimValid.value"
                type="date"
                class="form-input"
                :disabled="isLoading"
              />
            </div>
          </div>
        </div>

        <!-- Botões de Ação -->
        <div class="form-actions">
          <button type="button" class="btn btn-secondary" @click="resetForm" :disabled="isLoading">
            <svg class="btn-icon" viewBox="0 0 24 24">
              <path d="M12,6V9L16,5L12,1V4A8,8 0 0,0 4,12C4,13.57 4.46,15.03 5.24,16.26L6.7,14.8C6.25,13.97 6,13 6,12A6,6 0 0,1 12,6M18.76,7.74L17.3,9.2C17.74,10.04 18,11 18,12A6,6 0 0,1 12,18V15L8,19L12,23V20A8,8 0 0,0 20,12C20,10.43 19.54,8.97 18.76,7.74Z"/>
            </svg>
            Limpar
          </button>
          
          <button type="submit" class="btn btn-primary" :disabled="isLoading">
            <svg v-if="!isLoading" class="btn-icon" viewBox="0 0 24 24">
              <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/>
            </svg>
            <div v-else class="loading-spinner"></div>
            {{ isLoading ? 'Salvando...' : 'Salvar Informações' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { esocialTables, getOpcoesSelect } from '@/data/esocial-tables.js'
import ESocialCardHeading from '@/components/ESocialCardHeading.vue'
import { useTabState } from '@/composables/useTabState'

// Estados do componente
const isLoading = ref(false)

// Sistema de preservação de estado
const tabId = 'esocial-s1000'
const { getFieldState, saveFieldState } = useTabState(tabId)

// Campos do formulário usando refs simples com estado preservado
const formData = {
  // Identificação
  tpInsc: ref(getFieldState('tpInsc', '')),
  nrInsc: ref(getFieldState('nrInsc', '')),
  nmRazao: ref(getFieldState('nmRazao', '')),
  nmFantasia: ref(getFieldState('nmFantasia', '')),
  classTrib: ref(getFieldState('classTrib', '')),
  natJurid: ref(getFieldState('natJurid', '')),
  
  // Informações complementares
  indCoop: ref(getFieldState('indCoop', '')),
  indConstr: ref(getFieldState('indConstr', '')),
  indDesFolha: ref(getFieldState('indDesFolha', '')),
  indOptRegEletron: ref(getFieldState('indOptRegEletron', '')),
  
  // Contato
  nmCtt: ref(getFieldState('nmCtt', '')),
  cpfCtt: ref(getFieldState('cpfCtt', '')),
  foneFixo: ref(getFieldState('foneFixo', '')),
  foneCel: ref(getFieldState('foneCel', '')),
  email: ref(getFieldState('email', '')),
  
  // Período
  iniValid: ref(getFieldState('iniValid', new Date().toISOString().split('T')[0])),
  fimValid: ref(getFieldState('fimValid', ''))
}

// Funções de formatação
const formatInscricao = (event: Event) => {
  const target = event.target as HTMLInputElement
  let value = target.value.replace(/\D/g, '')
  
  if (formData.tpInsc.value === '1') { // CNPJ
    value = value.replace(/(\d{2})(\d)/, '$1.$2')
    value = value.replace(/(\d{3})(\d)/, '$1.$2')
    value = value.replace(/(\d{3})(\d)/, '$1/$2')
    value = value.replace(/(\d{4})(\d)/, '$1-$2')
    value = value.substring(0, 18)
  } else if (formData.tpInsc.value === '2') { // CPF
    value = value.replace(/(\d{3})(\d)/, '$1.$2')
    value = value.replace(/(\d{3})(\d)/, '$1.$2')
    value = value.replace(/(\d{3})(\d)/, '$1-$2')
    value = value.substring(0, 14)
  }
  
  target.value = value
}

const formatCPF = (event: Event) => {
  const target = event.target as HTMLInputElement
  let value = target.value.replace(/\D/g, '')
  value = value.replace(/(\d{3})(\d)/, '$1.$2')
  value = value.replace(/(\d{3})(\d)/, '$1.$2')
  value = value.replace(/(\d{3})(\d)/, '$1-$2')
  value = value.substring(0, 14)
  target.value = value
}

const formatTelefone = (event: Event) => {
  const target = event.target as HTMLInputElement
  let value = target.value.replace(/\D/g, '')
  value = value.replace(/(\d{2})(\d)/, '($1) $2')
  value = value.replace(/(\d{4})(\d)/, '$1-$2')
  value = value.substring(0, 14)
  target.value = value
}

const formatCelular = (event: Event) => {
  const target = event.target as HTMLInputElement
  let value = target.value.replace(/\D/g, '')
  value = value.replace(/(\d{2})(\d)/, '($1) $2')
  value = value.replace(/(\d{5})(\d)/, '$1-$2')
  value = value.substring(0, 15)
  target.value = value
}

// Funções do formulário
const handleSubmit = async () => {
  isLoading.value = true
  
  try {
    // Aqui você implementaria a lógica de envio para o backend
    const formValues = Object.keys(formData).reduce((acc, key) => {
      acc[key] = formData[key as keyof typeof formData].value
      return acc
    }, {} as Record<string, any>)
    
    console.log('Dados do S-1000:', formValues)
    
    // Simular delay de envio
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    alert('Informações do S-1000 salvas com sucesso!')
  } catch (error) {
    console.error('Erro ao salvar:', error)
    alert('Erro ao salvar as informações. Tente novamente.')
  } finally {
    isLoading.value = false
  }
}

const resetForm = () => {
  Object.keys(formData).forEach(key => {
    if (key === 'iniValid') {
      formData[key as keyof typeof formData].value = new Date().toISOString().split('T')[0]
    } else {
      formData[key as keyof typeof formData].value = ''
    }
    // Salvar estado limpo
    saveFieldState(key, formData[key as keyof typeof formData].value)
  })
}

// Configurar auto-save do estado
onMounted(() => {
  // Configurar watchers para auto-salvar quando campos mudarem
  Object.keys(formData).forEach(key => {
    watch(
      () => formData[key as keyof typeof formData].value,
      (newValue) => {
        saveFieldState(key, newValue)
      },
      { immediate: false }
    )
  })
})
</script>

<style scoped>
.esocial-s1000-container {
  min-height: 100vh;
  background: var(--bg-primary);
  padding: 0.5rem 1rem 1.5rem;
  user-select: none;
}



.form-container {
  max-width: 1400px;
  margin: 0 auto;
  background: var(--bg-secondary);
  border-radius: 8px;
  box-shadow: var(--shadow-xl);
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.esocial-form {
  padding: 1.5rem;
}

.form-section {
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 1.5rem;
}

.form-section:last-of-type {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1rem;
  user-select: none;
}

.section-icon {
  width: 20px;
  height: 20px;
  fill: var(--accent-primary);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  margin-bottom: 0.75rem;
  max-width: 100%;
  overflow: hidden;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0; /* Permite que o flex item encolha */
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.half-width {
  grid-column: span 1;
}

@media (min-width: 1200px) {
  .half-width {
    grid-column: span 2;
  }
}

@media (min-width: 768px) and (max-width: 1199px) {
  .half-width {
    grid-column: span 1;
  }
}

@media (max-width: 767px) {
  .half-width {
    grid-column: span 1;
  }
}

.form-label {
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  font-size: 0.8rem;
  user-select: none;
}

.form-input {
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 0.85rem;
  transition: all 0.2s ease;
  background: var(--input-bg);
  color: var(--text-primary);
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px var(--accent-glow);
}

.form-input:disabled {
  background-color: var(--bg-primary);
  color: var(--text-muted);
  cursor: not-allowed;
}

.form-input::placeholder {
  color: var(--text-muted);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  user-select: none;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-icon {
  width: 16px;
  height: 16px;
  fill: currentColor;
}

.btn-primary {
  background: var(--accent-primary);
  color: var(--bg-primary);
}

.btn-primary:hover:not(:disabled) {
  background: var(--accent-hover);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px var(--accent-glow);
}

.btn-secondary {
  background: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--input-bg);
  transform: translateY(-1px);
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Responsividade */
/* Tablets e telas médias */
@media (min-width: 768px) and (max-width: 1200px) {
  .esocial-s1000-container {
    padding: 0.5rem 0.75rem 1rem;
  }
  
  .form-grid {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 0.75rem;
  }
  
  .form-container {
    max-width: 95%;
  }
}

/* Telas grandes */
@media (min-width: 1200px) {
  .form-grid {
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 1rem;
  }
  
  .esocial-s1000-container {
    padding: 0.75rem;
  }
}

/* Mobile */
@media (max-width: 767px) {
  .esocial-s1000-container {
    padding: 0.5rem;
  }
  
  .page-header h1 {
    font-size: 1.5rem;
  }
  
  .esocial-form {
    padding: 1rem;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  
  .form-container {
    margin: 0;
    border-radius: 8px;
    max-width: 100%;
  }
  
  .section-title {
    font-size: 1rem;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .btn {
    justify-content: center;
  }
  
  .form-input {
    font-size: 16px; /* Previne zoom no iOS */
  }
}

@media (max-width: 480px) {
  .esocial-s1000-container {
    padding: 0.5rem;
  }
  
  .page-header h1 {
    font-size: 1.75rem;
  }
  
  .esocial-form {
    padding: 1rem;
  }
}
</style>