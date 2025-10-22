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
        <!-- Seção: Filtros de Consulta -->
        <div class="form-section">
          <h2 class="section-title">
            <div class="section-title-content">
              <svg class="section-icon" viewBox="0 0 24 24">
                <path d="M14,12V19.88C14.04,20.18 13.94,20.5 13.71,20.71C13.32,21.1 12.69,21.1 12.3,20.71L10.29,18.7C10.06,18.47 9.96,18.16 10,17.87V12H9.97L4.21,4.62C3.87,4.19 3.95,3.56 4.38,3.22C4.57,3.08 4.78,3 5,3V3H19V3C19.22,3 19.43,3.08 19.62,3.22C20.05,3.56 20.13,4.19 19.79,4.62L14.03,12H14Z"/>
              </svg>
              Filtros de Consulta
            </div>
            <button class="toggle-filters-btn" title="Expandir filtros">
              <svg class="toggle-icon" viewBox="0 0 24 24">
                <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/>
              </svg>
            </button>
          </h2>

          <div class="filters-content">
            <div class="form-grid">
              <div class="form-group">
                <label for="filterNome" class="form-label">Nome do Usuário</label>
                <input
                   id="filterNome"
                   type="text"
                   class="form-input"
                   placeholder="Digite o nome do usuário"
                 />
              </div>

              <div class="form-group">
                <label for="filterEmail" class="form-label">E-mail</label>
                <input
                   id="filterEmail"
                   type="email"
                   class="form-input"
                   placeholder="Digite o e-mail"
                 />
              </div>

              <div class="form-group">
                <label for="filterStatus" class="form-label">Status</label>
                <select
                   id="filterStatus"
                   class="form-input"
                 >
                  <option value="">Todos os status</option>
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                  <option value="bloqueado">Bloqueado</option>
                  <option value="pendente">Pendente</option>
                </select>
              </div>

              <div class="form-group">
                <label for="filterPerfil" class="form-label">Perfil de Acesso</label>
                <select
                   id="filterPerfil"
                   class="form-input"
                 >
                  <option value="">Todos os perfis</option>
                  <option value="admin">Administrador</option>
                  <option value="usuario">Usuário</option>
                  <option value="operador">Operador</option>
                  <option value="consulta">Consulta</option>
                </select>
              </div>

              <div class="form-group">
                <label for="filterDataInicio" class="form-label">Data de Cadastro</label>
                <input
                   id="filterDataInicio"
                   type="date"
                   class="form-input"
                 />
              </div>

              <div class="form-group">
                <label for="filterDataFim" class="form-label">Data Fim</label>
                <input
                   id="filterDataFim"
                   type="date"
                   class="form-input"
                 />
              </div>
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn-primary">
                <svg class="btn-icon" viewBox="0 0 24 24">
                  <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/>
                </svg>
                Aplicar Filtros
              </button>
              <button type="button" class="btn btn-secondary">
                <svg class="btn-icon" viewBox="0 0 24 24">
                  <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
                </svg>
                Limpar Filtros
              </button>
            </div>
          </div>
        </div>

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
                <select id="itemsPerPage" class="form-input small">
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
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
                  <th>E-mail</th>
                  <th>Perfil</th>
                  <th>Status</th>
                  <th>Data Cadastro</th>
                  <th>Último Acesso</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr>
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
              </tbody>
            </table>
          </div>

          <!-- Paginação -->
          <div class="pagination-container">
            <div class="pagination-info">
              <span>Mostrando 0 de 0 registros</span>
            </div>
            <div class="pagination-controls">
              <div class="btn btn-secondary disabled">Anterior</div>
              <span class="page-info">Página 1 de 1</span>
              <div class="btn btn-secondary disabled">Próxima</div>
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

<style scoped>
/* Container principal */
.user-management-container {
  padding: 1rem;
  background: var(--bg-primary, #f8fafc);
  min-height: 100vh;
}

.form-container {
  max-width: 1400px;
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
</style>
