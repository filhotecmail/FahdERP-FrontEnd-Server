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
  background: transparent;
  user-select: none;
}

.form-container {
  max-width: 1400px;
  margin: 0 auto;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1), 0 4px 16px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
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