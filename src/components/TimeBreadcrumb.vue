<template>
  <div class="time-breadcrumb">
    <div class="breadcrumb-container">
      <!-- Manhã -->
      <div 
        class="time-period-card morning" 
        :class="{ active: currentPeriod === 'morning' }"
        @click="selectPeriod('morning')"
      >
        <div class="period-background">
          <div class="sky-gradient morning-sky"></div>
          <div class="sun morning-sun"></div>
          <div class="clouds">
            <div class="cloud cloud-1"></div>
            <div class="cloud cloud-2"></div>
          </div>
        </div>
        <div class="period-label">Manhã</div>
        <div class="period-time">06:00 - 12:00</div>
      </div>

      <!-- Tarde -->
      <div 
        class="time-period-card afternoon" 
        :class="{ active: currentPeriod === 'afternoon' }"
        @click="selectPeriod('afternoon')"
      >
        <div class="period-background">
          <div class="sky-gradient afternoon-sky"></div>
          <div class="sun afternoon-sun"></div>
          <div class="rays">
            <div class="ray" v-for="i in 8" :key="i" :style="{ transform: `rotate(${i * 45}deg)` }"></div>
          </div>
          <div class="clouds">
            <div class="cloud cloud-3"></div>
          </div>
        </div>
        <div class="period-label">Tarde</div>
        <div class="period-time">12:00 - 18:00</div>
      </div>

      <!-- Pôr do Sol -->
      <div 
        class="time-period-card evening" 
        :class="{ active: currentPeriod === 'evening' }"
        @click="selectPeriod('evening')"
      >
        <div class="period-background">
          <div class="sky-gradient evening-sky"></div>
          <div class="sun evening-sun"></div>
          <div class="horizon"></div>
          <div class="water-reflection"></div>
          <div class="clouds">
            <div class="cloud cloud-4"></div>
            <div class="cloud cloud-5"></div>
          </div>
        </div>
        <div class="period-label">Pôr do Sol</div>
        <div class="period-time">18:00 - 20:00</div>
      </div>

      <!-- Noite -->
      <div 
        class="time-period-card night" 
        :class="{ active: currentPeriod === 'night' }"
        @click="selectPeriod('night')"
      >
        <div class="period-background">
          <div class="sky-gradient night-sky"></div>
          <div class="moon"></div>
          <div class="moon-craters">
            <div class="crater crater-1"></div>
            <div class="crater crater-2"></div>
            <div class="crater crater-3"></div>
          </div>
          <div class="stars">
            <div class="star" v-for="i in 12" :key="i" :style="getStarPosition(i)"></div>
          </div>
          <div class="clouds">
            <div class="cloud cloud-6"></div>
          </div>
        </div>
        <div class="period-label">Noite</div>
        <div class="period-time">20:00 - 06:00</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { getTimePeriod } from '@/config/weather'

interface Props {
  localtime?: string
}

const props = withDefaults(defineProps<Props>(), {
  localtime: new Date().toISOString()
})

const emit = defineEmits<{
  periodSelected: [period: string]
}>()

const currentPeriod = computed(() => {
  return getTimePeriod(props.localtime)
})

const selectPeriod = (period: string) => {
  emit('periodSelected', period)
}

const getStarPosition = (index: number) => {
  const positions = [
    { top: '15%', left: '20%' },
    { top: '25%', left: '80%' },
    { top: '35%', left: '15%' },
    { top: '45%', left: '85%' },
    { top: '20%', left: '60%' },
    { top: '40%', left: '40%' },
    { top: '30%', left: '70%' },
    { top: '50%', left: '25%' },
    { top: '15%', left: '45%' },
    { top: '35%', left: '55%' },
    { top: '45%', left: '75%' },
    { top: '25%', left: '35%' }
  ]
  return positions[index - 1] || { top: '20%', left: '50%' }
}
</script>

<style scoped>
.time-breadcrumb {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  margin-bottom: 1rem;
}

.breadcrumb-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
}

.time-period-card {
  position: relative;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.time-period-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.time-period-card.active {
  border-color: #fff;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
}

.period-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

/* Sky Gradients */
.morning-sky {
  background: linear-gradient(to bottom, #87CEEB 0%, #FFE4B5 100%);
}

.afternoon-sky {
  background: linear-gradient(to bottom, #87CEEB 0%, #B0E0E6 100%);
}

.evening-sky {
  background: linear-gradient(to bottom, #FF6B6B 0%, #FFE66D 30%, #FF8E53 70%, #4ECDC4 100%);
}

.night-sky {
  background: linear-gradient(to bottom, #191970 0%, #000080 50%, #483D8B 100%);
}

.sky-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

/* Suns */
.sun {
  position: absolute;
  border-radius: 50%;
  width: 30px;
  height: 30px;
}

.morning-sun {
  background: radial-gradient(circle, #FFD700 0%, #FFA500 100%);
  top: 20px;
  right: 20px;
}

.afternoon-sun {
  background: radial-gradient(circle, #FFD700 0%, #FF8C00 100%);
  top: 15px;
  left: 50%;
  transform: translateX(-50%);
}

.evening-sun {
  background: radial-gradient(circle, #FFD700 0%, #FF4500 100%);
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
}

/* Moon */
.moon {
  position: absolute;
  width: 25px;
  height: 25px;
  background: radial-gradient(circle at 30% 30%, #F5F5DC 0%, #C0C0C0 100%);
  border-radius: 50%;
  top: 15px;
  right: 15px;
}

.moon-craters {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 25px;
  height: 25px;
}

.crater {
  position: absolute;
  background: #A9A9A9;
  border-radius: 50%;
}

.crater-1 {
  width: 4px;
  height: 4px;
  top: 6px;
  left: 8px;
}

.crater-2 {
  width: 3px;
  height: 3px;
  top: 12px;
  left: 15px;
}

.crater-3 {
  width: 2px;
  height: 2px;
  top: 16px;
  left: 6px;
}

/* Rays */
.rays {
  position: absolute;
  top: 15px;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 30px;
}

.ray {
  position: absolute;
  width: 2px;
  height: 8px;
  background: #FFD700;
  top: -4px;
  left: 50%;
  transform-origin: 50% 19px;
  opacity: 0.8;
}

/* Clouds */
.clouds {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.cloud {
  position: absolute;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 20px;
}

.cloud::before,
.cloud::after {
  content: '';
  position: absolute;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
}

.cloud-1 {
  width: 20px;
  height: 8px;
  top: 25px;
  left: 10px;
}

.cloud-1::before {
  width: 8px;
  height: 8px;
  top: -4px;
  left: 3px;
}

.cloud-1::after {
  width: 6px;
  height: 6px;
  top: -3px;
  right: 3px;
}

.cloud-2 {
  width: 15px;
  height: 6px;
  top: 40px;
  right: 15px;
}

.cloud-2::before {
  width: 6px;
  height: 6px;
  top: -3px;
  left: 2px;
}

.cloud-2::after {
  width: 5px;
  height: 5px;
  top: -2px;
  right: 2px;
}

.cloud-3 {
  width: 18px;
  height: 7px;
  top: 20px;
  left: 15px;
}

.cloud-3::before {
  width: 7px;
  height: 7px;
  top: -3px;
  left: 3px;
}

.cloud-3::after {
  width: 6px;
  height: 6px;
  top: -3px;
  right: 3px;
}

.cloud-4,
.cloud-5 {
  background: rgba(255, 142, 83, 0.6);
}

.cloud-4::before,
.cloud-4::after,
.cloud-5::before,
.cloud-5::after {
  background: rgba(255, 142, 83, 0.6);
}

.cloud-4 {
  width: 16px;
  height: 6px;
  top: 15px;
  left: 8px;
}

.cloud-4::before {
  width: 6px;
  height: 6px;
  top: -3px;
  left: 2px;
}

.cloud-4::after {
  width: 5px;
  height: 5px;
  top: -2px;
  right: 2px;
}

.cloud-5 {
  width: 14px;
  height: 5px;
  top: 30px;
  right: 10px;
}

.cloud-5::before {
  width: 5px;
  height: 5px;
  top: -2px;
  left: 2px;
}

.cloud-5::after {
  width: 4px;
  height: 4px;
  top: -2px;
  right: 2px;
}

.cloud-6 {
  background: rgba(47, 47, 47, 0.6);
  width: 18px;
  height: 7px;
  bottom: 15px;
  left: 10px;
}

.cloud-6::before,
.cloud-6::after {
  background: rgba(47, 47, 47, 0.6);
}

.cloud-6::before {
  width: 7px;
  height: 7px;
  top: -3px;
  left: 3px;
}

.cloud-6::after {
  width: 6px;
  height: 6px;
  top: -3px;
  right: 3px;
}

/* Stars */
.stars {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.star {
  position: absolute;
  width: 2px;
  height: 2px;
  background: white;
  border-radius: 50%;
  animation: twinkle 2s infinite alternate;
}

@keyframes twinkle {
  0% { opacity: 0.3; }
  100% { opacity: 1; }
}

/* Horizon and Water */
.horizon {
  position: absolute;
  bottom: 30px;
  left: 0;
  right: 0;
  height: 2px;
  background: rgba(255, 255, 255, 0.3);
}

.water-reflection {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 30px;
  background: linear-gradient(to bottom, rgba(78, 205, 196, 0.3) 0%, rgba(78, 205, 196, 0.6) 100%);
}

/* Labels */
.period-label {
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  text-align: center;
  color: white;
  font-weight: 600;
  font-size: 0.75rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.period-time {
  position: absolute;
  bottom: 5px;
  left: 0;
  right: 0;
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.6rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

/* Responsive */
@media (max-width: 768px) {
  .breadcrumb-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
  
  .time-period-card {
    height: 100px;
  }
  
  .period-label {
    font-size: 0.7rem;
  }
  
  .period-time {
    font-size: 0.55rem;
  }
}

@media (max-width: 480px) {
  .breadcrumb-container {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  .time-period-card {
    height: 80px;
  }
}
</style>