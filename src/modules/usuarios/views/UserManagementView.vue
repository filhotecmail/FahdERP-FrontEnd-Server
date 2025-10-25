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
                  <td>{{ formatCPF(u.cpf) }}</td>
                  <td>{{ u.grupo }}</td>
                  <td>{{ u.cargo }}</td>
                  <td>{{ u.statusstr }}</td>
                  <td>{{ formatBR12(u.dhc) }}</td>
                  <td>{{ formatBR24(u.logdh) }}</td>
                  <td>
                    <div class="action-icons">
                      <button class="icon-btn" title="Detalhes" @click="onView(u)">
                        <svg viewBox="0 0 24 24" class="icon-eye">
                          <path d="M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5M12,17C9.24,17 7,14.76 7,12C7,9.24 9.24,7 12,7C14.76,7 17,9.24 17,12C17,14.76 14.76,17 12,17M12,9C10.34,9 9,10.34 9,12C9,13.66 10.34,15 12,15C13.66,15 15,13.66 15,12C15,10.34 13.66,9 12,9Z"/>
                        </svg>
                      </button>
                      <button class="icon-btn" title="Editar" @click="onEdit(u)">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <rect x="0" y="0" width="24" height="24"/>
        <path d="M12.2674799,18.2323597 L12.0084872,5.45852451 C12.0004303,5.06114792 12.1504154,4.6768183 12.4255037,4.38993949 L15.0030167,1.70195304 L17.5910752,4.40093695 C17.8599071,4.6812911 18.0095067,5.05499603 18.0083938,5.44341307 L17.9718262,18.2062508 C17.9694575,19.0329966 17.2985816,19.701953 16.4718324,19.701953 L13.7671717,19.701953 C12.9505952,19.701953 12.2840328,19.0487684 12.2674799,18.2323597 Z" fill="#000000" fill-rule="nonzero" transform="translate(14.701953, 10.701953) rotate(-135.000000) translate(-14.701953, -10.701953) "/>
        <path d="M12.9,2 C13.4522847,2 13.9,2.44771525 13.9,3 C13.9,3.55228475 13.4522847,4 12.9,4 L6,4 C4.8954305,4 4,4.8954305 4,6 L4,18 C4,19.1045695 4.8954305,20 6,20 L18,20 C19.1045695,20 20,19.1045695 20,18 L20,13 C20,12.4477153 20.4477153,12 21,12 C21.5522847,12 22,12.4477153 22,13 L22,18 C22,20.209139 20.209139,22 18,22 L6,22 C3.790861,22 2,20.209139 2,18 L2,6 C2,3.790861 3.790861,2 6,2 L12.9,2 Z" fill="#000000" fill-rule="nonzero" opacity="0.3"/>
    </g>
</svg>
                      </button>
                      <button class="icon-btn danger" title="Excluir" @click="onDelete(u)">
                        <svg viewBox="0 0 24 24" class="icon-trash">
                          <path d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6Z"/>
                        </svg>
                      </button>
                    </div>
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
import { UserManagementController } from '@/modules/usuarios/controllers/UserManagementController'
import { useRouter } from 'vue-router'
import type { UserDoc } from '@/modules/usuarios/services/UserService'

// Instanciar controller e expor estado/formatadores
const controller = new UserManagementController()
const { users, total, limit, page, pages, searchQuery, loading, formatBR12, formatBR24, formatCPF } = controller

// Wrappers para ações (garantem o this correto)
const nextPage = () => controller.nextPage()
const prevPage = () => controller.prevPage()
const loadUsers = () => controller.loadUsers()

const router = useRouter()

function onView(u: UserDoc) {
  router.push(`/visualizar-usuario/${u.idpk}`)
}

function onEdit(u: UserDoc) {
  router.push(`/editar-usuario/${u.idpk}`)
}

function onDelete(u: UserDoc) {
  // TODO: integrar com serviço de exclusão e confirmação
  // Placeholder seguro: apenas loga por enquanto
  console.log('Excluir usuário', u.idpk)
}
</script>

<!-- Atualizações no template: tabela e paginação -->
<!-- Inseriremos apenas os trechos substituídos com bindings Vue -->

<style src="../styles/user-management.css" scoped></style>

