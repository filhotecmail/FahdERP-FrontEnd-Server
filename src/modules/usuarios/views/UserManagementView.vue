<template>
  <div class="esocial-processing-container">
    <div class="form-container">
      <!-- Card Heading -->
      <div class="card-heading">
        <div class="heading-content">
          <div class="heading-icon">
            <svg viewBox="0 0 24 24">
              <path d="M16,4C16.88,4 17.67,4.38 18.18,5H20C21.11,5 22,5.89 22,7V19C22,20.11 21.11,21 20,21H4C2.89,21 2,20.11 2,19V7C2,5.89 2.89,5 4,5H5.82C6.33,4.38 7.12,4 8,4H16M8,6A1,1 0 0,0 7,7A1,1 0 0,0 8,8H16A1,1 0 0,0 17,7A1,1 0 0,0 16,6H8M4,9V19H20V9H4M6,11H8V13H6V11M6,15H14V17H6V15M16,11H18V13H16V11M10,11H14V13H10V11Z"/>
            </svg>
          </div>
          <div class="heading-text">
            <h1 class="heading-title">Gerenciamento de Usuários Cadastrados no Sistema</h1>
            <p class="heading-subtitle">Template padrão para gerenciamento de usuários</p>
          </div>
          <div class="heading-badge">Usuários</div>
        </div>
      </div>

      <div class="esocial-form">
        <!-- Seção: Dados dos Usuários -->
        <div class="form-section">
          <h2 class="section-title">
            <div class="section-title-content">
              <svg class="section-icon" viewBox="0 0 24 24">
                <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
              </svg>
              Dados dos Usuários
            </div>
          </h2>

          <div class="table-controls">
            <div class="table-controls-left">
              <div class="items-per-page">
                <label for="itemsPerPage">Mostrar</label>
                <select id="itemsPerPage" class="form-input small" v-model="limit">
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                  <option value="10000000">Todos</option>
                </select>
                <span>registros</span>
              </div>
            </div>
            <div class="table-controls-right">
              <div class="search-box">
                <input
                  type="text"
                  class="form-input"
                  placeholder="Buscar usuários..."
                  v-model="searchQuery"
                  @keydown.enter.prevent="page = 1; loadUsers()"
                />
                <svg class="search-icon" viewBox="0 0 24 24">
                  <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- Tabela -->
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th class="checkbox-column">
                    <div class="checkbox-placeholder"></div>
                  </th>
                  <th>Nome</th>
                  <th>Sobrenome</th>
                  <th>E-mail</th>
                  <th>Nroº CPF</th>
                  <th>Grupo</th>
                  <th>Cargo</th>
                  <th>Status</th>
                  <th>Data Cadastro</th>
                  <th>Último Acesso</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="!loading && users.length === 0">
                  <td colspan="8" class="empty-state">
                    <div class="empty-content">
                      <svg class="empty-icon" viewBox="0 0 24 24">
                        <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z"/>
                      </svg>
                      <p class="empty-text">Nenhum usuário encontrado</p>
                      <p class="empty-subtext">Os dados dos usuários serão exibidos aqui</p>
                    </div>
                  </td>
                </tr>
                <tr v-else v-for="u in users" :key="u.idpk">
                  <td class="checkbox-column">
                    <div class="checkbox-placeholder"></div>
                  </td>
                  <td>{{ u.nome }}</td>
                  <td>{{ u.sobrenome }}</td>
                  <td>{{ u.email }}</td>
                  <td>{{ u.cpf }}</td>
                  <td>{{ u.grupo }}</td>
                  <td>{{ u.cargo }}</td>
                  <td>{{ u.statusstr }}</td>
                  <td>{{ formatBR12(u.dhc) }}</td>
                  <td>-</td>
                  <td>-</td>
                  <td>
                    <div class="btn btn-secondary">Detalhes</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Paginação -->
          <div class="pagination-container">
            <div class="pagination-info">
              <span>Mostrando {{ users.length }} de {{ total }} registros</span>
            </div>
            <div class="pagination-controls">
              <button class="btn btn-secondary" :class="{ disabled: page === 1 }" @click="prevPage">Anterior</button>
              <span class="page-info">Página {{ page }} de {{ pages }}</span>
              <button class="btn btn-secondary" :class="{ disabled: page === pages }" @click="nextPage">Próxima</button>
            </div>
          </div>

          <!-- Ações em Lote -->
          <div class="form-actions">
            <div class="btn btn-primary disabled">
              <svg class="btn-icon" viewBox="0 0 24 24">
                <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z"/>
              </svg>
              Ativar Selecionados
            </div>
            <div class="btn btn-secondary disabled">
              <svg class="btn-icon" viewBox="0 0 24 24">
                <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M15,9H9V15H15V9Z"/>
              </svg>
              Desativar Selecionados
            </div>
            <div class="btn btn-secondary">
              <svg class="btn-icon" viewBox="0 0 24 24">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
              </svg>
              Relatório de Usuários
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import backendRouter from '@/utils/backendRouter'
import { formatBR12 } from '@/utils/dateTime'

interface UserDoc {
  idpk: number
  masteridpk: number
  cnpjcontrato: string
  username: string
  idpkloja: number
  status: number,
  statusstr: string,
  dhc: string,
  grupo: string,
  idpk1: number
  fkkey: number
  nome: string
  sobrenome: string
  nascimento: string
  cpf: string
  rg: string
  nrocelular: string
  email: string
  cargo: string
  foto: string | null
  logr: string
  nrolog: string
  compl: string | null
  bairro: string
  municipio: string
  uf: string
  cep: string
}

interface UserPaginateResponse {
  docs: UserDoc[]
  total: number
  limit: number
  page: number
  pages: number
}

// Estado da tabela e paginação
const users = ref<UserDoc[]>([])
const total = ref(0)
const limit = ref(10)
const page = ref(1)
const pages = ref(1)

// Adapta diferentes formatos de resposta da API para paginação
function normalizePaginateResponse(data: unknown): UserPaginateResponse {
  if (Array.isArray(data)) {
    return {
      docs: data as UserDoc[],
      total: (data as UserDoc[]).length,
      limit: limit.value,
      page: page.value,
      pages: 1
    }
  }
  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>
    const payload = (obj.data && typeof obj.data === 'object') ? obj.data as Record<string, unknown> : obj
    const docs = (payload.docs as UserDoc[]) || (payload.items as UserDoc[]) || []
    const totalNum = Number(payload.total ?? (payload.count ?? docs.length))
    const limitNum = Number(payload.limit ?? limit.value)
    const pageNum = Number(payload.page ?? page.value)
    const pagesNum = Number(payload.pages ?? Math.max(1, Math.ceil(totalNum / (limitNum || 1))))
    return { docs, total: totalNum, limit: limitNum, page: pageNum, pages: pagesNum }
  }
  return { docs: [], total: 0, limit: limit.value, page: page.value, pages: 1 }
}

const cnpjcontrato = ref('')
const idpkloja = ref('')

const loading = ref(false)

function hydrateAuthFilters() {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem('authData') : null
    if (raw) {
      const auth = JSON.parse(raw) as {
        SystemAuth?: { CnpjContrato?: string }
        Lojas?: { IdPk?: number }
      }
      cnpjcontrato.value = (auth.SystemAuth?.CnpjContrato || '').replace(/\D/g, '')
      idpkloja.value = String(auth.Lojas?.IdPk ?? '')
    }
  } catch (e) {
    console.warn('Não foi possível hidratar filtros a partir do authData:', e)
  }
}

async function loadUsers() {
  loading.value = true
  try {
    const params: Record<string, string | number> = {
      cnpjcontrato: String(cnpjcontrato.value ?? ''),
      idpkloja: String(idpkloja.value ?? ''),
      limit: Number(limit.value),
      page: Number(page.value),
    }
    const q = searchQuery.value.trim()
    if (q) {
      params.search = q
      params.q = q
    }
    const resp = await backendRouter.get<UserPaginateResponse>(
      '/api/user/paginate',
      params,
      { headers: { 'X-Paginate': 'true' } }
    )
    if (resp.status === 200 && resp.data !== undefined) {
      const data = normalizePaginateResponse(resp.data)
      users.value = data.docs
      total.value = data.total
      // mantém o limit selecionado pelo usuário
      page.value = data.page
      // recalcula pages com base no total e no limit atual
      pages.value = Math.max(1, Math.ceil((total.value || 0) / (limit.value || 1)))
      console.log('👥 Users mapeados:', { total: total.value, page: page.value, pages: pages.value, docs: users.value.length, limit: limit.value })
    } else {
      users.value = []
      total.value = 0
      pages.value = 1
    }
  } catch (e) {
    console.error('Erro ao carregar usuários:', e)
    users.value = []
    total.value = 0
    pages.value = 1
  } finally {
    loading.value = false
  }
}

// Busca no grid
const searchQuery = ref('')

// Busca client-side desativada; o backend faz filtragem
// const visibleUsers = computed(() => users.value)
let searchTimer: number | undefined
watch(searchQuery, () => {
  if (searchTimer !== undefined) window.clearTimeout(searchTimer)
  searchTimer = window.setTimeout(() => {
    page.value = 1
    loadUsers()
  }, 300)
})

 // Refaz a consulta ao mudar "Mostrar registros"
 watch(limit, (val) => {
   limit.value = Number(val)
   page.value = 1
   loadUsers()
 })

 function nextPage() {
   if (page.value < pages.value) {
     page.value += 1
     loadUsers()
   }
 }

 function prevPage() {
   if (page.value > 1) {
     page.value -= 1
     loadUsers()
   }
 }

 onMounted(() => {
   hydrateAuthFilters()
   loadUsers()
 })
</script>

<!-- Atualizações no template: tabela e paginação -->
<!-- Inseriremos apenas os trechos substituídos com bindings Vue -->

<style scoped>
/* Container principal */
.user-management-container {
  padding: 1rem;
  background: var(--bg-primary, #f8fafc);
  min-height: 100vh;
}

.form-container {
  max-width: 1600px;
  margin: 0 auto;
  background: var(--bg-secondary, #ffffff);
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* Card Heading */
.card-heading {
  background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
  padding: 2rem;
  color: white;
}

.heading-content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.heading-icon {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.heading-icon svg {
  width: 24px;
  height: 24px;
  fill: white;
}

.heading-text {
  flex: 1;
}

.heading-title {
  font-size: 1.875rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: white;
}

.heading-subtitle {
  font-size: 1rem;
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.5;
}

.heading-badge {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

/* Form styles */
.esocial-form {
  padding: 2rem;
}

.form-section {
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color, #e5e7eb);
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
  justify-content: space-between;
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-primary, #1f2937);
  margin-bottom: 1rem;
  user-select: none;
}

.section-title-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-icon {
  width: 20px;
  height: 20px;
  fill: var(--accent-primary, #10b981);
}

.filters-content {
  display: block;
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
  min-width: 0;
}

.form-label {
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
}

.form-input {
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: border-color 0.2s, box-shadow 0.2s;
  background: white;
}

.form-input:focus {
 outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.form-input.small {
  padding: 0.5rem;
  width: auto;
  min-width: 80px;
}

/* Buttons */
.form-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-top: 1rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
}

.btn-primary {
  background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
  border: 2px solid #e5e7eb;
}

.btn-secondary:hover {
  background: #e5e7eb;
  transform: translateY(-1px);
}

.btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-icon {
  width: 16px;
  height: 16px;
  fill: currentColor;
}

/* Table controls */
.table-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  gap: 1rem;
  flex-wrap: wrap;
}

.table-controls-left,
.table-controls-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.items-per-page {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.select-placeholder {
  padding: 0.25rem 0.5rem;
  border: 1px solid var(--border-color, #d1d5db);
  border-radius: 4px;
  font-size: 0.875rem;
  background: var(--bg-disabled, #f9fafb);
  color: var(--text-muted, #9ca3af);
  font-style: italic;
}

.search-container {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  fill: var(--text-muted, #9ca3af);
  pointer-events: none;
}

.search-placeholder {
  padding: 0.5rem 0.75rem 0.5rem 2.5rem;
  border: 1px solid var(--border-color, #d1d5db);
  border-radius: 6px;
  font-size: 0.875rem;
  background: var(--bg-disabled, #f9fafb);
  color: var(--text-muted, #9ca3af);
  width: 200px;
  font-style: italic;
}

/* Table */
.table-container {
  overflow-x: auto;
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 8px;
  margin-bottom: 1rem;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--bg-secondary, #ffffff);
}

.data-table th,
.data-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid var(--border-color, #e5e7eb);
}

.data-table th {
  background: var(--bg-primary, #f8fafc);
  font-weight: 600;
  color: var(--text-primary, #1f2937);
  font-size: 0.875rem;
}

.data-table td {
  font-size: 0.875rem;
  color: var(--text-primary, #1f2937);
}

.checkbox-column {
  width: 40px;
  text-align: center;
}

.checkbox-placeholder {
  width: 16px;
  height: 16px;
  border: 1px solid var(--border-color, #d1d5db);
  border-radius: 3px;
  background: var(--bg-disabled, #f9fafb);
  margin: 0 auto;
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
}

.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.empty-icon {
  width: 48px;
  height: 48px;
  fill: var(--text-muted, #9ca3af);
  opacity: 0.5;
}

.empty-text {
  font-size: 1.125rem;
  font-weight: 500;
  color: var(--text-secondary, #6b7280);
  margin: 0;
}

.empty-subtext {
  font-size: 0.875rem;
  color: var(--text-muted, #9ca3af);
  margin: 0;
}

/* Pagination */
.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1rem 0;
  gap: 1rem;
  flex-wrap: wrap;
}

.pagination-info {
  font-size: 0.875rem;
  color: var(--text-secondary, #6b7280);
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.page-info {
  font-size: 0.875rem;
  color: var(--text-secondary, #6b7280);
}

/* Responsividade */
@media (max-width: 768px) {
  .user-management-container {
    padding: 0.25rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .form-actions {
    flex-direction: column;
    gap: 0.75rem;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }

  .table-container {
    overflow-x: auto;
  }

  .data-table {
    min-width: 800px;
  }

  .pagination-container {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .pagination-controls {
    justify-content: center;
  }

  .table-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .table-controls-left,
  .table-controls-right {
    justify-content: center;
  }

  .heading-content {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .search-placeholder {
    width: 100%;
  }
}

/* Hover: linhas da tabela */
.data-table tbody tr {
  cursor: pointer;
}

.data-table tbody tr:hover {
  background-color: rgba(59, 130, 246, 0.08);
}

.data-table tbody tr:hover td {
  color: var(--text-primary, #111827);
}
</style>

.data-table tbody tr {
  cursor: pointer;
}

.data-table tbody tr:hover {
  background-color: rgba(59, 130, 246, 0.08); /* azul suave */
}

.data-table tbody tr:hover td {
  color: var(--text-primary, #111827);
}

const loading = ref(false)

function formatDateTime(val: string | number | Date | null | undefined): string {
  if (val === null || val === undefined || val === '') return '-'
  try {
    let date: Date
    if (typeof val === 'string') {
      // Strings ISO como "2025-09-15T11:35:20.000Z"
      date = new Date(val)
    } else if (typeof val === 'number') {
      // Timestamps numéricos (ms ou s)
      const ms = String(val).length === 10 ? val * 1000 : val
      date = new Date(ms)
    } else if (val instanceof Date) {
      date = val
    } else {
      return '-'
    }

    if (isNaN(date.getTime())) {
      // Fallback: remove T/Z se for string inválida
      return typeof val === 'string' ? val.replace('T', ' ').replace('Z', '') : '-'
    }

    return date.toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  } catch {
    return '-'
  }
}
