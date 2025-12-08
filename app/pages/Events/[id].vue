<template>
  <div class="event-page">
    <NuxtLink to="/events" class="back-link">&larr; Back to Events</NuxtLink>

    <div class="event-detail-page">
      <div class="event-detail-main">
        <div class="event-detail-feed">
          <article class="hero-media-section">
            <div class="hero-media-container">
              <img
                :src="heroImage"
                :alt="event.title"
                class="hero-media-image"
                @error="handleImageError"
              />
              <div class="hero-media-overlay">
                <div class="hero-media-content">
                  <span class="hero-category-badge">{{ event.category }}</span>
                  <h1 class="hero-media-title">{{ event.title }}</h1>
                  <p class="hero-media-subtitle">{{ event.subtitle }}</p>
                  <div class="hero-actions">
                    <button type="button" class="hero-button primary">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor" />
                      </svg>
                      Daftar Event
                    </button>
                    <button type="button" class="hero-button ghost">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" fill="currentColor" />
                      </svg>
                      Bagikan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </article>

          <section class="event-info">
            <div class="event-header">
              <p class="hosted-by">
                Hosted by: <span class="host-link">{{ event.hostedBy }}</span>
              </p>
            </div>

            <section class="event-description">
              <h3>Deskripsi Event</h3>
              <p>{{ event.description }}</p>
              <div v-if="event.objectives" class="event-objectives">
                <p>{{ event.objectives }}</p>
              </div>
              <div v-if="event.benefits" class="event-benefits">
                <p>{{ event.benefits }}</p>
              </div>
              <!-- Tags Section -->
                <div class="event-tags-section">
                  <h4>Tags</h4>
                  <div class="tags-container">
                    <span
                      v-for="tag in event.tags"
                      :key="tag"
                      :class="['tag', getTagClass(tag)]"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </div>
            </section>

            <!-- Detail Event and Related Events Grid -->
            <div class="details-and-related-grid">
              <!-- Detail Event Section -->
              <section class="event-details-section">
                <div class="details-grid"> 

                  <!-- Date/time -->
                    <div class="detail-item">
                      <div class="detail-icon time">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" fill="currentColor" />
                        </svg>
                      </div>
                      <div>
                        <p class="detail-label">Tanggal & Waktu</p>
                        <p class="detail-value">{{ event.datetime }}</p>
                      </div>
                    </div>

                  <!-- Location (online/offline) -->
                    <div class="detail-item">
                      <div class="detail-icon location">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" fill="currentColor" />
                        </svg>
                      </div>
                      <div>
                        <p class="detail-label">Lokasi</p>
                        <div class="detail-value">
                          <template v-if="isOnlineEvent">
                            <div class="location-title">{{ event.shortAddress || 'Online (Zoom Meeting)' }}</div>
                            <div class="location-link">
                              <a :href="extractLink(event.address) || '#'" target="_blank" rel="noopener">{{ extractLink(event.address) ? extractLink(event.address) : event.address }}</a>
                            </div>
                          </template>
                          <template v-else>
                            <div class="location-title">{{ event.shortAddress || event.address }}</div>
                          </template>
                        </div>
                      </div>
                    </div>
                </div>
              </section>
            </div>
          </section>

          <!-- Related events carousel (moved below details) -->
          <section class="related-events-card carousel-card">
            <div class="card-header">
              <h3>Related Events</h3>
              <span class="events-count">{{ carouselItems.length }} Events</span>
            </div>

            <div class="carousel-wrapper related-carousel">
              <button v-if="carouselItems.length > visibleCount" class="carousel-nav carousel-nav-left" @click="previousRelated" :disabled="relatedIndex===0" aria-label="Previous">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>

              <div class="carousel-container">
                <div class="carousel-track" :style="{ transform: `translateX(-${relatedIndex * (cardWidth + gap)}px)` }">
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

              <button v-if="carouselItems.length > visibleCount" class="carousel-nav carousel-nav-right" @click="nextRelated" :disabled="relatedIndex >= maxRelatedIndex" aria-label="Next">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>
            </div>

            
          </section>
        </div>
      </div>

      <RightSideBar>
        <EventsSidebar
          :informasiTambahan="sidebarInfo"
          :tags="popularEventTags"
          :relatedEvents="[]"
        />
      </RightSideBar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute } from '#imports';
import RightSideBar from '~/components/General/RightSideBar.vue';
import eventsDataRaw from '~/../mock-backend/data/events.json';

interface EventData {
  id: string;
  title: string;
  subtitle: string;
  hostedBy: string;
  description: string;
  objectives?: string;
  benefits?: string;
  image: string;
  category: string;
  locationType: string;
  datetime: string;
  address: string;
  shortAddress?: string;
  capacity: string;
  price: string;
  certificate: string;
  contact: string;
  tags: string[];
}

interface SidebarInfoItem {
  icon: string;
  label: string;
  value: string;
}

interface SidebarTag {
  name: string;
  class: string;
}

interface RelatedEventCard {
  title: string;
  type: string;
  date: string;
  color: string;
  image?: string;
  id?: string;
}

// Transform mock-backend events to EventData format
const eventDetails = computed<Record<string, EventData>>(() => {
  const result: Record<string, EventData> = {};
  
  eventsDataRaw.forEach((event: any) => {
    const eventId = String(event.id);
    const dateStr = event.date || '';
    const isOnline = (event.location || '').toLowerCase().includes('online');
    
    result[eventId] = {
      id: eventId,
      title: event.title,
      subtitle: event.subtitle || '',
      hostedBy: event.community_name || 'Community',
      description: event.description || '',
      image: event.image || fallbackHeroImage,
      category: event.category || 'Event',
      locationType: event.location || 'TBA',
      datetime: formatFullDateTime(dateStr),
      address: event.location || 'TBA',
      shortAddress: event.location || 'TBA',
      capacity: `${event.maxAttendees || 0} peserta`,
      price: 'TBA',
      certificate: 'TBA',
      contact: event.community_id || '',
      tags: event.tags || []
    };
  });
  
  return result;
});

// Helper function to format date from ISO format with WIB timezone (+7)
const formatFullDateTime = (dateStr: string): string => {
  if (!dateStr) return 'TBA';
  
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    
    const monthsFull = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    
    // Convert UTC to WIB (UTC+7) by adding 7 hours
    const wibDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);
    
    const dayName = days[wibDate.getUTCDay()];
    const dayNum = String(wibDate.getUTCDate()).padStart(2, '0');
    const monthName = monthsFull[wibDate.getUTCMonth()];
    const year = wibDate.getUTCFullYear();
    const hours = String(wibDate.getUTCHours()).padStart(2, '0');
    const minutes = String(wibDate.getUTCMinutes()).padStart(2, '0');
    
    return `${dayName}, ${dayNum} ${monthName} ${year} • ${hours}:${minutes} WIB`;
  } catch (e) {
    return dateStr;
  }
};

const route = useRoute();
const showFullAddress = ref(false);
const heroImage = ref('');
const fallbackHeroImage = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80';

const event = computed<EventData>(() => {
  const id = String(route.params.id ?? '');
  const fallback: EventData = {
    id: 'not-found',
    title: 'Event not found',
    subtitle: '',
    hostedBy: '',
    description: '',
    image: fallbackHeroImage,
    category: '',
    locationType: '',
    datetime: '',
    address: '',
    shortAddress: '',
    capacity: '',
    price: '',
    certificate: '',
    contact: '',
    tags: []
  };
  return (eventDetails.value[id] ?? fallback) as EventData;
});

watch(
  () => event.value.image,
  (value) => {
    heroImage.value = value || fallbackHeroImage;
  },
  { immediate: true }
);

const displayedAddress = computed(() => {
  if (showFullAddress.value) {
    return event.value.address;
  }
  return event.value.shortAddress ?? event.value.address;
});

const toggleAddress = () => {
  showFullAddress.value = !showFullAddress.value;
};

const sidebarInfo = computed<SidebarInfoItem[]>(() => [
  { icon: 'CAT', label: 'Kategori', value: event.value.category },
  { icon: 'LOC', label: 'Tipe Lokasi', value: event.value.locationType },
  { icon: 'TIME', label: 'Tanggal & Waktu', value: event.value.datetime },
  { icon: 'CAP', label: 'Kapasitas', value: event.value.capacity },
  { icon: 'CP', label: 'Narahubung', value: event.value.contact }
]);

const popularEventTags = computed<SidebarTag[]>(() =>
  event.value.tags.map((tag) => ({ name: tag, class: 'tag-default' }))
);

const relatedEventsSource = computed<RelatedEventCard[]>(() => {
  return eventsDataRaw
    .filter((e: any) => String(e.id) !== String(route.params.id))
    .map((e: any) => ({
      title: e.title,
      type: e.location || 'Event',
      date: formatEventDateShort(e.date),
      color: 'green',
      image: e.image,
      id: String(e.id)
    }));
});

const formatEventDateShort = (dateStr: string): string => {
  if (!dateStr) return 'TBA';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    
    const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    
    // Convert UTC to WIB (UTC+7)
    const wibDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);
    const dayNum = wibDate.getUTCDate();
    const monthName = monthsShort[wibDate.getUTCMonth()];
    const year = wibDate.getUTCFullYear();
    
    return `${dayNum} ${monthName} ${year}`;
  } catch (e) {
    return dateStr;
  }
};

// Map related source to include image URLs and ids from eventDetails when possible
const relatedEvents = computed<RelatedEventCard[]>(() =>
  relatedEventsSource.value
    .filter((item) => item.title !== event.value.title)
    .slice(0, 3)
);

// Carousel for related events (all available related items with images and ids)
const carouselItems = computed<RelatedEventCard[]>(() =>
  relatedEventsSource.value
    .filter((item) => item.title !== event.value.title)
);

const relatedIndex = ref(0);
const cardWidth = 300; // px
const gap = 8; // px
// visibleCount adapts to how many items exist (max 3)
const visibleCount = computed(() => Math.min(3, carouselItems.value.length));
const maxRelatedIndex = computed(() => Math.max(0, carouselItems.value.length - visibleCount.value));

const nextRelated = () => {
  if (relatedIndex.value < maxRelatedIndex.value) {
    relatedIndex.value = Math.min(relatedIndex.value + 1, maxRelatedIndex.value);
  }
};

const previousRelated = () => {
  if (relatedIndex.value > 0) {
    relatedIndex.value = Math.max(0, relatedIndex.value - 1);
  }
};

// Helpers for location display
const isOnlineEvent = computed(() => {
  const loc = (event.value.locationType || '').toString().toLowerCase();
  return loc.includes('online') || loc.includes('zoom');
});

const extractLink = (text: string) => {
  if (!text) return '';
  const m = text.match(/https?:\/\/[\S]+/i);
  return m ? m[0] : '';
};

const handleImageError = () => {
  heroImage.value = fallbackHeroImage;
};

const getTagClass = (tag: string): string => {
  const tagClasses: Record<string, string> = {
    '#Workshop': 'tag-workshop',
    '#Literasi': 'tag-literasi',
    '#CreativeWriting': 'tag-creative',
    '#Menulis': 'tag-menulis',
    '#Inspirasi': 'tag-inspirasi'
  };

  return tagClasses[tag] || 'tag-default';
};
</script>

<style scoped>
.event-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.back-link {
  color: #3b5379;
  font-weight: 600;
  text-decoration: none;
}

.event-detail-page {
  display: flex;
  flex-direction: row;
  gap: 8px;
  width: 100%;
}

.event-detail-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 920px;
}


.event-detail-feed {
  display: flex;
  flex-direction: column;
  gap: 24px;
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
  min-height: clamp(200px, 32vh, 260px);
  aspect-ratio: 16 / 7;
  border-radius: 0;
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
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6));
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.hero-media-content {
  text-align: center;
  color: #ffffff;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.hero-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.hero-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 14px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
}

.hero-button svg {
  width: 18px;
  height: 18px;
}

.hero-button.primary {
  background: #fbbf24;
  color: var(--color-black);
  box-shadow: 0 12px 24px rgba(250, 191, 36, 0.35);
}

.hero-button.primary:hover {
  background: #f59e0b;
  transform: translateY(-2px);
}

.hero-button.ghost {
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.35);
  color: #ffffff;
}

.hero-button.ghost:hover {
  background: rgba(255, 255, 255, 0.28);
  transform: translateY(-2px);
}

.hero-category-badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  padding: 8px 20px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.hero-media-title {
  font-size: 48px;
  font-weight: 800;
  margin-bottom: 16px;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  line-height: 1.1;
}

.hero-media-subtitle {
  font-size: 20px;
  font-weight: 400;
  opacity: 0.95;
  line-height: 1.5;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
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
  font-size: 32px;
  font-weight: 800;
  color: var(--color-black);
  margin-bottom: 12px;
  line-height: 1.2;
}

.event-subtitle {
  font-size: 20px;
  font-weight: 600;
  color: #475569;
  margin-bottom: 8px;
  line-height: 1.4;
}

.hosted-by {
  color: #64748b;
  font-size: 14px;
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

.event-description p,
.event-objectives p,
.event-benefits p {
  color: #475569;
  line-height: 1.6;
  margin-bottom: 16px;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  flex: 1;
  min-width: 0;
}

.detail-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.detail-icon.category {
  background: #dbeafe;
  color: #1d4ed8;
}

.detail-icon.location {
  background: #dcfce7;
  color: #16a34a;
}

.detail-icon.time {
  background: #fef3c7;
  color: #d97706;
}

.detail-icon svg {
  width: 20px;
  height: 20px;
}

.detail-label {
  font-weight: 600;
  color: #374151;
  font-size: 12px;
  margin-bottom: 3px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-value {
  color: #6b7280;
  font-size: 13px;
  line-height: 1.4;
}

.detail-address-toggle {
  border: none;
  background: none;
  padding: 0;
  color: #3b5379;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}


.register-btn {
  background: #fbbf24;
  color: var(--color-black);
  flex: 1;
}

.detail-address-toggle:hover .detail-address-hint {
  text-decoration: underline;
}

.detail-address-full {
  margin-top: 8px;
  color: #475569;
  line-height: 1.5;
}

.tags-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.4;
  width: fit-content;
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

.tag-workshop,
.tag-literasi,
.tag-creative,
.tag-menulis,
.tag-inspirasi,
.tag-default {
  background: #3B5379;
  color: #FFFFFF;
  border: 1px solid rgba(59, 83, 121, 0.22);
}

/* Details and Related Events Grid Layout */
.details-and-related-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 16px;
  align-items: start;
}

.event-details-section {
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  padding: 20px;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.04);
}

.event-details-section h3 {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 16px;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
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
  /* remove white background and outer chrome so the related area blends with page */
  background: transparent;
  border-radius: 0;
  border: none;
  padding: 0;
  box-shadow: none;
  overflow: visible;
  height: auto;
}

/* Related events carousel styles */
.carousel-card .carousel-wrapper {
  position: relative;
  padding: 12px 16px;
}

.related-carousel .carousel-container {
  overflow: hidden;
  width: 100%;
}

.related-carousel .carousel-track {
  display: flex;
  gap: 8px;
  transition: transform 0.36s ease;
  padding: 12px 16px 20px;
  will-change: transform;
}

.related-card {
  flex-shrink: 0;
  width: 320px; 
  display: flex;
  align-items: stretch;
}

.related-card-inner {
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 12px;
  display: flex;
  gap: 12px;
  align-items: center;
  height: 100%;
  box-sizing: border-box;
}

.related-thumb {
  width: 112px;   
  height: 112px; 
  border-radius: 10px;
  flex-shrink: 0;
  display: block;
  overflow: hidden;
  background: #eaeef3;
  box-shadow: 0 6px 14px rgba(15,23,42,0.04);
  display: flex;
  align-items: center;
  justify-content: center;
}

.related-thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;       
  object-position: 50% 50%;
  display: block;
}

/* make the whole card a clickable link when wrapped by NuxtLink */
.related-link {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  color: inherit;
  text-decoration: none;
}

.related-link:hover {
  transform: translateY(-4px);
  transition: transform 0.18s ease;
}

.related-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.related-title {
  font-size: 14px;
  font-weight: 700;
  margin: 0 0 6px 0;
  color: #1e293b;
  line-height: 1.2;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.related-meta { display:flex; gap:8px; align-items:center; color:#64748b; font-size:12px }

.carousel-nav { position: absolute; top: 50%; transform: translateY(-50%); z-index: 10; }
.carousel-nav-left { left: 8px; }
.carousel-nav-right { right: 8px; }


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
}

.event-action-btn:hover {
  color: #1e293b;
  background: #f1f5f9;
}

.related-events-card .card-footer {
  padding: 16px 24px 24px;
  border-top: 1px solid #f1f5f9;
  text-align: center;
}

.view-all-events-btn {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  color: #ffffff;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(30, 41, 59, 0.2);
}

.view-all-events-btn:hover {
  background: linear-gradient(135deg, #334155 0%, #475569 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(30, 41, 59, 0.3);
}

@media (max-width: 768px) {
  .event-detail-page {
    flex-direction: column;
    gap: 16px;
  }

  .hero-media-container {
    min-height: 220px;
    border-radius: 16px;
  }

  .hero-media-title {
    font-size: 32px;
  }

  .hero-media-subtitle {
    font-size: 16px;
  }

  .hero-media-overlay {
    padding: 24px;
  }

  .hero-actions {
    flex-direction: column;
    width: 100%;
  }

  .hero-button {
    width: 100%;
    justify-content: center;
  }

  .event-info {
    padding: 20px;
  }

  .details-grid {
    flex-direction: column;
    gap: 12px;
  }

  .details-and-related-grid {
    grid-template-columns: 1fr;
    gap: 12px;
    margin-top: 12px;
  }

  .event-details-section,
  .related-events-card {
    padding: 16px;
  }

  .related-events-card .card-header {
    padding: 16px 16px 0;
    margin-bottom: 12px;
  }

  .related-events-list {
    padding: 0 16px;
    gap: 4px;
  }

  .related-events-card .card-footer {
    padding: 8px 16px 12px;
  }

  .view-all-events-btn {
    font-size: 10px;
    padding: 6px 10px;
  }
}

/* Override to ensure details grid shows two columns on desktop and stacks on mobile */
.event-info .event-details-section .details-grid {
  /* static two-column layout: center the pair and give each card a fixed width */
  display: flex !important;
  gap: 16px !important;
  align-items: stretch !important;
  justify-content: center !important;
  flex-wrap: nowrap !important;
  padding: 12px 8px;
}

.event-info .event-details-section .detail-item {
  flex: 0 0 380px !important;
  width: 380px !important;
  max-width: 380px !important;
}

/* Truncate long detail text (single line) to keep cards compact */
.event-info .event-details-section .detail-value,
.event-info .event-details-section .detail-value a {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Make sure carousel nav sits above content and is visible on all sizes */
.related-carousel .carousel-nav { z-index: 20 !important; }
</style>
