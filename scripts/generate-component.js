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

const toSnakeCase = (str) => {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase().replace(/[\s-]/g, '_')
}

// Component types configuration
const componentTypes = {
  component: {
    name: 'Vue Component',
    template: 'component.vue.template',
    defaultPath: 'src/components',
    extension: '.vue'
  },
  view: {
    name: 'Vue View',
    template: 'view.vue.template',
    defaultPath: 'src/views',
    extension: '.vue'
  },
  composable: {
    name: 'Vue Composable',
    template: 'composable.ts.template',
    defaultPath: 'src/composables',
    extension: '.ts',
    prefix: 'use'
  },
  store: {
    name: 'Pinia Store',
    template: 'store.ts.template',
    defaultPath: 'src/stores',
    extension: '.ts'
  },
  module: {
    name: 'Module Definition',
    template: 'module.ts.template',
    defaultPath: 'src/modules',
    extension: '/index.ts'
  }
}

// Module-specific paths
const modulePaths = {
  esocial: 'src/modules/esocial',
  core: 'src/modules/core',
  vendas: 'src/modules/vendas',
  estoque: 'src/modules/estoque',
  financeiro: 'src/modules/financeiro',
  rh: 'src/modules/rh'
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

// Validate component name
const validateComponentName = (name) => {
  if (!name || name.trim().length === 0) {
    return 'Nome do componente é obrigatório'
  }
  
  if (!/^[a-zA-Z][a-zA-Z0-9\s-_]*$/.test(name)) {
    return 'Nome deve começar com letra e conter apenas letras, números, espaços, hífens ou underscores'
  }
  
  return null
}

// Check if file exists
const checkFileExists = (filePath) => {
  return existsSync(filePath)
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

// Generate component file
const generateComponent = async (config) => {
  const {
    type,
    name,
    description,
    module,
    customPath,
    subFolder
  } = config
  
  const componentConfig = componentTypes[type]
  const templatePath = join(__dirname, 'templates', componentConfig.template)
  
  // Determine output path
  let outputPath
  if (customPath) {
    outputPath = customPath
  } else if (module && modulePaths[module]) {
    outputPath = join(projectRoot, modulePaths[module])
    
    // Add component type subfolder for modules
    if (type === 'component') outputPath = join(outputPath, 'components')
    else if (type === 'view') outputPath = join(outputPath, 'views')
    else if (type === 'composable') outputPath = join(outputPath, 'composables')
    else if (type === 'store') outputPath = join(outputPath, 'stores')
  } else {
    outputPath = join(projectRoot, componentConfig.defaultPath)
  }
  
  // Add subfolder if specified
  if (subFolder) {
    outputPath = join(outputPath, subFolder)
  }
  
  // Generate file name
  let fileName
  if (type === 'module') {
    fileName = toKebabCase(name)
    outputPath = join(outputPath, fileName)
    fileName = 'index.ts'
  } else {
    const baseName = componentConfig.prefix ? 
      `${componentConfig.prefix}${toPascalCase(name)}` : 
      toPascalCase(name)
    fileName = `${baseName}${componentConfig.extension}`
  }
  
  const fullPath = join(outputPath, fileName)
  
  // Check if file already exists
  if (checkFileExists(fullPath)) {
    const overwrite = await question(`⚠️  Arquivo já existe: ${fullPath}\nDeseja sobrescrever? (s/N): `)
    if (overwrite.toLowerCase() !== 's' && overwrite.toLowerCase() !== 'sim') {
      console.log('❌ Operação cancelada')
      return false
    }
  }
  
  // Prepare template replacements
  const replacements = {
    componentName: toPascalCase(name),
    pascalName: toPascalCase(name),
    camelName: toCamelCase(name),
    kebabName: toKebabCase(name),
    snakeName: toSnakeCase(name),
    title: name,
    description: description || `${componentConfig.name} ${name}`,
    module: module || 'default',
    iconPath: 'M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z'
  }
  
  try {
    // Ensure directory exists
    ensureDirectory(outputPath)
    
    // Process template
    const content = processTemplate(templatePath, replacements)
    
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
  console.log('🚀 Gerador de Componentes - Fahd ERP\n')
  
  try {
    // Select component type
    console.log('Tipos de componentes disponíveis:')
    Object.entries(componentTypes).forEach(([, config], index) => {
      console.log(`${index + 1}. ${config.name}`)
    })
    
    const typeChoice = await question('\nEscolha o tipo de componente (1-5): ')
    const typeIndex = parseInt(typeChoice) - 1
    const typeKeys = Object.keys(componentTypes)
    
    if (typeIndex < 0 || typeIndex >= typeKeys.length) {
      console.log('❌ Opção inválida')
      rl.close()
      return
    }
    
    const selectedType = typeKeys[typeIndex]
    
    // Get component name
    const name = await question('Nome do componente: ')
    const nameError = validateComponentName(name)
    if (nameError) {
      console.log(`❌ ${nameError}`)
      rl.close()
      return
    }
    
    // Get description
    const description = await question('Descrição (opcional): ')
    
    // Select module (optional)
    console.log('\nMódulos disponíveis:')
    console.log('0. Nenhum (usar pasta padrão)')
    Object.keys(modulePaths).forEach((module, index) => {
      console.log(`${index + 1}. ${module}`)
    })
    
    const moduleChoice = await question('\nEscolha o módulo (0 para pasta padrão): ')
    const moduleIndex = parseInt(moduleChoice) - 1
    const moduleKeys = Object.keys(modulePaths)
    let selectedModule = null
    
    if (moduleIndex >= 0 && moduleIndex < moduleKeys.length) {
      selectedModule = moduleKeys[moduleIndex]
    }
    
    // Get subfolder (optional)
    const subFolder = await question('Subpasta (opcional): ')
    
    // Get custom path (optional)
    let customPath = null
    if (!selectedModule) {
      const customPathInput = await question('Caminho customizado (opcional): ')
      if (customPathInput.trim()) {
        customPath = resolve(projectRoot, customPathInput)
      }
    }
    
    // Generate component
    const config = {
      type: selectedType,
      name: name.trim(),
      description: description.trim() || null,
      module: selectedModule,
      customPath,
      subFolder: subFolder.trim() || null
    }
    
    console.log('\n📋 Configuração:')
    console.log(`   Tipo: ${componentTypes[selectedType].name}`)
    console.log(`   Nome: ${config.name}`)
    if (config.description) console.log(`   Descrição: ${config.description}`)
    if (config.module) console.log(`   Módulo: ${config.module}`)
    if (config.subFolder) console.log(`   Subpasta: ${config.subFolder}`)
    if (config.customPath) console.log(`   Caminho: ${config.customPath}`)
    
    const confirm = await question('\nConfirmar criação? (S/n): ')
    if (confirm.toLowerCase() === 'n' || confirm.toLowerCase() === 'não') {
      console.log('❌ Operação cancelada')
      rl.close()
      return
    }
    
    const success = await generateComponent(config)
    
    if (success) {
      console.log('\n🎉 Componente gerado com sucesso!')
      
      // Show next steps
      console.log('\n📝 Próximos passos:')
      if (selectedType === 'module') {
        console.log('   1. Registre o módulo no sistema de módulos')
        console.log('   2. Adicione as rotas necessárias')
        console.log('   3. Configure a navegação')
      } else if (selectedType === 'store') {
        console.log('   1. Importe e use a store nos componentes')
        console.log('   2. Configure as ações e estado conforme necessário')
      } else if (selectedType === 'composable') {
        console.log('   1. Importe e use o composable nos componentes')
        console.log('   2. Customize a lógica conforme necessário')
      } else {
        console.log('   1. Importe o componente onde necessário')
        console.log('   2. Customize o template e lógica')
        console.log('   3. Adicione testes se necessário')
      }
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

export { generateComponent, componentTypes, modulePaths }