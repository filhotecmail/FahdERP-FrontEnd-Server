import { ref, watch, onMounted } from 'vue'
import { formatBR12, formatBR24 } from '@/utils/dateTime'
import { formatCPF } from '@/utils/cpf'
import { UserService, type UserDoc } from '@/modules/usuarios/services/UserService'

export class UserManagementController {
  public users = ref<UserDoc[]>([])
  public total = ref(0)
  public limit = ref(10)
  public page = ref(1)
  public pages = ref(1)
  public searchQuery = ref('')
  public loading = ref(false)

  public cnpjcontrato = ref('')
  public idpkloja = ref('')

  // Expor utilitários de formatação para o template
  public formatBR12 = formatBR12
  public formatBR24 = formatBR24
  public formatCPF = formatCPF

  private userService = new UserService()

  constructor() {
    this.hydrateAuthFilters()
    this.setupWatchers()
    onMounted(() => {
      this.loadUsers()
    })
  }

  private hydrateAuthFilters() {
    try {
      const raw = typeof localStorage !== 'undefined' ? localStorage.getItem('authData') : null
      if (raw) {
        const auth = JSON.parse(raw) as {
          SystemAuth?: { CnpjContrato?: string }
          Lojas?: { IdPk?: number }
        }
        this.cnpjcontrato.value = (auth.SystemAuth?.CnpjContrato || '').replace(/\D/g, '')
        this.idpkloja.value = String(auth.Lojas?.IdPk ?? '')
      }
    } catch (e) {
      console.warn('Não foi possível hidratar filtros a partir do authData:', e)
    }
  }

  private setupWatchers() {
    let searchTimer: number | undefined
    watch(this.searchQuery, () => {
      if (searchTimer !== undefined) window.clearTimeout(searchTimer)
      searchTimer = window.setTimeout(() => {
        this.page.value = 1
        this.loadUsers()
      }, 300)
    })

    watch(this.limit, (val) => {
      this.limit.value = Number(val)
      this.page.value = 1
      this.loadUsers()
    })
  }

  public async loadUsers() {
    this.loading.value = true
    try {
      const params: Record<string, string | number> = {
        cnpjcontrato: String(this.cnpjcontrato.value ?? ''),
        idpkloja: String(this.idpkloja.value ?? ''),
        limit: Number(this.limit.value),
        page: Number(this.page.value),
      }
      const q = this.searchQuery.value.trim()
      if (q) {
        params.search = q
        params.q = q
      }

      const resp = await this.userService.paginateUsers(params)

      if (resp?.status === 200 && resp.data !== undefined) {
        const data = this.userService.normalizePaginateResponse(resp.data)
        this.users.value = data.docs
        this.total.value = data.total
        this.page.value = data.page
        this.pages.value = Math.max(1, Math.ceil((this.total.value || 0) / (this.limit.value || 1)))
        console.log('👥 Users mapeados:', { total: this.total.value, page: this.page.value, pages: this.pages.value, docs: this.users.value.length, limit: this.limit.value })
      } else {
        this.users.value = []
        this.total.value = 0
        this.pages.value = 1
      }
    } catch (e) {
      console.error('Erro ao carregar usuários:', e)
      this.users.value = []
      this.total.value = 0
      this.pages.value = 1
    } finally {
      this.loading.value = false
    }
  }

  public nextPage() {
    if (this.page.value < this.pages.value) {
      this.page.value += 1
      this.loadUsers()
    }
  }

  public prevPage() {
    if (this.page.value > 1) {
      this.page.value -= 1
      this.loadUsers()
    }
  }
}
