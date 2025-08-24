# Exemplos do Sistema Global de Estado de Formulários

Esta pasta contém exemplos práticos de como usar o sistema global de estado de formulários implementado na aplicação.

## 📁 Arquivos Disponíveis

### `FormStateExample.vue`
Exemplo completo e interativo que demonstra todas as funcionalidades do sistema:

- **Formulário Principal**: Campos com validação, tipos diferentes (texto, número, select, checkbox, textarea)
- **Sistema de Filtros**: Busca global, filtros específicos, filtros expandíveis
- **Paginação**: Controle de páginas e itens por página
- **Seleção**: Seleção individual e em lote de itens
- **Persistência**: Auto-save e restauração de estado
- **Validação**: Validação em tempo real com mensagens de erro
- **Debug**: Visualização do estado completo para desenvolvimento

## 🚀 Como Usar os Exemplos

### 1. Executar o Exemplo Completo

```bash
# Navegar para o diretório do projeto
cd fahd-erp

# Instalar dependências (se necessário)
npm install

# Executar o servidor de desenvolvimento
npm run dev
```

### 2. Acessar o Exemplo

Adicione uma rota temporária no seu router para acessar o exemplo:

```typescript
// router/index.ts
import FormStateExample from '@/examples/FormStateExample.vue'

const routes = [
  // ... suas rotas existentes
  {
    path: '/exemplo-form-state',
    name: 'FormStateExample',
    component: FormStateExample
  }
]
```

Então acesse: `http://localhost:5173/exemplo-form-state`

### 3. Estudar o Código

O exemplo está totalmente comentado e organizado em seções:

- **Template**: Estrutura HTML com todos os componentes
- **Script**: Lógica TypeScript com configuração do sistema
- **Style**: CSS responsivo e moderno

## 🎯 Funcionalidades Demonstradas

### Configuração Básica
```typescript
const formState = useFormState({
  formId: 'form-state-example',
  autoSave: true,
  persistToLocalStorage: true,
  restoreOnMount: true,
  debounceMs: 300
})
```

### Campos com Validação
```typescript
const campos = {
  nome: formState.field('nome', { 
    defaultValue: '', 
    type: 'string',
    validator: (value: string) => {
      if (!value.trim()) return 'Nome é obrigatório'
      if (value.length < 2) return 'Nome deve ter pelo menos 2 caracteres'
      return true
    }
  })
}
```

### Filtros e Busca
```typescript
const { filters, pagination, selection } = formState

// Uso nos templates
<input v-model="filters.searchTerm" placeholder="Buscar..." />
```

### Paginação
```typescript
// Controles automáticos
pagination.setPage(1)
pagination.setItemsPerPage(10)
pagination.setTotalItems(100)
```

### Seleção
```typescript
// Seleção múltipla
selection.toggleSelectAll()
selection.setSelectedItems([1, 2, 3])
```

## 📚 Conceitos Importantes

### 1. Reatividade
Todos os campos são reativos e se atualizam automaticamente:
```vue
<input v-model="campos.nome.value" />
<span v-if="campos.nome.error">{{ campos.nome.error }}</span>
```

### 2. Persistência
O estado é automaticamente salvo e restaurado:
- LocalStorage para persistência entre sessões
- Auto-save com debounce para performance
- Restauração automática ao montar o componente

### 3. Validação
Validação em tempo real com feedback visual:
```typescript
validator: (value: string) => {
  if (!value.trim()) return 'Campo obrigatório'
  return true // válido
}
```

### 4. Performance
- Debounce automático para evitar atualizações excessivas
- Computed properties para dados filtrados e paginados
- Lazy loading de componentes pesados

## 🔧 Personalização

### Estilos
O exemplo usa CSS moderno e responsivo que pode ser adaptado:
- Grid layouts para formulários
- Flexbox para controles
- Media queries para mobile
- Variáveis CSS para temas

### Funcionalidades
Você pode remover ou adicionar funcionalidades conforme necessário:
- Desabilitar auto-save: `autoSave: false`
- Remover persistência: `persistToLocalStorage: false`
- Ajustar debounce: `debounceMs: 500`

## 🐛 Debug e Desenvolvimento

### Visualizar Estado
O exemplo inclui uma seção de debug:
```vue
<pre>{{ JSON.stringify(formState.exportState(), null, 2) }}</pre>
```

### Console Logs
Use os métodos de debug do sistema:
```typescript
console.log('Estado atual:', formState.exportState())
console.log('Campos válidos:', formState.isValid)
console.log('Formulário modificado:', formState.isDirty)
```

### Exportar/Importar Estado
O exemplo inclui funcionalidade para exportar o estado:
```typescript
const exportarEstado = () => {
  const estado = formState.exportState()
  // Salvar como arquivo JSON
}
```

## 📖 Próximos Passos

1. **Estude o código**: Analise cada seção do exemplo
2. **Experimente**: Modifique valores e veja as mudanças
3. **Adapte**: Use como base para seus próprios formulários
4. **Contribua**: Sugira melhorias ou novos exemplos

## 🤝 Contribuindo

Para adicionar novos exemplos:

1. Crie um novo arquivo `.vue` nesta pasta
2. Documente as funcionalidades demonstradas
3. Adicione ao README com descrição
4. Teste em diferentes cenários

---

**Dica**: Este sistema foi projetado para ser flexível e extensível. Use os exemplos como ponto de partida e adapte conforme suas necessidades específicas.