# Template CRUD Management - Fahd ERP

## Visão Geral

O template `crud-management.vue.template` é um componente Vue.js genérico baseado no `UserManagementView.vue` que fornece uma estrutura padronizada para páginas de gerenciamento CRUD em todo o sistema Fahd ERP.

## Características

- ✅ **Interface Consistente**: Design padronizado com gradiente verde-azul
- ✅ **Responsivo**: Adaptável a diferentes tamanhos de tela
- ✅ **Filtros Avançados**: Sistema de filtros configurável
- ✅ **Tabela de Dados**: Estrutura de tabela com paginação
- ✅ **Ações em Lote**: Suporte a operações em múltiplos registros
- ✅ **Estado Vazio**: Interface amigável quando não há dados
- ✅ **Configurável**: Totalmente parametrizável via JSON

## Estrutura de Arquivos

```
scripts/templates/
├── crud-management.vue.template     # Template principal
├── crud-management.config.json      # Configurações e presets
└── README-CRUD-Template.md          # Esta documentação
```

## Como Usar

### 1. Usando um Preset Existente

Para módulos comuns, use os presets pré-configurados:

```bash
# Copiar template para o módulo de usuários
cp scripts/templates/crud-management.vue.template src/modules/usuarios/views/UserManagementView.vue

# Aplicar configurações do preset "usuarios"
# (substitua os placeholders pelos valores do preset)
```

### 2. Configuração Manual

#### Passo 1: Copiar o Template
```bash
cp scripts/templates/crud-management.vue.template src/modules/[seu-modulo]/views/[SeuModulo]ManagementView.vue
```

#### Passo 2: Substituir Placeholders

Substitua os seguintes placeholders no arquivo:

| Placeholder | Descrição | Exemplo |
|-------------|-----------|---------|
| `{{title}}` | Título principal | "Gerenciamento de Produtos" |
| `{{subtitle}}` | Subtítulo descritivo | "Gerencie produtos, categorias e estoque" |
| `{{badgeText}}` | Texto do badge | "Catálogo Ativo" |
| `{{iconPath}}` | Path SVG do ícone | "M12,4A4,4 0 0,1 16,8..." |
| `{{dataTitle}}` | Título da seção de dados | "dos Produtos" |
| `{{entityName}}` | Nome da entidade (singular) | "produto" |
| `{{dataDescription}}` | Descrição para estado vazio | "dos produtos" |

#### Passo 3: Configurar Arrays

Configure os arrays usando a sintaxe Handlebars:

**Campos de Filtro:**
```handlebars
{{#each filterFields}}
<div class="form-group">
  <label for="filter{{pascalCase name}}" class="form-label">{{label}}</label>
  <input type="{{type}}" class="form-input" placeholder="{{placeholder}}" />
</div>
{{/each}}
```

**Colunas da Tabela:**
```handlebars
{{#each tableColumns}}
<th>{{label}}</th>
{{/each}}
```

## Presets Disponíveis

### 1. Preset "usuarios"
- **Módulo**: Gerenciamento de Usuários
- **Filtros**: Nome, E-mail, Status, Perfil de Acesso, Datas
- **Colunas**: Nome, E-mail, Perfil, Status, Data Cadastro, Último Acesso
- **Ações**: Ativar, Desativar, Relatório

### 2. Preset "produtos"
- **Módulo**: Gerenciamento de Produtos
- **Filtros**: Nome, Código, Categoria, Status
- **Colunas**: Código, Nome, Categoria, Preço, Estoque, Status
- **Ações**: Ativar, Atualizar Preços

## Configuração Detalhada

### Campos de Filtro

```json
{
  "filterFields": [
    {
      "name": "nome",
      "label": "Nome",
      "type": "text",
      "placeholder": "Digite o nome"
    },
    {
      "name": "status",
      "label": "Status", 
      "type": "select",
      "placeholder": "Selecione o status",
      "options": [
        {"value": "ativo", "label": "Ativo"},
        {"value": "inativo", "label": "Inativo"}
      ]
    }
  ]
}
```

**Tipos de Campo Suportados:**
- `text`: Campo de texto
- `email`: Campo de e-mail
- `select`: Lista suspensa
- `date`: Seletor de data
- `number`: Campo numérico

### Filtros de Status

```json
{
  "statusFilters": [
    {"value": "all", "label": "Todos os registros"},
    {"value": "active", "label": "Registros ativos"},
    {"value": "inactive", "label": "Registros inativos"}
  ]
}
```

### Colunas da Tabela

```json
{
  "tableColumns": [
    {
      "key": "nome",
      "label": "Nome",
      "sortable": true,
      "width": "200px"
    },
    {
      "key": "status",
      "label": "Status",
      "sortable": false
    }
  ]
}
```

### Ações em Lote

```json
{
  "batchActions": [
    {
      "key": "activate",
      "label": "Ativar Selecionados",
      "class": "btn-primary",
      "iconPath": "M12,2A10,10 0 0,0 2,12...",
      "disabled": false
    }
  ]
}
```

**Classes de Botão Disponíveis:**
- `btn-primary`: Botão principal (verde-azul)
- `btn-secondary`: Botão secundário (cinza)
- `btn-danger`: Botão de perigo (vermelho)

## Personalização de Estilos

O template usa as seguintes variáveis CSS principais:

```css
/* Cores principais */
--primary-gradient: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
--accent-primary: #10b981;
--text-primary: #1f2937;
--text-secondary: #6b7280;
--border-color: #e5e7eb;
--background-light: #f8fafc;
```

### Customizações Comuns

**Alterar cores do gradiente:**
```css
.card-heading {
  background: linear-gradient(135deg, #sua-cor-1 0%, #sua-cor-2 100%);
}
```

**Personalizar ícones:**
```css
.section-icon {
  fill: #sua-cor-de-icone;
}
```

## Integração com Scripts de Geração

### Criando um Gerador Automático

```javascript
// scripts/generate-crud.js
const fs = require('fs');
const path = require('path');

function generateCRUD(moduleName, config) {
  const templatePath = 'scripts/templates/crud-management.vue.template';
  const template = fs.readFileSync(templatePath, 'utf8');
  
  // Substituir placeholders
  let result = template;
  Object.keys(config).forEach(key => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, config[key]);
  });
  
  // Salvar arquivo
  const outputPath = `src/modules/${moduleName}/views/${moduleName}ManagementView.vue`;
  fs.writeFileSync(outputPath, result);
  
  console.log(`✅ CRUD gerado: ${outputPath}`);
}

// Uso
const config = require('./templates/crud-management.config.json');
generateCRUD('produtos', config.presets.produtos);
```

## Exemplos Práticos

### Exemplo 1: Módulo de Clientes

```json
{
  "title": "Gerenciamento de Clientes",
  "subtitle": "Gerencie clientes, contatos e histórico de compras",
  "badgeText": "CRM Ativo",
  "iconPath": "M16,4C18.11,4 20,5.89 20,8A4,4 0 0,1 16,12A4,4 0 0,1 12,8A4,4 0 0,1 16,4M16,14C20.42,14 24,15.79 24,18V20H8V18C8,15.79 11.58,14 16,14Z",
  "dataTitle": "dos Clientes",
  "entityName": "cliente",
  "dataDescription": "dos clientes",
  "filterFields": [
    {"name": "nome", "label": "Nome", "type": "text", "placeholder": "Digite o nome do cliente"},
    {"name": "email", "label": "E-mail", "type": "email", "placeholder": "Digite o e-mail"},
    {"name": "cidade", "label": "Cidade", "type": "text", "placeholder": "Digite a cidade"},
    {"name": "status", "label": "Status", "type": "select", "placeholder": "Selecione o status", "options": [{"value": "ativo", "label": "Ativo"}, {"value": "inativo", "label": "Inativo"}]}
  ]
}
```

### Exemplo 2: Módulo de Fornecedores

```json
{
  "title": "Gerenciamento de Fornecedores",
  "subtitle": "Gerencie fornecedores, contratos e avaliações",
  "badgeText": "Supply Chain",
  "iconPath": "M17,18A2,2 0 0,1 19,20A2,2 0 0,1 17,22C15.89,22 15,21.1 15,20C15,18.89 15.89,18 17,18M1,2H4.27L5.21,4H20A1,1 0 0,1 21,5A1,1 0 0,1 20.75,5.57L17.33,11.18C16.96,11.65 16.4,11.93 15.83,11.93H8.1L7.2,13.63L7.17,13.75A0.25,0.25 0 0,0 7.42,14H19V16H7A2,2 0 0,1 5,14A2,2 0 0,1 5.27,12.84L6.58,10.58L3,4H1V2M7,18A2,2 0 0,1 9,20A2,2 0 0,1 7,22C5.89,22 5,21.1 5,20C5,18.89 5.89,18 7,18Z",
  "dataTitle": "dos Fornecedores",
  "entityName": "fornecedor",
  "dataDescription": "dos fornecedores"
}
```

## Troubleshooting

### Problemas Comuns

**1. Placeholders não substituídos**
- Verifique se todos os `{{}}` foram substituídos
- Confirme a sintaxe dos arrays com `{{#each}}`

**2. Estilos não aplicados**
- Verifique se o CSS está sendo importado corretamente
- Confirme se as classes CSS estão corretas

**3. Funcionalidades não funcionam**
- Implemente os métodos `applyFilters()`, `clearFilters()`, etc.
- Adicione a lógica de negócio específica do módulo

### Logs de Debug

Adicione logs para debug:

```javascript
// No método applyFilters
console.log('Filtros aplicados:', filters);

// No método de ações em lote
console.log('Ação executada:', action, 'Itens selecionados:', selectedItems);
```

## Contribuição

Para melhorar este template:

1. Faça suas alterações no arquivo base `crud-management.vue.template`
2. Atualize a configuração em `crud-management.config.json`
3. Documente as mudanças neste README
4. Teste com diferentes presets
5. Submeta um pull request

## Versionamento

- **v1.0.0**: Versão inicial baseada no UserManagementView
- Futuras versões incluirão melhorias e novos recursos

## Suporte

Para dúvidas ou problemas:
- Consulte a documentação do projeto Fahd ERP
- Abra uma issue no repositório
- Entre em contato com a equipe de desenvolvimento