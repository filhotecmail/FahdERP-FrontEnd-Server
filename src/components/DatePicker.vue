<template>
  <div class="date-picker" ref="datePickerRef">
    <div class="date-input" @click="toggleCalendar">
      <input 
        type="text" 
        :value="formattedDate" 
        readonly 
        :placeholder="placeholder"
        class="date-field"
      />
      <svg class="calendar-icon" viewBox="0 0 24 24">
        <path d="M19,3H18V1H16V3H8V1H6V3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M19,19H5V8H19V19M5,6V5H19V6H5Z"/>
      </svg>
    </div>
    
    <transition name="calendar-fade">
      <div v-if="isOpen" class="calendar-dropdown">
        <div class="calendar-header">
          <button @click="previousMonth" class="nav-btn" title="Mês anterior">
          <svg viewBox="0 0 24 24">
            <path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"/>
          </svg>
        </button>
          
          <div class="month-year">
            <select v-model="currentMonth" @change="updateCalendar" class="month-select" title="Selecionar mês">
              <option v-for="(month, index) in monthNames" :key="index" :value="index">
                {{ month }}
              </option>
            </select>
            <select v-model="currentYear" @change="updateCalendar" class="year-select" title="Selecionar ano">
              <option v-for="year in availableYears" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
          </div>
          
          <button @click="nextMonth" class="nav-btn" title="Próximo mês">
          <svg viewBox="0 0 24 24">
            <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/>
          </svg>
        </button>
        </div>
        
        <div class="calendar-grid">
          <div class="weekdays">
            <div v-for="day in weekDays" :key="day" class="weekday" :title="`Coluna ${day}`">
              {{ day }}
            </div>
          </div>
          
          <div class="days-grid">
            <div 
              v-for="day in calendarDays" 
              :key="day.key"
              :class="getDayClasses(day)"
              :title="getDateTooltip(day)"
              @click="selectDate(day)"
            >
              <span class="day-number">{{ day.date }}</span>
              <div v-if="day.isHoliday" class="holiday-indicator" :title="day.holidayName">
                <svg viewBox="0 0 24 24">
                  <path d="M12,2A7,7 0 0,1 19,9C19,11.38 17.81,13.47 16,14.74V17A1,1 0 0,1 15,18H9A1,1 0 0,1 8,17V14.74C6.19,13.47 5,11.38 5,9A7,7 0 0,1 12,2M9,21V20H15V21A1,1 0 0,1 14,22H10A1,1 0 0,1 9,21M12,4A5,5 0 0,0 7,9C7,10.64 7.81,12.09 9,13V16H15V13C16.19,12.09 17,10.64 17,9A5,5 0 0,0 12,4Z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        <div class="calendar-footer">
          <button @click="selectToday" class="today-btn" title="Ir para hoje">
            Hoje
          </button>
          <button @click="closeCalendar" class="close-btn" title="Fechar calendário">
            Fechar
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

interface CalendarDay {
  date: number
  fullDate: Date
  isCurrentMonth: boolean
  isToday: boolean
  isSelected: boolean
  isHoliday: boolean
  holidayName?: string
  key: string
  year: number
  month: number
  day: number
  isOtherMonth: boolean
}

interface Props {
  modelValue?: string | Date
  placeholder?: string
  minDate?: string | Date
  maxDate?: string | Date
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Selecione uma data',
  modelValue: ''
})

const emit = defineEmits<Emits>()

const datePickerRef = ref<HTMLElement>()
const isOpen = ref(false)
const currentMonth = ref(new Date().getMonth())
const currentYear = ref(new Date().getFullYear())
const selectedDate = ref<Date | null>(null)

// Feriados nacionais brasileiros
const nationalHolidays: { [key: string]: string } = {
  '01-01': 'Confraternização Universal',
  '04-21': 'Tiradentes',
  '05-01': 'Dia do Trabalhador',
  '09-07': 'Independência do Brasil',
  '10-12': 'Nossa Senhora Aparecida',
  '11-02': 'Finados',
  '11-15': 'Proclamação da República',
  '12-25': 'Natal'
}

// Feriados móveis (calculados dinamicamente)
const getEasterDate = (year: number): Date => {
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31)
  const day = ((h + l - 7 * m + 114) % 31) + 1
  return new Date(year, month - 1, day)
}

const getMobileHolidays = (year: number) => {
  const easter = getEasterDate(year)
  const holidays: { [key: string]: string } = {}
  
  // Carnaval (47 dias antes da Páscoa)
  const carnival = new Date(easter)
  carnival.setDate(carnival.getDate() - 47)
  holidays[`${String(carnival.getMonth() + 1).padStart(2, '0')}-${String(carnival.getDate()).padStart(2, '0')}`] = 'Carnaval'
  
  // Sexta-feira Santa (2 dias antes da Páscoa)
  const goodFriday = new Date(easter)
  goodFriday.setDate(goodFriday.getDate() - 2)
  holidays[`${String(goodFriday.getMonth() + 1).padStart(2, '0')}-${String(goodFriday.getDate()).padStart(2, '0')}`] = 'Sexta-feira Santa'
  
  // Corpus Christi (60 dias após a Páscoa)
  const corpusChristi = new Date(easter)
  corpusChristi.setDate(corpusChristi.getDate() + 60)
  holidays[`${String(corpusChristi.getMonth() + 1).padStart(2, '0')}-${String(corpusChristi.getDate()).padStart(2, '0')}`] = 'Corpus Christi'
  
  return holidays
}

const monthNames = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

const availableYears = computed(() => {
  const currentYear = new Date().getFullYear()
  const years = []
  for (let i = currentYear - 10; i <= currentYear + 10; i++) {
    years.push(i)
  }
  return years
})

const formattedDate = computed(() => {
  if (!selectedDate.value) return ''
  return selectedDate.value.toLocaleDateString('pt-BR')
})

const calendarDays = computed(() => {
  const days: CalendarDay[] = []
  const firstDay = new Date(currentYear.value, currentMonth.value, 1)
  const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())
  
  const mobileHolidays = getMobileHolidays(currentYear.value)
  const allHolidays = { ...nationalHolidays, ...mobileHolidays }
  
  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    
    const dateKey = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    const isHoliday = dateKey in allHolidays
    
    days.push({
      date: date.getDate(),
      fullDate: new Date(date),
      isCurrentMonth: date.getMonth() === currentMonth.value,
      isToday: date.toDateString() === new Date().toDateString(),
      isSelected: selectedDate.value ? date.toDateString() === selectedDate.value.toDateString() : false,
      isHoliday,
      holidayName: isHoliday ? allHolidays[dateKey] : undefined,
      key: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
      year: date.getFullYear(),
      month: date.getMonth(),
      day: date.getDate(),
      isOtherMonth: date.getMonth() !== currentMonth.value
    })
  }
  
  return days
})

const toggleCalendar = () => {
  isOpen.value = !isOpen.value
}

const closeCalendar = () => {
  isOpen.value = false
}

const getDateTooltip = (day: CalendarDay): string => {
  const dateStr = day.fullDate.toLocaleDateString('pt-BR', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
  
  let tooltip = dateStr
  
  if (day.isToday) {
    tooltip += ' (Hoje)'
  }
  
  if (day.isHoliday && day.holidayName) {
    tooltip += ` - ${day.holidayName}`
  }
  
  if (day.isOtherMonth) {
    tooltip += ' (Outro mês)'
  }
  
  return tooltip
}

const selectDate = (day: CalendarDay) => {
  if (!day.isCurrentMonth) return
  
  selectedDate.value = day.fullDate
  const dateString = day.fullDate.toISOString().split('T')[0]
  emit('update:modelValue', dateString)
  emit('change', dateString)
  closeCalendar()
}

const selectToday = () => {
  const today = new Date()
  selectedDate.value = today
  currentMonth.value = today.getMonth()
  currentYear.value = today.getFullYear()
  const dateString = today.toISOString().split('T')[0]
  emit('update:modelValue', dateString)
  emit('change', dateString)
  closeCalendar()
}

const previousMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

const updateCalendar = () => {
  // Força a reatividade do calendário
}

const getDayClasses = (day: CalendarDay) => {
  return {
    'calendar-day': true,
    'other-month': !day.isCurrentMonth,
    'today': day.isToday,
    'selected': day.isSelected,
    'holiday': day.isHoliday
  }
}

const handleClickOutside = (event: Event) => {
  if (datePickerRef.value && !datePickerRef.value.contains(event.target as Node)) {
    closeCalendar()
  }
}

// Inicializar data selecionada
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    const date = typeof newValue === 'string' ? new Date(newValue) : newValue
    selectedDate.value = date
    currentMonth.value = date.getMonth()
    currentYear.value = date.getFullYear()
  }
}, { immediate: true })

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.date-picker {
  position: relative;
  display: inline-block;
  width: 100%;
  max-width: 280px;
}

.date-input {
  position: relative;
  display: flex;
  align-items: center;
}

.date-field {
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  background: var(--input-bg);
  color: var(--text-primary);
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.date-field:hover {
  border-color: var(--accent-primary);
}

.date-field:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px var(--accent-glow);
}

.calendar-icon {
  position: absolute;
  right: 0.75rem;
  width: 20px;
  height: 20px;
  fill: var(--text-secondary);
  pointer-events: none;
  transition: fill 0.3s ease;
}

.date-input:hover .calendar-icon {
  fill: var(--accent-primary);
}

.calendar-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 8px;
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: var(--accent-primary);
  color: white;
  user-select: none;
}

.nav-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.nav-btn svg {
  width: 16px;
  height: 16px;
  fill: currentColor;
}

.month-year {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  user-select: none;
}

.month-select,
.year-select {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  color: white;
  padding: 0.25rem 0.5rem;
  font-size: 0.9rem;
  cursor: pointer;
  user-select: none;
}

.month-select:focus,
.year-select:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.3);
}

.calendar-grid {
  padding: 1rem;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 0.5rem;
}

.weekday {
  text-align: center;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-secondary);
  padding: 0.5rem 0;
  user-select: none;
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.calendar-day {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  font-weight: 500;
  user-select: none;
}

.calendar-day:hover {
  background: var(--accent-glow);
  transform: scale(1.1);
}

.calendar-day.other-month {
  color: var(--text-muted);
  cursor: default;
}

.calendar-day.other-month:hover {
  background: transparent;
  transform: none;
}

.calendar-day.today {
  background: var(--accent-primary);
  color: white;
  font-weight: 700;
}

.calendar-day.selected {
  background: var(--accent-primary);
  color: white;
  font-weight: 700;
  box-shadow: 0 0 0 2px var(--accent-glow);
}

.calendar-day.holiday {
  color: #ff6b6b;
  font-weight: 600;
}

.calendar-day.holiday.today,
.calendar-day.holiday.selected {
  color: white;
}

.day-number {
  position: relative;
  z-index: 2;
}

.holiday-indicator {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 8px;
  height: 8px;
  z-index: 1;
}

.holiday-indicator svg {
  width: 100%;
  height: 100%;
  fill: #ff6b6b;
}

.calendar-footer {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  border-top: 1px solid var(--border-color);
  background: var(--bg-primary);
  user-select: none;
}

.today-btn,
.close-btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  user-select: none;
}

.today-btn:hover {
  background: var(--accent-primary);
  color: white;
  border-color: var(--accent-primary);
}

.close-btn:hover {
  background: var(--input-bg);
  border-color: var(--accent-primary);
}

/* Animações */
.calendar-fade-enter-active,
.calendar-fade-leave-active {
  transition: all 0.3s ease;
}

.calendar-fade-enter-from {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.calendar-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

/* Responsividade */
@media (max-width: 768px) {
  .calendar-dropdown {
    position: fixed;
    top: 50%;
    left: 50%;
    right: auto;
    transform: translate(-50%, -50%);
    width: 90vw;
    max-width: 350px;
    margin: 0;
  }
  
  .calendar-day {
    width: 32px;
    height: 32px;
    font-size: 0.85rem;
  }
  
  .calendar-header {
    padding: 0.75rem;
  }
  
  .calendar-grid {
    padding: 0.75rem;
  }
}
</style>