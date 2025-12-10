<template>
  <section class="event-detail-page">
    <NuxtLink to="/events" class="back-link">&larr; Back to Events</NuxtLink>

    <div class="event-detail-content">
      <div class="event-detail-main">
        <div v-if="isLoading" class="state-card loading">
          <div class="loading-spinner"></div>
          <p>Memuat detail event...</p>
        </div>

        <div v-else-if="loadError" class="state-card error">
          <h3>Gagal memuat data</h3>
          <p>{{ loadError }}</p>
          <button class="retry-btn" @click="retryFetch">Coba lagi</button>
        </div>

        <div v-else-if="notFound" class="state-card empty">
          <h3>Event tidak ditemukan</h3>
          <p>Periksa kembali tautan atau pilih event lain dari daftar.</p>
        </div>

        <div v-else-if="eventData" class="event-detail-feed">
          <article class="hero-media-section">
            <div class="hero-media-container">
              <img :src="heroImage" :alt="eventData.title" class="hero-media-image" @error="handleImageError" />
              <div class="hero-media-overlay">
                <div class="hero-media-content">
                  <span v-if="eventData.category" class="hero-category-badge">{{ eventData.category }}</span>
                  <h1 class="hero-media-title">{{ eventData.title }}</h1>
                  
                  <div class="hero-cta">
                    <button
                      type="button"
                      class="hero-button primary"
                      :disabled="!registrationLink"
                      @click="handleRegisterClick"
                    >
                      <span class="hero-button-icon">★</span>
                      {{ registrationButtonLabel }}
                    </button>
                    <button type="button" class="hero-button secondary" @click="shareEvent">
                      <svg class="hero-button-share" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 8a3 3 0 1 0-2.83-4H15a3 3 0 0 0 0 6h.17A3 3 0 0 0 18 8Zm0 2a4.98 4.98 0 0 0-3.9 1.9l-5.3-2.65a3 3 0 1 0-.8 1.6l5.34 2.67A4.97 4.97 0 0 0 13 16a5 5 0 1 0 5-5Z" fill="currentColor" />
                      </svg>
                      {{ shareButtonLabel }}
                    </button>
                  </div>
                
                  <p v-if="shareMessage" class="hero-share-feedback">{{ shareMessage }}</p>
                </div>
              </div>
            </div>
          </article>

          <section class="event-info">
            <header class="event-header">
              
              <span v-if="displayStatus" class="status-pill">{{ displayStatus }}</span>
            </header>

            <section v-if="eventData.description" class="event-description">
              <h3>Deskripsi Event</h3>
              <p>{{ eventData.description }}</p>
            </section>

            <section v-if="detailBlocks.length" class="event-details-section">
              <h3>Detail Event</h3>
              <dl class="details-grid">
                <div v-for="detail in detailBlocks" :key="detail.label" class="detail-item">
                  <dt class="detail-label">{{ detail.label }}</dt>
                  <dd class="detail-value">{{ detail.value }}</dd>
                </div>
              </dl>
            </section>

            <section v-if="tagList.length" class="event-tags">
              <h3>Tag</h3>
              <div class="tags-container">
                <span v-for="tag in tagList" :key="tag" class="tag tag-default">{{ tag }}</span>
              </div>
            </section>
          </section>

          <section v-if="isRelatedLoading" class="related-events-card related-loading">
            <div class="card-header">
              <h3>Related Events</h3>
              <div class="loading-pulse"></div>
            </div>
            <p class="related-placeholder">Memuat rekomendasi event...</p>
          </section>

          <section v-else-if="carouselItems.length" class="related-events-card carousel-card">
            <div class="card-header">
              <h3>Related Events</h3>
              <span class="events-count">{{ carouselItems.length }} Events</span>
            </div>

            <div class="carousel-wrapper related-carousel">
              <button
                v-if="showCarouselNav"
                class="carousel-nav carousel-nav-left"
                type="button"
                :disabled="relatedIndex === 0"
                @click="previousRelated"
                aria-label="Event sebelumnya"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>

              <div class="carousel-container">
                <div class="carousel-track" :style="{ transform: carouselTranslate }">
                  <div v-for="item in carouselItems" :key="item.title" class="related-card">
                    <NuxtLink v-if="item.id" :to="`/events/${item.id}`" class="related-card-inner related-link">
                      <div class="related-thumb">
                        <img class="related-thumb-img" :src="item.image" :alt="item.title" />
                      </div>
                      <div class="related-body">
                        <h4 class="related-title">{{ item.title }}</h4>
                        <div class="related-meta">
                          <span class="related-type">{{ item.type }}</span>
                          <span class="related-date">{{ item.date }}</span>
                        </div>
                      </div>
                    </NuxtLink>
                    <div v-else class="related-card-inner">
                      <div class="related-thumb">
                        <img class="related-thumb-img" :src="item.image" :alt="item.title" />
                      </div>
                      <div class="related-body">
                        <h4 class="related-title">{{ item.title }}</h4>
                        <div class="related-meta">
                          <span class="related-type">{{ item.type }}</span>
                          <span class="related-date">{{ item.date }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                v-if="showCarouselNav"
                class="carousel-nav carousel-nav-right"
                type="button"
                :disabled="relatedIndex >= maxRelatedIndex"
                @click="nextRelated"
                aria-label="Event berikutnya"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>
            </div>
          </section>

          <section v-else class="related-events-card empty">
            <div class="card-header">
              <h3>Related Events</h3>
            </div>
            <p class="related-placeholder">Belum ada rekomendasi event lainnya.</p>
          </section>
        </div>
      </div>

      <EventsSidebar :informasiTambahan="sidebarInfo" :tags="sidebarTags" :relatedEvents="[]" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch, onBeforeUnmount } from 'vue'
import { useRoute, useRuntimeConfig } from '#imports'
import { useEvents } from '~/composables/useEvents'
import type { Event } from '~/composables/useEvents'

interface SidebarInfoItem {
  icon: string
  label: string
  value: string
}

interface SidebarTag {
  name: string
  class: string
}

interface RelatedEventCard {
  id: number | null
  title: string
  type: string
  date: string
  image: string
}

const route = useRoute()
const runtimeConfig = useRuntimeConfig()
const eventApi = useEvents()
const relatedApi = useEvents()
const { getEventById, loading, error } = eventApi
const { getAllEvents } = relatedApi

const event = ref<Event | null>(null)
const notFound = ref(false)
const heroImage = ref('')
const fallbackHeroImage = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80'
const shareMessage = ref('')
let shareMessageTimer: ReturnType<typeof setTimeout> | null = null
const relatedRaw = ref<Event[]>([])
const relatedIndex = ref(0)
const isRelatedLoading = ref(false)
const CARD_WIDTH = 320
const CARD_GAP = 12
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

const getHeroImageSrc = (item: Event | null) => {
  if (!item) return null
  const record = item as unknown as Record<string, string | undefined>
  const candidate = item.image_url || record.image || record.cover_image || record.banner_url || null
  return resolveAbsoluteUrl(candidate)
}

const getCardImageSrc = (item: Event | null) => getHeroImageSrc(item) || fallbackHeroImage

const formatRelatedDate = (dateStr?: string | null) => {
  if (!dateStr) return 'TBA'
  try {
    const date = new Date(dateStr)
    if (Number.isNaN(date.getTime())) return dateStr
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
    const day = String(date.getDate()).padStart(2, '0')
    const month = months[date.getMonth()] || ''
    const year = date.getFullYear()
    return `${day} ${month} ${year}`
  } catch {
    return dateStr
  }
}

const registrationLink = computed(() => {
  const value = event.value as (Event & Record<string, string | undefined>) | null
  if (!value) return null
  return (
    value.registration_url ||
    value.registrationLink ||
    value.link ||
    value.cta_url ||
    value.ctaLink ||
    null
  )
})

const registrationButtonLabel = computed(() => {
  if (!event.value) return 'Daftar Event'
  return event.value.is_free ? 'Daftar Event (Gratis)' : 'Daftar Event'
})

const shareButtonLabel = computed(() => {
  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    return 'Bagikan'
  }
  return 'Salin Tautan'
})

const clearShareTimer = () => {
  if (shareMessageTimer) {
    clearTimeout(shareMessageTimer)
    shareMessageTimer = null
  }
}

const fetchEvent = async (rawId: string | string[] | undefined) => {
  notFound.value = false
  const idParam = Array.isArray(rawId) ? rawId[0] : rawId
  if (!idParam) {
    event.value = null
    notFound.value = true
    relatedRaw.value = []
    return
  }

  const numericId = Number(idParam)
  if (Number.isNaN(numericId)) {
    event.value = null
    notFound.value = true
    relatedRaw.value = []
    return
  }

  const result = await getEventById(numericId)
  if (result) {
    event.value = result
    await loadRelatedEvents(result)
  } else if (!error.value) {
    notFound.value = true
    relatedRaw.value = []
  }
}

const loadRelatedEvents = async (current: Event | null) => {
  if (!current) {
    relatedRaw.value = []
    return
  }

  isRelatedLoading.value = true
  relatedIndex.value = 0
  try {
    const response = await getAllEvents(1, 20)
    if (response?.data) {
      relatedRaw.value = response.data
    } else {
      relatedRaw.value = []
    }
  } catch {
    relatedRaw.value = []
  } finally {
    isRelatedLoading.value = false
  }
}

watch(
  () => route.params.id,
  (newId) => {
    void fetchEvent(newId)
  },
  { immediate: true }
)

watch(
  () => event.value,
  (value) => {
    heroImage.value = getHeroImageSrc(value) || fallbackHeroImage
  },
  { immediate: true }
)

const setShareMessage = (message: string) => {
  shareMessage.value = message
  clearShareTimer()
  shareMessageTimer = setTimeout(() => {
    shareMessage.value = ''
    shareMessageTimer = null
  }, 2400)
}

const handleRegisterClick = () => {
  if (!registrationLink.value) return
  if (typeof window === 'undefined') return
  window.open(registrationLink.value, '_blank', 'noopener')
}

const shareEvent = async () => {
  if (typeof window === 'undefined') return
  const shareUrl = window.location.href
  const title = event.value?.title ?? 'Event AKSARA'

  try {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      await navigator.share({ title, url: shareUrl })
      return
    }
  } catch {
    // Fallback to clipboard if share fails.
  }

  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setShareMessage('Tautan event berhasil disalin')
      return
    } catch {
      setShareMessage('Tidak dapat menyalin tautan')
      return
    }
  }

  setShareMessage('Silakan salin tautan secara manual')
}

onBeforeUnmount(() => {
  clearShareTimer()
})

const isLoading = computed(() => loading.value)
const loadError = computed(() => error.value)
const eventData = computed(() => event.value)

const formatCurrency = (value?: number | null) => {
  if (value === null || value === undefined) return null
  try {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(value)
  } catch {
    return `Rp ${value}`
  }
}

const formatStatus = (status?: Event['status']) => {
  if (!status) return null
  if (status === 'upcoming') return 'Akan Datang'
  if (status === 'ongoing') return 'Sedang Berlangsung'
  if (status === 'completed') return 'Selesai'
  if (status === 'cancelled') return 'Dibatalkan'
  return status
}

const displayDate = computed(() => {
  const value = eventData.value
  if (!value?.date) return null

  const date = new Date(value.date)
  if (!Number.isNaN(date.getTime())) {
    const datePart = date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })

    const timePart = value.time
      ? value.time
      : value.date.includes('T')
        ? date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        : null

    return timePart ? `${datePart} • ${timePart} WIB` : datePart
  }

  return value.date
})

const displayPrice = computed(() => {
  const value = eventData.value
  if (!value) return null
  if (value.is_free) return 'Gratis'
  if (value.price !== undefined && value.price !== null) return formatCurrency(value.price)
  return null
})

const displayCapacity = computed(() => {
  const value = eventData.value
  if (!value) return null
  if (value.capacity) return `${value.capacity} peserta`
  if (value.registered_count) return `${value.registered_count} peserta terdaftar`
  return null
})

const displayStatus = computed(() => formatStatus(eventData.value?.status))

const detailBlocks = computed(() => {
  const value = eventData.value
  if (!value) return [] as { label: string; value: string }[]

  const details: { label: string; value: string | null }[] = [
    { label: 'Tanggal & Waktu', value: displayDate.value },
    { label: 'Lokasi', value: value.location || null },
    { label: 'Status', value: displayStatus.value },
    { label: 'Harga', value: displayPrice.value },
    { label: 'Kapasitas', value: displayCapacity.value },
    
  ]

  return details.filter((item) => item.value) as { label: string; value: string }[]
})

const sidebarInfo = computed((): SidebarInfoItem[] => {
  const value = eventData.value
  if (!value) return []

  const info: SidebarInfoItem[] = []
  if (value.category) info.push({ icon: 'CAT', label: 'Kategori', value: value.category })
  if (displayDate.value) info.push({ icon: 'TIME', label: 'Tanggal & Waktu', value: displayDate.value })
  if (value.location) info.push({ icon: 'LOC', label: 'Lokasi', value: value.location })
  if (displayCapacity.value) info.push({ icon: 'CAP', label: 'Kapasitas', value: displayCapacity.value })
  if (displayPrice.value) info.push({ icon: 'CAP', label: 'Harga', value: displayPrice.value })
  if (value.organizer) info.push({ icon: 'CP', label: 'Penyelenggara', value: value.organizer })
  if (displayStatus.value) info.push({ icon: 'CAT', label: 'Status', value: displayStatus.value })
  return info
})

const normalizeTag = (raw: string) => `#${raw.replace(/\s+/g, '')}`

const tagList = computed(() => {
  const value = eventData.value
  if (!value) return [] as string[]

  const tags = new Set<string>()
  if (value.category) tags.add(normalizeTag(value.category))
  if (value.status) tags.add(normalizeTag(formatStatus(value.status) || value.status))
  if (value.is_free) tags.add('#Gratis')
  return Array.from(tags)
})

const sidebarTags = computed(() => tagList.value.map((name) => ({ name, class: 'tag-default' })) as SidebarTag[])

const relatedEventsList = computed(() => {
  const current = event.value
  if (!current) return [] as Event[]

  const others = relatedRaw.value.filter((item) => item.id !== current.id)
  const sameCategory = current.category ? others.filter((item) => item.category === current.category) : others
  const remaining = current.category ? others.filter((item) => item.category !== current.category) : []
  const merged = [...sameCategory, ...remaining]
  return merged.slice(0, 9)
})

const carouselItems = computed((): RelatedEventCard[] => {
  return relatedEventsList.value.map((item, index) => ({
    id: item.id ?? null,
    title: item.title,
    type: item.category || 'Event',
    date: formatRelatedDate(item.date),
    image: getCardImageSrc(item),
  }))
})

const visibleCount = computed(() => Math.min(3, carouselItems.value.length))
const maxRelatedIndex = computed(() => Math.max(0, carouselItems.value.length - visibleCount.value))
const carouselTranslate = computed(() => `translateX(-${relatedIndex.value * (CARD_WIDTH + CARD_GAP)}px)`)
const showCarouselNav = computed(() => carouselItems.value.length > visibleCount.value)

const nextRelated = () => {
  if (relatedIndex.value < maxRelatedIndex.value) {
    relatedIndex.value += 1
  }
}

const previousRelated = () => {
  if (relatedIndex.value > 0) {
    relatedIndex.value -= 1
  }
}

watch([
  () => carouselItems.value.length,
  () => visibleCount.value,
], () => {
  if (relatedIndex.value > maxRelatedIndex.value) {
    relatedIndex.value = maxRelatedIndex.value
  }
})

const handleImageError = () => {
  heroImage.value = fallbackHeroImage
}

const truncate = (value: string, length = 180) => {
  if (value.length <= length) return value
  return `${value.slice(0, length).trim()}…`
}

const retryFetch = () => {
  void fetchEvent(route.params.id)
}
</script>

<style scoped>
.event-detail-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

.back-link {
  color: #3b5379;
  font-weight: 600;
  text-decoration: none;
  margin-left: 31px;
}

.event-detail-content {
  display: flex;
  flex-direction: row;
  gap: 8px;
  width: 100%;
  align-items: flex-start;
}

.event-detail-content > *:last-child {
  flex-shrink: 0;
}

.event-detail-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-width: 0;
  max-width: 920px;
}

.event-detail-feed {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-left: 31px;
}

.state-card {
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  padding: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
}

.state-card h3 {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
}

.state-card p {
  margin: 0;
  color: #475569;
}

.state-card.error {
  border-color: #fecaca;
  background: #fef2f2;
}

.state-card.empty {
  background: #f8fafc;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 4px solid #e2e8f0;
  border-top-color: #3b5379;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.retry-btn {
  padding: 10px 18px;
  border-radius: 10px;
  border: none;
  background: #3b5379;
  color: #ffffff;
  font-weight: 600;
  cursor: pointer;
}

.hero-media-section {
  background: #ffffff;
  border-radius: 24px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
  overflow: hidden;
}

.hero-media-container {
  position: relative;
  width: 100%;
  min-height: clamp(220px, 32vh, 320px);
  aspect-ratio: 16 / 7;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.hero-media-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.hero-media-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.7));
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.hero-media-content {
  text-align: center;
  color: #ffffff;
  max-width: 720px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
}

.hero-category-badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 999px;
  padding: 8px 20px;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.hero-media-title {
  font-size: clamp(28px, 5vw, 48px);
  font-weight: 800;
  margin: 0;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
}

.hero-media-subtitle {
  font-size: 18px;
  line-height: 1.5;
  opacity: 0.95;
}

.hero-cta {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.hero-button {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  border-radius: 999px;
  border: none;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hero-button.primary {
  background: #ffda49;
  color: #1f2937;
  box-shadow: 0 12px 24px rgba(249, 115, 22, 0.35);
}

.hero-button.secondary {
  background: rgba(255, 255, 255, 0.18);
  color: #f8fafc;
  border: 1px solid rgba(255, 255, 255, 0.35);
}

.hero-button:hover:not(:disabled) {
  transform: translateY(-2px);
}

.hero-button-icon {
  font-size: 16px;
}

.hero-button-share {
  display: block;
}

.hero-meta {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
}

.hero-meta-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.28);
  font-weight: 600;
}

.hero-share-feedback {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #facc15;
}


.event-info {
  background: #ffffff;
  border-radius: 28px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 22px 44px rgba(15, 23, 42, 0.08);
  padding: 36px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.event-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.event-title {
  font-size: clamp(28px, 4vw, 38px);
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 10px;
}

.hosted-by {
  color: #64748b;
  font-size: 15px;
  margin: 0;
}

.host-link {
  color: #2563eb;
  font-weight: 700;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 18px;
  border-radius: 999px;
  background: rgba(59, 130, 246, 0.1);
  color: #1d4ed8;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 12px;
}

.event-description h3,
.event-details-section h3,
.event-tags h3 {
  font-size: 19px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 16px;
}

.event-description p {
  color: #475569;
  line-height: 1.7;
  margin: 0;
  font-size: 16px;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 18px;
}

.detail-item {
  background: #f8fafc;
  border-radius: 18px;
  border: 1px solid #e2e8f0;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.detail-label {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #64748b;
  margin: 0;
}

.detail-value {
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
}

.tags-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.event-tags-section {
  border-top: 1px solid #f1f5f9;
  padding-top: 12px;
}

.event-tags-section h4 {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 10px;
}

.related-events-section {
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  padding: 24px;
  margin-top: 24px;
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.05);
}

.related-events-section h3 {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.related-events-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.related-event-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
}

.related-event-card:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.1);
}

.event-indicator {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  margin-top: 6px;
  flex-shrink: 0;
  position: relative;
}

.indicator-green {
  background: #10b981;
}

.event-details {
  flex: 1;
  min-width: 0;
}

.related-event-card .event-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.related-event-card .event-meta {
  display: flex;
  gap: 12px;
  align-items: center;
}

.related-event-card .event-type {
  font-size: 11px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 6px;
  background: #e2e8f0;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.related-event-card .event-date {
  color: #64748b;
  font-size: 12px;
  font-weight: 500;
}

.more-events-section {
  border-top: 1px solid #e2e8f0;
  padding-top: 16px;
  text-align: center;
}

.more-events-btn {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  color: #ffffff;
  padding: 12px 24px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(30, 41, 59, 0.2);
}

.more-events-btn:hover {
  background: linear-gradient(135deg, #334155 0%, #475569 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(30, 41, 59, 0.3);
}

/* Related Events Card Styles */
.related-events-card {
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  padding: 0;
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.05);
  overflow: hidden;
  height: fit-content;
}

.related-events-card .card-header {
  padding: 24px 24px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.related-events-card .card-header h3 {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.related-events-card .events-count {
  font-size: 11px;
  color: #475569;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  padding: 6px 12px;
  border-radius: 12px;
  font-weight: 600;
  letter-spacing: 0.3px;
  border: 1px solid rgba(71, 85, 105, 0.1);
}

.related-events-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 24px;
  margin-bottom: 16px;
}

.related-event-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
}

.related-event-item:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
}

.event-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.indicator-green { background: #10b981; }
.indicator-blue { background: #3b82f6; }
.indicator-purple { background: #8b5cf6; }
.indicator-orange { background: #f59e0b; }

.event-info {
  flex: 1;
  min-width: 0;
}

.related-event-item .event-title {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px 0;
  line-height: 1.3;
}

.related-event-item .event-meta {
  display: flex;
  gap: 8px;
  align-items: center;
}

.related-event-item .event-type {
  font-size: 9px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
  background: #e2e8f0;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.related-event-item .event-date {
  color: #64748b;
  font-size: 11px;
  font-weight: 500;
}

.event-action-btn {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
  background: rgba(59, 83, 121, 0.12);
  color: #3b5379;
  border: 1px solid rgba(59, 83, 121, 0.22);
}

.tag-default {
  background: #3b5379;
  color: #ffffff;
  border: 1px solid rgba(59, 83, 121, 0.22);
}

.related-events-card {
  background: #ffffff;
  border-radius: 24px;
  border: 1px solid #e2e8f0;
  padding: 28px;
  box-shadow: 0 18px 36px rgba(15, 23, 42, 0.08);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.related-events-card .card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.related-events-card .card-header h3 {
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.events-count {
  font-size: 12px;
  font-weight: 600;
  color: #475569;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  padding: 6px 12px;
  border-radius: 12px;
  border: 1px solid rgba(71, 85, 105, 0.12);
}

.related-placeholder {
  margin: 0;
  color: #64748b;
  font-size: 14px;
}

.related-loading .loading-pulse {
  width: 64px;
  height: 10px;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(148, 163, 184, 0.35), rgba(148, 163, 184, 0.15), rgba(148, 163, 184, 0.35));
  animation: pulse 1.2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.4;
  }
  50% {
    opacity: 1;
  }
}

.carousel-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.carousel-container {
  overflow: hidden;
  width: 100%;
}

.carousel-track {
  display: flex;
  gap: 12px;
  transition: transform 0.35s ease;
  padding: 8px 4px;
  will-change: transform;
}

.related-card {
  flex-shrink: 0;
  width: 320px;
}

.related-card-inner {
  background: #f8fafc;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  padding: 16px;
  display: flex;
  gap: 14px;
  align-items: center;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.related-link {
  text-decoration: none;
  color: inherit;
}

.related-link:hover .related-card-inner,
.related-card-inner:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.12);
}

.related-thumb {
  width: 104px;
  height: 104px;
  border-radius: 14px;
  overflow: hidden;
  background: #e2e8f0;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.related-thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.related-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.related-title {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  line-height: 1.3;
}

.related-meta {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
  color: #64748b;
  font-size: 12px;
  font-weight: 600;
}

.related-type {
  background: #e2e8f0;
  color: #334155;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.related-date {
  font-size: 12px;
}

.carousel-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 38px;
  height: 38px;
  border-radius: 999px;
  border: 1px solid #cbd5f5;
  background: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #1d4ed8;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 8px 16px rgba(15, 23, 42, 0.12);
}

.carousel-nav:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  box-shadow: none;
}

.carousel-nav-left {
  left: -18px;
}

.carousel-nav-right {
  right: -18px;
}

.carousel-nav:hover:not(:disabled) {
  transform: translateY(-50%) translateY(-2px);
}

@media (max-width: 1280px) {
  .event-detail-content {
    gap: 20px;
  }
}

@media (max-width: 1024px) {
  .event-detail-content {
    gap: 18px;
  }
}

@media (max-width: 768px) {
  .event-detail-content {
    flex-direction: column;
    gap: 16px;
  }

  .event-detail-main {
    padding-right: 0;
  }

  .hero-media-container {
    min-height: 220px;
    border-radius: 16px;
  }

  .hero-media-overlay {
    padding: 24px;
  }

  .hero-media-title {
    font-size: 32px;
  }

  .hero-media-subtitle {
    font-size: 16px;
  }

  .event-info {
    padding: 24px;
  }

  .event-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .hero-cta {
    flex-direction: column;
    width: 100%;
  }

  .hero-button {
    width: 100%;
    justify-content: center;
  }

  .related-events-card {
    padding: 22px;
  }

  .related-card {
    width: 260px;
  }

  .carousel-nav-left {
    left: -6px;
  }

  .carousel-nav-right {
    right: -6px;
  }
}
</style>
