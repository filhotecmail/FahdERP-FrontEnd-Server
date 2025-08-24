<template>
  <div class="xml-tree-node">
    <div class="node-content" :style="{ paddingLeft: `${level * 20}px` }">
      <div class="node-toggle" @click="toggleExpanded" v-if="hasChildren">
        <svg class="toggle-icon" :class="{ expanded: isExpanded }" viewBox="0 0 24 24">
          <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/>
        </svg>
      </div>
      <div class="node-icon" v-else>
        <svg class="element-icon" viewBox="0 0 24 24">
          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
        </svg>
      </div>
      
      <div class="node-info">
        <div class="node-header">
          <span class="node-tag-open">&lt;{{ node.name }}</span>
          
          <!-- Atributos -->
          <div v-if="Object.keys(node.attributes).length > 0" class="node-attributes">
            <span v-for="(value, key) in node.attributes" :key="key" class="node-attribute">
              <span class="attr-name">{{ key }}</span>=<span class="attr-value">"{{ value }}"</span>
            </span>
          </div>
          
          <span class="node-tag-close" v-if="!hasChildren && !node.text">/&gt;</span>
          <span class="node-tag-close" v-else>&gt;</span>
        </div>
        
        <!-- Texto do nó -->
        <div v-if="node.text && !hasChildren" class="node-text-inline">{{ node.text }}</div>
        
        <!-- Tag de fechamento para nós com filhos -->
        <span v-if="hasChildren && !isExpanded" class="node-closing-tag">
          <span class="collapse-indicator">{{ node.children.length }} elemento(s)</span>
          &lt;/{{ node.name }}&gt;
        </span>
      </div>
    </div>
    
    <!-- Filhos -->
    <div v-if="hasChildren && isExpanded" class="node-children">
      <XMLTreeNode 
        v-for="(child, index) in node.children" 
        :key="index"
        :node="child"
        :level="level + 1"
      />
      
      <!-- Texto do nó se houver filhos -->
      <div v-if="node.text" class="node-text-content" :style="{ paddingLeft: `${(level + 1) * 20}px` }">
        <span class="node-text">{{ node.text }}</span>
      </div>
      
      <!-- Tag de fechamento -->
      <div class="node-closing" :style="{ paddingLeft: `${level * 20}px` }">
        <span class="node-tag-close">&lt;/{{ node.name }}&gt;</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Interfaces
interface XMLNode {
  name: string
  attributes: Record<string, string>
  children: XMLNode[]
  text?: string
}

// Props
const props = defineProps<{
  node: XMLNode
  level: number
}>()

// Estado reativo
const isExpanded = ref(true)

// Computed properties
const hasChildren = computed(() => {
  return props.node.children && props.node.children.length > 0
})

// Métodos
const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value
}
</script>

<style scoped>
.xml-tree-node {
  font-family: 'Courier New', Monaco, monospace;
  font-size: 0.85rem;
  line-height: 1.6;
}

.node-content {
  display: flex;
  align-items: flex-start;
  gap: 0.25rem;
  padding: 0.125rem 0;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.node-content:hover {
  background: rgba(255, 255, 255, 0.05);
}

.node-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease;
  margin-top: 2px;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.node-toggle:hover {
  background: rgba(59, 130, 246, 0.2);
  border-color: rgba(59, 130, 246, 0.5);
}

.node-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  margin-top: 2px;
}

.toggle-icon {
  width: 12px;
  height: 12px;
  fill: #3b82f6;
  transition: transform 0.2s ease;
}

.toggle-icon.expanded {
  transform: rotate(90deg);
}

.element-icon {
  width: 12px;
  height: 12px;
  fill: var(--text-secondary);
  opacity: 0.6;
}

.node-info {
  flex: 1;
  word-break: break-all;
}

.node-header {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.node-attributes {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-left: 0.5rem;
}

/* Tags XML */
.node-tag-open,
.node-tag-close {
  color: #3b82f6;
  font-weight: 600;
}

.node-closing-tag {
  color: #6b7280;
  font-style: italic;
  margin-left: 0.5rem;
}

/* Atributos */
.node-attribute {
  background: rgba(16, 185, 129, 0.1);
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  border: 1px solid rgba(16, 185, 129, 0.2);
  font-size: 0.8rem;
}

.attr-name {
  color: #10b981;
  font-weight: 600;
}

.attr-value {
  color: #f59e0b;
  font-weight: 500;
}

/* Texto do nó */
.node-text-inline {
  color: var(--text-primary);
  margin-top: 0.25rem;
  background: rgba(255, 255, 255, 0.08);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  border-left: 3px solid #3b82f6;
  font-style: italic;
}

.node-text-content {
  padding: 0.125rem 0;
}

.collapse-indicator {
  background: rgba(107, 114, 128, 0.2);
  color: #6b7280;
  padding: 0.125rem 0.375rem;
  border-radius: 12px;
  font-size: 0.75rem;
  margin-right: 0.5rem;
}

.node-closing {
  padding: 0.125rem 0;
}

/* Filhos */
.node-children {
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  margin-left: 8px;
}

/* Estados especiais */
.node-content[data-level="0"] {
  background: rgba(59, 130, 246, 0.1);
  border-radius: 6px;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
}

/* Responsividade */
@media (max-width: 768px) {
  .xml-tree-node {
    font-size: 0.8rem;
  }
  
  .node-content {
    padding-left: 0.5rem !important;
  }
  
  .node-text-content {
    padding-left: 1rem !important;
  }
  
  .node-closing {
    padding-left: 0.5rem !important;
  }
  
  .node-children {
    margin-left: 4px;
  }
}
</style>