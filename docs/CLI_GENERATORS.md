# Geradores CLI - Fahd ERP

Este documento descreve como usar os geradores CLI para criar novos componentes, views, composables, stores e módulos no projeto Fahd ERP.

## Comandos Disponíveis

### Gerador Principal
```bash
# Comando completo
npm run generate

# Atalhos
npm run g
npm run g:c
```

### Gerador Específico para eSocial
```bash
# Comando completo
npm run generate:esocial

# Atalho
npm run g:e
```

## Tipos de Componentes

### 1. Vue Component
Cria um componente Vue reutilizável.

**Estrutura gerada:**
```vue
<template>
  <div class="component-name">
    <!-- Conteúdo do componente -->
  </div>
</template>

<script setup lang="ts">
// Lógica do componente
</script>

<style scoped>
/* Estilos do componente */
</style>
```

**Localização:** `src/components/[módulo]/ComponentName.vue`

### 2. Vue View
Cria uma view (página) completa com navegação e layout.

**Características:**
- Header com título e ícone
- Botões de ação (Salvar/Cancelar)
- Layout responsivo
- Integração com roteamento

**Localização:** `src/views/[módulo]/ViewName.vue`

### 3. Vue Composable
Cria um composable para lógica reutilizável.

**Características:**
- Estado reativo
- Métodos de manipulação
- Propriedades computadas
- Tratamento de erros

**Localização:** `src/composables/[módulo]/useComposableName.ts`

### 4. Pinia Store
Cria uma store Pinia para gerenciamento de estado.

**Características:**
- Estado tipado
- Getters computados
- Actions para CRUD
- Métodos de filtro e busca

**Localização:** `src/stores/[módulo]/composableNameStore.ts`

### 5. Module Definition
Cria uma definição completa de módulo.

**Características:**
- Definição de componentes
- Configuração de rotas
- Navegação do módulo

**Localização:** `src/modules/[módulo]/index.ts`

## Módulos Disponíveis

- **esocial** - Módulo do eSocial
- **core** - Funcionalidades centrais
- **vendas** - Módulo de vendas
- **estoque** - Controle de estoque
- **financeiro** - Gestão financeira
- **rh** - Recursos humanos

## Gerador eSocial Específico

O gerador específico para eSocial oferece tipos especializados:

### 1. Evento eSocial
Cria componentes para eventos específicos do eSocial.

**Eventos disponíveis:**
- S-1000: Informações do Empregador/Contribuinte/Órgão Público
- S-1005: Tabela de Estabelecimentos, Obras ou Unidades de Órgãos Públicos
- S-1010: Tabela de Rubricas
- S-1020: Tabela de Lotações Tributárias
- S-1030: Tabela de Cargos/Empregos Públicos
- S-1040: Tabela de Funções/Cargos em Comissão
- S-1050: Tabela de Horários/Turnos de Trabalho
- S-1060: Tabela de Ambientes de Trabalho
- S-1070: Tabela de Processos Administrativos/Judiciais
- S-1080: Tabela de Operadores Portuários
- S-2190: Admissão de Trabalhador - Registro Preliminar
- S-2200: Cadastramento Inicial do Vínculo e Admissão/Ingresso de Trabalhador
- S-2205: Alteração de Dados Cadastrais do Trabalhador
- S-2206: Alteração de Contrato de Trabalho
- S-2210: Comunicação de Acidente de Trabalho
- S-2220: Monitoramento da Saúde do Trabalhador
- S-2230: Afastamento Temporário
- S-2240: Condições Ambientais do Trabalho - Agentes Nocivos
- S-2250: Aviso Prévio
- S-2260: Convocação para Trabalho Intermitente
- S-2298: Reintegração
- S-2299: Desligamento
- S-2300: Trabalhador Sem Vínculo de Emprego/Estatutário - Início
- S-2306: Trabalhador Sem Vínculo de Emprego/Estatutário - Alteração Contratual
- S-2399: Trabalhador Sem Vínculo de Emprego/Estatutário - Término
- S-3000: Exclusão de Eventos

### 2. Formulário eSocial
Cria formulários específicos para entrada de dados do eSocial.

### 3. Composable eSocial
Cria composables específicos para lógica do eSocial.

### 4. Store eSocial
Cria stores específicas para gerenciamento de dados do eSocial.

## Exemplos de Uso

### Criando um Componente Simples
```bash
npm run generate
# Escolher: 1 (Vue Component)
# Nome: UserCard
# Descrição: Cartão de exibição de usuário
# Módulo: 2 (core)
```

### Criando uma View de Vendas
```bash
npm run generate
# Escolher: 2 (Vue View)
# Nome: ProductList
# Descrição: Lista de produtos para venda
# Módulo: 3 (vendas)
```

### Criando um Evento eSocial
```bash
npm run generate:esocial
# Escolher: 1 (Evento eSocial)
# Evento: S-2200 (Cadastramento Inicial do Vínculo)
# Descrição: Formulário para cadastramento inicial de trabalhador
```

### Criando um Composable de Estoque
```bash
npm run generate
# Escolher: 3 (Vue Composable)
# Nome: ProductInventory
# Descrição: Gerenciamento de inventário de produtos
# Módulo: 4 (estoque)
```

## Estrutura de Arquivos Gerada

```
src/
├── components/
│   ├── esocial/
│   │   └── ComponentName.vue
│   ├── core/
│   │   └── ComponentName.vue
│   └── ...
├── views/
│   ├── esocial/
│   │   └── ViewName.vue
│   └── ...
├── composables/
│   ├── esocial/
│   │   └── useComposableName.ts
│   └── ...
├── stores/
│   ├── esocial/
│   │   └── composableNameStore.ts
│   └── ...
└── modules/
    ├── esocial/
    │   └── index.ts
    └── ...
```

## Convenções de Nomenclatura

- **Componentes:** PascalCase (ex: `UserCard.vue`)
- **Views:** PascalCase com sufixo View (ex: `ProductListView.vue`)
- **Composables:** camelCase com prefixo use (ex: `useProductInventory.ts`)
- **Stores:** camelCase com sufixo Store (ex: `productInventoryStore.ts`)
- **Arquivos:** kebab-case para classes CSS (ex: `.user-card`)

## Validações

O gerador inclui validações para:
- Nomes de componentes válidos
- Verificação de arquivos existentes
- Estrutura de pastas correta
- Convenções de nomenclatura

## Personalização

Os templates estão localizados em `scripts/templates/` e podem ser personalizados conforme necessário:

- `component.vue.template` - Template para componentes
- `view.vue.template` - Template para views
- `composable.ts.template` - Template para composables
- `store.ts.template` - Template para stores
- `module.ts.template` - Template para módulos
- `esocial-event.vue.template` - Template para eventos eSocial

## Troubleshooting

### Erro: "Template not found"
- Verifique se os arquivos de template existem em `scripts/templates/`
- Certifique-se de que os caminhos estão corretos

### Erro: "Directory not found"
- O gerador criará automaticamente as pastas necessárias
- Verifique as permissões de escrita no diretório

### Erro: "File already exists"
- O gerador não sobrescreve arquivos existentes
- Renomeie ou remova o arquivo existente antes de gerar novamente

## Contribuindo

Para adicionar novos templates ou modificar os existentes:

1. Edite os arquivos em `scripts/templates/`
2. Use placeholders como `{{componentName}}`, `{{kebabName}}`, etc.
3. Teste o gerador após as modificações
4. Atualize esta documentação se necessário