<template>
  <div class="form-state-example">
    <h1>Exemplo de Uso do Sistema Global de Estado</h1>
    
    <!-- Informações do Estado -->
    <div class="state-info">
      <h3>Informações do Estado</h3>
      <p><strong>Form ID:</strong> {{ formState.formId }}</p>
      <p><strong>Registrado:</strong> {{ formState.isRegistered ? 'Sim' : 'Não' }}</p>
      <p><strong>Última Atualização:</strong> {{ formState.lastUpdated }}</p>
      <p><strong>Versão:</strong> {{ formState.version }}</p>
      <p><strong>Modificado:</strong> {{ formState.isDirty ? 'Sim' : 'Não' }}</p>
    </div>

    <!-- Formulário Principal -->
    <div class="main-form">
      <h3>Dados Pessoais</h3>
      <form @submit.prevent="salvarFormulario">
        <div class="form-grid">
          <div class="form-group">
            <label>Nome Completo:</label>
            <input 
              v-model="campos.nome.value" 
              type="text" 
              placeholder="Digite seu nome"
              :class="{ 'error': campos.nome.error }"
            />
            <span v-if="campos.nome.error" class="error-message">
              {{ campos.nome.error }}
            </span>
          </div>

          <div class="form-group">
            <label>Email:</label>
            <input 
              v-model="campos.email.value" 
              type="email" 
              placeholder="seu@email.com"
              :class="{ 'error': campos.email.error }"
            />
            <span v-if="campos.email.error" class="error-message">
              {{ campos.email.error }}
            </span>
          </div>

          <div class="form-group">
            <label>Idade:</label>
            <input 
              v-model="campos.idade.value" 
              type="number" 
              min="0" 
              max="120"
              placeholder="Sua idade"
            />
          </div>

          <div class="form-group">
            <label>Profissão:</label>
            <select v-model="campos.profissao.value">
              <option value="">Selecione...</option>
              <option value="desenvolvedor">Desenvolvedor</option>
              <option value="designer">Designer</option>
              <option value="gerente">Gerente</option>
              <option value="analista">Analista</option>
              <option value="outro">Outro</option>
            </select>
          </div>

          <div class="form-group full-width">
            <label>Observações:</label>
            <textarea 
              :value="String(campos.observacoes.value.value || '')" 
              @input="campos.observacoes.setValue(($event.target as HTMLTextAreaElement).value)"
              rows="3"
              placeholder="Observações adicionais..."
            ></textarea>
          </div>

          <div class="form-group">
            <label>
              <input 
                v-model="campos.ativo.value" 
                type="checkbox"
              />
              Usuário Ativo
            </label>
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary">
            Salvar Dados
          </button>
          <button type="button" @click="limparFormulario" class="btn btn-secondary">
            Limpar
          </button>
          <button type="button" @click="exportarEstado" class="btn btn-info">
            Exportar Estado
          </button>
        </div>
      </form>
    </div>

    <!-- Filtros e Busca -->
    <div class="filters-section">
      <h3>Filtros e Busca</h3>
      <div class="filters-grid">
        <div class="form-group">
          <label>Busca Global:</label>
          <input 
            v-model="filters.searchTerm" 
            type="text" 
            placeholder="Buscar em todos os campos..."
          />
        </div>

        <div class="form-group">
          <label>Status:</label>
          <select v-model="filtroStatus.value">
            <option value="">Todos</option>
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </select>
        </div>

        <div class="form-group">
          <label>Ordenar por:</label>
          <select @change="alterarOrdenacao">
            <option value="nome:asc">Nome (A-Z)</option>
            <option value="nome:desc">Nome (Z-A)</option>
            <option value="idade:asc">Idade (Menor)</option>
            <option value="idade:desc">Idade (Maior)</option>
          </select>
        </div>

        <div class="form-group">
          <button @click="filters.toggleExpanded?.()" class="btn btn-outline">
            {{ filters.expanded ? 'Recolher' : 'Expandir' }} Filtros
          </button>
        </div>
      </div>

      <div v-if="filters.expanded" class="expanded-filters">
        <h4>Filtros Avançados</h4>
        <div class="filters-grid">
          <div class="form-group">
            <label>Idade Mínima:</label>
            <input v-model="filtroIdadeMin.value" type="number" min="0" />
          </div>
          <div class="form-group">
            <label>Idade Máxima:</label>
            <input v-model="filtroIdadeMax.value" type="number" max="120" />
          </div>
        </div>
        <button @click="filters.clearFilters?.()" class="btn btn-warning">
          Limpar Filtros
        </button>
      </div>
    </div>

    <!-- Lista de Dados Mockados -->
    <div class="data-list">
      <h3>Lista de Usuários ({{ dadosFiltrados.length }} registros)</h3>
      
      <!-- Seleção -->
      <div class="selection-controls">
        <label>
          <input 
            type="checkbox" 
            :checked="selection.selectAll"
            @change="selection.toggleSelectAll?.()"
          />
          Selecionar Todos
        </label>
        <span class="selection-count">
          {{ selection.selectedItems.length }} selecionados
        </span>
        <button 
          v-if="selection.selectedItems.length > 0"
          @click="removerSelecionados"
          class="btn btn-danger btn-sm"
        >
          Remover Selecionados
        </button>
      </div>

      <!-- Tabela -->
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th width="50">Sel.</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Idade</th>
              <th>Profissão</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="item in dadosPaginados" 
              :key="item.id"
              :class="{ 'selected': selection.selectedItems.includes(item.id) }"
            >
              <td>
                <input 
                  type="checkbox" 
                  :checked="selection.selectedItems.includes(item.id)"
                  @change="toggleItemSelection(item.id)"
                />
              </td>
              <td>{{ item.nome }}</td>
              <td>{{ item.email }}</td>
              <td>{{ item.idade }}</td>
              <td>{{ item.profissao }}</td>
              <td>
                <span :class="`status ${item.ativo ? 'ativo' : 'inativo'}`">
                  {{ item.ativo ? 'Ativo' : 'Inativo' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginação -->
      <div class="pagination">
        <button 
          @click="pagination.setPage?.(pagination.currentPage - 1)"
          :disabled="pagination.currentPage === 1"
          class="btn btn-outline"
        >
          Anterior
        </button>
        
        <span class="page-info">
          Página {{ pagination.currentPage }} de {{ totalPaginas }}
          ({{ pagination.totalItems }} registros)
        </span>
        
        <button 
          @click="pagination.setPage?.(pagination.currentPage + 1)"
          :disabled="pagination.currentPage >= totalPaginas"
          class="btn btn-outline"
        >
          Próxima
        </button>
        
        <select 
          :value="pagination.itemsPerPage"
          @change="pagination.setItemsPerPage?.(Number(($event.target as HTMLSelectElement)?.value || '10'))"
          class="items-per-page"
        >
          <option value="5">5 por página</option>
          <option value="10">10 por página</option>
          <option value="20">20 por página</option>
          <option value="50">50 por página</option>
        </select>
      </div>
    </div>

    <!-- Estado Atual (Debug) -->
    <div class="debug-section">
      <h3>Estado Atual (Debug)</h3>
      <details>
        <summary>Ver Estado Completo</summary>
        <pre>{{ JSON.stringify(formState.exportState(), null, 2) }}</pre>
      </details>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useFormState } from '@/composables/useFormState'

// Configurar o sistema de estado
const formState = useFormState({
  formId: 'form-state-example',
  autoSave: true,
  persistToLocalStorage: true,
  restoreOnMount: true,
  debounceMs: 300
})

// Campos do formulário principal
const campos = {
  nome: formState.field('nome', { 
    defaultValue: '', 
    type: 'string',
    validator: (value: unknown) => {
      const str = String(value || '')
      if (!str.trim()) return 'Nome é obrigatório'
      if (str.length < 2) return 'Nome deve ter pelo menos 2 caracteres'
      return true
    }
  }),
  email: formState.field('email', { 
    defaultValue: '', 
    type: 'string',
    validator: (value: unknown) => {
      const str = String(value || '')
      if (!str.trim()) return 'Email é obrigatório'
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(str)) return 'Email inválido'
      return true
    }
  }),
  idade: formState.field('idade', { 
    defaultValue: 0, 
    type: 'number' 
  }),
  profissao: formState.field('profissao', { 
    defaultValue: '', 
    type: 'string' 
  }),
  observacoes: formState.field('observacoes', { 
    defaultValue: '', 
    type: 'string' 
  }),
  ativo: formState.field('ativo', { 
    defaultValue: true, 
    type: 'boolean' 
  })
}

// Campos de filtro
const filtroStatus = formState.field('filtroStatus', { 
  defaultValue: '', 
  type: 'string' 
})
const filtroIdadeMin = formState.field('filtroIdadeMin', { 
  defaultValue: 0, 
  type: 'number' 
})
const filtroIdadeMax = formState.field('filtroIdadeMax', { 
  defaultValue: 120, 
  type: 'number' 
})

// Acessar sistemas de estado
const { filters, pagination, selection } = formState

// Dados mockados
const dadosMockados = ref([
  { id: 1, nome: 'João Silva', email: 'joao@email.com', idade: 30, profissao: 'desenvolvedor', ativo: true },
  { id: 2, nome: 'Maria Santos', email: 'maria@email.com', idade: 25, profissao: 'designer', ativo: true },
  { id: 3, nome: 'Pedro Costa', email: 'pedro@email.com', idade: 35, profissao: 'gerente', ativo: false },
  { id: 4, nome: 'Ana Oliveira', email: 'ana@email.com', idade: 28, profissao: 'analista', ativo: true },
  { id: 5, nome: 'Carlos Ferreira', email: 'carlos@email.com', idade: 42, profissao: 'desenvolvedor', ativo: true },
  { id: 6, nome: 'Lucia Mendes', email: 'lucia@email.com', idade: 31, profissao: 'designer', ativo: false },
  { id: 7, nome: 'Roberto Lima', email: 'roberto@email.com', idade: 38, profissao: 'gerente', ativo: true },
  { id: 8, nome: 'Fernanda Rocha', email: 'fernanda@email.com', idade: 26, profissao: 'analista', ativo: true },
  { id: 9, nome: 'Marcos Alves', email: 'marcos@email.com', idade: 33, profissao: 'outro', ativo: false },
  { id: 10, nome: 'Patricia Gomes', email: 'patricia@email.com', idade: 29, profissao: 'desenvolvedor', ativo: true }
])

// Dados filtrados
const dadosFiltrados = computed(() => {
  let dados = dadosMockados.value
  
  // Filtro por busca global
  if (filters.value.searchTerm) {
    const termo = filters.value.searchTerm.toLowerCase()
    dados = dados.filter(item => 
      item.nome.toLowerCase().includes(termo) ||
      item.email.toLowerCase().includes(termo) ||
      item.profissao.toLowerCase().includes(termo)
    )
  }
  
  // Filtro por status
  if (filtroStatus.value) {
    const ativo = String(filtroStatus.value) === 'ativo'
    dados = dados.filter(item => item.ativo === ativo)
  }
  
  // Filtro por idade
  const idadeMin = Number(filtroIdadeMin.value) || 0
  const idadeMax = Number(filtroIdadeMax.value) || 120
  if (idadeMin > 0) {
    dados = dados.filter(item => item.idade >= idadeMin)
  }
  if (idadeMax < 120) {
    dados = dados.filter(item => item.idade <= idadeMax)
  }
  
  // Ordenação
  if (filters.value.sortBy) {
    dados.sort((a, b) => {
      const campo = filters.value.sortBy as keyof typeof a
      const valorA = a[campo]
      const valorB = b[campo]
      
      if (filters.value.sortOrder === 'desc') {
        return valorB > valorA ? 1 : -1
      }
      return valorA > valorB ? 1 : -1
    })
  }
  
  return dados
})

// Dados paginados
const dadosPaginados = computed(() => {
  const inicio = (pagination.value.currentPage - 1) * pagination.value.itemsPerPage
  const fim = inicio + pagination.value.itemsPerPage
  return dadosFiltrados.value.slice(inicio, fim)
})

// Total de páginas
const totalPaginas = computed(() => {
  return Math.ceil(dadosFiltrados.value.length / pagination.value.itemsPerPage)
})

// Atualizar total de itens quando dados filtrados mudarem
watch(dadosFiltrados, (newValue: typeof dadosFiltrados.value) => {
  pagination.value.setTotalItems?.(newValue.length)
}, { immediate: true })

// Funções
const salvarFormulario = () => {
  // Validar campos
  const erros = []
  if (!campos.nome.isValid) erros.push('Nome inválido')
  if (!campos.email.isValid) erros.push('Email inválido')
  
  if (erros.length > 0) {
    alert('Corrija os erros: ' + erros.join(', '))
    return
  }
  
  const dados = {
    nome: campos.nome.value,
    email: campos.email.value,
    idade: campos.idade.value,
    profissao: campos.profissao.value,
    observacoes: campos.observacoes.value,
    ativo: campos.ativo.value
  }
  
  console.log('Salvando dados:', dados)
  alert('Dados salvos com sucesso!')
}

const limparFormulario = () => {
  Object.values(campos).forEach(campo => campo.reset())
}

const exportarEstado = () => {
  const estado = formState.exportState()
  const blob = new Blob([JSON.stringify(estado, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'form-state-export.json'
  a.click()
  URL.revokeObjectURL(url)
}

const alterarOrdenacao = (event: Event) => {
  const target = event.target as HTMLSelectElement | null
  if (!target) return
  const [campo, ordem] = target.value.split(':')
  filters.value.setSorting?.(campo, ordem as 'asc' | 'desc')
}

const toggleItemSelection = (id: number) => {
  const selecionados = [...selection.value.selectedItems]
  const index = selecionados.indexOf(id)
  
  if (index > -1) {
    selecionados.splice(index, 1)
  } else {
    selecionados.push(id)
  }
  
  selection.value.setSelectedItems?.(selecionados)
}

const removerSelecionados = () => {
  if (confirm(`Remover ${selection.value.selectedItems.length} itens selecionados?`)) {
    dadosMockados.value = dadosMockados.value.filter(
      item => !selection.value.selectedItems.includes(item.id)
    )
    selection.value.setSelectedItems?.([])
  }
}

// Inicialização
onMounted(() => {
  console.log('Exemplo de Form State carregado')
  console.log('Estado inicial:', formState.exportState())
})
</script>

<style scoped>
.form-state-example {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.state-info {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 2rem;
}

.state-info h3 {
  margin-top: 0;
  color: #495057;
}

.main-form, .filters-section, .data-list {
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #495057;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #80bdff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.form-group input.error {
  border-color: #dc3545;
}

.error-message {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #545b62;
}

.btn-info {
  background-color: #17a2b8;
  color: white;
}

.btn-info:hover:not(:disabled) {
  background-color: #117a8b;
}

.btn-outline {
  background-color: transparent;
  color: #007bff;
  border: 1px solid #007bff;
}

.btn-outline:hover:not(:disabled) {
  background-color: #007bff;
  color: white;
}

.btn-warning {
  background-color: #ffc107;
  color: #212529;
}

.btn-warning:hover:not(:disabled) {
  background-color: #e0a800;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background-color: #c82333;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.expanded-filters {
  border-top: 1px solid #dee2e6;
  padding-top: 1rem;
  margin-top: 1rem;
}

.selection-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 4px;
}

.selection-count {
  font-weight: 600;
  color: #495057;
}

.table-container {
  overflow-x: auto;
  margin-bottom: 1rem;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #dee2e6;
}

.data-table th,
.data-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #dee2e6;
}

.data-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #495057;
}

.data-table tr:hover {
  background-color: #f8f9fa;
}

.data-table tr.selected {
  background-color: #e3f2fd;
}

.status {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 600;
}

.status.ativo {
  background-color: #d4edda;
  color: #155724;
}

.status.inativo {
  background-color: #f8d7da;
  color: #721c24;
}

.pagination {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.page-info {
  font-weight: 600;
  color: #495057;
}

.items-per-page {
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
}

.debug-section {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 1.5rem;
}

.debug-section details {
  margin-top: 1rem;
}

.debug-section pre {
  background: #ffffff;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 1rem;
  overflow-x: auto;
  font-size: 0.875rem;
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .form-state-example {
    padding: 1rem;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .filters-grid {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
    justify-content: center;
  }
  
  .pagination {
    flex-direction: column;
    align-items: stretch;
  }
  
  .selection-controls {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>