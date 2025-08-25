#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { dirname, join, resolve } from 'path'
import { fileURLToPath } from 'url'
import readline from 'readline'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = resolve(__dirname, '..')

// Utility functions
const toPascalCase = (str) => {
  return str.replace(/(?:^|[\s-_])(\w)/g, (match, letter) => letter.toUpperCase()).replace(/[\s-_]/g, '')
}

const toCamelCase = (str) => {
  const pascal = toPascalCase(str)
  return pascal.charAt(0).toLowerCase() + pascal.slice(1)
}

const toKebabCase = (str) => {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase().replace(/[\s_]/g, '-')
}

// eSocial specific component types
const esocialComponentTypes = {
  event: {
    name: 'Evento eSocial',
    template: 'esocial-event.vue.template',
    path: 'src/modules/esocial/views',
    extension: '.vue',
    suffix: 'View'
  },
  form: {
    name: 'Formulário eSocial',
    template: 'esocial-form.vue.template',
    path: 'src/modules/esocial/components',
    extension: '.vue',
    suffix: 'Form'
  },
  composable: {
    name: 'Composable eSocial',
    template: 'esocial-composable.ts.template',
    path: 'src/modules/esocial/composables',
    extension: '.ts',
    prefix: 'use'
  },
  store: {
    name: 'Store eSocial',
    template: 'esocial-store.ts.template',
    path: 'src/modules/esocial/stores',
    extension: '.ts'
  }
}

// eSocial events configuration
const esocialEvents = {
  's1000': {
    name: 'S-1000 - Informações do Empregador/Contribuinte/Órgão Público',
    description: 'Cadastramento inicial do empregador'
  },
  's1005': {
    name: 'S-1005 - Tabela de Estabelecimentos, Obras ou Unidades de Órgãos Públicos',
    description: 'Cadastramento de estabelecimentos'
  },
  's1010': {
    name: 'S-1010 - Tabela de Rubricas',
    description: 'Cadastramento de rubricas'
  },
  's1020': {
    name: 'S-1020 - Tabela de Lotações Tributárias',
    description: 'Cadastramento de lotações tributárias'
  },
  's1030': {
    name: 'S-1030 - Tabela de Cargos/Empregos Públicos',
    description: 'Cadastramento de cargos'
  },
  's1040': {
    name: 'S-1040 - Tabela de Funções/Cargos em Comissão',
    description: 'Cadastramento de funções'
  },
  's1050': {
    name: 'S-1050 - Tabela de Horários/Turnos de Trabalho',
    description: 'Cadastramento de horários'
  },
  's1060': {
    name: 'S-1060 - Tabela de Ambientes de Trabalho',
    description: 'Cadastramento de ambientes'
  },
  's1070': {
    name: 'S-1070 - Tabela de Processos Administrativos/Judiciais',
    description: 'Cadastramento de processos'
  },
  's1080': {
    name: 'S-1080 - Tabela de Operadores Portuários',
    description: 'Cadastramento de operadores portuários'
  },
  's2190': {
    name: 'S-2190 - Admissão de Trabalhador - Registro Preliminar',
    description: 'Registro preliminar de admissão'
  },
  's2200': {
    name: 'S-2200 - Cadastramento Inicial do Vínculo e Admissão/Ingresso de Trabalhador',
    description: 'Cadastramento inicial do vínculo'
  },
  's2205': {
    name: 'S-2205 - Alteração de Dados Cadastrais do Trabalhador',
    description: 'Alteração de dados cadastrais'
  },
  's2206': {
    name: 'S-2206 - Alteração de Contrato de Trabalho',
    description: 'Alteração de contrato'
  },
  's2210': {
    name: 'S-2210 - Comunicação de Acidente de Trabalho',
    description: 'Comunicação de acidente'
  },
  's2220': {
    name: 'S-2220 - Monitoramento da Saúde do Trabalhador',
    description: 'Monitoramento de saúde'
  },
  's2230': {
    name: 'S-2230 - Afastamento Temporário',
    description: 'Registro de afastamento'
  },
  's2240': {
    name: 'S-2240 - Condições Ambientais do Trabalho - Agentes Nocivos',
    description: 'Condições ambientais'
  },
  's2245': {
    name: 'S-2245 - Treinamentos, Capacitações, Exercícios Simulados e Outras Anotações',
    description: 'Registro de treinamentos'
  },
  's2250': {
    name: 'S-2250 - Aviso Prévio',
    description: 'Comunicação de aviso prévio'
  },
  's2260': {
    name: 'S-2260 - Convocação para Trabalho Intermitente',
    description: 'Convocação trabalho intermitente'
  },
  's2298': {
    name: 'S-2298 - Reintegração',
    description: 'Registro de reintegração'
  },
  's2299': {
    name: 'S-2299 - Desligamento',
    description: 'Registro de desligamento'
  },
  's2300': {
    name: 'S-2300 - Trabalhador Sem Vínculo de Emprego/Estatutário - Início',
    description: 'Cadastramento trabalhador sem vínculo'
  },
  's2306': {
    name: 'S-2306 - Trabalhador Sem Vínculo de Emprego/Estatutário - Alteração Contratual',
    description: 'Alteração contratual sem vínculo'
  },
  's2399': {
    name: 'S-2399 - Trabalhador Sem Vínculo de Emprego/Estatutário - Término',
    description: 'Término trabalhador sem vínculo'
  },
  's2400': {
    name: 'S-2400 - Cadastro de Beneficiário - Entes Públicos',
    description: 'Cadastramento de beneficiário'
  },
  's3000': {
    name: 'S-3000 - Exclusão de Eventos',
    description: 'Exclusão de eventos'
  }
}

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

// Promisify readline question
const question = (query) => {
  return new Promise((resolve) => {
    rl.question(query, resolve)
  })
}

// Create directory if it doesn't exist
const ensureDirectory = (dirPath) => {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true })
    console.log(`📁 Diretório criado: ${dirPath}`)
  }
}

// Load and process template
const processTemplate = (templatePath, replacements) => {
  try {
    let content = readFileSync(templatePath, 'utf-8')
    
    // Replace all placeholders
    Object.entries(replacements).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g')
      content = content.replace(regex, value)
    })
    
    return content
  } catch (error) {
    throw new Error(`Erro ao processar template: ${error.message}`)
  }
}

// Create eSocial templates if they don't exist
const createESocialTemplates = () => {
  const templatesDir = join(__dirname, 'templates')
  
  // eSocial Event View Template
  const eventTemplate = `<template>
  <div class="esocial-{{kebabName}}-container">
    <div class="form-container">
      <!-- Card Heading -->
      <ESocialCardHeading 
        :title="'{{eventName}}'"
        :subtitle="'{{eventDescription}}'"
        :badge="'eSocial'"
        :icon-path="iconPath"
      />
      
      <div class="esocial-form">
        <!-- Filtros Section -->
        <div class="form-section">
          <h2 class="section-title">
            <div class="section-title-content">
              <svg class="section-icon" viewBox="0 0 24 24">
                <path d="M14,12V19.88C14.04,20.18 13.94,20.5 13.71,20.71C13.32,21.1 12.69,21.1 12.3,20.71L10.29,18.7C10.06,18.47 9.96,18.16 10,17.87V12H9.97L4.21,4.62C3.87,4.19 3.95,3.56 4.38,3.22C4.57,3.08 4.78,3 5,3V3H19V3C19.22,3 19.43,3.08 19.62,3.22C20.05,3.56 20.13,4.19 19.79,4.62L14.03,12H14Z"/>
              </svg>
              Filtros de Consulta
            </div>
          </h2>
          
          <div class="filters-content">
            <div class="form-grid">
              <div class="form-group">
                <label for="filterCpf" class="form-label">CPF do Trabalhador</label>
                <input
                  id="filterCpf"
                  v-model="filters.cpf"
                  type="text"
                  class="form-input"
                  placeholder="000.000.000-00"
                  maxlength="14"
                />
              </div>
              
              <div class="form-group">
                <label for="filterStatus" class="form-label">Status</label>
                <select id="filterStatus" v-model="filters.status" class="form-input">
                  <option value="">Todos os status</option>
                  <option value="pendente">Pendente</option>
                  <option value="processando">Processando</option>
                  <option value="enviado">Enviado</option>
                  <option value="sucesso">Sucesso</option>
                  <option value="erro">Erro</option>
                </select>
              </div>
            </div>
            
            <div class="form-actions">
              <button @click="handleSearch" class="btn btn-primary">
                <svg class="btn-icon" viewBox="0 0 24 24">
                  <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/>
                </svg>
                Pesquisar
              </button>
              
              <button @click="handleClear" class="btn btn-secondary">
                <svg class="btn-icon" viewBox="0 0 24 24">
                  <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
                </svg>
                Limpar
              </button>
            </div>
          </div>
        </div>
        
        <!-- Results Section -->
        <div class="form-section">
          <h2 class="section-title">
            <div class="section-title-content">
              <svg class="section-icon" viewBox="0 0 24 24">
                <path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,5V19H5V5H19Z"/>
              </svg>
              Resultados
            </div>
          </h2>
          
          <div class="results-content">
            <div v-if="isLoading" class="loading-state">
              <svg class="loading-icon animate-spin" viewBox="0 0 24 24">
                <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z"/>
              </svg>
              <span>Carregando...</span>
            </div>
            
            <div v-else-if="results.length === 0" class="empty-state">
              <svg class="empty-icon" viewBox="0 0 24 24">
                <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z"/>
              </svg>
              <span>Nenhum resultado encontrado</span>
            </div>
            
            <div v-else class="results-table">
              <!-- Add your results table here -->
              <p>{{ results.length }} resultado(s) encontrado(s)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import ESocialCardHeading from '@/components/ESocialCardHeading.vue'

// Reactive state
const isLoading = ref(false)
const results = ref([])

// Filters
const filters = reactive({
  cpf: '',
  status: ''
})

// Icon path
const iconPath = 'M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z'

// Methods
const handleSearch = async () => {
  try {
    isLoading.value = true
    // Add search logic here
    console.log('Searching {{eventName}} with filters:', filters)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    results.value = []
    
  } catch (error) {
    console.error('Error searching {{eventName}}:', error)
  } finally {
    isLoading.value = false
  }
}

const handleClear = () => {
  filters.cpf = ''
  filters.status = ''
  results.value = []
}

// Lifecycle
onMounted(() => {
  console.log('{{eventName}} view mounted')
})
</script>

<style scoped>
/* Add your styles here following the eSocial pattern */
.esocial-{{kebabName}}-container {
  padding: 0.25rem 0.25rem 1rem;
  min-height: 100vh;
  background: var(--bg-primary);
  user-select: none;
}

/* Include standard eSocial styles */
</style>`
  
  const eventTemplatePath = join(templatesDir, 'esocial-event.vue.template')
  if (!existsSync(eventTemplatePath)) {
    writeFileSync(eventTemplatePath, eventTemplate, 'utf-8')
  }
}

// Generate eSocial component
const generateESocialComponent = async (config) => {
  const {
    type,
    eventCode,
    customName,
    description
  } = config
  
  const componentConfig = esocialComponentTypes[type]
  const templatePath = join(__dirname, 'templates', componentConfig.template)
  
  // Determine component name
  let componentName
  if (customName) {
    componentName = customName
  } else if (eventCode && esocialEvents[eventCode]) {
    componentName = `ESocial${eventCode.toUpperCase()}`
  } else {
    throw new Error('Nome do componente ou código do evento é obrigatório')
  }
  
  // Determine output path
  const outputPath = join(projectRoot, componentConfig.path)
  
  // Generate file name
  let fileName
  if (componentConfig.prefix) {
    fileName = `${componentConfig.prefix}${toPascalCase(componentName)}${componentConfig.extension}`
  } else if (componentConfig.suffix) {
    fileName = `${toPascalCase(componentName)}${componentConfig.suffix}${componentConfig.extension}`
  } else {
    fileName = `${toPascalCase(componentName)}${componentConfig.extension}`
  }
  
  const fullPath = join(outputPath, fileName)
  
  // Check if file already exists
  if (existsSync(fullPath)) {
    const overwrite = await question(`⚠️  Arquivo já existe: ${fullPath}\nDeseja sobrescrever? (s/N): `)
    if (overwrite.toLowerCase() !== 's' && overwrite.toLowerCase() !== 'sim') {
      console.log('❌ Operação cancelada')
      return false
    }
  }
  
  // Prepare template replacements
  const eventInfo = eventCode ? esocialEvents[eventCode] : null
  const replacements = {
    componentName: toPascalCase(componentName),
    pascalName: toPascalCase(componentName),
    camelName: toCamelCase(componentName),
    kebabName: toKebabCase(componentName),
    eventCode: eventCode || '',
    eventName: eventInfo?.name || componentName,
    eventDescription: eventInfo?.description || description || `Componente ${componentName}`,
    description: description || `${componentConfig.name} ${componentName}`,
    iconPath: 'M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z'
  }
  
  try {
    // Ensure directory exists
    ensureDirectory(outputPath)
    
    // Create templates if they don't exist
    createESocialTemplates()
    
    // Process template (fallback to regular templates if eSocial template doesn't exist)
    let content
    if (existsSync(templatePath)) {
      content = processTemplate(templatePath, replacements)
    } else {
      // Fallback to regular templates
      const fallbackTemplate = type === 'event' ? 'view.vue.template' : `${type}.ts.template`
      const fallbackPath = join(__dirname, 'templates', fallbackTemplate)
      content = processTemplate(fallbackPath, replacements)
    }
    
    // Write file
    writeFileSync(fullPath, content, 'utf-8')
    
    console.log(`✅ ${componentConfig.name} criado com sucesso!`)
    console.log(`📄 Arquivo: ${fullPath}`)
    
    return true
  } catch (error) {
    console.error(`❌ Erro ao criar componente: ${error.message}`)
    return false
  }
}

// Main CLI function
const main = async () => {
  console.log('🏛️  Gerador de Componentes eSocial - Fahd ERP\n')
  
  try {
    // Select component type
    console.log('Tipos de componentes eSocial disponíveis:')
    Object.entries(esocialComponentTypes).forEach(([, config], index) => {
      console.log(`${index + 1}. ${config.name}`)
    })
    
    const typeChoice = await question('\nEscolha o tipo de componente (1-4): ')
    const typeIndex = parseInt(typeChoice) - 1
    const typeKeys = Object.keys(esocialComponentTypes)
    
    if (typeIndex < 0 || typeIndex >= typeKeys.length) {
      console.log('❌ Opção inválida')
      rl.close()
      return
    }
    
    const selectedType = typeKeys[typeIndex]
    
    let eventCode = null
    let customName = null
    
    if (selectedType === 'event') {
      // Select eSocial event
      console.log('\nEventos eSocial disponíveis:')
      console.log('0. Personalizado')
      Object.entries(esocialEvents).forEach(([code, info], index) => {
        console.log(`${index + 1}. ${code.toUpperCase()} - ${info.name}`)
      })
      
      const eventChoice = await question('\nEscolha o evento (0 para personalizado): ')
      const eventIndex = parseInt(eventChoice) - 1
      const eventKeys = Object.keys(esocialEvents)
      
      if (eventIndex >= 0 && eventIndex < eventKeys.length) {
        eventCode = eventKeys[eventIndex]
      } else if (eventChoice === '0') {
        customName = await question('Nome do componente personalizado: ')
        if (!customName.trim()) {
          console.log('❌ Nome é obrigatório para componente personalizado')
          rl.close()
          return
        }
      } else {
        console.log('❌ Opção inválida')
        rl.close()
        return
      }
    } else {
      // Get custom name for other types
      customName = await question('Nome do componente: ')
      if (!customName.trim()) {
        console.log('❌ Nome do componente é obrigatório')
        rl.close()
        return
      }
    }
    
    // Get description
    const description = await question('Descrição (opcional): ')
    
    // Generate component
    const config = {
      type: selectedType,
      eventCode,
      customName: customName?.trim() || null,
      description: description.trim() || null
    }
    
    console.log('\n📋 Configuração:')
    console.log(`   Tipo: ${esocialComponentTypes[selectedType].name}`)
    if (config.eventCode) {
      console.log(`   Evento: ${config.eventCode.toUpperCase()} - ${esocialEvents[config.eventCode].name}`)
    }
    if (config.customName) {
      console.log(`   Nome: ${config.customName}`)
    }
    if (config.description) {
      console.log(`   Descrição: ${config.description}`)
    }
    
    const confirm = await question('\nConfirmar criação? (S/n): ')
    if (confirm.toLowerCase() === 'n' || confirm.toLowerCase() === 'não') {
      console.log('❌ Operação cancelada')
      rl.close()
      return
    }
    
    const success = await generateESocialComponent(config)
    
    if (success) {
      console.log('\n🎉 Componente eSocial gerado com sucesso!')
      
      // Show next steps
      console.log('\n📝 Próximos passos:')
      console.log('   1. Registre o componente no módulo eSocial (src/modules/esocial/index.ts)')
      console.log('   2. Adicione a rota se necessário')
      console.log('   3. Configure a navegação no sistema')
      console.log('   4. Implemente a lógica específica do evento')
      console.log('   5. Adicione validações e tratamento de erros')
    }
    
  } catch (error) {
    console.error(`❌ Erro inesperado: ${error.message}`)
  } finally {
    rl.close()
  }
}

// Run CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export { generateESocialComponent, esocialComponentTypes, esocialEvents }