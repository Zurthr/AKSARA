<template>
  <div class="carousel-wrapper related-carousel">
    <button
      v-if="showCarouselNav"
      class="carousel-nav carousel-nav-left"
      type="button"
      :disabled="currentIndex === 0"
      @click="previousSlide"
      aria-label="Previous event"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>

    <div class="carousel-container">
      <div class="carousel-track" :style="{ transform: carouselTranslate }">
        <div v-for="item in formattedEvents" :key="item.id || item.title" class="related-card">
          <NuxtLink v-if="item.id" :to="`/events/${item.id}`" class="related-card-inner related-link">
            <div class="related-thumb">
              <img class="related-thumb-img" :src="item.image" :alt="item.title" @error="handleImageError"/>
            </div>
            <div class="related-body">
              <h4 class="related-title">{{ item.title }}</h4>
              <div class="related-meta">
                <span v-if="item.type" class="related-type">{{ item.type }}</span>
                <span class="related-date">{{ item.date }}</span>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>

    <button
      v-if="showCarouselNav"
      class="carousel-nav carousel-nav-right"
      type="button"
      :disabled="currentIndex >= maxIndex"
      @click="nextSlide"
      aria-label="Next event"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

const props = defineProps<{
  events: Array<any>
}>();

const currentIndex = ref(0);
const CARD_WIDTH = 320;
const CARD_GAP = 12;
const fallbackHeroImage = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80';

const formatStatus = (status?: string) => {
    if (!status) return null // Or return 'Event' maybe?
    return status === 'upcoming' ? 'Upcoming' : status
}

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

const formattedEvents = computed(() => {
  return props.events.map(event => ({
    id: event.id,
    title: event.title,
    type: event.category || formatStatus(event.status) || 'Event',
    date: formatRelatedDate(event.date),
    image: event.image || event.image_url || fallbackHeroImage
  }));
});

const visibleCount = computed(() => {
    // Basic responsive check could be added here if needed, 
    // strictly copying logic it was min(3, length)
    return Math.min(3, formattedEvents.value.length);
});

const maxIndex = computed(() => Math.max(0, formattedEvents.value.length - visibleCount.value));
const carouselTranslate = computed(() => `translateX(-${currentIndex.value * (CARD_WIDTH + CARD_GAP)}px)`);
const showCarouselNav = computed(() => formattedEvents.value.length > visibleCount.value);

const nextSlide = () => {
  if (currentIndex.value < maxIndex.value) {
    currentIndex.value += 1;
  }
};

const previousSlide = () => {
  if (currentIndex.value > 0) {
    currentIndex.value -= 1;
  }
};

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement;
  target.src = fallbackHeroImage;
}

watch(() => props.events, () => {
  currentIndex.value = 0;
});
</script>

<style scoped>
.carousel-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  /* Ensure it fits in parent */
  width: 100%;
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
  height: 100%; /* Ensure full height */
  box-sizing: border-box;
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
  width: 80px; /* Adjusted size slightly smaller if needed, or keep 104px */
  height: 80px;
  border-radius: 12px;
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
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.related-meta {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
  color: #64748b;
  font-size: 12px;
  font-weight: 600;
}

.related-type {
  background: #e2e8f0;
  color: #334155;
  padding: 4px 8px; /* Slightly compact */
  border-radius: 999px;
  font-size: 10px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.related-date {
  font-size: 12px;
  font-weight: 500;
}

.carousel-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  border-radius: 999px;
  border: 1px solid #cbd5f5;
  background: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #1d4ed8;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.12);
  z-index: 2;
}

.carousel-nav:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  box-shadow: none;
}

.carousel-nav-left {
  left: -12px; /* Pull out slightly */
}

.carousel-nav-right {
  right: -12px;
}

.carousel-nav:hover:not(:disabled) {
  background: #f1f5f9;
  transform: translateY(-50%) scale(1.1);
}

@media (max-width: 768px) {
  .related-card {
    width: 260px;
  }
  .carousel-nav-left {
    left: -8px;
  }
  .carousel-nav-right {
    right: -8px;
  }
}
</style>
