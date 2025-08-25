import Swal from 'sweetalert2'

// Ícones SVG para os botões seguindo o tema da navbar
const icons = {
  confirm: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 6L9 17L4 12" stroke="#00ff7f" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  cancel: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6L6 18M6 6L18 18" stroke="rgba(255,255,255,0.8)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  deny: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6L6 18M6 6L18 18" stroke="rgba(255,255,255,0.8)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`
}

// Configuração global do SweetAlert seguindo o tema da navbar
const swalConfig = {
  // Cores baseadas no gradiente da navbar
  confirmButtonColor: '#00ff7f', // accent-primary
  cancelButtonColor: '#6c757d',
  denyButtonColor: '#dc3545',
  
  // Estilo customizado
  customClass: {
    popup: 'swal-custom-popup',
    header: 'swal-custom-header',
    title: 'swal-custom-title',
    content: 'swal-custom-content',
    confirmButton: 'swal-custom-confirm-btn',
    cancelButton: 'swal-custom-cancel-btn',
    denyButton: 'swal-custom-deny-btn',
    actions: 'swal-custom-actions'
  },
  
  // Configurações padrão
  backdrop: true,
  allowOutsideClick: false,
  allowEscapeKey: true,
  showCloseButton: false,
  showDenyButton: false,
  buttonsStyling: false,
  reverseButtons: true,
  focusConfirm: false,
  confirmButtonText: icons.confirm,
  cancelButtonText: icons.cancel,
  
  // Animações
  showClass: {
    popup: 'animate__animated animate__fadeInUp animate__faster'
  },
  hideClass: {
    popup: 'animate__animated animate__fadeOutDown animate__faster'
  }
}

// CSS customizado para o SweetAlert seguindo o tema da navbar
const swalStyles = `
<style>
/* Popup principal */
  .swal-custom-popup {
    background: linear-gradient(135deg, var(--accent-primary, #00ff7f), var(--accent-secondary, #667eea)) !important;
    border: 1px solid rgba(255, 255, 255, 0.2) !important;
    border-radius: 12px !important;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1), 0 8px 32px rgba(0, 0, 0, 0.2) !important;
    backdrop-filter: blur(10px) !important;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segui UI', Roboto, sans-serif !important;
    color: white !important;
    overflow: hidden !important;
    min-width: 400px !important;
    padding: 0 !important;
  }

  .swal-custom-card {
    background: rgba(255, 255, 255, 0.1) !important;
    border-radius: 12px !important;
    overflow: hidden !important;
    backdrop-filter: blur(10px) !important;
  }

  .swal-custom-card-header {
    background: rgba(255, 255, 255, 0.15) !important;
    padding: 16px 60px 16px 20px !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2) !important;
    color: white !important;
    position: relative !important;
  }

  .swal-custom-card-body {
    padding: 20px !important;
    background: rgba(255, 255, 255, 0.05) !important;
    color: white !important;
  }

/* Header personalizado */
  .swal2-header {
    padding: 0 !important;
    margin: 0 !important;
    border: none !important;
    background: transparent !important;
  }

  .swal2-close {
    position: absolute !important;
    top: 16px !important;
    right: 20px !important;
    z-index: 1000 !important;
    background: rgba(255, 255, 255, 0.2) !important;
    border: 1px solid rgba(255, 255, 255, 0.3) !important;
    color: white !important;
    border-radius: 50% !important;
    width: 32px !important;
    height: 32px !important;
    font-size: 18px !important;
    font-weight: bold !important;
    transition: all 0.2s ease !important;
    backdrop-filter: blur(5px) !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }

  .swal2-close:hover {
    background: rgba(255, 255, 255, 0.3) !important;
    border-color: rgba(255, 255, 255, 0.5) !important;
    transform: scale(1.1) !important;
  }

/* Breadcrumb */
  .swal-custom-breadcrumb {
    display: flex !important;
    align-items: center !important;
    font-size: 0.875rem !important;
    color: rgba(255, 255, 255, 0.7) !important;
    margin-bottom: 0.75rem !important;
    padding-top: 0.5rem !important;
  }

  .swal-custom-breadcrumb-item {
    display: flex !important;
    align-items: center !important;
  }

  .swal-custom-breadcrumb-separator {
    margin: 0 0.5rem !important;
    color: rgba(255, 255, 255, 0.5) !important;
  }

  .swal-custom-breadcrumb-current {
    color: rgba(255, 255, 255, 0.9) !important;
    font-weight: 500 !important;
  }

.swal-custom-header::before {
  content: '' !important;
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  height: 2px !important;
    background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.5) 50%, transparent 100%) !important;
}

/* Título */
.swal-custom-title {
  color: white !important;
  font-weight: 600 !important;
  font-size: 1.25rem !important;
  margin: 0 !important;
  line-height: 1.4 !important;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3) !important;
}

/* Conteúdo */
.swal-custom-content {
  color: rgba(255, 255, 255, 0.9) !important;
  font-size: 0.95rem !important;
  line-height: 1.6 !important;
  padding: 0 !important;
  font-weight: 400 !important;
  margin: 16px 0 !important;
}

/* Ações */
  .swal-custom-actions {
    background: rgba(255, 255, 255, 0.05) !important;
    border-top: 1px solid rgba(255, 255, 255, 0.2) !important;
    border-radius: 0 0 12px 12px !important;
    padding: 1rem 2rem !important;
    margin: 0 !important;
    gap: 1rem !important;
    backdrop-filter: blur(10px) !important;
  }

/* Botões */
  .swal-custom-confirm-btn {
    background: rgba(255, 255, 255, 0.1) !important;
    border: 1px solid rgba(255, 255, 255, 0.2) !important;
    border-radius: 8px !important;
    color: white !important;
    font-weight: 600 !important;
    padding: 0.75rem 1.5rem !important;
    transition: all 0.3s ease !important;
    backdrop-filter: blur(10px) !important;
    min-height: 40px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }

.swal-custom-confirm-btn:hover {
    background: rgba(255, 255, 255, 0.15) !important;
    border-color: rgba(255, 255, 255, 0.3) !important;
    transform: translateY(-1px) !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
  }

.swal-custom-cancel-btn {
  background: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  border-radius: 8px !important;
  color: rgba(255, 255, 255, 0.8) !important;
  font-weight: 500 !important;
  padding: 0.75rem 1.5rem !important;
  transition: all 0.3s ease !important;
  backdrop-filter: blur(10px) !important;
  min-height: 40px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.swal-custom-cancel-btn:hover {
  background: rgba(255, 255, 255, 0.15) !important;
  border-color: rgba(255, 255, 255, 0.3) !important;
  color: #ffffff !important;
}

.swal-custom-deny-btn {
  background: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  border-radius: 8px !important;
  color: rgba(255, 255, 255, 0.8) !important;
  font-weight: 500 !important;
  padding: 0.75rem 1.5rem !important;
  transition: all 0.3s ease !important;
  backdrop-filter: blur(10px) !important;
  min-height: 40px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.swal-custom-deny-btn:hover {
  background: rgba(255, 255, 255, 0.15) !important;
  border-color: rgba(255, 255, 255, 0.3) !important;
  color: #ffffff !important;
}

/* Ocultar botão deny completamente */
.swal2-deny {
  display: none !important;
}

/* Ícones */
.swal2-icon {
  border: none !important;
}

.swal2-icon.swal2-success {
  color: #00ff7f !important;
}

.swal2-icon.swal2-error {
  color: #dc3545 !important;
}

.swal2-icon.swal2-warning {
  color: #f59e0b !important;
}

.swal2-icon.swal2-info {
  color: #3b82f6 !important;
}

.swal2-icon.swal2-question {
  color: #00ff7f !important;
}

/* Tema escuro - mantém o mesmo estilo da navbar */
  [data-theme="dark"] .swal-custom-popup {
    background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary, #667eea)) !important;
  }

  [data-theme="dark"] .swal-custom-header {
    background: rgba(255, 255, 255, 0.1) !important;
  }

  [data-theme="dark"] .swal-custom-actions {
    background: rgba(255, 255, 255, 0.05) !important;
  }
</style>
`

// Função para injetar estilos
function injectSwalStyles() {
  if (!document.getElementById('swal-custom-styles')) {
    const styleElement = document.createElement('div')
    styleElement.id = 'swal-custom-styles'
    styleElement.innerHTML = swalStyles
    document.head.appendChild(styleElement)
  }
}

// Função para criar breadcrumb
function createBreadcrumb(items: string[]) {
  const breadcrumbHtml = items.map((item, index) => {
    const isLast = index === items.length - 1;
    const itemClass = isLast ? 'swal-custom-breadcrumb-current' : '';
    const separator = isLast ? '' : '<span class="swal-custom-breadcrumb-separator">›</span>';
    return `<span class="swal-custom-breadcrumb-item ${itemClass}">${item}</span>${separator}`;
  }).join('');
  
  return `<div class="swal-custom-breadcrumb">${breadcrumbHtml}</div>`;
}

// Função para criar card com header
function createCardWithHeader(title: string, content: string, breadcrumb?: string[]): string {
  const breadcrumbHtml = breadcrumb ? `<div class="swal-custom-breadcrumb">${createBreadcrumb(breadcrumb)}</div>` : ''
  
  return `
    <div class="swal-custom-card">
      <div class="swal-custom-card-header">
        ${breadcrumbHtml}
        <h3 style="margin: ${breadcrumb ? '8px 0 0 0' : '0'}; font-size: 1.25rem; font-weight: 600; color: white; text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);">${title}</h3>
      </div>
      <div class="swal-custom-card-body">
        <div style="color: rgba(255, 255, 255, 0.9); font-size: 0.95rem; line-height: 1.6;">${content}</div>
      </div>
    </div>
  `
}

// Configurar SweetAlert globalmente
export function configureSweetAlert() {
  // Injetar estilos customizados
  injectSwalStyles()
  
  // Definir configurações padrão
  Swal.mixin(swalConfig)
}

// Funções de conveniência com tema aplicado
export const SwalCustom = {
  fire: (options: any) => {
    return Swal.fire({
      ...swalConfig,
      ...options
    })
  },
  
  success: (title: string, text?: string, breadcrumb?: string[]) => {
    const cardHtml = createCardWithHeader(title, text || '', breadcrumb)
    
    return Swal.fire({
      ...swalConfig,
      html: cardHtml,
      confirmButtonText: icons.confirm,
      showCloseButton: true
    })
  },
  
  error: (title: string, text?: string, breadcrumb?: string[]) => {
    const cardHtml = createCardWithHeader(title, text || '', breadcrumb)
    
    return Swal.fire({
      ...swalConfig,
      html: cardHtml,
      confirmButtonText: icons.confirm,
      showCloseButton: true
    })
  },
  
  warning: (title: string, text?: string, breadcrumb?: string[]) => {
    const cardHtml = createCardWithHeader(title, text || '', breadcrumb)
    
    return Swal.fire({
      ...swalConfig,
      html: cardHtml,
      confirmButtonText: icons.confirm,
      showCloseButton: true
    })
  },
  
  info: (title: string, text?: string, breadcrumb?: string[]) => {
    const cardHtml = createCardWithHeader(title, text || '', breadcrumb)
    
    return Swal.fire({
      ...swalConfig,
      html: cardHtml,
      confirmButtonText: icons.confirm,
      showCloseButton: true
    })
  },
  
  question: (title: string, text?: string, breadcrumb?: string[]) => {
    const cardHtml = createCardWithHeader(title, text || '', breadcrumb)
    
    return Swal.fire({
      ...swalConfig,
      html: cardHtml,
      showCancelButton: true,
      confirmButtonText: icons.confirm,
      cancelButtonText: icons.cancel,
      showCloseButton: true
    })
  },
  
  confirm: (title: string, text?: string, confirmText = 'Confirmar', cancelText = 'Cancelar', breadcrumb?: string[]) => {
    const cardHtml = createCardWithHeader(title, text || '', breadcrumb)
    
    return Swal.fire({
      ...swalConfig,
      html: cardHtml,
      showCancelButton: true,
      showDenyButton: false,
      confirmButtonText: icons.confirm,
      cancelButtonText: icons.cancel,
      showCloseButton: false
    })
  }
}

export default SwalCustom