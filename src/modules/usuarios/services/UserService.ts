import backendRouter from '@/utils/backendRouter'

export interface UserDoc {
  idpk: number
  masteridpk: number
  cnpjcontrato: string
  username: string
  idpkloja: number
  status: number
  statusstr: string
  logdh: string
  dhc: string
  grupo: string
  idpk1: number
  fkkey: number
  nome: string
  sobrenome: string
  nascimento: string
  cpf: string
  rg: string
  nrocelular: string
  email: string
  cargo: string
  foto: string | null
  logr: string
  nrolog: string
  compl: string | null
  bairro: string
  municipio: string
  uf: string
  cep: string
}

export interface UserPaginateResponse {
  docs: UserDoc[]
  total: number
  limit: number
  page: number
  pages: number
}

export class UserService {
  async paginateUsers(params: Record<string, string | number>) {
    return backendRouter.get<UserPaginateResponse>(
      '/api/user/paginate',
      params,
      { headers: { 'X-Paginate': 'true' } }
    )
  }

  normalizePaginateResponse(data: unknown): UserPaginateResponse {
    const defaultLimit = Number(paramsFallback.limit ?? 10)
    const defaultPage = Number(paramsFallback.page ?? 1)
    if (Array.isArray(data)) {
      return {
        docs: data as UserDoc[],
        total: (data as UserDoc[]).length,
        limit: defaultLimit,
        page: defaultPage,
        pages: 1
      }
    }
    if (data && typeof data === 'object') {
      const obj = data as Record<string, unknown>
      const payload = (obj.data && typeof obj.data === 'object') ? obj.data as Record<string, unknown> : obj
      const docs = (payload.docs as UserDoc[]) || (payload.items as UserDoc[]) || []
      const totalNum = Number(payload.total ?? (payload.count ?? docs.length))
      const limitNum = Number(payload.limit ?? defaultLimit)
      const pageNum = Number(payload.page ?? defaultPage)
      const pagesNum = Number(payload.pages ?? Math.max(1, Math.ceil(totalNum / (limitNum || 1))))
      return { docs, total: totalNum, limit: limitNum, page: pageNum, pages: pagesNum }
    }
    return { docs: [], total: 0, limit: defaultLimit, page: defaultPage, pages: 1 }
  }
}

// Fallback para normalização quando o backend não retorna os números
const paramsFallback = {
  limit: 10,
  page: 1
}
