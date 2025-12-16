<script setup lang="ts">
const route = useRoute()
const configId = route.params.id as string

// 1. Fetch Data (Public Endpoint)
// We use useFetch which works great with SSR
const { data, error, pending } = await useFetch(`/embeds/${configId}`, {
  baseURL: 'http://localhost:3001/api'
})

// 2. Theme helpers
const themeName = computed(() => data.value?.meta?.theme || 'light')
const themeClasses = computed(() => {
  if (themeName.value === 'dark') return 'bg-gray-900 text-white'
  if (themeName.value === 'blue') return 'bg-slate-800 text-blue-50'
  return 'bg-white text-gray-900'
})
const toneClass = computed(() => `theme-${themeName.value}`)

// 3. Display helpers
const embedLabel = computed(() => data.value?.meta?.type === 'EVENT_LIST' ? 'Events & Workshops' : 'Reading List')
const filterSummary = computed(() => {
  const tags = data.value?.meta?.filterTags || []
  if (tags.length === 1) return `Focused on ${tags[0]}`
  if (tags.length > 1) {
    const [first, second, ...rest] = tags
    return `Focused on ${[first, second].filter(Boolean).join(' · ')}${rest.length ? ` +${rest.length} more` : ''}`
  }
  return 'Curated picks from the AKSARA community.'
})
</script>

<template>
  <div v-if="pending" class="p-4 text-center text-sm text-gray-500">
    Loading widget...
  </div>

  <div v-else-if="error" class="p-4 text-center text-red-500 text-sm">
    Widget unavailable
  </div>

  <div v-else :class="['w-full h-full min-h-screen transition-colors embed-shell', themeClasses, toneClass]">

    <div class="embed-frame">
      <div class="embed-header">
        <div class="embed-identity">
          <span class="signal-dot" aria-hidden="true"></span>
          <div>
            <p class="embed-eyebrow">{{ embedLabel }}</p>
            <h2 class="embed-heading">
              {{ data?.meta?.name || 'AKSARA Picks' }}
            </h2>
          </div>
        </div>
        <a href="/" target="_blank" class="powered-chip" aria-label="Powered by AKSARA">
          <span class="powered-logo">A</span>
          <span class="powered-text">Powered by AKSARA</span>
        </a>
      </div>

      <p class="embed-subtitle">
        {{ filterSummary }}
      </p>

      <div class="embed-grid">
        <!-- Event List Display -->
        <a
          v-for="item in data?.data"
          v-if="data?.meta?.type === 'EVENT_LIST'"
          :key="item.id"
          :href="`/events/${item.id}`"
          target="_blank"
          class="embed-card event-card"
        >
          <div class="card-body">
            <div class="card-heading">
              <h3 class="card-title">
                {{ item.title }}
              </h3>
              <span v-if="item.status" class="status-pill" :data-status="item.status">
                {{ item.status }}
              </span>
            </div>
            <p class="card-description">{{ item.description }}</p>

            <div class="card-meta">
              <span v-if="item.date" class="meta-chip">
                {{ new Date(item.date).toLocaleDateString() }}
              </span>
              <span v-if="item.location" class="meta-chip">
                {{ item.location }}
              </span>
              <span v-if="item.community" class="meta-chip subtle-chip">
                {{ item.community }}
              </span>
              <span v-if="item.attendees" class="meta-chip subtle-chip">
                {{ item.attendees }} attending
              </span>
            </div>
          </div>
        </a>

        <!-- Resource List Display -->
        <a
          v-for="item in data?.data"
          v-else
          :key="item.id"
          :href="`/literature/${item.id}`"
          target="_blank"
          class="embed-card resource-card"
        >
          <img
            v-if="data?.meta?.showThumbnail && item.cover"
            :src="item.cover"
            class="cover-thumb"
            alt="Cover image"
          />

          <div class="card-body">
            <div class="card-heading">
              <h3 class="card-title">
                {{ item.title }}
              </h3>
              <span v-if="item.rating > 0" class="rating-chip">
                ★ {{ item.rating }}
              </span>
            </div>
            <p class="card-description">
              {{ item.author || 'From the AKSARA library' }}
            </p>

            <div class="card-meta">
              <span v-for="tag in (item.tags || []).slice(0, 3)" :key="tag" class="meta-chip subtle-chip">
                {{ tag }}
              </span>
            </div>
          </div>
        </a>
      </div>

      <!-- Empty state -->
      <div v-if="data?.data?.length === 0" class="empty-state">
        <div class="emoji">📚</div>
        <p>No items found</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
definePageMeta({
  layout: 'blank' // CRITICAL: Don't show the main website navbar
})
</script>
