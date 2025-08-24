<template>
  <div class="esocial-s2200-container">
    <div class="form-container">
      <!-- Card Heading -->
      <ESocialCardHeading 
        title="eSocial S-2200" 
        subtitle="Cadastramento Inicial do Vínculo e Admissão/Ingresso de Trabalhador" 
      />
      
      <form @submit.prevent="handleSubmit" class="esocial-form">
        <!-- Seção: Identificação do Trabalhador -->
        <div class="form-section">
          <h2 class="section-title">
            <svg class="section-icon" viewBox="0 0 24 24">
              <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
            </svg>
            Identificação do Trabalhador
          </h2>
          
          <div class="form-grid">
            <div class="form-group small-field">
              <label for="cpfTrab" class="form-label">CPF do Trabalhador *</label>
              <input
                id="cpfTrab"
                v-model="formData.cpfTrab.value"
                type="text"
                class="form-input"
                placeholder="000.000.000-00"
                required
                :disabled="isLoading"
                @input="formatCPF"
                maxlength="14"
              />
            </div>

            <div class="form-group small-field">
              <label for="nisTrab" class="form-label">NIS/PIS/PASEP</label>
              <input
                id="nisTrab"
                v-model="formData.nisTrab.value"
                type="text"
                class="form-input"
                placeholder="000.00000.00-0"
                :disabled="isLoading"
                @input="formatNIS"
                maxlength="14"
              />
            </div>

            <div class="form-group half-width">
              <label for="nmTrab" class="form-label">Nome do Trabalhador *</label>
              <input
                id="nmTrab"
                v-model="formData.nmTrab.value"
                type="text"
                class="form-input"
                placeholder="Digite o nome completo"
                required
                :disabled="isLoading"
                maxlength="70"
              />
            </div>

            <div class="form-group small-field">
              <label for="dtNascto" class="form-label">Data de Nascimento *</label>
              <input
                id="dtNascto"
                v-model="formData.dtNascto.value"
                type="date"
                class="form-input"
                required
                :disabled="isLoading"
              />
            </div>

            <div class="form-group small-field">
              <label for="racaCor" class="form-label">Raça/Cor</label>
              <select id="racaCor" v-model="formData.racaCor.value" class="form-input" :disabled="isLoading">
                <option value="">Selecione...</option>
                <option value="1">Branca</option>
                <option value="2">Preta</option>
                <option value="3">Parda</option>
                <option value="4">Amarela</option>
                <option value="5">Indígena</option>
                <option value="6">Não informado</option>
              </select>
            </div>

            <div class="form-group small-field">
              <label for="estCiv" class="form-label">Estado Civil</label>
              <select id="estCiv" v-model="formData.estCiv.value" class="form-input" :disabled="isLoading">
                <option value="">Selecione...</option>
                <option value="1">Solteiro</option>
                <option value="2">Casado</option>
                <option value="3">Divorciado</option>
                <option value="4">Separado</option>
                <option value="5">Viúvo</option>
              </select>
            </div>

            <div class="form-group small-field">
              <label for="sexo" class="form-label">Sexo *</label>
              <select id="sexo" v-model="formData.sexo.value" class="form-input" required :disabled="isLoading">
                <option value="">Selecione...</option>
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
              </select>
            </div>

            <div class="form-group medium-field">
              <label for="grauInstr" class="form-label">Grau de Instrução</label>
              <select id="grauInstr" v-model="formData.grauInstr.value" class="form-input" :disabled="isLoading">
                <option value="">Selecione...</option>
                <option value="01">Analfabeto</option>
                <option value="02">Até 5ª Incompleto</option>
                <option value="03">5ª Completo Fundamental</option>
                <option value="04">6ª a 9ª Fundamental</option>
                <option value="05">Fundamental Completo</option>
                <option value="06">Médio Incompleto</option>
                <option value="07">Médio Completo</option>
                <option value="08">Superior Incompleto</option>
                <option value="09">Superior Completo</option>
                <option value="10">Pós-graduação</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Seção: Informações do Vínculo -->
        <div class="form-section">
          <h2 class="section-title">
            <svg class="section-icon" viewBox="0 0 24 24">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
            </svg>
            Informações do Vínculo
          </h2>
          
          <div class="form-grid">
            <div class="form-group medium-field">
              <label for="matricula" class="form-label">Matrícula do Trabalhador</label>
              <input
                id="matricula"
                v-model="formData.matricula.value"
                type="text"
                class="form-input"
                placeholder="Digite a matrícula"
                :disabled="isLoading"
                maxlength="30"
              />
            </div>

            <div class="form-group small-field">
              <label for="tpRegTrab" class="form-label">Tipo de Regime Trabalhista *</label>
              <select id="tpRegTrab" v-model="formData.tpRegTrab.value" class="form-input" required :disabled="isLoading">
                <option value="">Selecione...</option>
                <option value="1">CLT</option>
                <option value="2">Estatutário</option>
              </select>
            </div>

            <div class="form-group small-field">
              <label for="cadIni" class="form-label">Cadastramento Inicial *</label>
              <select id="cadIni" v-model="formData.cadIni.value" class="form-input" required :disabled="isLoading">
                <option value="">Selecione...</option>
                <option value="S">Sim</option>
                <option value="N">Não</option>
              </select>
            </div>

            <div class="form-group large-field">
              <label for="tpRegPrev" class="form-label">Tipo de Regime Previdenciário *</label>
              <select id="tpRegPrev" v-model="formData.tpRegPrev.value" class="form-input" required :disabled="isLoading">
                <option value="">Selecione...</option>
                <option value="1">Regime Geral de Previdência Social - RGPS</option>
                <option value="2">Regime Próprio de Previdência Social - RPPS</option>
                <option value="3">Regime de Previdência Social no Exterior</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Seção: Informações da Admissão -->
        <div class="form-section">
          <h2 class="section-title">
            <svg class="section-icon" viewBox="0 0 24 24">
              <path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,19H5V8H19V19M19,6H5V5H19V6Z"/>
            </svg>
            Informações da Admissão
          </h2>
          
          <div class="form-grid">
            <div class="form-group small-field">
              <label for="dtAdm" class="form-label">Data de Admissão *</label>
              <input
                id="dtAdm"
                v-model="formData.dtAdm.value"
                type="date"
                class="form-input"
                required
                :disabled="isLoading"
              />
            </div>

            <div class="form-group medium-field">
              <label for="indAdmissao" class="form-label">Indicativo de Admissão *</label>
              <select id="indAdmissao" v-model="formData.indAdmissao.value" class="form-input" required :disabled="isLoading">
                <option value="">Selecione...</option>
                <option value="1">Normal</option>
                <option value="2">Decorrente de ação fiscal</option>
                <option value="3">Decorrente de decisão judicial</option>
              </select>
            </div>

            <div class="form-group small-field">
              <label for="natAtividade" class="form-label">Natureza da Atividade *</label>
              <select id="natAtividade" v-model="formData.natAtividade.value" class="form-input" required :disabled="isLoading">
                <option value="">Selecione...</option>
                <option value="1">Trabalho urbano</option>
                <option value="2">Trabalho rural</option>
              </select>
            </div>

            <div class="form-group large-field">
              <label for="tpAdmissao" class="form-label">Tipo de Admissão *</label>
              <select id="tpAdmissao" v-model="formData.tpAdmissao.value" class="form-input" required :disabled="isLoading">
                <option value="">Selecione...</option>
                <option value="1">Admissão</option>
                <option value="2">Transferência de empresa do mesmo grupo econômico</option>
                <option value="3">Transferência de empresa consorciada ou consórcio</option>
                <option value="4">Transferência por motivo de sucessão, incorporação, cisão ou fusão</option>
                <option value="5">Transferência por motivo de mudança de CPF/CNPJ</option>
              </select>
            </div>

            <div class="form-group large-field">
              <label for="tpRegJor" class="form-label">Tipo de Regime de Jornada *</label>
              <select id="tpRegJor" v-model="formData.tpRegJor.value" class="form-input" required :disabled="isLoading">
                <option value="">Selecione...</option>
                <option value="1">Submetido a horário de trabalho (Capítulo II do Título II da CLT)</option>
                <option value="2">Atividade externa (art. 62, I da CLT)</option>
                <option value="3">Função de confiança (art. 62, II da CLT)</option>
                <option value="4">Teletrabalho (art. 62, III da CLT)</option>
              </select>
            </div>

            <div class="form-group medium-field">
              <label for="dtBase" class="form-label">Mês/Ano de Início da Obrigatoriedade</label>
              <input
                id="dtBase"
                v-model="formData.dtBase.value"
                type="month"
                class="form-input"
                :disabled="isLoading"
              />
            </div>
          </div>
        </div>

        <!-- Seção: Informações do Cargo/Função -->
        <div class="form-section">
          <h2 class="section-title">
            <svg class="section-icon" viewBox="0 0 24 24">
              <path d="M20,6C20.58,6 21.05,6.2 21.42,6.59C21.8,7 22,7.45 22,8V19C22,19.55 21.8,20 21.42,20.41C21.05,20.8 20.58,21 20,21H4C3.42,21 2.95,20.8 2.58,20.41C2.2,20 2,19.55 2,19V8C2,7.45 2.2,7 2.58,6.59C2.95,6.2 3.42,6 4,6H8V4C8,3.42 8.2,2.95 8.58,2.58C8.95,2.2 9.42,2 10,2H14C14.58,2 15.05,2.2 15.42,2.58C15.8,2.95 16,3.42 16,4V6H20M4,8V19H20V8H4M10,4V6H14V4H10Z"/>
            </svg>
            Informações do Cargo/Função
          </h2>
          
          <div class="form-grid">
            <div class="form-group small-field">
              <label for="codCargo" class="form-label">Código do Cargo</label>
              <input
                id="codCargo"
                v-model="formData.codCargo.value"
                type="text"
                class="form-input"
                placeholder="Digite o código do cargo"
                :disabled="isLoading"
                maxlength="30"
              />
            </div>

            <div class="form-group small-field">
              <label for="codFuncao" class="form-label">Código da Função</label>
              <input
                id="codFuncao"
                v-model="formData.codFuncao.value"
                type="text"
                class="form-input"
                placeholder="Digite o código da função"
                :disabled="isLoading"
                maxlength="30"
              />
            </div>

            <div class="form-group small-field">
              <label for="codCBO" class="form-label">Código CBO *</label>
              <input
                id="codCBO"
                v-model="formData.codCBO.value"
                type="text"
                class="form-input"
                placeholder="0000-00"
                required
                :disabled="isLoading"
                @input="formatCBO"
                maxlength="7"
              />
            </div>

            <div class="form-group large-field">
              <label for="codCateg" class="form-label">Código da Categoria do Trabalhador *</label>
              <select id="codCateg" v-model="formData.codCateg.value" class="form-input" required :disabled="isLoading">
                <option value="">Selecione...</option>
                <option value="101">Empregado - Geral, inclusive o empregado público da administração direta ou indireta contratado pela CLT</option>
                <option value="102">Empregado - Trabalhador rural por pequeno prazo</option>
                <option value="103">Empregado - Aprendiz</option>
                <option value="104">Empregado - Doméstico</option>
                <option value="105">Empregado - Contrato a termo firmado nos termos da Lei 9.601/98</option>
                <option value="106">Trabalhador temporário</option>
                <option value="111">Empregado - Contrato Verde e Amarelo</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Seção: Remuneração e Informações Contratuais -->
        <div class="form-section">
          <h2 class="section-title">
            <svg class="section-icon" viewBox="0 0 24 24">
              <path d="M7,15H9C9,16.08 10.37,17 12,17C13.63,17 15,16.08 15,15C15,13.9 13.96,13.5 11.76,12.97C9.64,12.44 7,11.78 7,9C7,7.21 8.47,5.69 10.5,5.18V3H13.5V5.18C15.53,5.69 17,7.21 17,9H15C15,7.92 13.63,7 12,7C10.37,7 9,7.92 9,9C9,10.1 10.04,10.5 12.24,11.03C14.36,11.56 17,12.22 17,15C17,16.79 15.53,18.31 13.5,18.82V21H10.5V18.82C8.47,18.31 7,16.79 7,15Z"/>
            </svg>
            Remuneração e Informações Contratuais
          </h2>
          
          <div class="form-grid">
            <div class="form-group small-field">
              <label for="vrSalFx" class="form-label">Salário Base *</label>
              <input
                id="vrSalFx"
                v-model="formData.vrSalFx.value"
                type="text"
                class="form-input"
                placeholder="0,00"
                required
                :disabled="isLoading"
                @input="formatMoney"
              />
            </div>

            <div class="form-group medium-field">
              <label for="undSalFixo" class="form-label">Unidade de Pagamento *</label>
              <select id="undSalFixo" v-model="formData.undSalFixo.value" class="form-input" required :disabled="isLoading">
                <option value="">Selecione...</option>
                <option value="1">Por Hora</option>
                <option value="2">Por Dia</option>
                <option value="3">Por Semana</option>
                <option value="4">Por Quinzena</option>
                <option value="5">Por Mês</option>
                <option value="6">Por Tarefa</option>
                <option value="7">Não Aplicável</option>
              </select>
            </div>

            <div class="form-group small-field">
              <label for="tpContr" class="form-label">Tipo de Contrato de Trabalho *</label>
              <select id="tpContr" v-model="formData.tpContr.value" class="form-input" required :disabled="isLoading">
                <option value="">Selecione...</option>
                <option value="1">Prazo indeterminado</option>
                <option value="2">Prazo determinado, definido em dias</option>
                <option value="3">Prazo determinado, vinculado ao término de serviços/obra/atividade</option>
              </select>
            </div>

            <div class="form-group large-field">
              <label for="dscSalVar" class="form-label">Descrição do Salário Variável</label>
              <input
                id="dscSalVar"
                v-model="formData.dscSalVar.value"
                type="text"
                class="form-input"
                placeholder="Descrição da parte variável"
                :disabled="isLoading"
                maxlength="999"
              />
            </div>

            <div class="form-group small-field" v-if="formData.tpContr.value === '2'">
              <label for="dtTerm" class="form-label">Data de Término do Contrato</label>
              <input
                id="dtTerm"
                v-model="formData.dtTerm.value"
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
            {{ isLoading ? 'Salvando...' : 'Salvar Cadastro' }}
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
const tabId = 'esocial-s2200'
const { getFieldState, saveFieldState } = useTabState(tabId)

// Campos do formulário usando refs simples com estado preservado
const formData = {
  // Identificação do Trabalhador
  cpfTrab: ref(getFieldState('cpfTrab', '')),
  nisTrab: ref(getFieldState('nisTrab', '')),
  nmTrab: ref(getFieldState('nmTrab', '')),
  dtNascto: ref(getFieldState('dtNascto', '')),
  racaCor: ref(getFieldState('racaCor', '')),
  estCiv: ref(getFieldState('estCiv', '')),
  grauInstr: ref(getFieldState('grauInstr', '')),
  sexo: ref(getFieldState('sexo', '')),
  
  // Informações do Vínculo
  matricula: ref(getFieldState('matricula', '')),
  tpRegTrab: ref(getFieldState('tpRegTrab', '')),
  tpRegPrev: ref(getFieldState('tpRegPrev', '')),
  cadIni: ref(getFieldState('cadIni', 'S')),
  
  // Informações da Admissão
  dtAdm: ref(getFieldState('dtAdm', new Date().toISOString().split('T')[0])),
  tpAdmissao: ref(getFieldState('tpAdmissao', '1')),
  indAdmissao: ref(getFieldState('indAdmissao', '1')),
  tpRegJor: ref(getFieldState('tpRegJor', '')),
  natAtividade: ref(getFieldState('natAtividade', '')),
  dtBase: ref(getFieldState('dtBase', '')),
  
  // Informações do Cargo/Função
  codCargo: ref(getFieldState('codCargo', '')),
  codFuncao: ref(getFieldState('codFuncao', '')),
  codCateg: ref(getFieldState('codCateg', '')),
  codCBO: ref(getFieldState('codCBO', '')),
  
  // Remuneração
  vrSalFx: ref(getFieldState('vrSalFx', '')),
  undSalFixo: ref(getFieldState('undSalFixo', '')),
  dscSalVar: ref(getFieldState('dscSalVar', '')),
  tpContr: ref(getFieldState('tpContr', '')),
  dtTerm: ref(getFieldState('dtTerm', ''))
}

// Funções de formatação
const formatCPF = (event: Event) => {
  const target = event.target as HTMLInputElement
  let value = target.value.replace(/\D/g, '')
  value = value.replace(/(\d{3})(\d)/, '$1.$2')
  value = value.replace(/(\d{3})(\d)/, '$1.$2')
  value = value.replace(/(\d{3})(\d)/, '$1-$2')
  value = value.substring(0, 14)
  target.value = value
}

const formatNIS = (event: Event) => {
  const target = event.target as HTMLInputElement
  let value = target.value.replace(/\D/g, '')
  value = value.replace(/(\d{3})(\d)/, '$1.$2')
  value = value.replace(/(\d{5})(\d)/, '$1.$2')
  value = value.replace(/(\d{2})(\d)/, '$1-$2')
  value = value.substring(0, 14)
  target.value = value
}

const formatCBO = (event: Event) => {
  const target = event.target as HTMLInputElement
  let value = target.value.replace(/\D/g, '')
  value = value.replace(/(\d{4})(\d)/, '$1-$2')
  value = value.substring(0, 7)
  target.value = value
}

const formatMoney = (event: Event) => {
  const target = event.target as HTMLInputElement
  let value = target.value.replace(/\D/g, '')
  value = (parseInt(value) / 100).toFixed(2)
  value = value.replace('.', ',')
  value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  target.value = value
}

// Funções do formulário
const handleSubmit = async () => {
  isLoading.value = true
  
  try {
    // Aqui você implementaria a lógica de envio para o backend
    console.log('Dados do S-2200:', formData)
    
    // Simular delay de envio
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    alert('Cadastro do trabalhador S-2200 salvo com sucesso!')
  } catch (error) {
    console.error('Erro ao salvar:', error)
    alert('Erro ao salvar o cadastro. Tente novamente.')
  } finally {
    isLoading.value = false
  }
}

const resetForm = () => {
  Object.keys(formData).forEach(key => {
    if (key === 'dtAdm') {
      formData[key as keyof typeof formData].value = new Date().toISOString().split('T')[0]
    } else if (key === 'cadIni') {
      formData[key as keyof typeof formData].value = 'S'
    } else if (key === 'tpAdmissao' || key === 'indAdmissao') {
      formData[key as keyof typeof formData].value = '1'
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
.esocial-s2200-container {
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
  fill: var(--primary-color);
  flex-shrink: 0;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1rem;
  max-width: 100%;
  overflow: hidden;
}

.form-group {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.form-group.small-field {
  grid-column: span 3;
}

.form-group.medium-field {
  grid-column: span 4;
}

.form-group.large-field {
  grid-column: span 5;
}

.form-group.half-width {
  grid-column: span 6;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 0.25rem;
  user-select: none;
}

.form-input {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 0.875rem;
  background: var(--bg-primary);
  color: var(--text-primary);
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px var(--primary-color-alpha);
}

.form-input:disabled {
  background: var(--bg-disabled);
  color: var(--text-disabled);
  cursor: not-allowed;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--bg-hover);
}

.btn-primary {
  background: var(--primary-color);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--primary-color-hover);
}

.btn-icon {
  width: 16px;
  height: 16px;
  fill: currentColor;
}

.loading-spinner {
  width: 16px;
  height: 16px;
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
@media (max-width: 768px) {
  .esocial-s2200-container {
    padding: 0.5rem;
  }
  
  .esocial-form {
    padding: 1rem;
  }
  
  .form-grid {
    grid-template-columns: repeat(6, 1fr);
  }
  
  .form-group.small-field {
    grid-column: span 3;
  }
  
  .form-group.medium-field,
  .form-group.large-field {
    grid-column: span 6;
  }
  
  .form-group.half-width {
    grid-column: span 6;
  }
  
  .form-input {
    font-size: 16px; /* Previne zoom no iOS */
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .btn {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .form-group.small-field,
  .form-group.medium-field,
  .form-group.large-field,
  .form-group.half-width {
    grid-column: span 1;
  }
}

@media (min-width: 1200px) {
  .form-grid {
    grid-template-columns: repeat(16, 1fr);
  }
  
  .form-group.small-field {
    grid-column: span 3;
  }
  
  .form-group.medium-field {
    grid-column: span 4;
  }
  
  .form-group.large-field {
    grid-column: span 6;
  }
  
  .form-group.half-width {
    grid-column: span 8;
  }
}
</style>