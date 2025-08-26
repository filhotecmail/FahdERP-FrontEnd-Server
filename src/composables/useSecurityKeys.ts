import { onMounted, onUnmounted } from 'vue'

/**
 * Composable para gerenciar bloqueio de teclas de segurança
 */
export function useSecurityKeys() {
  // Lista de teclas bloqueadas
  const blockedKeys = [
    'F11',          // Fullscreen (pode ser usado para ocultar barra de endereço)
    'F1',           // Help
    'F3',           // Find
    'F6',           // Address bar focus
    'F7',           // Caret browsing
    'F10',          // Menu
    'PrintScreen',  // Screenshot
    'Insert',       // Insert mode
    'Delete',       // Delete (em alguns contextos)
    'Home',         // Home
    'End',          // End
    'PageUp',       // Page Up
    'PageDown'      // Page Down
  ]

  // Combinações de teclas bloqueadas
  const blockedCombinations = [
    { ctrl: true, key: 'r' },           // Ctrl+R (Refresh)
    { ctrl: true, key: 'R' },           // Ctrl+Shift+R (Hard refresh)
    { ctrl: true, shift: true, key: 'r' },
    { ctrl: true, shift: true, key: 'R' },
    { ctrl: true, key: 'f5' },          // Ctrl+F5 (Hard refresh)
    { ctrl: true, shift: true, key: 'i' }, // Ctrl+Shift+I (DevTools)
    { ctrl: true, shift: true, key: 'I' },
    { ctrl: true, shift: true, key: 'j' }, // Ctrl+Shift+J (Console)
    { ctrl: true, shift: true, key: 'J' },
    { ctrl: true, shift: true, key: 'c' }, // Ctrl+Shift+C (Inspect)
    { ctrl: true, shift: true, key: 'C' },
    { ctrl: true, key: 'u' },           // Ctrl+U (View source)
    { ctrl: true, key: 'U' },
    { ctrl: true, key: 's' },           // Ctrl+S (Save page)
    { ctrl: true, key: 'S' },
    { ctrl: true, key: 'p' },           // Ctrl+P (Print)
    { ctrl: true, key: 'P' },
    { ctrl: true, key: 'h' },           // Ctrl+H (History)
    { ctrl: true, key: 'H' },
    { ctrl: true, key: 'j' },           // Ctrl+J (Downloads)
    { ctrl: true, key: 'J' },
    { ctrl: true, key: 'd' },           // Ctrl+D (Bookmark)
    { ctrl: true, key: 'D' },
    { ctrl: true, key: 'f' },           // Ctrl+F (Find)
    { ctrl: true, key: 'F' },
    { ctrl: true, key: 'g' },           // Ctrl+G (Find next)
    { ctrl: true, key: 'G' },
    { ctrl: true, key: 'w' },           // Ctrl+W (Close tab)
    { ctrl: true, key: 'W' },
    { ctrl: true, key: 't' },           // Ctrl+T (New tab)
    { ctrl: true, key: 'T' },
    { ctrl: true, key: 'n' },           // Ctrl+N (New window)
    { ctrl: true, key: 'N' },
    { ctrl: true, shift: true, key: 'n' }, // Ctrl+Shift+N (Incognito)
    { ctrl: true, shift: true, key: 'N' },
    { alt: true, key: 'F4' },           // Alt+F4 (Close window)
    { alt: true, key: 'Tab' },          // Alt+Tab (Switch apps)
    { alt: true, key: 'F10' },          // Alt+F10 (Menu)
    { ctrl: true, alt: true, key: 'Delete' }, // Ctrl+Alt+Del
    { ctrl: true, shift: true, key: 'Delete' }, // Ctrl+Shift+Del
  ]

  function handleKeyDown(event: KeyboardEvent) {
    // Verificar teclas individuais bloqueadas
    if (blockedKeys.includes(event.key)) {
      event.preventDefault()
      event.stopPropagation()
      return false
    }

    // Verificar combinações de teclas bloqueadas
    for (const combo of blockedCombinations) {
      const ctrlMatch = combo.ctrl ? event.ctrlKey : !event.ctrlKey
      const shiftMatch = combo.shift ? event.shiftKey : !event.shiftKey
      const altMatch = combo.alt ? event.altKey : !event.altKey
      const keyMatch = event.key.toLowerCase() === combo.key.toLowerCase()

      if (ctrlMatch && shiftMatch && altMatch && keyMatch) {
        event.preventDefault()
        event.stopPropagation()
        return false
      }
    }

    return true
  }

  function handleContextMenu(event: MouseEvent) {
    // Bloquear menu de contexto (botão direito)
    event.preventDefault()
    event.stopPropagation()
    return false
  }

  function handleBeforeUnload(event: BeforeUnloadEvent) {
    // Prevenir fechamento/refresh da página
    event.preventDefault()
    event.returnValue = 'Tem certeza que deseja sair? Suas alterações podem ser perdidas.'
    return event.returnValue
  }

  function handleVisibilityChange() {
    // Detectar quando a página perde o foco (possível tentativa de burlar)
    if (document.hidden) {
      // Página perdeu o foco
    }
  }

  function enableSecurityKeys() {
    // Adicionar event listeners
    document.addEventListener('keydown', handleKeyDown, { capture: true })
    document.addEventListener('contextmenu', handleContextMenu, { capture: true })
    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Desabilitar seleção de texto
    document.body.style.userSelect = 'none'
    ;(document.body.style as any).webkitUserSelect = 'none'
    
    // Desabilitar arrastar e soltar
    ;(document.body.style as any).webkitUserDrag = 'none'
    
    // Desabilitar highlight
    ;(document.body.style as any).webkitTouchCallout = 'none'
    ;(document.body.style as any).webkitTapHighlightColor = 'transparent'
  }

  function disableSecurityKeys() {
    // Remover event listeners
    document.removeEventListener('keydown', handleKeyDown, { capture: true })
    document.removeEventListener('contextmenu', handleContextMenu, { capture: true })
    window.removeEventListener('beforeunload', handleBeforeUnload)
    document.removeEventListener('visibilitychange', handleVisibilityChange)

    // Restaurar seleção de texto
    document.body.style.userSelect = ''
    ;(document.body.style as any).webkitUserSelect = ''
    
    // Restaurar arrastar e soltar
    ;(document.body.style as any).webkitUserDrag = ''
    
    // Restaurar highlight
    ;(document.body.style as any).webkitTouchCallout = ''
    ;(document.body.style as any).webkitTapHighlightColor = ''
  }

  // Auto-ativar quando o composable é usado
  onMounted(() => {
    enableSecurityKeys()
  })

  onUnmounted(() => {
    disableSecurityKeys()
  })

  return {
    enableSecurityKeys,
    disableSecurityKeys
  }
}