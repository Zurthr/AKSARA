<template>
  <section class="event-detail-page">
    <NuxtLink to="/events" class="back-link">&larr; Back to Events</NuxtLink>

    <div class="event-detail-content">
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
                <h3>Detail Event</h3>
                <div class="details-grid"> <div class="detail-item">
                    <div class="detail-icon location">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" fill="currentColor" />
                      </svg>
                    </div>
                    <div>
                      <p class="detail-label">Tipe Lokasi</p>
                      <p class="detail-value">{{ event.locationType }}</p>
                    </div>
                  </div>

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

                  <div class="detail-item">
                    <div class="detail-icon location">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" fill="currentColor" />
                      </svg>
                    </div>
                    <div>
                      <p class="detail-label">Alamat</p>
                      <p class="detail-value">
                        <button
                          type="button"
                          class="detail-address-toggle"
                          @click="toggleAddress"
                          :aria-expanded="showFullAddress"
                        >
                          {{ displayedAddress }}
                          <span class="detail-address-hint">
                            {{ showFullAddress ? 'Sembunyikan detail' : 'Lihat detail' }}
                          </span>
                        </button>
                      </p>
                      <p v-if="showFullAddress" class="detail-address-full">{{ event.address }}</p>
                    </div>
                  </div>
                </div>

                
              </section>

              <!-- Related Events Section -->
              <section class="related-events-card">
                <div class="card-header">
                  <h3>Related Events</h3>
                  <span class="events-count">{{ relatedEvents.length }} Events</span>
                </div>
                
                <div class="related-events-list">
                  <div v-for="relatedEvent in relatedEvents" :key="relatedEvent.title" class="related-event-item">
                    <div class="event-indicator" :class="`indicator-${relatedEvent.color}`"></div>
                    <div class="event-info">
                      <h4 class="event-title">{{ relatedEvent.title }}</h4>
                      <div class="event-meta">
                        <span class="event-type">{{ relatedEvent.type }}</span>
                        <span class="event-date">{{ relatedEvent.date }}</span>
                      </div>
                    </div>
                    <button class="event-action-btn">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div class="card-footer">
                  <button class="view-all-events-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    View All Related Events
                  </button>
                </div>
              </section>
            </div>
          </section>

          <div class="event-actions">
            <button class="register-btn">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>
              </svg>
              Daftar Event
            </button>
            <button class="share-btn">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92S19.61 16.08 18 16.08z" fill="currentColor"/>
              </svg>
              Bagikan
            </button>
          </div>
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
  </section>
</template>

<script setup lang="ts">
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
  capacity: string;
  price: string;
  certificate: string;
  contact: string;
  tags: string[];
  informasiTambahan: Array<{
    icon: string;
    label: string;
    value: string;
  }>;
}

interface RelatedEvent {
  title: string;
  type: string;
  date: string;
  color: string;
}

interface PopularTag {
  name: string;
  class: string;
}

const route = useRoute();

// Sample event data based on route ID
const eventData: Record<string, EventData> = {
  'creative-writing-workshop': {
    id: 'creative-writing-workshop',
    title: 'Creative Writing Workshop',
    subtitle: 'Workshop Creative Writing: Menulis Cerita yang Menginspirasi',
    hostedBy: 'Komunitas Literasi Bandung',
    description: 'Bergabunglah dengan workshop creative writing yang akan mengasah kemampuan menulis Anda! Dalam sesi ini, Anda akan mempelajari teknik-teknik dasar penulisan kreatif, mulai dari pengembangan karakter, plot, hingga gaya penulisan yang menarik.',
    objectives: 'Workshop ini cocok untuk pemula yang ingin memulai perjalanan menulis maupun penulis yang ingin meningkatkan keterampilan mereka. Kami akan memberikan panduan praktis dan latihan langsung yang bisa diterapkan segera.',
    benefits: 'Dapatkan kesempatan untuk berbagi karya dengan sesama peserta dan mendapat feedback konstruktif dari mentor berpengalaman di bidang literasi.',
    image: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&q=80',
    category: 'Workshop',
    locationType: 'Online',
    datetime: '20 November 2024, 13:00 - 16:00 WIB',
    address: 'Perpustakaan Kota Bandung Jl. Seram No. 2, Citarum, Bandung Wetan Kota Bandung, Jawa Barat 40115',
    capacity: '30 peserta',
    price: 'Gratis',
    certificate: 'Available',
    contact: '+62 812-3456-7890',
    tags: ['#Workshop', '#Literasi', '#CreativeWriting', '#Menulis', '#Inspirasi'],
    informasiTambahan: [
      { icon: '👥', label: 'Kapasitas', value: '30 peserta' },
      { icon: '💰', label: 'Gratis', value: 'Gratis' },
      { icon: '📜', label: 'Sertifikat dan materi workshop', value: 'Available' },
      { icon: '📞', label: 'Contact', value: '+62 812-3456-7890' }
    ]
  }
};

const event = computed((): EventData => {
  const targetId = String(route.params.id);
  return eventData[targetId] ?? eventData['creative-writing-workshop']!;
});

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement;
  const container = target.parentElement;
  
  if (container) {
    // Create a fallback gradient background
    container.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    target.style.display = 'none';
  }
};

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

const relatedEvents: RelatedEvent[] = [
  {
    title: 'Workshop Creative',
    type: 'Online',
    date: '20 November 2024',
    color: 'green'
  },
  {
    title: 'Workshop Creative', 
    type: 'Onsite',
    date: '20 November 2024',
    color: 'green'
  },
  {
    title: 'Reading Together',
    type: 'Online', 
    date: '20 November 2024',
    color: 'green'
  },
  {
    title: 'Workshop Writing',
    type: 'Online',
    date: '25 November 2024', 
    color: 'green'
  }
];

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

.event-detail-main::-webkit-scrollbar-thumb {
  background-color: rgba(148, 163, 184, 0.35);
  border-radius: 999px;
}

.hero-media-section {
  margin-bottom: 32px;
}

.hero-media-container {
  position: relative;
  width: 100%;
  height: 350px;
  border-radius: 20px;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.15);
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
  color: white;
  max-width: 800px;
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

.event-image-container {
  width: 100%;
  height: 250px;
  border-radius: 16px;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  margin-bottom: 24px;
  box-shadow: 0 8px 32px rgba(15, 23, 42, 0.1);
  border: 1px solid #e2e8f0;
}

.event-main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
}

.event-main-image:hover {
  transform: scale(1.02);
}

.event-hero {
  background: #ffffff;
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
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
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.detail-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
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

.detail-icon.category { background: #dbeafe; color: #1d4ed8; }
.detail-icon.location { background: #dcfce7; color: #16a34a; }
.detail-icon.time { background: #fef3c7; color: #d97706; }

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
    height: 280px;
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
  
  .hero-overlay h1 {
    font-size: 24px;
  }
  
  .event-info {
    padding: 20px;
  }

  .events-detail-sidebar,
  .event-detail-content > *:last-child {
    width: 100%;
  }
  
  .details-grid {
    grid-template-columns: 1fr;
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
</style>