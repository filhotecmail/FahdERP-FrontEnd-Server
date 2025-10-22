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

// Load CRUD configuration
const loadCRUDConfig = () => {
  try {
    const configPath = join(__dirname, 'templates', 'crud-management.config.json')
    const configContent = readFileSync(configPath, 'utf8')
    return JSON.parse(configContent)
  } catch (error) {
    console.error('❌ Erro ao carregar configuração do CRUD:', error.message)
    process.exit(1)
  }
}

// Module paths configuration
const modulePaths = {
  usuarios: 'src/modules/usuarios',
  produtos: 'src/modules/produtos',
  clientes: 'src/modules/clientes',
  fornecedores: 'src/modules/fornecedores',
  vendas: 'src/modules/vendas',
  estoque: 'src/modules/estoque',
  financeiro: 'src/modules/financeiro',
  rh: 'src/modules/rh',
  esocial: 'src/modules/esocial',
  core: 'src/modules/core'
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const question = (query) => {
  return new Promise((resolve) => {
    rl.question(query, resolve)
  })
}

const validateModuleName = (name) => {
  if (!name || name.trim().length === 0) {
    return 'Nome do módulo é obrigatório'
  }
  if (!/^[a-zA-Z][a-zA-Z0-9-_]*$/.test(name)) {
    return 'Nome do módulo deve começar com letra e conter apenas letras, números, hífens e underscores'
  }
  return null
}

const checkFileExists = (filePath) => {
  return existsSync(filePath)
}

const ensureDirectory = (dirPath) => {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true })
    console.log(`📁 Diretório criado: ${dirPath}`)
  }
}

const processTemplate = (templateContent, replacements) => {
  let result = templateContent

  // Replace simple placeholders
  Object.keys(replacements).forEach(key => {
    if (typeof replacements[key] === 'string' || typeof replacements[key] === 'number') {
      const regex = new RegExp(`{{${key}}}`, 'g')
      result = result.replace(regex, replacements[key])
    }
  })

  // Process arrays with Handlebars-like syntax
  const processArray = (arrayName, items, template) => {
    if (!items || !Array.isArray(items)) return ''
    
    return items.map(item => {
      let itemTemplate = template
      Object.keys(item).forEach(key => {
        const regex = new RegExp(`{{${key}}}`, 'g')
        itemTemplate = itemTemplate.replace(regex, item[key])
      })
      return itemTemplate
    }).join('\n')
  }

  // Process filterFields
  if (replacements.filterFields) {
    const filterFieldsRegex = /{{#each filterFields}}([\s\S]*?){{\/each}}/g
    result = result.replace(filterFieldsRegex, (match, template) => {
      return processArray('filterFields', replacements.filterFields, template)
    })
  }

  // Process statusFilters
  if (replacements.statusFilters) {
    const statusFiltersRegex = /{{#each statusFilters}}([\s\S]*?){{\/each}}/g
    result = result.replace(statusFiltersRegex, (match, template) => {
      return processArray('statusFilters', replacements.statusFilters, template)
    })
  }

  // Process tableColumns
  if (replacements.tableColumns) {
    const tableColumnsRegex = /{{#each tableColumns}}([\s\S]*?){{\/each}}/g
    result = result.replace(tableColumnsRegex, (match, template) => {
      return processArray('tableColumns', replacements.tableColumns, template)
    })
  }

  // Process batchActions
  if (replacements.batchActions) {
    const batchActionsRegex = /{{#each batchActions}}([\s\S]*?){{\/each}}/g
    result = result.replace(batchActionsRegex, (match, template) => {
      return processArray('batchActions', replacements.batchActions, template)
    })
  }

  // Calculate tableColumnsCount (columns + checkbox + actions)
  const columnsCount = (replacements.tableColumns?.length || 0) + 2
  result = result.replace(/{{tableColumnsCount}}/g, columnsCount)

  // Process conditional helpers
  result = result.replace(/{{#if \(eq type 'select'\)}}([\s\S]*?){{else}}([\s\S]*?){{\/if}}/g, (match, selectTemplate, inputTemplate) => {
    // This would need more complex processing for each field
    return inputTemplate // Default to input template for now
  })

  return result
}

const generateCRUD = async (config) => {
  try {
    console.log('\n🚀 Gerando CRUD Management View...\n')

    const {
      moduleName,
      preset,
      customConfig,
      outputPath,
      overwrite
    } = config

    // Load template
    const templatePath = join(__dirname, 'templates', 'crud-management.vue.template')
    if (!existsSync(templatePath)) {
      throw new Error(`Template não encontrado: ${templatePath}`)
    }

    const templateContent = readFileSync(templatePath, 'utf8')
    const crudConfig = loadCRUDConfig()

    // Determine configuration to use
    let finalConfig
    if (preset && crudConfig.presets[preset]) {
      finalConfig = crudConfig.presets[preset]
      console.log(`📋 Usando preset: ${preset}`)
    } else if (customConfig) {
      finalConfig = customConfig
      console.log('⚙️  Usando configuração customizada')
    } else {
      throw new Error('Preset ou configuração customizada deve ser fornecida')
    }

    // Add utility functions to config
    const replacements = {
      ...finalConfig,
      pascalCase: toPascalCase,
      camelCase: toCamelCase,
      kebabCase: toKebabCase,
      snakeCase: toSnakeCase
    }

    // Process template
    const processedContent = processTemplate(templateContent, replacements)

    // Ensure output directory exists
    const outputDir = dirname(outputPath)
    ensureDirectory(outputDir)

    // Check if file exists
    if (checkFileExists(outputPath) && !overwrite) {
      throw new Error(`Arquivo já existe: ${outputPath}. Use --overwrite para sobrescrever.`)
    }

    // Write file
    writeFileSync(outputPath, processedContent, 'utf8')

    console.log('✅ CRUD gerado com sucesso!')
    console.log(`📄 Arquivo: ${outputPath}`)
    console.log(`📦 Módulo: ${moduleName}`)
    console.log(`🎨 Preset: ${preset || 'customizado'}`)

    // Show next steps
    console.log('\n📋 Próximos passos:')
    console.log('1. Revise o arquivo gerado')
    console.log('2. Implemente a lógica de negócio nos métodos')
    console.log('3. Configure as rotas do módulo')
    console.log('4. Teste a funcionalidade')

  } catch (error) {
    console.error('❌ Erro ao gerar CRUD:', error.message)
    throw error
  }
}

const showAvailablePresets = () => {
  const config = loadCRUDConfig()
  console.log('\n📋 Presets disponíveis:')
  Object.keys(config.presets).forEach(preset => {
    const presetConfig = config.presets[preset]
    console.log(`  • ${preset}: ${presetConfig.title}`)
  })
  console.log('')
}

const main = async () => {
  try {
    console.log('🎯 Gerador de CRUD Management - Fahd ERP')
    console.log('=====================================\n')

    // Show available presets
    showAvailablePresets()

    // Get module name
    const moduleName = await question('📦 Nome do módulo: ')
    const moduleValidation = validateModuleName(moduleName)
    if (moduleValidation) {
      console.error(`❌ ${moduleValidation}`)
      process.exit(1)
    }

    // Get preset or custom config
    const usePreset = await question('🎨 Usar preset existente? (s/n): ')
    
    let preset = null
    let customConfig = null

    if (usePreset.toLowerCase() === 's' || usePreset.toLowerCase() === 'sim') {
      preset = await question('📋 Nome do preset: ')
      const config = loadCRUDConfig()
      if (!config.presets[preset]) {
        console.error(`❌ Preset '${preset}' não encontrado`)
        showAvailablePresets()
        process.exit(1)
      }
    } else {
      console.log('⚙️  Configuração customizada não implementada nesta versão.')
      console.log('📝 Use um preset existente ou edite o arquivo manualmente após a geração.')
      process.exit(1)
    }

    // Determine output path
    let outputPath
    const suggestedPath = modulePaths[moduleName] 
      ? `${modulePaths[moduleName]}/views/${toPascalCase(moduleName)}ManagementView.vue`
      : `src/modules/${moduleName}/views/${toPascalCase(moduleName)}ManagementView.vue`

    const customPath = await question(`📁 Caminho de saída (Enter para usar: ${suggestedPath}): `)
    outputPath = customPath.trim() || suggestedPath

    // Make path absolute
    if (!outputPath.startsWith('/')) {
      outputPath = resolve(projectRoot, outputPath)
    }

    // Check overwrite
    let overwrite = false
    if (checkFileExists(outputPath)) {
      const overwriteAnswer = await question(`⚠️  Arquivo já existe. Sobrescrever? (s/n): `)
      overwrite = overwriteAnswer.toLowerCase() === 's' || overwriteAnswer.toLowerCase() === 'sim'
      if (!overwrite) {
        console.log('❌ Operação cancelada.')
        process.exit(0)
      }
    }

    // Generate CRUD
    await generateCRUD({
      moduleName,
      preset,
      customConfig,
      outputPath,
      overwrite
    })

  } catch (error) {
    console.error('❌ Erro:', error.message)
    process.exit(1)
  } finally {
    rl.close()
  }
}

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export { generateCRUD, loadCRUDConfig, modulePaths }