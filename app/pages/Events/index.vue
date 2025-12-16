<template>
  <section class="events-page">
    <div class="events-main">
     

      <div class="events-body">
        <div class="events-content">
          <!-- Loading state -->
          <div v-if="isBusy" class="loading-state">
            <div class="loading-spinner"></div>
            <p>Loading events...</p>
          </div>

          <!-- Error state -->
          <div v-else-if="combinedError" class="error-state">
            <p class="error-message">{{ combinedError }}</p>
            <button @click="retryFetch" class="retry-btn">Try Again</button>
            <!-- Fallback: show local/file events if backend fails -->
            <div v-if="filteredEvents.length" class="events-grid" style="margin-top:32px;">
              <NuxtLink
                v-for="eventItem in filteredEvents"
                :key="eventItem.id"
                :to="`/events/${eventItem.id}`"
                class="event-card"
                @click="handleEventClick(eventItem)"
              >
                <div class="event-image">
                  <img :src="getEventImageSrc(eventItem)" :alt="eventItem.title" @error="handleCardImageError" />
                </div>
                <div class="event-content">
                  <div class="event-meta">
                    <h4>{{ eventItem.title }}</h4>
                    <p class="event-description">{{ eventItem.description }}</p>
                    <div class="event-details">
                      <div class="event-location">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" fill="currentColor"/>
                        </svg>
                        {{ eventItem.location }}
                      </div>
                      <div class="event-date">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" fill="currentColor"/>
                        </svg>
                        <div class="date-block">
                          <div class="date-info">
                            <div class="date-full">{{ formatEventDate(eventItem.date).full }}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button class="event-detail-btn">View Details</button>
                </div>
              </NuxtLink>
            </div>
          </div>

          <!-- Events grid -->
          <div v-else class="events-grid">
            <NuxtLink
              v-for="eventItem in filteredEvents"
              :key="eventItem.id"
              :to="`/events/${eventItem.id}`"
              class="event-card"
              @click="handleEventClick(eventItem)"
            >
              <div class="event-image">
                <img :src="getEventImageSrc(eventItem)" :alt="eventItem.title" @error="handleCardImageError" />
              </div>
              <div class="event-content">
                <div class="event-meta">
                  <h4>{{ eventItem.title }}</h4>
                  <p class="event-description">{{ eventItem.description }}</p>
                  <div class="event-details">
                    <div class="event-location">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" fill="currentColor"/>
                      </svg>
                      {{ eventItem.location }}
                    </div>
                    <div class="event-date">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" fill="currentColor"/>
                      </svg>
                      <div class="date-block">
                        <div class="date-info">
                          <div class="date-full">{{ formatEventDate(eventItem.date).full }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <button class="event-detail-btn">View Details</button>
              </div>
            </NuxtLink>
          </div>
        </div>

        <div class="events-insights" aria-label="Event highlights">
          <EventsFilter />

          <section class="sidebar-card">
            <h3>Most Popular Tags</h3>
            <div class="tags-grid">
              <span v-for="tag in popularTags" :key="tag.name" class="tag" :class="tag.class">
                {{ tag.name }}
              </span>
            </div>
          </section>

          <section class="sidebar-card">
            <NuxtLink to="/events/create" class="initiate-btn">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor" />
              </svg>
              Initiate an Event
            </NuxtLink>
          </section>
        </div>
      </div>

      <div class="load-more" ref="loadMoreTrigger">
        <button
          class="load-more-btn"
          @click="handleManualLoadMore"
          :disabled="isLoading || !hasMore"
        >
          <span v-if="hasMore">{{ isLoading ? 'Loading...' : 'Load More Events' }}</span>
          <span v-else>No more events</span>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRuntimeConfig, useRoute } from '#imports'

import { useEvents, useLazyEvents } from '~/composables/useEvents'
import type { Event as EventItem } from '~/composables/useEvents'
import { useLocalEvents } from '~/composables/useLocalEvents'
import mockEvents from 'mockData/events.json'
import { mergeEventCollections, normalizeEventCollection } from '~/utils/events-normalizer'
import { useClickTracking } from '~/composables/useClickTracking'

const runtimeConfig = useRuntimeConfig()

type RawEventRecord = Record<string, unknown>
const resolveAssetBaseUrl = () => {
  const configured = runtimeConfig.public?.assetBaseUrl as string | undefined
  if (configured) return configured
  const apiBase = runtimeConfig.public?.apiBaseUrl as string | undefined
  if (!apiBase) return ''
  try {
    const url = new URL(apiBase)
    return url.origin
  } catch {
    return apiBase.replace(/\/api\/?$/, '')
  }
}
const assetBaseUrl = resolveAssetBaseUrl()
const listFallbackImage = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80'

// Use Laravel API
const { getAllEvents, loading, error } = useEvents()
const { trackEventClick } = useClickTracking()

const {
  events: lazyEvents,
  isLoading,
  hasMore,
  loadMore,
  search,
  error: lazyError
} = useLazyEvents(6)

const isBusy = computed(() => loading.value || isLoading.value)
const combinedError = computed(() => {
  if (error.value) return error.value
  return lazyError.value?.message ?? null
})

const originalEvents = ref<EventItem[]>([])
const mockApiEvents = ref<EventItem[]>([])
const staticEvents = normalizeEventCollection(mockEvents as RawEventRecord[]).map((event, index) => {
  const candidateId = event.id
  const resolvedId = candidateId && String(candidateId).trim() !== '' ? candidateId : `static-${index + 1}`
  return {
    ...event,
    id: resolvedId,
    source: 'json'
  }
})
const { localEvents } = useLocalEvents()

const normalizedLocalEvents = computed<EventItem[]>(() => {
  const raw = Array.isArray(localEvents.value) ? localEvents.value : []
  return normalizeEventCollection(raw as RawEventRecord[]).map((event, index) => {
    const candidateId = event.id
    const resolvedId = candidateId && String(candidateId).trim() !== '' ? candidateId : `local-${index + 1}`
    return {
      ...event,
      id: resolvedId,
      source: 'localStorage'
    }
  })
})

const fetchLaravelEvents = async (query?: string): Promise<EventItem[]> => {
  try {
    const response = await getAllEvents(1, 18, query || undefined)
    const pageItems = Array.isArray(response?.data) ? response.data : []

    return pageItems.map((event, index) => ({
      ...event,
      id: event.id || `laravel-${index + 1}`,
      source: 'laravel'
    }))
  } catch (apiError) {
    console.warn('Failed to fetch events from Laravel API, skipping Laravel merge.', apiError)
    return []
  }
}

const fetchMockEvents = async (query?: string): Promise<EventItem[]> => {
  try {
    const url = new URL('http://localhost:3002/events')
    if (query) {
      url.searchParams.set('q', query)
    }

    const response = await $fetch<Array<Record<string, unknown>>>(url.toString())
    const normalized = normalizeEventCollection(response)

    return normalized.map((event, index) => {
      const candidateId = event.id
      const resolvedId = candidateId && String(candidateId).trim() !== '' ? candidateId : `mock-api-${index + 1}`
      return {
        ...event,
        id: resolvedId,
        source: 'mockApi'
      }
    })
  } catch (apiError) {
    console.warn('Failed to fetch events from mock API, skipping mock merge.', apiError)
    return []
  }
}

const fetchEvents = async (query?: string) => {
  const normalizedQuery = query?.trim() || undefined

  const [laravelEvents, mockEventsData] = await Promise.all([
    fetchLaravelEvents(normalizedQuery),
    fetchMockEvents(normalizedQuery)
  ])

  mockApiEvents.value = mockEventsData
  originalEvents.value = laravelEvents.length ? laravelEvents : []

  if (!originalEvents.value.length) {
    originalEvents.value = staticEvents
  }
}

const retryFetch = async () => {
  await fetchEvents(searchQuery.value)
  search(searchQuery.value)
}

// Global Route for Search
const route = useRoute()
const searchQuery = computed(() => typeof route.query.q === 'string' ? route.query.q : '')

// Filter state variables (used by filteredEvents)
const onlineChecked = ref(true)
const offlineChecked = ref(true)
const start = ref<Date | null>(null)
const end = ref<Date | null>(null)
const tagFilters = ref<string[]>([])

watch(searchQuery, (query) => {
  search(query)
  void fetchEvents(query)
}, { immediate: true })


// Infinite Scroll Logic
const loadMoreTrigger = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

const setupIntersectionObserver = () => {
  if (observer) observer.disconnect()
  
  observer = new IntersectionObserver((entries) => {
    // If visible and we have more data and not currently loading
    if (entries[0]?.isIntersecting && hasMore.value && !isLoading.value) {
      void loadMore()
    }
  }, {
    root: null, // viewport
    rootMargin: '100px', // load before updated bottom
    threshold: 0.1
  })
  
  if (loadMoreTrigger.value && observer) {
    observer.observe(loadMoreTrigger.value)
  }
}

onMounted(() => {
  setupIntersectionObserver()
})

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})

// Watch for element availability (e.g. if conditions change)
watch(loadMoreTrigger, (el) => {
  if (el) setupIntersectionObserver()
})

// Merged events - uses the lazy loaded events
const mergedEvents = computed<EventItem[]>(() => {
  const remote = Array.isArray(originalEvents.value) ? originalEvents.value : []
  const mockApi = Array.isArray(mockApiEvents.value) ? mockApiEvents.value : []
  const lazy = Array.isArray(lazyEvents.value) ? lazyEvents.value : []
  const primarySource = lazy.length ? 'laravelLazy' : 'laravel'
  const primary = (lazy.length ? lazy : remote).map((event, index) => {
    const candidateId = event.id
    const resolvedId = candidateId && String(candidateId).trim() !== '' ? candidateId : `${primarySource}-${index + 1}`
    return {
      ...event,
      id: resolvedId,
      source: primarySource
    }
  })

  console.log('🔍 Merging events:')
  console.log('⚡ Lazy stream:', lazy.length, 'events')
  console.log('📡 Remote (Laravel):', remote.length, 'events')
  console.log('🧪 Mock API:', mockApi.length, 'events')
  console.log('📄 Static (JSON):', staticEvents.length, 'events')
  console.log('💾 Local Storage:', normalizedLocalEvents.value.length, 'events')

  const merged = mergeEventCollections([staticEvents, mockApi, normalizedLocalEvents.value, primary])
  console.log('✅ Final merged:', merged.length, 'events')
  return merged
})

const resolveAbsoluteUrl = (raw?: string | null) => {
  if (!raw) return null
  const trimmed = raw.trim()
  if (!trimmed) return null
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  if (!assetBaseUrl) return trimmed
  const normalizedBase = assetBaseUrl.replace(/\/$/, '')
  const normalizedPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  return `${normalizedBase}${normalizedPath}`
}

const getEventImageSrc = (event: EventItem) => {
  const record = event as unknown as Record<string, string | undefined>
  const candidate = event.image_url || record.image || record.cover_image || record.banner_url || null
  return resolveAbsoluteUrl(candidate) || listFallbackImage
}

const handleCardImageError = (domEvent: Event) => {
  const image = domEvent.target as HTMLImageElement | null
  if (image) {
    image.src = listFallbackImage
  }
}

// Handle event card click
const handleEventClick = (eventItem: EventItem) => {
  trackEventClick({
    id: eventItem.id,
    title: eventItem.title,
    date: eventItem.date,
    community_id: eventItem.community_id
  })
}

const handleManualLoadMore = () => {
  if (isLoading.value || !hasMore.value) {
    return
  }

  void loadMore()
}

const normalizeKey = (value: unknown) =>
  (value ?? '').toString().trim().toLowerCase();

const parseEventDate = (dateStr?: string | null): Date | null => {
  if (!dateStr) return null;
  
  // Try ISO first (for mock-backend data like "2023-10-15T08:00:00Z")
  if (dateStr.includes('T')) {
    const iso = new Date(dateStr as string);
    if (!isNaN(iso.getTime())) return iso;
  }
  
  // Try plain ISO date format
  const iso = new Date(dateStr as string);
  if (!isNaN(iso.getTime())) return iso;

  // Try Indonesian month names like "29 Desember, 2025"
  const months: Record<string, number> = {
    january: 0,
    february: 1,
    march: 2,
    april: 3,
    may: 4,
    june: 5,
    july: 6,
    august: 7,
    september: 8,
    october: 9,
    november: 10,
    december: 11
  };

  const m = (dateStr as string).match(/(\d{1,2})\s+([A-Za-z]+),?\s*(\d{4})/);
  if (!m) return null;
  const day = parseInt(m[1] || '', 10);
  const monthName = (m[2] || '').toLowerCase();
  const year = parseInt(m[3] || '', 10);
  const month = months[monthName];
  if (month === undefined) return null;
  return new Date(year, month, day);
};

const formatEventDate = (dateStr?: string | null) => {
  const d = parseEventDate(dateStr || undefined);
  const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthsFull = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  if (!d || isNaN(d.getTime())) {
    return { day: '--', monthShort: '---', year: '', full: (dateStr as string) || '' };
  }
  
  // Convert UTC to WIB (UTC+7) for display
  const wibDate = new Date(d.getTime() + 7 * 60 * 60 * 1000);
  const day = String(wibDate.getUTCDate()).padStart(2, '0');
  const monthIdx = wibDate.getUTCMonth();
  const monthShort = monthsShort[monthIdx] || '';
  const monthFull = monthsFull[monthIdx] || '';
  const year = String(wibDate.getUTCFullYear());
  const full = `${day} ${monthFull} ${year}`;
  return { day, monthShort, monthFull, year, full };
};

const isEventOnline = (event: any) => {
  const loc = (event.location || '').toString().toLowerCase();
  return loc.includes('zoom') || loc.includes('online');
};

const filteredEvents = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  return mergedEvents.value.filter((ev: EventItem) => {
    if (query) {
      const title = typeof ev.title === 'string' ? ev.title.toLowerCase() : ''
      const description = typeof ev.description === 'string' ? ev.description.toLowerCase() : ''
      if (!title.includes(query) && !description.includes(query)) {
        return false
      }
    }

    // Type filter using chips: if both checked -> show all. If neither checked -> show all.
    if (!(onlineChecked.value && offlineChecked.value)) {
      // one of them might be false
      if (onlineChecked.value && !offlineChecked.value) {
        if (!isEventOnline(ev)) return false;
      } else if (!onlineChecked.value && offlineChecked.value) {
        if (isEventOnline(ev)) return false;
      } else {
        // neither checked -> treat as all (show everything)
      }
    }

    // date filters
    if (start.value || end.value) {
      const evDate = parseEventDate(ev.date);
      if (!evDate) return false;

      if (start.value && evDate < start.value) return false;
      if (end.value && evDate > end.value) return false;
    }

    // tag filters (any match)
    if (tagFilters.value.length) {
      const eventTags = Array.isArray(ev.tags)
        ? ev.tags
            .map((t: any) =>
              typeof t === 'string' ? t : t.name || t.label || ''
            )
            .map(normalizeKey)
        : [];

      const allMatch = tagFilters.value.every((t: string) =>
        eventTags.some((et) => et.includes(t))
      );
      if (!allMatch) return false;
    }

    return true;
  });
});

const popularTags = [
  { name: 'Harry Potter', class: 'tag-secondary' },
  { name: 'College', class: 'tag-secondary' },
  { name: '#Book', class: 'tag-primary' },
  { name: 'Literasi', class: 'tag-secondary' },
  { name: 'LMS', class: 'tag-secondary' },
  { name: '#Sejarah', class: 'tag-primary' },
  { name: 'Website', class: 'tag-secondary' },
  { name: 'Course', class: 'tag-secondary' },
  { name: '#API', class: 'tag-primary' }
];
</script>

<style scoped>
.events-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
}

.events-main {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.events-body {
  display: flex;
  gap: 8px;
  align-items: flex-start;
  width: 100%;
}

.events-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-width: 0;
  max-width: 920px;
}

.events-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: var(--color-black);
  margin-bottom: 8px;
}

.events-header p {
  color: #64748b;
  font-size: 16px;
  line-height: 1.6;
}

.events-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-left: 31px;
}

.event-card {
  display: flex;
  background: #ffffff;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.05);
  transition: all 0.3s ease;
  text-decoration: none;
  color: inherit;
  min-height: 240px;
}

.event-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.12);
}

.event-image {
  position: relative;
  width: 300px;
  aspect-ratio: 4 / 3;
  flex-shrink: 0;
}

.event-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.event-overlay {
  position: absolute;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  padding: 20px;
}

.event-overlay h3 {
  font-size: 24px;
  font-weight: 700;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.event-content {
  flex: 1;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.event-meta h4 {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-black);
  margin-bottom: 8px;
}

.event-description {
  color: #475569;
  line-height: 1.6;
  margin-bottom: 16px;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.event-details {
  display: flex;
  gap: 20px;
  margin-bottom: 16px;
}

.event-location,
.event-date {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #64748b;
}

.date-block {
  display: flex;
  align-items: center;
  gap: 12px;
}

.date-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg,#3B5379,#2C3542);
  color: #fff;
  padding: 6px 10px;
  border-radius: 8px;
  min-width: 56px;
}

.date-day {
  font-size: 16px;
  font-weight: 800;
  line-height: 1;
}

.date-month {
  font-size: 11px;
  opacity: 0.95;
}

.date-info .date-full {
  font-size: 14px;
  color: #475569;
}

/* Filter card styles */
.filter-card {
  padding: 18px;
}

.filter-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.filter-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.filter-label {
  font-weight: 700;
  color: #111827;
  font-size: 14px;
}

.input-with-icon {
  position: relative;
}

.filter-input {
  width: 100%;
  padding: 10px 40px 10px 12px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  font-size: 14px;
  color: #0f172a;
  height: 40px;
}

/* Tidy date input: remove native picker icon space and hide webkit indicator */
input[type="date"] {
  -webkit-appearance: none;
  appearance: none;
}

input[type="date"]::-webkit-calendar-picker-indicator {
  display: none;
}

.input-icon {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 28px;
  height: 28px;
  opacity: 0.95;
  color: #3B5379; /* project primary */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 4px;
}

.input-icon svg { width: 18px; height: 18px; }

.filter-radio-group {
  display: flex;
  gap: 10px;
  align-items: center;
}

.radio-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  color: #334155;
}

.radio-label input[type="radio"] {
  width: 16px;
  height: 16px;
}

.filter-actions {
  display: flex;
  gap: 10px;
  margin-top: 6px;
}

.clear-btn {
  background: transparent;
  border: 1px solid #e2e8f0;
  color: #3B5379; /* primary color */
  padding: 10px 12px;
  border-radius: 10px;
  cursor: pointer;
}

.apply-btn {
  background: linear-gradient(90deg,#3B5379,#2C3542);
  color: #fff;
  padding: 10px 12px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
}

.apply-btn:hover {
  filter: brightness(0.95);
}

/* chips for online/offline */
.chip-group {
  display: flex;
  gap: 8px;
}

.chip {
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  cursor: pointer;
  font-weight: 700;
  color: #334155;
  transition: all 0.15s ease;
}

.chip-active {
  /* use tag primary -> tag secondary gradient for active chips */
  background: linear-gradient(90deg,#3B5379,#2C3542);
  color: #ffffff;
  border-color: transparent;
  box-shadow: 0 8px 20px rgba(44,53,66,0.12);
  transform: translateY(-1px);
}

.event-location svg,
.event-date svg {
  width: 16px;
  height: 16px;
}

.event-detail-btn {
  background: #fbbf24;
  color: var(--color-black);
  padding: 8px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
  align-self: flex-start;
}

.event-detail-btn:hover {
  background: #f59e0b;
}

.load-more {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}

.load-more-btn {
  background: #f1f5f9;
  color: #475569;
  padding: 12px 32px;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.load-more-btn:hover {
  background: #e2e8f0;
  transform: translateY(-2px);
}

.events-insights {
  position: sticky;
  top: 80px;
  margin-top: 20px;
  width: 320px;
  padding-left: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.sidebar-card {
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  padding: 20px;
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.05);
}

.sidebar-card h3 {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-black);
  margin-bottom: 16px;
}

.tags-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.loading-more-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #64748b;
  font-size: 14px;
  padding: 20px 0;
}

.loading-spinner-small {
  width: 24px;
  height: 24px;
  border: 2px solid #e2e8f0;
  border-top-color: #3B5379;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.no-more-events {
  text-align: center;
  color: #94a3b8;
  padding: 24px 0;
  font-size: 14px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.tag {
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tag-primary { background: #3B5379; color: #ffffff; }
.tag-secondary { background: #2C3542; color: #ffffff; }


.tag:hover {
  transform: translateY(-1px);
}

.initiate-btn {
  width: 100%;
  background: #1e293b;
  color: #ffffff;
  padding: 16px;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
  text-decoration: none;
}

.initiate-btn:hover {
  background: var(--color-black);
  transform: translateY(-2px);
}

.initiate-btn svg {
  width: 20px;
  height: 20px;
}

@media (max-width: 1024px) {
  .events-body {
    flex-direction: column;
    gap: 16px;
  }

  .events-content {
    max-width: 100%;
  }

  .events-insights {
    position: static;
    width: 100%;
    padding-left: 0;
    margin-top: 0;
  }
}

@media (max-width: 768px) {
  .events-body {
    gap: 16px;
  }

  .event-card {
    flex-direction: column;
  }
  
  .event-image {
    width: 100%;
    aspect-ratio: 16 / 9;
  }
  
  .events-header h1 {
    font-size: 24px;
  }
}

/* Loading and Error States */
.loading-state, .error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
  min-height: 300px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  color: #dc2626;
  margin-bottom: 16px;
  font-size: 16px;
}

.retry-btn {
  background: #3b82f6;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.retry-btn:hover {
  background: #2563eb;
}
</style>