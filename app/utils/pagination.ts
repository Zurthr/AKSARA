export interface PaginatedCollection<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}

const toFiniteNumber = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) {
      return parsed
    }
  }

  return null
}

const pickNumber = (keys: string[], sources: Array<unknown>, fallback: number): number => {
  for (const source of sources) {
    if (!source || typeof source !== 'object') {
      continue
    }

    const record = source as Record<string, unknown>
    for (const key of keys) {
      if (!Object.prototype.hasOwnProperty.call(record, key)) {
        continue
      }

      const value = toFiniteNumber(record[key])
      if (value !== null) {
        return value
      }
    }
  }

  return fallback
}

const pickArray = <T>(candidates: Array<unknown>): T[] => {
  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate as T[]
    }
  }
  return []
}

export const normalizePaginatedCollection = <T>(payload: unknown): PaginatedCollection<T> => {
  const fallback: PaginatedCollection<T> = {
    data: [],
    current_page: 1,
    last_page: 1,
    per_page: 0,
    total: 0
  }

  if (payload === null || payload === undefined) {
    return fallback
  }

  if (Array.isArray(payload)) {
    const data = payload as T[]
    const length = data.length
    return {
      data,
      current_page: length > 0 ? 1 : 0,
      last_page: length > 0 ? 1 : 0,
      per_page: length,
      total: length
    }
  }

  if (typeof payload !== 'object') {
    return fallback
  }

  const raw = payload as Record<string, unknown>
  const primaryData = pickArray<T>([
    raw.data,
    (raw.data as Record<string, unknown> | undefined)?.data,
    raw.items,
    raw.results,
    raw.records,
    raw.payload,
    raw.list
  ])

  let data = primaryData

  if (data.length === 0 && raw.data && typeof raw.data === 'object' && !Array.isArray(raw.data)) {
    const nested = raw.data as Record<string, unknown>
    data = pickArray<T>([
      nested.data,
      nested.items,
      nested.results,
      nested.records,
      nested.payload,
      nested.list
    ])
  }

  if (data.length === 0) {
    data = pickArray<T>([
      raw.collection,
      raw.events,
      raw.books
    ])
  }

  const metaSources: Array<unknown> = [
    raw,
    raw.meta,
    raw.pagination,
    (raw.data as Record<string, unknown> | undefined)?.meta,
    (raw.data as Record<string, unknown> | undefined)?.pagination
  ]

  const currentPageDefault = data.length > 0 ? 1 : 0
  const currentPage = pickNumber(['current_page', 'currentPage', 'page'], metaSources, currentPageDefault)
  const lastPage = pickNumber(
    ['last_page', 'lastPage', 'total_pages', 'totalPages'],
    metaSources,
    currentPage || currentPageDefault
  )
  const perPage = pickNumber(
    ['per_page', 'perPage', 'limit', 'page_size', 'pageSize'],
    metaSources,
    data.length
  )
  const total = pickNumber(
    ['total', 'total_items', 'totalItems', 'count'],
    metaSources,
    data.length
  )

  return {
    data,
    current_page: currentPage || currentPageDefault,
    last_page: lastPage || currentPage || currentPageDefault,
    per_page: perPage,
    total
  }
}
