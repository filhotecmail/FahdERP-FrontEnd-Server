<template>
  <div class="intro-container">
    <div class="intro-content">
      <div class="logo-animation">
        <h1 class="brand-name">
          <span class="fahd" ref="fahdText">Fahd</span>
          <span class="erp" ref="erpText">ERP</span>
        </h1>
        <div class="tagline" ref="tagline">
          Sistema Empresarial Integrado
        </div>
      </div>
      <div class="loading-indicator" ref="loadingIndicator">
        <div class="loading-bar"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const fahdText = ref<HTMLElement>()
const erpText = ref<HTMLElement>()
const tagline = ref<HTMLElement>()
const loadingIndicator = ref<HTMLElement>()

onMounted(() => {
  // Animação sequencial dos elementos
  setTimeout(() => {
    fahdText.value?.classList.add('animate-in')
  }, 500)
  
  setTimeout(() => {
    erpText.value?.classList.add('animate-in')
  }, 1000)
  
  setTimeout(() => {
    tagline.value?.classList.add('animate-in')
  }, 1500)
  
  setTimeout(() => {
    loadingIndicator.value?.classList.add('animate-in')
  }, 2000)
  
  // Redirecionar para login após animação
  setTimeout(() => {
    router.push('/login')
  }, 4000)
})
</script>

<style scoped>
.intro-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.intro-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 50% 50%, rgba(0, 255, 127, 0.1) 0%, transparent 70%);
  animation: pulse 3s ease-in-out infinite;
}

.intro-content {
  text-align: center;
  z-index: 2;
}

.logo-animation {
  margin-bottom: 3rem;
}

.brand-name {
  font-size: 4.5rem;
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.fahd {
  color: #ffffff;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.erp {
  color: #00ff7f;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  text-shadow: 0 0 20px rgba(0, 255, 127, 0.5);
}

.fahd.animate-in,
.erp.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.tagline {
  font-size: 1.2rem;
  color: #cccccc;
  font-weight: 300;
  margin-top: 1rem;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease-out;
  letter-spacing: 0.05em;
}

.tagline.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.loading-indicator {
  width: 200px;
  height: 3px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  margin: 0 auto;
  overflow: hidden;
  opacity: 0;
  transition: opacity 0.5s ease-out;
}

.loading-indicator.animate-in {
  opacity: 1;
}

.loading-bar {
  width: 0;
  height: 100%;
  background: linear-gradient(90deg, #00ff7f, #00cc66);
  border-radius: 2px;
  animation: loading 2s ease-out forwards;
  box-shadow: 0 0 10px rgba(0, 255, 127, 0.5);
}

@keyframes loading {
  to {
    width: 100%;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.6;
  }
}

/* Responsividade */
@media (max-width: 768px) {
  .brand-name {
    font-size: 3rem;
  }
  
  .tagline {
    font-size: 1rem;
  }
  
  .loading-indicator {
    width: 150px;
  }
}

@media (max-width: 480px) {
  .brand-name {
    font-size: 2.5rem;
  }
  
  .tagline {
    font-size: 0.9rem;
  }
}
</style>