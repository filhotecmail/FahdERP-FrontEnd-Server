<template>
  <div class="template-container">
    <div class="form-container">
      <!-- Card Heading -->
      <div class="template-card-heading">
        <div class="template-heading-content">
          <div class="heading-icon">
            <svg viewBox="0 0 24 24">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
            </svg>
          </div>
          <div class="heading-text">
            <h1 class="heading-title">Gerenciamento de Templates do Sistema</h1>
            <p class="heading-subtitle">Template padrão para gerenciamento de templates</p>
          </div>
          <div class="heading-badge">Templates</div>
        </div>
      </div>

      <div class="template-form">
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
                <label for="filterNome" class="form-label">Nome do Template</label>
                <input
                   id="filterNome"
                   type="text"
                   class="form-input"
                   placeholder="Digite o nome do template"
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
                <label for="filterDataCriacao" class="form-label">Data de Criação</label>
                <input
                   id="filterDataCriacao"
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

        <!-- Seção: Lista de Templates -->
        <div class="form-section">
          <h2 class="section-title">
            <div class="section-title-content">
              <svg class="section-icon" viewBox="0 0 24 24">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
              </svg>
              Dados dos Templates
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
                  placeholder="Buscar..."
                />
                <svg class="search-icon" viewBox="0 0 24 24">
                  <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/>
                </svg>
              </div>
            </div>
          </div>

          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Tipo</th>
                  <th>Status</th>
                  <th>Data Criação</th>
                  <th>Último Acesso</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr class="empty-state">
                  <td colspan="6">
                    <div class="empty-content">
                      <svg class="empty-icon" viewBox="0 0 24 24">
                        <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z"/>
                      </svg>
                      <p>Nenhum template encontrado</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* Estilos específicos do componente (se houver) */
/* Os estilos globais agora estão em /src/modules/modules-global.css */
</style>
