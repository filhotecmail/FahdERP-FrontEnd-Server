<template>
  <div class="card-heading">
    <div class="card-heading-content">
      <div class="card-heading-icon">
        <svg viewBox="0 0 24 24">
          <path :d="iconPath" />
        </svg>
      </div>
      <div class="card-heading-text">
        <h2 class="card-title">{{ title }}</h2>
        <p class="card-subtitle">{{ subtitle }}</p>
      </div>
    </div>
    <div class="card-heading-badge">
      <span class="badge">{{ badge }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
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
.card-heading {
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary, #667eea));
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border-color);
}

.card-heading-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.card-heading-icon {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.card-heading-icon svg {
  width: 24px;
  height: 24px;
  fill: white;
}

.card-heading-text {
  color: white;
}

.card-title {
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  color: white;
}

.card-subtitle {
  font-size: 0.9rem;
  margin: 0;
  opacity: 0.9;
  color: rgba(255, 255, 255, 0.8);
}

.card-heading-badge {
  display: flex;
  align-items: center;
}

.badge {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Mobile */
@media (max-width: 767px) {
  .card-heading {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .card-heading-content {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .card-title {
    font-size: 1.2rem;
  }
  
  .card-subtitle {
    font-size: 0.8rem;
  }
}
</style>