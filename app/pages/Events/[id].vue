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
                  <p v-if="eventData.description" class="hero-media-subtitle">{{ truncate(eventData.description) }}</p>
                  <div class="hero-actions">
                    <span v-if="displayDate" class="hero-chip">{{ displayDate }}</span>
                    <span v-if="eventData.location" class="hero-chip">{{ eventData.location }}</span>
                  </div>
                </div>
              </div>
            </div>
          </article>

          <section class="event-info">
            <header class="event-header">
              <h2 class="event-title">{{ eventData.title }}</h2>
              <p v-if="eventData.organizer" class="hosted-by">
                Diselenggarakan oleh <span class="host-link">{{ eventData.organizer }}</span>
              </p>
              <p v-if="displayStatus" class="event-subtitle">Status: {{ displayStatus }}</p>
            </header>

            <section v-if="eventData.description" class="event-description">
              <h3>Deskripsi</h3>
              <p>{{ eventData.description }}</p>
            </section>

            <section v-if="detailBlocks.length" class="event-details-section">
              <h3>Detail Event</h3>
              <div class="details-grid">
                <div v-for="detail in detailBlocks" :key="detail.label" class="detail-item">
                  <div class="detail-content">
                    <p class="detail-label">{{ detail.label }}</p>
                    <p class="detail-value">{{ detail.value }}</p>
                  </div>
                </div>
              </div>
            </section>

            <section v-if="tagList.length" class="event-tags">
              <h3>Tag</h3>
              <div class="tags-container">
                <span v-for="tag in tagList" :key="tag" class="tag tag-default">{{ tag }}</span>
              </div>
            </section>
          </section>
        </div>
      </div>

      <EventsSidebar :informasiTambahan="sidebarInfo" :tags="sidebarTags" :relatedEvents="relatedEvents" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
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
  title: string
  type: string
  date: string
  color: string
}

const route = useRoute()
const runtimeConfig = useRuntimeConfig()
const { getEventById, loading, error } = useEvents()

const event = ref<Event | null>(null)
const notFound = ref(false)
const heroImage = ref('')
const fallbackHeroImage = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80'
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

const fetchEvent = async (rawId: string | string[] | undefined) => {
  notFound.value = false
  const idParam = Array.isArray(rawId) ? rawId[0] : rawId
  if (!idParam) {
    event.value = null
    notFound.value = true
    return
  }

  const numericId = Number(idParam)
  if (Number.isNaN(numericId)) {
    event.value = null
    notFound.value = true
    return
  }

  const result = await getEventById(numericId)
  if (result) {
    event.value = result
  } else if (!error.value) {
    notFound.value = true
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
    { label: 'Terakhir Diperbarui', value: value.updated_at ? new Date(value.updated_at).toLocaleString('id-ID') : null },
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
const relatedEvents = computed(() => [] as RelatedEventCard[])

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
}

.event-detail-content {
  display: grid;
  grid-template-columns: minmax(0, 1fr) clamp(240px, 24vw, 320px);
  gap: 24px;
  align-items: start;
}

.event-detail-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-height: calc(100vh - 160px);
  overflow-y: auto;
  padding-right: 4px;
  scrollbar-width: thin;
  min-width: 0;
}

.event-detail-main::-webkit-scrollbar {
  width: 4px;
}

.event-detail-main::-webkit-scrollbar-track {
  background: transparent;
}

.event-detail-feed {
  display: flex;
  flex-direction: column;
  gap: 24px;
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
  gap: 16px;
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

.hero-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.hero-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.35);
  font-weight: 600;
}

.event-info {
  background: #ffffff;
  border-radius: 24px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.event-header h2 {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-black);
  margin-bottom: 8px;
}

.event-title {
  font-size: clamp(24px, 4vw, 32px);
  font-weight: 800;
  color: var(--color-black);
  margin: 0 0 8px;
}

.event-subtitle {
  font-size: 16px;
  color: #475569;
  margin: 0;
}

.hosted-by {
  color: #64748b;
  font-size: 14px;
  margin: 0;
}

.host-link {
  color: #3b82f6;
  font-weight: 600;
}

.event-description h3,
.event-details-section h3,
.event-tags h3 {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-black);
  margin-bottom: 12px;
}

.event-description p {
  color: #475569;
  line-height: 1.6;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.detail-item {
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.detail-label {
  font-weight: 600;
  color: #374151;
  font-size: 13px;
  margin-bottom: 4px;
  text-transform: uppercase;
}

.detail-value {
  color: #1f2937;
  font-size: 15px;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
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

@media (max-width: 1280px) {
  .event-detail-content {
    grid-template-columns: minmax(0, 1fr) clamp(220px, 30vw, 300px);
    gap: 20px;
  }
}

@media (max-width: 1024px) {
  .event-detail-content {
    grid-template-columns: minmax(0, 1fr) clamp(200px, 36vw, 260px);
    gap: 18px;
  }
}

@media (max-width: 768px) {
  .event-detail-content {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .event-detail-main {
    max-height: none;
    overflow: visible;
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

  .hero-actions {
    flex-direction: column;
    width: 100%;
  }

  .hero-chip {
    width: 100%;
    justify-content: center;
  }

  .event-info {
    padding: 20px;
  }
}
</style>
