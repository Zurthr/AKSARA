<script setup lang="ts">
const route = useRoute()
const configId = route.params.id as string

// 1. Fetch Data (Public Endpoint)
// We use useFetch which works great with SSR
const { data, error, pending } = await useFetch(`/embeds/${configId}`, {
  baseURL: 'http://localhost:3001/api'
})

// 2. Computed Theme Classes
const themeClasses = computed(() => {
  const mode = data.value?.meta?.theme || 'light'
  if (mode === 'dark') return 'bg-gray-900 text-white'
  if (mode === 'blue') return 'bg-slate-800 text-blue-50'
  return 'bg-white text-gray-900'
})

// 3. Computed Card Classes (for the books/events)
const cardClasses = computed(() => {
  const mode = data.value?.meta?.theme || 'light'
  return mode === 'light' ? 'border-gray-100 hover:bg-gray-50' : 'border-gray-700 hover:bg-white/5'
})

// 4. Format item display based on type
const formatItemData = (item: any) => {
  if (data.value?.meta?.type === 'EVENT_LIST') {
    return {
      title: item.title,
      description: item.description,
      date: item.date ? new Date(item.date).toLocaleDateString() : null,
      location: item.location,
      status: item.status,
      attendees: item.attendees || 0,
      community: item.community
    }
  } else {
    // RESOURCE_LIST
    return {
      title: item.title,
      description: item.description,
      author: item.author,
      rating: item.rating || 0,
      tags: item.tags || []
    }
  }
}
</script>

<template>
  <div v-if="pending" class="p-4 text-center text-sm text-gray-500">
    Loading widget...
  </div>

  <div v-else-if="error" class="p-4 text-center text-red-500 text-sm">
    Widget unavailable
  </div>

  <div v-else :class="['w-full h-full min-h-screen p-4 transition-colors', themeClasses]">

    <div class="flex justify-between items-center mb-4 border-b border-opacity-10 pb-2" :class="themeClasses">
      <h2 class="text-xs font-bold uppercase tracking-widest opacity-70">
        {{ data?.meta?.name || 'Recommended' }}
      </h2>
      <a href="/" target="_blank" class="text-[10px] opacity-50 hover:opacity-100 transition-opacity">
        Powered by Aksara
      </a>
    </div>

    <div class="grid gap-3">
      <!-- Event List Display -->
      <a
        v-for="item in data?.data"
        v-if="data?.meta?.type === 'EVENT_LIST'"
        :key="item.id"
        :href="`/events/${item.id}`"
        target="_blank"
        class="flex gap-3 items-start p-2 rounded-lg border transition-all group"
        :class="cardClasses"
      >
        <div class="flex-1 min-w-0">
          <h3 class="text-sm font-semibold truncate leading-tight mb-1">
            {{ item.title }}
          </h3>
          <p class="text-xs opacity-70 truncate mb-1">{{ item.description }}</p>

          <div class="flex gap-2 items-center text-[10px] flex-wrap">
            <span v-if="item.date" class="opacity-70">
              📅 {{ new Date(item.date).toLocaleDateString() }}
            </span>
            <span v-if="item.location" class="opacity-70">
              📍 {{ item.location }}
            </span>
            <span v-if="item.community" class="opacity-70 bg-opacity-10 px-1 rounded border border-current">
              {{ item.community }}
            </span>
            <span v-if="item.status" class="opacity-70" :class="{
              'text-green-500': item.status === 'upcoming',
              'text-blue-500': item.status === 'ongoing',
              'text-gray-500': item.status === 'completed'
            }">
              {{ item.status }}
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
        class="flex gap-3 items-start p-2 rounded-lg border transition-all group"
        :class="cardClasses"
      >
        <img
          v-if="data.meta.showThumbnail && item.cover"
          :src="item.cover"
          class="w-12 h-16 object-cover rounded shadow-sm group-hover:shadow-md transition-all"
          alt="Cover image"
        />

        <div class="flex-1 min-w-0">
          <h3 class="text-sm font-semibold truncate leading-tight mb-1">
            {{ item.title }}
          </h3>
          <p class="text-xs opacity-70 truncate mb-1">{{ item.author }}</p>

          <div class="flex gap-2 items-center text-[10px]">
            <span v-if="item.rating > 0" class="text-yellow-500 font-bold">
              ★ {{ item.rating }}
            </span>
            <span v-for="tag in (item.tags || []).slice(0, 2)" :key="tag" class="opacity-50 bg-opacity-10 px-1 rounded border border-current">
              {{ tag }}
            </span>
          </div>
        </div>
      </a>
    </div>

    <!-- Empty state -->
    <div v-if="data?.data?.length === 0" class="text-center py-8 opacity-50">
      <div class="text-2xl mb-2">📚</div>
      <p class="text-sm">No items found</p>
    </div>
  </div>
</template>

<script lang="ts">
definePageMeta({
  layout: 'blank' // CRITICAL: Don't show the main website navbar
})
</script>