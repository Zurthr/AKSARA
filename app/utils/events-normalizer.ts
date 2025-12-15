import type { Event as EventItem } from '~/composables/useEvents'

// Helpers to normalize and merge event data from multiple sources.

const VALID_STATUSES = ['upcoming', 'ongoing', 'completed', 'cancelled'] as const
const STATUS_SET = new Set<string>(VALID_STATUSES)

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

const coerceStatus = (value: unknown): EventItem['status'] => {
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase()
    if (STATUS_SET.has(normalized)) {
      return normalized as EventItem['status']
    }
  }
  return 'upcoming'
}

const determineIsFree = (flag: unknown, priceCandidate: unknown): boolean => {
  if (typeof flag === 'boolean') {
    return flag
  }
  if (typeof priceCandidate === 'number') {
    return priceCandidate <= 0
  }
  if (typeof priceCandidate === 'string') {
    const normalized = priceCandidate.trim().toLowerCase()
    if (!normalized) {
      return true
    }
    if (normalized === 'gratis' || normalized === 'free') {
      return true
    }
    const numeric = Number(normalized.replace(/[^0-9.-]/g, ''))
    if (Number.isFinite(numeric)) {
      return numeric <= 0
    }
    return false
  }
  return true
}

export const normalizeEventRecord = (raw: Record<string, unknown>): EventItem => {
  const source = raw as AnyRecord
  const copy: AnyRecord = { ...source }

  const fallbackId = `generated-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const rawId = source.id ?? source.event_id ?? source.slug ?? source.uuid
  copy.id = typeof rawId === 'number' || typeof rawId === 'string' ? rawId : fallbackId

  copy.title = ensureString(source.title ?? source.name ?? source.event_name, 'Event Tanpa Judul')

  const description = ensureString(source.description ?? source.subtitle ?? source.summary, '')
  copy.description = description || 'Deskripsi belum tersedia.'

  const baseDate = ensureString(source.date ?? source.event_date ?? source.start_date ?? source.datetime, new Date().toISOString())
  copy.date = baseDate

  const time = ensureString(source.time ?? source.event_time, '')
  if (time) {
    copy.time = time
  } else {
    delete copy.time
  }

  copy.location = ensureString(source.location ?? source.venue ?? source.address ?? source.place, 'TBA')
  copy.organizer = ensureString(source.organizer ?? source.organizer_name ?? source.community_name, 'Aksara Community')

  const capacity = coerceNumber(source.capacity ?? source.maxAttendees ?? source.quota)
  if (capacity !== undefined) {
    copy.capacity = capacity
  } else {
    delete copy.capacity
  }

  const registered = coerceNumber(source.registered_count ?? source.attendeeCount ?? source.registrants)
  if (registered !== undefined) {
    copy.registered_count = registered
  } else {
    delete copy.registered_count
  }

  const priceCandidate = source.price ?? source.ticket_price ?? source.cost ?? source.ticketPrice
  const numericPrice = coerceNumber(priceCandidate)
  if (numericPrice !== undefined) {
    copy.price = numericPrice
  } else if (copy.price !== undefined && typeof copy.price !== 'number') {
    delete copy.price
  }

  copy.is_free = determineIsFree(source.is_free, priceCandidate)
  copy.status = coerceStatus(source.status)

  const category = ensureString(source.category ?? source.type, '')
  if (category) {
    copy.category = category
  } else {
    delete copy.category
  }

  const image = ensureString(source.image_url ?? source.image ?? source.cover_image ?? source.banner_url ?? source.banner, '')
  if (image) {
    copy.image_url = image
  } else {
    delete copy.image_url
  }

  const created = ensureString(source.created_at ?? baseDate, baseDate)
  const updated = ensureString(source.updated_at ?? created, created)
  copy.created_at = created
  copy.updated_at = updated

  return copy as EventItem
}

export const normalizeEventCollection = (records: Array<Record<string, unknown>>): EventItem[] => {
  return records.map((record) => normalizeEventRecord(record))
}

export const mergeEventCollections = (collections: Array<Iterable<EventItem>>): EventItem[] => {
  const merged = new Map<string, EventItem>()
  const sourcePriority = {
    json: 0,
    mockApi: 1,
    localStorage: 2,
    laravel: 3,
    laravelLazy: 4
  } as const

  type SourceKey = keyof typeof sourcePriority

  const resolvePriority = (rawSource: unknown): number => {
    if (typeof rawSource === 'string' && rawSource in sourcePriority) {
      return sourcePriority[rawSource as SourceKey]
    }
    return sourcePriority.json
  }

  const buildKey = (item: EventItem): string => {
    const idCandidate = item?.id
    if (idCandidate !== undefined && idCandidate !== null) {
      const trimmed = String(idCandidate).trim()
      if (trimmed) {
        return `id:${trimmed}`
      }
    }

    const title = ensureString(item?.title, '').toLowerCase()
    const date = ensureString(item?.date, '').toLowerCase()
    const location = ensureString(item?.location, '').toLowerCase()
    return `content:${title}|${date}|${location}`
  }

  for (const collection of collections) {
    for (const item of collection) {
      const key = buildKey(item)
      if (!key) {
        continue
      }

      const existing = merged.get(key)
      if (!existing) {
        merged.set(key, item)
        continue
      }

      const nextPriority = resolvePriority((item as any).source)
      const currentPriority = resolvePriority((existing as any).source)

      if (nextPriority >= currentPriority) {
        merged.set(key, item)
      }
    }
  }

  return Array.from(merged.values())
}

export const findEventById = (id: string | number, collections: Array<Iterable<EventItem>>): EventItem | null => {
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

export const readLocalEventsSnapshot = (storageKey: string): EventItem[] => {
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
    return normalizeEventCollection(parsed as Array<Record<string, unknown>>)
  } catch {
    return []
  }
}
