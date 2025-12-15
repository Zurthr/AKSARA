import type { LiteratureBook } from '~/composables/useLiterature'

type BookItem = LiteratureBook

// Helpers to normalize and merge literature/book data from multiple sources.

type AnyRecord = Record<string, any>

const ensureString = (value: unknown, fallback = ''): string => {
  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed || fallback
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value)
  }
  return fallback
}

const coerceNumber = (value: unknown): number | undefined => {
  if (value === null || value === undefined) {
    return undefined
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }
  const maybe = Number(value)
  return Number.isFinite(maybe) ? maybe : undefined
}

const normalizeTags = (rawTags: unknown): Array<{ name: string; type?: string }> => {
  if (!rawTags) return []
  
  if (Array.isArray(rawTags)) {
    return rawTags.map(tag => {
      if (typeof tag === 'string') {
        return { name: tag.trim() }
      }
      if (tag && typeof tag === 'object' && tag.name) {
        return {
          name: String(tag.name).trim(),
          type: tag.type ? String(tag.type).trim() : undefined
        }
      }
      return { name: String(tag).trim() }
    }).filter(tag => tag.name)
  }
  
  return []
}

const normalizeSources = (rawSources: unknown): Array<{ name: string; url: string }> => {
  if (!Array.isArray(rawSources)) return []
  
  return rawSources.map(source => {
    if (source && typeof source === 'object') {
      return {
        name: ensureString(source.name || source.platform, 'Unknown Source'),
        url: ensureString(source.url || source.link, '#')
      }
    }
    return { name: 'Unknown Source', url: '#' }
  }).filter(source => source.name && source.url !== '#')
}

export const normalizeBookRecord = (raw: Record<string, unknown>): BookItem => {
  const source = raw as AnyRecord
  const copy: AnyRecord = { ...source }

  // Ensure ID
  const fallbackId = `generated-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const rawId = source.id ?? source.book_id ?? source.slug ?? source.uuid
  copy.id = typeof rawId === 'number' || typeof rawId === 'string' ? rawId : fallbackId

  // Basic fields
  copy.title = ensureString(source.title ?? source.name ?? source.book_title, 'Untitled Book')
  copy.author = ensureString(source.author ?? source.author_name ?? source.writer)
  copy.description = ensureString(source.description ?? source.summary ?? source.synopsis, '')

  // Images
  const coverCandidate = source.cover ?? source.image_url ?? source.image ?? source.cover_image ?? source.banner
  copy.cover = ensureString(coverCandidate, '')
  if (copy.cover) {
    copy.image_url = copy.cover
  }

  // Rating and numbers
  const rating = coerceNumber(source.rating ?? source.score ?? source.stars)
  if (rating !== undefined && rating >= 0 && rating <= 5) {
    copy.rating = rating
  } else {
    delete copy.rating
  }

  const bookmarks = coerceNumber(source.total_bookmarked ?? source.bookmarks ?? source.likes ?? source.favorites)
  if (bookmarks !== undefined) {
    copy.total_bookmarked = bookmarks
  } else {
    delete copy.total_bookmarked
  }

  const year = ensureString(source.year_edition ?? source.year ?? source.published_year ?? source.publication_year)
  if (year) {
    copy.year_edition = year
  } else {
    delete copy.year_edition
  }

  // Tags
  const tags = normalizeTags(source.tags ?? source.categories ?? source.genres)
  if (tags.length > 0) {
    copy.tags = tags
  } else {
    delete copy.tags
  }

  // Copy types (keep as-is if exists)
  if (source.copy_types && typeof source.copy_types === 'object') {
    copy.copy_types = source.copy_types
  } else {
    delete copy.copy_types
  }

  // Licensing
  const licensing = ensureString(source.licensing_type ?? source.license ?? source.access_type)
  if (licensing) {
    copy.licensing_type = licensing
  } else {
    delete copy.licensing_type
  }

  // Sources and access links
  const sources = normalizeSources(source.sources ?? source.access_links ?? source.links)
  if (sources.length > 0) {
    copy.sources = sources
    // Also set access_links for compatibility
    copy.access_links = sources.map(s => ({ platform: s.name, url: s.url, type: 'access' }))
  } else {
    delete copy.sources
    delete copy.access_links
  }

  // Timestamps
  const created = ensureString(source.created_at ?? new Date().toISOString())
  const updated = ensureString(source.updated_at ?? created)
  copy.created_at = created
  copy.updated_at = updated

  return copy as BookItem
}

export const normalizeBookCollection = (records: Array<Record<string, unknown>>): BookItem[] => {
  return records.map((record) => normalizeBookRecord(record))
}

export const mergeBookCollections = (collections: Array<Iterable<BookItem>>): BookItem[] => {
  const merged = new Map<string, BookItem>()
  const sourcePriority = {
    json: 0,
    mockApi: 1,
    localStorage: 2,
    laravel: 3
  } as const

  type SourceKey = keyof typeof sourcePriority

  const resolvePriority = (rawSource: unknown): number => {
    if (typeof rawSource === 'string' && rawSource in sourcePriority) {
      return sourcePriority[rawSource as SourceKey]
    }
    return sourcePriority.json
  }

  for (const collection of collections) {
    for (const item of collection) {
      const key = item?.id !== undefined ? String(item.id) : ''
      if (!key) {
        continue
      }

      const existingItem = merged.get(key)
      if (!existingItem) {
        merged.set(key, item)
        continue
      }

      const itemPriority = resolvePriority((item as any).source)
      const existingPriority = resolvePriority((existingItem as any).source)

      if (itemPriority >= existingPriority) {
        merged.set(key, item)
      }
    }
  }

  return Array.from(merged.values())
}

export const findBookById = (id: string | number, collections: Array<Iterable<BookItem>>): BookItem | null => {
  const key = String(id)
  for (const collection of collections) {
    for (const item of collection) {
      if (String(item.id) === key) {
        return item
      }
    }
  }
  return null
}

export const readLocalBooksSnapshot = (storageKey: string): BookItem[] => {
  if (typeof window === 'undefined') {
    return []
  }
  try {
    const raw = window.localStorage.getItem(storageKey)
    if (!raw) {
      return []
    }
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      return []
    }
    return normalizeBookCollection(parsed as Array<Record<string, unknown>>)
  } catch {
    return []
  }
}