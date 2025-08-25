<template>
  <div class="esocial-container">
    <div class="form-container">
      <!-- Card Heading -->
      <ESocialCardHeading 
        :title="title"
        :subtitle="subtitle"
        :badge="badge"
        :icon-path="iconPath"
      />
      
      <!-- Form Content Slot -->
      <div class="esocial-form">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ESocialCardHeading from './ESocialCardHeading.vue'

interface Props {
  title: string
  subtitle: string
  badge?: string
  iconPath?: string
}

withDefaults(defineProps<Props>(), {
  badge: 'eSocial',
  iconPath: 'M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z'
})
</script>

<style scoped>
.esocial-container {
  padding: 0.25rem 0.25rem 1rem;
  min-height: 100vh;
  background: var(--bg-primary);
  user-select: none;
}

.form-container {
  max-width: 1400px;
  margin: 0 auto;
  background: var(--bg-secondary);
  border-radius: 8px;
  box-shadow: var(--shadow-xl);
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.esocial-form {
  padding: 0.75rem;
}

/* Tablet */
@media (max-width: 1023px) {
  .esocial-container {
    padding: 0.25rem 0.25rem 1rem;
  }
}

/* Mobile */
@media (max-width: 767px) {
  .esocial-container {
    padding: 0.25rem;
  }
  
  .esocial-form {
    padding: 0.5rem;
  }
  
  .form-container {
    margin: 0.25rem;
    border-radius: 8px;
  }
}
</style>