<template>
  <div class="default-edit-template-container">
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
