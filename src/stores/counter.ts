import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

/**
 * Store para gerenciamento de contador simples
 * 
 * Fornece funcionalidades básicas de incremento e cálculo de valor dobrado
 * para demonstração e testes da aplicação.
 * 
 * @example
 * ```typescript
 * const counterStore = useCounterStore()
 * counterStore.increment() // Incrementa o contador
 * console.log(counterStore.doubleCount) // Valor dobrado
 * ```
 * 
 * @since 1.0.0
 */
export const useCounterStore = defineStore('counter', () => {
  /**
   * Valor atual do contador
   * @type {Ref<number>}
   */
  const count = ref(0)
  
  /**
   * Valor dobrado do contador (computed)
   * @type {ComputedRef<number>}
   */
  const doubleCount = computed(() => count.value * 2)
  
  /**
   * Incrementa o valor do contador em 1
   * 
   * @example
   * ```typescript
   * const store = useCounterStore()
   * store.increment() // count passa de 0 para 1
   * ```
   * 
   * @since 1.0.0
   */
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})
