<template>
  <div class="esocial-s2200-container">
     <div class="form-container">
      <!-- Card Heading -->
      <ESocialCardHeading
        title="eSocial S-2200"
        subtitle="Processamento e Envio - Cadastramento Inicial do Vínculo"
        badge="Processamento"
        :icon-path="'M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z'"
      />

      <div class="esocial-form">
        <!-- Seção: Filtros de Consulta -->
        <div class="form-section">
          <h2 class="section-title">
            <div class="section-title-content">
              <svg class="section-icon" viewBox="0 0 24 24">
                <path d="M14,12V19.88C14.04,20.18 13.94,20.5 13.71,20.71C13.32,21.1 12.69,21.1 12.3,20.71L10.29,18.7C10.06,18.47 9.96,18.16 10,17.87V12H9.97L4.21,4.62C3.87,4.19 3.95,3.56 4.38,3.22C4.57,3.08 4.78,3 5,3V3H19V3C19.22,3 19.43,3.08 19.62,3.22C20.05,3.56 20.13,4.19 19.79,4.62L14.03,12H14Z"/>
              </svg>
              Filtros de Consulta
            </div>
            <button @click="toggleFilters" class="toggle-filters-btn" :title="filtersExpanded ? 'Recolher filtros' : 'Expandir filtros'">
              <svg class="toggle-icon" :class="{ 'rotated': !filtersExpanded }" viewBox="0 0 24 24">
                <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/>
              </svg>
            </button>
          </h2>

          <div v-show="filtersExpanded" class="filters-content">
          <div class="form-grid">
            <div class="form-group">
              <label for="filterCpf" class="form-label">CPF do Trabalhador</label>
              <input
                 id="filterCpf"
                 v-model="cpfFilter"
                 type="text"
                 class="form-input"
                 :class="{ 'error': cpfFilterError }"
                 placeholder="000.000.000-00"
                 @input="formatFilterCPF"
                 maxlength="14"
               />
               <span v-if="cpfFilterError" class="error-message">{{ cpfFilterError }}</span>
            </div>

            <div class="form-group">
              <label for="filterMatricula" class="form-label">Matrícula</label>
              <input
                 id="filterMatricula"
                 v-model="matriculaFilter"
                 type="text"
                 class="form-input"
                 :class="{ 'error': matriculaFilterError }"
                 placeholder="Digite a matrícula"
               />
               <span v-if="matriculaFilterError" class="error-message">{{ matriculaFilterError }}</span>
            </div>

            <div class="form-group">
              <label for="filterStatus" class="form-label">Status</label>
              <select
                 id="filterStatus"
                 v-model="statusFilter"
                 class="form-input"
               >
                <option value="">Todos os status</option>
                <option value="pendente">Pendente</option>
                <option value="processando">Processando</option>
                <option value="enviado">Enviado</option>
                <option value="sucesso">Sucesso</option>
                <option value="erro">Erro</option>
                <option value="critica">Crítica</option>
              </select>
            </div>

            <div class="form-group">
              <label for="filterEvento" class="form-label">Evento</label>
              <select
                 id="filterEvento"
                 v-model="eventoFilter"
                 class="form-input"
               >
                <option value="">Todos os eventos</option>
                <option value="S-2200">S-2200 - Cadastramento Inicial</option>
                <option value="S-2300">S-2300 - Trabalhador Sem Vínculo</option>
                <option value="S-2400">S-2400 - Cadastro de Beneficiário</option>
              </select>
            </div>

            <div class="form-group">
              <label for="filterDataInicio" class="form-label">Data Início</label>
              <input
                 id="filterDataInicio"
                 v-model="dataInicioFilter"
                 type="date"
                 class="form-input"
               />
            </div>

            <div class="form-group">
              <label for="filterDataFim" class="form-label">Data Fim</label>
              <input
                 id="filterDataFim"
                 v-model="dataFimFilter"
                 type="date"
                 class="form-input"
               />
            </div>


          </div>

          <div class="form-actions">
            <button @click="applyFilters" type="button" class="btn btn-primary">
              <svg class="btn-icon" viewBox="0 0 24 24">
                <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/>
              </svg>
              Aplicar Filtros
            </button>
            <button @click="clearFilters" type="button" class="btn btn-secondary">
              <svg class="btn-icon" viewBox="0 0 24 24">
                <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
              </svg>
              Limpar Filtros
            </button>
          </div>
          </div>
        </div>

        <!-- Seção: Dados do Processamento -->
        <div class="form-section">
          <h2 class="section-title">
            <svg class="section-icon" viewBox="0 0 24 24">
              <path d="M3,3H21V5H3V3M3,7H21V9H3V7M3,11H21V13H3V11M3,15H21V17H3V15M3,19H21V21H3V19Z"/>
            </svg>
            Dados do Processamento ({{ totalItems }} registros)
          </h2>

          <!-- Controles da tabela -->
          <div class="table-controls">
            <div class="table-controls-left">
              <div class="items-per-page">
                <label for="itemsPerPage" class="control-label">Mostrar:</label>
                <select id="itemsPerPage" v-model="itemsPerPage" class="items-select">
                  <option value="all">Todos</option>
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
                <span class="control-label">registros</span>
              </div>
            </div>
            <div class="table-controls-right">
              <div class="status-filter-container">
                 <div class="radio-group">
                   <label class="radio-item">
                     <input type="radio" v-model="statusFilterRadio" value="all" />
                     <span>Todos os registros</span>
                   </label>
                   <label class="radio-item">
                     <input type="radio" v-model="statusFilterRadio" value="success" />
                     <span>Processados com sucesso</span>
                   </label>
                   <label class="radio-item">
                     <input type="radio" v-model="statusFilterRadio" value="critics" />
                     <span>Criticados pelo eSocial</span>
                   </label>
                   <label class="radio-item">
                     <input type="radio" v-model="statusFilterRadio" value="error" />
                     <span>Com erros</span>
                   </label>
                 </div>
               </div>
              <div class="search-container">
                <svg class="search-icon" viewBox="0 0 24 24">
                  <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/>
                </svg>
                <input
                  id="searchFilter"
                  v-model="searchFilter"
                  type="text"
                  class="search-input"
                  placeholder="Buscar..."
                />
              </div>
            </div>
          </div>

          <!-- Sistema de Abas -->
          <div class="tabs-container">
            <!-- Navegação das Abas -->
            <div class="tabs-navigation">
              <button
                @click="activeTab = 'grid'"
                :class="['tab-button', { active: activeTab === 'grid' }]">
                <svg class="tab-icon" viewBox="0 0 24 24">
                  <path d="M3,3H21V5H3V3M3,7H21V9H3V7M3,11H21V13H3V11M3,15H21V17H3V15M3,19H21V21H3V19Z"/>
                </svg>
                Grid de Dados
              </button>

              <button
                @click="activeTab = 'stats'"
                :class="['tab-button', { active: activeTab === 'stats' }]">
                <svg class="tab-icon" viewBox="0 0 24 24">
                  <path d="M11,2V22C5.9,21.5 2,17.2 2,12S5.9,2.5 11,2M13,2V11H22C22,6.8 18.2,3 13,2M13,13V22C18.1,21.5 22,17.2 22,13H13Z"/>
                </svg>
                Estatísticas
              </button>
            </div>

            <!-- Conteúdo das Abas -->
            <div class="tabs-content">
              <!-- Aba 1: Grid de Dados -->
              <div v-show="activeTab === 'grid'" class="tab-panel">
                <div class="table-container" @contextmenu="showContextMenu" @click="hideContextMenu">
                  <table class="data-table">
                    <thead>
                      <tr>
                        <th class="checkbox-column">
                          <input type="checkbox" @change="(event) => toggleSelectAll(event, paginatedData)" />
                        </th>
                        <th>CPF</th>
                        <th>Matrícula</th>
                        <th>Nome</th>
                        <th>Evento</th>
                        <th>Data Processamento</th>
                        <th>Nro do Protocolo</th>
                        <th>Nro do Recibo</th>
                        <th>Nro Recibo Exclusão</th>
                        <th>Ações</th>
                        <th class="loading-column" :class="{ 'visible': processingItems.length > 0 }">Processando</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in paginatedData" :key="item.id"
                          :class="getRowProcessingClass(item.id)">
                        <td class="checkbox-column">
                          <input type="checkbox" :value="item.id" v-model="selectedItems" />
                        </td>
                        <td>{{ formatCPFDisplay(item.cpf) }}</td>
                        <td>{{ item.matricula }}</td>
                        <td>{{ item.nome }}</td>
                        <td>{{ item.evento }}</td>
                        <td>{{ formatDateTime(item.dataProcessamento) }}</td>
                        <td>{{ item.nroProtocolo || '' }}</td>
                        <td>{{ item.nroRecibo || '' }}</td>
                        <td>{{ item.nroReciboExclusao || '' }}</td>
                        <td>
                          <div class="action-buttons">
                            <button v-if="canRetify(item.status)" @click="retifyData(item)" class="btn-action" title="Retificar">
                              <svg viewBox="0 0 24 24">
                                <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z"/>
                              </svg>
                            </button>
                            <button v-if="canProcess(item.status)" @click="processItem(item)" class="btn-action" title="Processar">
                              <svg viewBox="0 0 24 24">
                                <path d="M8,5.14V19.14L19,12.14L8,5.14Z"/>
                              </svg>
                            </button>
                          </div>
                        </td>
                        <td class="loading-column" :class="{ 'visible': processingItems.length > 0 }">
                          <div v-if="processingItems.includes(item.id)" class="loading-spinner"></div>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <!-- Menu de Contexto -->
                  <div v-if="contextMenuVisible"
                       class="context-menu"
                       :style="{ top: contextMenuY + 'px', left: contextMenuX + 'px' }">
                    <ul class="context-menu-list">
                      <li @click="() => selectAllItems(paginatedData)" class="context-menu-item">
                        Selecionar todos
                      </li>
                      <li @click="deselectAllItems" class="context-menu-item">
                        Desmarcar todos
                      </li>
                      <li @click="processSelectedItems" class="context-menu-item" :class="{ disabled: selectedItems.length === 0 }">
                        Processar registros selecionados
                      </li>
                      <li @click="retifySelectedItems" class="context-menu-item" :class="{ disabled: selectedItems.length === 0 }">
                        Retificar registros selecionados
                      </li>
                      <li @click="deleteSelectedItems" class="context-menu-item" :class="{ disabled: selectedItems.length === 0 }">
                        Exclusão, enviar evento S3000 dos arquivos selecionados
                      </li>
                    </ul>
                  </div>
                </div>

                <!-- Paginação -->
                <div class="pagination-container">
                  <div class="pagination-info">
                    <span v-if="itemsPerPage === 'all'">
                      Mostrando todos os {{ totalItems }} registros
                    </span>
                    <span v-else>
                      Mostrando {{ (currentPage - 1) * effectiveItemsPerPage + 1 }} a {{ Math.min(currentPage * effectiveItemsPerPage, totalItems) }} de {{ totalItems }} registros
                    </span>
                  </div>
                  <div class="pagination-controls" v-if="itemsPerPage !== 'all'">
                    <button @click="currentPage = Math.max(1, currentPage - 1)" :disabled="currentPage === 1" class="btn btn-secondary">
                      Anterior
                    </button>
                    <span class="page-info">Página {{ currentPage }} de {{ totalPages }}</span>
                    <button @click="currentPage = Math.min(totalPages, currentPage + 1)" :disabled="currentPage >= totalPages" class="btn btn-secondary">
                      Próxima
                    </button>
                  </div>
                </div>

                <!-- Ações em Lote -->
                <div class="form-actions">
                  <button @click="processSelectedData" :disabled="selectedItems.length === 0" class="btn btn-primary">
                    <svg class="btn-icon" viewBox="0 0 24 24">
                      <path d="M8,5.14V19.14L19,12.14L8,5.14Z"/>
                    </svg>
                    Processar Selecionados ({{ selectedItems.length }})
                  </button>
                  <button @click="generateCriticsReport" class="btn btn-secondary">
                    <svg class="btn-icon" viewBox="0 0 24 24">
                      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                    </svg>
                    Relatório de Críticas
                  </button>
                </div>
              </div>



              <!-- Aba 3: Estatísticas -->
              <div v-show="activeTab === 'stats'" class="tab-panel">
                <div class="stats-container">
                  <div class="stats-header">
                    <h3 class="stats-title">
                      <svg class="stats-icon" viewBox="0 0 24 24">
                        <path d="M16,11.78L20.24,4.45L21.97,5.45L16.74,14.5L10.23,10.75L5.46,19H22V21H2V3H4V17.54L9.5,8L16,11.78Z"/>
                      </svg>
                      Estatísticas de Processamento ao Longo do Tempo
                    </h3>
                  </div>
                  <div class="chart-container-large">
                    <Line :data="chartData" :options="chartOptions" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import ESocialCardHeading from '../../esocial/components/ESocialCardHeading.vue'
import { useTabState } from '@/composables/useTabState'

// Estados do componente
const isLoading = ref(false)

// Sistema de preservação de estado
const tabId = 'add-user'
const { getFieldState, saveFieldState } = useTabState(tabId)

// Campos do formulário usando refs simples com estado preservado
const formData = {
  // Informações de Acesso
  usuario: ref(getFieldState('usuario', '') as string),
  status: ref(getFieldState('status', 'ativo') as string),
  senha: ref(getFieldState('senha', '') as string),
  confirmarSenha: ref(getFieldState('confirmarSenha', '') as string),

  // Informações Profissionais
  cargo: ref(getFieldState('cargo', '') as string),
  departamento: ref(getFieldState('departamento', '') as string),
  dataAdmissao: ref(getFieldState('dataAdmissao', '') as string),
  salario: ref(getFieldState('salario', '') as string),

  // Permissões
  permissoes: ref(getFieldState('permissoes', []) as string[])
}

// Funções de validação
const validatePassword = (): string | null => {
  if (formData.senha.value !== formData.confirmarSenha.value) {
    return 'As senhas não coincidem'
  }
  if (formData.senha.value.length < 6) {
    return 'A senha deve ter pelo menos 6 caracteres'
  }
  return null
}

const validateUsername = (): string | null => {
  if (formData.usuario.value.length < 3) {
    return 'O nome de usuário deve ter pelo menos 3 caracteres'
  }
  return null
}

// Funções do formulário
const saveUser = async () => {
  isLoading.value = true

  try {
    // Validações
    const passwordError = validatePassword()
    const usernameError = validateUsername()

    if (passwordError) {
      alert(passwordError)
      return
    }

    if (usernameError) {
      alert(usernameError)
      return
    }

    // Preparar dados para envio
    const userData = {
      usuario: formData.usuario.value,
      status: formData.status.value,
      senha: formData.senha.value,
      cargo: formData.cargo.value,
      departamento: formData.departamento.value,
      dataAdmissao: formData.dataAdmissao.value,
      salario: formData.salario.value ? parseFloat(formData.salario.value) : null,
      permissoes: formData.permissoes.value
    }

    // Aqui você implementaria a lógica de envio para o backend
    console.log('Dados do usuário:', userData)

    // Simular delay de envio
    await new Promise(resolve => setTimeout(resolve, 2000))

    alert('Usuário cadastrado com sucesso!')

    // Limpar formulário após sucesso
    resetForm()

  } catch (error) {
    console.error('Erro ao salvar usuário:', error)
    alert('Erro ao cadastrar usuário. Tente novamente.')
  } finally {
    isLoading.value = false
  }
}

const resetForm = () => {
  Object.keys(formData).forEach(key => {
    const fieldKey = key as keyof typeof formData
    if (key === 'status') {
      (formData[fieldKey] as any).value = 'ativo'
    } else if (key === 'permissoes') {
      (formData[fieldKey] as any).value = []
    } else {
      (formData[fieldKey] as any).value = ''
    }
    // Salvar estado limpo
    saveFieldState(key, (formData[fieldKey] as any).value)
  })
}

// Configurar auto-save do estado
onMounted(() => {
  // Configurar watchers para auto-salvar quando campos mudarem
  Object.keys(formData).forEach(key => {
    const fieldKey = key as keyof typeof formData
    watch(
      () => (formData[fieldKey] as any).value,
      (newValue) => {
        saveFieldState(key, newValue)
      },
      { immediate: false }
    )
  })
})
</script>

<style scoped>
/* Estilos específicos do AddUser (estilos globais aplicados via main.css) */

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
  align-items: start;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
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

.form-group.full-field {
  grid-column: span 12;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 0.25rem;
}

.form-input {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 0.875rem;
  background: var(--input-background);
  color: var(--text-primary);
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px var(--primary-color-alpha);
}

.form-input:disabled {
  background: var(--input-disabled-background);
  color: var(--text-disabled);
  cursor: not-allowed;
}

.permissions-grid {
  margin-top: 1rem;
}

.permissions-table {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  background: var(--table-header-background);
  border-bottom: 1px solid var(--border-color);
}

.header-cell {
  padding: 0.75rem;
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--text-secondary);
  text-align: center;
}

.header-cell.module-header {
  text-align: left;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  border-bottom: 1px solid var(--border-color);
}

.table-row:last-child {
  border-bottom: none;
}

.table-row:nth-child(even) {
  background: var(--table-row-even-background);
}

.cell {
  padding: 0.75rem;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cell.module-name {
  justify-content: flex-start;
}

.cell input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.cell input[type="checkbox"]:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.btn-secondary {
  background: var(--button-secondary-background);
  color: var(--button-secondary-color);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--button-secondary-hover-background);
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
  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-group.small-field,
  .form-group.medium-field,
  .form-group.large-field {
    grid-column: span 1;
  }

  .table-header,
  .table-row {
    grid-template-columns: 1fr;
  }

  .header-cell,
  .cell {
    text-align: left;
    justify-content: flex-start;
  }

  .form-actions {
    flex-direction: column;
    gap: 1rem;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
