# Sistema Global de Estado de Formulários

Este documento descreve o sistema global de estado de formulários implementado na aplicação FAHD ERP, que permite preservar e gerenciar o estado de todos os formulários de forma centralizada e persistente.

## Visão Geral

O sistema é composto por:
- **Store Global Pinia**: Gerencia todos os estados de formulários
- **Composable useFormState**: Interface reativa para componentes
- **Plugin Vue**: Auto-registro automático de formulários
- **Sistema de Identificação**: IDs únicos baseados em rota/componente
- **Persistência**: Salvamento automático no localStorage

## Componentes do Sistema

### 1. Store Global (`globalFormState.ts`)

O store Pinia centralizado que gerencia todos os estados:

```typescript
const store = useGlobalFormStateStore()

// Métodos principais
store.registerForm(formId, route, component)
store.getFormState(formId)
store.updateFields(formId, fields)
store.updatePagination(formId, pagination)
store.updateFilters(formId, filters)
store.clearForm(formId)
```

### 2. Composable useFormState

Interface reativa para componentes Vue:

```typescript
const formState = useFormState({
  formId: 'meu-formulario',
  autoSave: true,
  persistToLocalStorage: true,
  restoreOnMount: true
})

// Criar campos reativos
const nome = formState.field('nome', { 
  defaultValue: '', 
  type: 'string' 
})

// Usar no template
<input v-model="nome.value" />
```

### 3. Plugin de Auto-registro

Registra automaticamente formulários baseado na rota:

```typescript
// main.ts
app.use(FormStatePlugin, {
  enablePersistence: true,
  defaultDebounce: 500,
  debug: true
})
```

## Como Usar

### Configuração Básica

1. **Importar o composable**:
```typescript
import { useFormState } from '@/composables/useFormState'
```

2. **Configurar o formulário**:
```typescript
const formState = useFormState({
  formId: 'nome-unico-do-formulario',
  autoSave: true,
  persistToLocalStorage: true,
  restoreOnMount: true
})
```

3. **Criar campos**:
```typescript
const campos = {
  nome: formState.field('nome', { defaultValue: '', type: 'string' }),
  email: formState.field('email', { defaultValue: '', type: 'string' }),
  idade: formState.field('idade', { defaultValue: 0, type: 'number' })
}
```

4. **Usar no template**:
```vue
<template>
  <form>
    <input v-model="campos.nome.value" placeholder="Nome" />
    <input v-model="campos.email.value" placeholder="Email" />
    <input v-model="campos.idade.value" type="number" placeholder="Idade" />
  </form>
</template>
```

### Funcionalidades Avançadas

#### Paginação
```typescript
// Acessar paginação
const { pagination } = formState

// Usar no template
<div>
  Página: {{ pagination.currentPage }}
  <button @click="pagination.setPage(pagination.currentPage + 1)">
    Próxima
  </button>
</div>
```

#### Filtros
```typescript
// Acessar filtros
const { filters } = formState

// Usar no template
<input 
  v-model="filters.searchTerm" 
  placeholder="Buscar..." 
/>
```

#### Seleção
```typescript
// Acessar seleção
const { selection } = formState

// Usar no template
<div>
  Selecionados: {{ selection.selectedItems.length }}
  <button @click="selection.toggleSelectAll()">
    Selecionar Todos
  </button>
</div>
```

## Exemplos Práticos

### Formulário Simples

```vue
<template>
  <form @submit.prevent="salvar">
    <input v-model="dados.nome.value" placeholder="Nome" />
    <input v-model="dados.email.value" placeholder="Email" />
    <button type="submit">Salvar</button>
    <button type="button" @click="limpar">Limpar</button>
  </form>
</template>

<script setup>
import { useFormState } from '@/composables/useFormState'

const formState = useFormState({
  formId: 'cadastro-usuario',
  autoSave: true,
  persistToLocalStorage: true
})

const dados = {
  nome: formState.field('nome', { defaultValue: '', type: 'string' }),
  email: formState.field('email', { defaultValue: '', type: 'string' })
}

const salvar = () => {
  console.log('Dados:', {
    nome: dados.nome.value,
    email: dados.email.value
  })
}

const limpar = () => {
  dados.nome.reset()
  dados.email.reset()
}
</script>
```

### Formulário com Filtros e Paginação

```vue
<template>
  <div>
    <!-- Filtros -->
    <div class="filtros">
      <input v-model="filters.searchTerm" placeholder="Buscar..." />
      <select v-model="filtroStatus.value">
        <option value="">Todos</option>
        <option value="ativo">Ativo</option>
        <option value="inativo">Inativo</option>
      </select>
    </div>

    <!-- Lista -->
    <div class="lista">
      <div v-for="item in dadosFiltrados" :key="item.id">
        {{ item.nome }} - {{ item.status }}
      </div>
    </div>

    <!-- Paginação -->
    <div class="paginacao">
      <button 
        @click="pagination.setPage(pagination.currentPage - 1)"
        :disabled="pagination.currentPage === 1"
      >
        Anterior
      </button>
      <span>Página {{ pagination.currentPage }}</span>
      <button @click="pagination.setPage(pagination.currentPage + 1)">
        Próxima
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useFormState } from '@/composables/useFormState'

const formState = useFormState({
  formId: 'lista-usuarios',
  autoSave: true,
  persistToLocalStorage: true
})

const { filters, pagination } = formState

const filtroStatus = formState.field('status', { 
  defaultValue: '', 
  type: 'string' 
})

// Dados mockados
const dados = ref([
  { id: 1, nome: 'João', status: 'ativo' },
  { id: 2, nome: 'Maria', status: 'inativo' },
  // ...
])

const dadosFiltrados = computed(() => {
  let resultado = dados.value
  
  // Filtro por busca
  if (filters.searchTerm) {
    resultado = resultado.filter(item => 
      item.nome.toLowerCase().includes(filters.searchTerm.toLowerCase())
    )
  }
  
  // Filtro por status
  if (filtroStatus.value) {
    resultado = resultado.filter(item => item.status === filtroStatus.value)
  }
  
  return resultado
})
</script>
```

## Configurações Disponíveis

### Opções do useFormState

```typescript
interface UseFormStateOptions {
  formId?: string              // ID único do formulário
  instanceId?: string          // ID da instância (para múltiplas instâncias)
  autoSave?: boolean          // Salvamento automático (padrão: true)
  persistToLocalStorage?: boolean // Persistir no localStorage (padrão: true)
  restoreOnMount?: boolean    // Restaurar ao montar (padrão: true)
  clearOnUnmount?: boolean    // Limpar ao desmontar (padrão: false)
  debounceMs?: number         // Tempo de debounce em ms (padrão: 500)
}
```

### Configuração de Campos

```typescript
interface FormFieldConfig {
  defaultValue?: any          // Valor padrão
  type?: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'date'
  validator?: (value: any) => boolean | string
  transformer?: (value: any) => any
  debounceMs?: number        // Debounce específico do campo
}
```

### Opções do Plugin

```typescript
interface FormStatePluginOptions {
  idPrefix?: string           // Prefixo para IDs (padrão: 'form')
  defaultDebounce?: number    // Debounce padrão (padrão: 500)
  enablePersistence?: boolean // Habilitar persistência (padrão: true)
  storageKey?: string        // Chave do localStorage
  debug?: boolean            // Logs de debug (padrão: false)
  excludeRoutes?: string[]   // Rotas excluídas do auto-registro
  cleanupTimeout?: number    // Timeout para limpeza (padrão: 30min)
}
```

## Benefícios

1. **Persistência Automática**: Estados são salvos automaticamente no localStorage
2. **Restauração**: Formulários são restaurados ao recarregar a página
3. **Performance**: Debounce evita salvamentos excessivos
4. **Flexibilidade**: Configuração granular por formulário
5. **Centralização**: Todos os estados em um local
6. **Auto-registro**: Formulários são registrados automaticamente
7. **TypeScript**: Tipagem completa para melhor DX

## Migração de Formulários Existentes

Para migrar um formulário existente:

1. **Substituir reactive/ref**:
```typescript
// Antes
const formData = reactive({
  nome: '',
  email: ''
})

// Depois
const formState = useFormState({ formId: 'meu-form' })
const formData = {
  nome: formState.field('nome', { defaultValue: '', type: 'string' }),
  email: formState.field('email', { defaultValue: '', type: 'string' })
}
```

2. **Atualizar v-model**:
```vue
<!-- Antes -->
<input v-model="formData.nome" />

<!-- Depois -->
<input v-model="formData.nome.value" />
```

3. **Atualizar funções de reset**:
```typescript
// Antes
const resetForm = () => {
  formData.nome = ''
  formData.email = ''
}

// Depois
const resetForm = () => {
  formData.nome.reset()
  formData.email.reset()
}
```

## Troubleshooting

### Problemas Comuns

1. **Estado não persiste**: Verificar se `persistToLocalStorage: true`
2. **Performance lenta**: Ajustar `debounceMs` para valor maior
3. **Conflitos de ID**: Usar `instanceId` para múltiplas instâncias
4. **Dados não restauram**: Verificar se `restoreOnMount: true`

### Debug

Habilitar debug no plugin:
```typescript
app.use(FormStatePlugin, {
  debug: true
})
```

Isto mostrará logs detalhados no console sobre registro, salvamento e restauração de formulários.