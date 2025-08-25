<template>
  <div class="xml-view-page-container">
    <div class="page-header">
      <button type="button" @click="$emit('back')" class="btn btn-back">
        <svg class="btn-icon" viewBox="0 0 24 24">
          <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"/>
        </svg>
        Voltar
      </button>
      
      <h2 class="page-title">
        <svg class="title-icon" viewBox="0 0 24 24">
          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
        </svg>
        Visualização de XML - eSocial
      </h2>
    </div>

    <!-- Informações do Registro -->
    <div class="record-info-section">
      <div class="info-card">
        <div class="info-header">
          <h3 class="info-title">
            <svg class="info-icon" viewBox="0 0 24 24">
              <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
            </svg>
            Informações do Funcionário
          </h3>
        </div>
        
        <div class="info-content">
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Nome Completo:</span>
              <span class="info-value">{{ selectedRecord?.nomeCompleto || 'N/A' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">CPF:</span>
              <span class="info-value">{{ formatCPF(selectedRecord?.cpf || '') }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Matrícula:</span>
              <span class="info-value">{{ selectedRecord?.matricula || 'N/A' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Data de Admissão:</span>
              <span class="info-value">{{ formatDate(selectedRecord?.dataAdmissao || '') }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Cargo:</span>
              <span class="info-value">{{ selectedRecord?.cargo || 'N/A' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Departamento:</span>
              <span class="info-value">{{ selectedRecord?.departamento || 'N/A' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Status:</span>
              <span class="status-badge" :class="`status-${selectedRecord?.status}`">
                {{ getStatusLabel(selectedRecord?.status || '') }}
              </span>
            </div>
            <div class="info-item">
              <span class="info-label">Protocolo eSocial:</span>
              <span class="info-value protocol">{{ selectedRecord?.protocolo || 'Não enviado' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Controles de Visualização -->
    <div class="xml-controls">
      <div class="controls-left">
        <div class="view-options">
          <button 
            type="button" 
            @click="viewMode = 'formatted'"
            class="btn btn-view-option"
            :class="{ active: viewMode === 'formatted' }"
          >
            <svg class="btn-icon" viewBox="0 0 24 24">
              <path d="M14,17H7V15H14M17,13H7V11H17M17,9H7V7H17M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z"/>
            </svg>
            XML Formatado
          </button>
          
          <button 
            type="button" 
            @click="viewMode = 'raw'"
            class="btn btn-view-option"
            :class="{ active: viewMode === 'raw' }"
          >
            <svg class="btn-icon" viewBox="0 0 24 24">
              <path d="M8,3A2,2 0 0,0 6,5V9A2,2 0 0,1 4,11H3V13H4A2,2 0 0,1 6,15V19A2,2 0 0,0 8,21H10V19H8V14A2,2 0 0,0 6,12A2,2 0 0,0 8,10V5H10V3M16,3A2,2 0 0,1 18,5V9A2,2 0 0,0 20,11H21V13H20A2,2 0 0,0 18,15V19A2,2 0 0,1 16,21H14V19H16V14A2,2 0 0,1 18,12A2,2 0 0,1 16,10V5H14V3H16Z"/>
            </svg>
            XML Bruto
          </button>
          
          <button 
            type="button" 
            @click="viewMode = 'tree'"
            class="btn btn-view-option"
            :class="{ active: viewMode === 'tree' }"
          >
            <svg class="btn-icon" viewBox="0 0 24 24">
              <path d="M8,2H16A2,2 0 0,1 18,4V6L16,4H8V6L6,4V4A2,2 0 0,1 8,2M18,7V8A2,2 0 0,1 16,10H8A2,2 0 0,1 6,8V7H4V8A4,4 0 0,0 8,12H16A4,4 0 0,0 20,8V7H18M6,13V22H8V13H6M16,13V22H18V13H16Z"/>
            </svg>
            Árvore XML
          </button>
        </div>
      </div>
      
      <div class="controls-right">
        <button 
          type="button" 
          @click="downloadXML"
          class="btn btn-secondary"
        >
          <svg class="btn-icon" viewBox="0 0 24 24">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
          </svg>
          Baixar XML
        </button>
        
        <button 
          type="button" 
          @click="copyXMLToClipboard"
          class="btn btn-primary"
        >
          <svg class="btn-icon" viewBox="0 0 24 24">
            <path d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"/>
          </svg>
          Copiar XML
        </button>
      </div>
    </div>

    <!-- Visualização do XML -->
    <div class="xml-viewer-section">
      <div class="xml-viewer-header">
        <h3 class="viewer-title">
          <svg class="viewer-icon" viewBox="0 0 24 24">
            <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.98C19.47,12.66 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11.02L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.97 19.05,5.05L16.56,6.05C16.04,5.65 15.48,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.52,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11.02C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.52,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.48,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.04 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.98Z"/>
          </svg>
          {{ getViewerTitle() }}
        </h3>
        
        <div class="xml-stats">
          <span class="stat-item">
            <strong>Tamanho:</strong> {{ xmlStats.size }}
          </span>
          <span class="stat-item">
            <strong>Linhas:</strong> {{ xmlStats.lines }}
          </span>
          <span class="stat-item">
            <strong>Elementos:</strong> {{ xmlStats.elements }}
          </span>
        </div>
      </div>
      
      <div class="xml-content-container">
        <!-- XML Formatado -->
        <div v-if="viewMode === 'formatted'" class="xml-formatted">
          <pre class="xml-code"><code>{{ formattedXML }}</code></pre>
        </div>
        
        <!-- XML Bruto -->
        <div v-else-if="viewMode === 'raw'" class="xml-raw">
          <textarea 
            :value="rawXML" 
            readonly 
            class="xml-textarea"
            rows="30"
          ></textarea>
        </div>
        
        <!-- Árvore XML -->
        <div v-else-if="viewMode === 'tree'" class="xml-tree">
          <div class="tree-container">
            <XMLTreeNode 
              v-for="(node, index) in xmlTree" 
              :key="index"
              :node="node"
              :level="0"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Validação e Erros -->
    <div v-if="xmlValidation.errors.length > 0" class="validation-section">
      <div class="validation-header">
        <h3 class="validation-title">
          <svg class="validation-icon error" viewBox="0 0 24 24">
            <path d="M12,2L13.09,8.26L22,9L17.22,13.78L18.18,22L12,18.27L5.82,22L6.78,13.78L2,9L10.91,8.26L12,2Z"/>
          </svg>
          Erros de Validação ({{ xmlValidation.errors.length }})
        </h3>
      </div>
      
      <div class="validation-errors">
        <div 
          v-for="(error, index) in xmlValidation.errors" 
          :key="index"
          class="error-item"
        >
          <div class="error-icon">
            <svg viewBox="0 0 24 24">
              <path d="M12,2L13.09,8.26L22,9L17.22,13.78L18.18,22L12,18.27L5.82,22L6.78,13.78L2,9L10.91,8.26L12,2Z"/>
            </svg>
          </div>
          <div class="error-content">
            <div class="error-message">{{ error.message }}</div>
            <div class="error-location">Linha {{ error.line }}, Coluna {{ error.column }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import XMLTreeNode from '@/components/esocial/XMLTreeNode.vue'

// Interfaces
interface EmployeeRecord {
  id: string
  nomeCompleto: string
  cpf: string
  matricula: string
  dataAdmissao: string
  cargo: string
  departamento: string
  status: string
  protocolo?: string
}

interface XMLNode {
  name: string
  attributes: Record<string, string>
  children: XMLNode[]
  text?: string
}

interface ValidationError {
  message: string
  line: number
  column: number
}

// Props
const props = defineProps<{
  recordId?: string
}>()

// Emits
defineEmits<{
  back: []
}>()

// Estado reativo
const viewMode = ref<'formatted' | 'raw' | 'tree'>('formatted')
const selectedRecord = ref<EmployeeRecord | null>(null)
const rawXML = ref('')
const formattedXML = ref('')
const xmlTree = ref<XMLNode[]>([])
const xmlValidation = ref<{ errors: ValidationError[] }>({ errors: [] })

// Computed properties
const xmlStats = computed(() => {
  const xml = rawXML.value
  const lines = xml.split('\n').length
  const elements = (xml.match(/<[^/][^>]*>/g) || []).length
  const size = formatFileSize(xml.length)
  
  return { size, lines, elements }
})

// Métodos
const formatCPF = (cpf: string) => {
  if (!cpf) return 'N/A'
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

const formatDate = (date: string) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('pt-BR')
}

const getStatusLabel = (status: string) => {
  const labels = {
    ready: 'Pronto',
    processing: 'Processando',
    sent: 'Enviado',
    error: 'Erro',
    validated: 'Validado'
  }
  return labels[status as keyof typeof labels] || status
}

const getViewerTitle = () => {
  const titles = {
    formatted: 'XML Formatado e Destacado',
    raw: 'XML em Formato Bruto',
    tree: 'Estrutura em Árvore do XML'
  }
  return titles[viewMode.value]
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatXML = (xml: string): string => {
  try {
    // Formatação simples sem biblioteca externa
    const formatted = xml.replace(/></g, '>\n<').replace(/^\s*\n/gm, '')
    
    // Adicionar indentação
    const lines = formatted.split('\n')
    let indent = 0
    const indentedLines = lines.map(line => {
      const trimmed = line.trim()
      if (trimmed.startsWith('</')) {
        indent = Math.max(0, indent - 1)
      }
      const indentedLine = '  '.repeat(indent) + trimmed
      if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.endsWith('/>') && !trimmed.includes('</')) {
        indent++
      }
      return indentedLine
    })
    
    return indentedLines.join('\n')
  } catch (error) {
    console.error('Erro ao formatar XML:', error)
    return xml
  }
}

const generateMockXML = () => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<pessoa>
  <nome>João Silva</nome>
  <idade>30</idade>
  <cidade>São Paulo</cidade>
</pessoa>`
}



const parseXMLToTree = (xml: string): XMLNode[] => {
  // Implementação simplificada de parser XML para árvore
  const parser = new DOMParser()
  const doc = parser.parseFromString(xml, 'text/xml')
  
  const parseNode = (node: Element): XMLNode => {
    const xmlNode: XMLNode = {
      name: node.tagName,
      attributes: {},
      children: [],
      text: ''
    }
    
    // Atributos
    for (let i = 0; i < node.attributes.length; i++) {
      const attr = node.attributes[i]
      xmlNode.attributes[attr.name] = attr.value
    }
    
    // Filhos
    for (let i = 0; i < node.childNodes.length; i++) {
      const child = node.childNodes[i]
      if (child.nodeType === Node.ELEMENT_NODE) {
        xmlNode.children.push(parseNode(child as Element))
      } else if (child.nodeType === Node.TEXT_NODE && child.textContent?.trim()) {
        xmlNode.text = child.textContent.trim()
      }
    }
    
    return xmlNode
  }
  
  const rootNodes: XMLNode[] = []
  for (let i = 0; i < doc.documentElement.childNodes.length; i++) {
    const child = doc.documentElement.childNodes[i]
    if (child.nodeType === Node.ELEMENT_NODE) {
      rootNodes.push(parseNode(child as Element))
    }
  }
  
  return [parseNode(doc.documentElement)]
}

const validateXML = (xml: string) => {
  const errors: ValidationError[] = []
  
  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(xml, 'text/xml')
    
    // Verificar erros de parsing
    const parserError = doc.querySelector('parsererror')
    if (parserError) {
      errors.push({
        message: parserError.textContent || 'Erro de parsing XML',
        line: 1,
        column: 1
      })
    }
    
    // Validações específicas do eSocial (simuladas)
    if (!xml.includes('cpfTrab')) {
      errors.push({
        message: 'Campo obrigatório cpfTrab não encontrado',
        line: 10,
        column: 5
      })
    }
    
    if (!xml.includes('nmTrab')) {
      errors.push({
        message: 'Campo obrigatório nmTrab não encontrado',
        line: 11,
        column: 5
      })
    }
    
  } catch {
    errors.push({
      message: 'Erro geral na validação do XML',
      line: 1,
      column: 1
    })
  }
  
  xmlValidation.value.errors = errors
}

const downloadXML = () => {
  const blob = new Blob([rawXML.value], { type: 'application/xml' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `esocial-s2200-${selectedRecord.value?.matricula || 'registro'}.xml`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const copyXMLToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(rawXML.value)
    alert('XML copiado para a área de transferência!')
  } catch (error) {
    console.error('Erro ao copiar XML:', error)
    alert('Erro ao copiar XML. Tente novamente.')
  }
}

const loadRecordData = () => {
  // Simular carregamento de dados do registro
  selectedRecord.value = {
    id: props.recordId || '1',
    nomeCompleto: 'João Silva Santos',
    cpf: '12345678901',
    matricula: '001234',
    dataAdmissao: '2024-01-15',
    cargo: 'Desenvolvedor Frontend',
    departamento: 'TI',
    status: 'sent',
    protocolo: '1.2.202401.0000000000000001234'
  }
  
  // Gerar XML mockado
  rawXML.value = generateMockXML()
  console.log('Raw XML:', rawXML.value.substring(0, 200))
  
  // Formatar XML
  formattedXML.value = formatXML(rawXML.value)
  console.log('Formatted XML:', formattedXML.value.substring(0, 200))
  
  // Processar XML
  xmlTree.value = parseXMLToTree(rawXML.value)
  
  // Validar XML
  validateXML(rawXML.value)
}

// Lifecycle
onMounted(() => {
  loadRecordData()
})
</script>

<style scoped>
.xml-view-page-container {
  padding: 1.5rem;
  max-width: 1600px;
  margin: 0 auto;
}

/* Header */
.page-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--border-color);
}

.btn-back {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: var(--secondary-color);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-back:hover {
  background: var(--secondary-color-hover);
}

.page-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.title-icon {
  width: 28px;
  height: 28px;
  fill: var(--accent-primary);
}

/* Informações do Registro */
.record-info-section {
  margin-bottom: 2rem;
}

.info-card {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  overflow: hidden;
}

.info-header {
  background: var(--accent-primary);
  padding: 1rem 1.5rem;
}

.info-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  margin: 0;
}

.info-icon {
  width: 20px;
  height: 20px;
  fill: white;
}

.info-content {
  padding: 1.5rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: var(--bg-secondary);
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.info-label {
  font-weight: 500;
  color: var(--text-secondary);
}

.info-value {
  font-weight: 600;
  color: var(--text-primary);
}

.info-value.protocol {
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  color: var(--accent-primary);
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
}

.status-ready {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
}

.status-processing {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
}

.status-sent {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
}

.status-error {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.status-validated {
  background: rgba(168, 85, 247, 0.2);
  color: #a855f7;
}

/* Controles de Visualização */
.xml-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.view-options {
  display: flex;
  gap: 0.5rem;
}

.btn-view-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: transparent;
  color: var(--text-secondary);
  border: 2px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-view-option:hover {
  color: var(--accent-primary);
  border-color: var(--accent-primary);
}

.btn-view-option.active {
  background: var(--accent-primary);
  color: white;
  border-color: var(--accent-primary);
}

.controls-right {
  display: flex;
  gap: 1rem;
}

/* Visualizador de XML */
.xml-viewer-section {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  margin-bottom: 2rem;
}

.xml-viewer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.viewer-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.viewer-icon {
  width: 20px;
  height: 20px;
  fill: var(--accent-primary);
}

.xml-stats {
  display: flex;
  gap: 1.5rem;
}

.stat-item {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.xml-content-container {
  padding: 1.5rem;
  max-height: 600px;
  overflow: auto;
}

/* XML Formatado */
.xml-formatted {
  background: var(--bg-secondary);
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid var(--border-color);
}

.xml-code {
  font-family: 'Courier New', Monaco, monospace;
  font-size: 0.85rem;
  line-height: 1.5;
  color: var(--text-primary);
  white-space: pre-wrap;
  word-break: break-all;
}

/* Prism.js syntax highlighting customization */
:deep(.token.tag) {
  color: #3b82f6;
}

:deep(.token.attr-name) {
  color: #10b981;
}

:deep(.token.attr-value) {
  color: #f59e0b;
}

:deep(.token.punctuation) {
  color: #6b7280;
}

:deep(.token.prolog),
:deep(.token.doctype),
:deep(.token.cdata) {
  color: #8b5cf6;
  font-style: italic;
}

:deep(.token.comment) {
  color: #6b7280;
  font-style: italic;
}

/* XML Bruto */
.xml-raw {
  background: var(--bg-secondary);
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.xml-textarea {
  width: 100%;
  background: transparent;
  color: var(--text-primary);
  border: none;
  padding: 1rem;
  font-family: 'Courier New', Monaco, monospace;
  font-size: 0.85rem;
  line-height: 1.5;
  resize: vertical;
}

.xml-textarea:focus {
  outline: none;
}

/* Árvore XML */
.xml-tree {
  background: var(--bg-secondary);
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid var(--border-color);
}

.tree-container {
  font-family: 'Courier New', Monaco, monospace;
  font-size: 0.85rem;
  line-height: 1.6;
}

/* Validação */
.validation-section {
  background: rgba(239, 68, 68, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(239, 68, 68, 0.3);
  margin-bottom: 2rem;
}

.validation-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(239, 68, 68, 0.3);
}

.validation-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #ef4444;
  margin: 0;
}

.validation-icon {
  width: 20px;
  height: 20px;
  fill: #ef4444;
}

.validation-errors {
  padding: 1.5rem;
}

.error-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: rgba(239, 68, 68, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(239, 68, 68, 0.2);
  margin-bottom: 1rem;
}

.error-item:last-child {
  margin-bottom: 0;
}

.error-icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
}

.error-icon svg {
  width: 100%;
  height: 100%;
  fill: #ef4444;
}

.error-content {
  flex: 1;
}

.error-message {
  font-weight: 500;
  color: #ef4444;
  margin-bottom: 0.25rem;
}

.error-location {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

/* Botões */
.btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--primary-color-hover);
}

.btn-secondary {
  background: var(--secondary-color);
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: var(--secondary-color-hover);
}

.btn-icon {
  width: 16px;
  height: 16px;
  fill: currentColor;
}

/* Responsividade */
@media (max-width: 1200px) {
  .info-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}

@media (max-width: 768px) {
  .xml-view-page-container {
    padding: 1rem;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .xml-controls {
    flex-direction: column;
    gap: 1rem;
  }
  
  .view-options {
    width: 100%;
    justify-content: stretch;
  }
  
  .btn-view-option {
    flex: 1;
    justify-content: center;
  }
  
  .controls-right {
    width: 100%;
    justify-content: stretch;
  }
  
  .controls-right .btn {
    flex: 1;
    justify-content: center;
  }
  
  .xml-viewer-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .xml-stats {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .xml-content-container {
    padding: 1rem;
  }
  
  .error-item {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>