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
}

const eventDetails: Record<string, EventData> = {
  'creative-writing-workshop': {
    id: 'creative-writing-workshop',
    title: 'Creative Writing Workshop',
    subtitle: 'Workshop Creative Writing: Menulis Cerita yang Menginspirasi',
    hostedBy: 'Komunitas Literasi Bandung',
    description: 'Bergabunglah dengan workshop creative writing yang akan mengasah kemampuan menulis Anda! Dalam sesi ini, Anda akan mempelajari teknik dasar penulisan kreatif mulai dari pengembangan karakter, alur, hingga gaya penulisan yang menarik.',
    objectives: 'Peserta akan mendapatkan panduan praktis dan latihan yang dapat langsung diterapkan untuk memperkuat kepercayaan diri menulis.',
    benefits: 'Dapatkan kesempatan berbagi karya dan menerima umpan balik konstruktif dari mentor literasi berpengalaman.',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80',
    category: 'Workshop',
    locationType: 'Online (Zoom Meeting)',
    datetime: 'Rabu, 20 November 2025 • 19:00 - 21:00 WIB',
    address: 'Link Zoom akan dikirim setelah registrasi melalui email resmi peserta.',
    shortAddress: 'Zoom Meeting (Link via email)',
    capacity: '100 peserta',
    price: 'Gratis',
    certificate: 'E-sertifikat tersedia',
    contact: 'literasi@aksara.id',
    tags: ['#Workshop', '#Literasi', '#CreativeWriting', '#Menulis', '#Inspirasi']
  },
  'book-knowledge-sharing': {
    id: 'book-knowledge-sharing',
    title: 'Book Events',
    subtitle: 'Many Book Many Knowledge',
    hostedBy: 'Komunitas Buku Nusantara',
    description: 'Sesi berbagi pengetahuan dari para pembaca setia untuk mengulas buku-buku terbaru, diskusi tematik, dan membangun jejaring antar pecinta literasi.',
    objectives: 'Menghadirkan ruang berdiskusi seputar buku dan memperkaya perspektif membaca melalui sesi tanya jawab.',
    benefits: 'Bangun koneksi dengan komunitas literasi dan dapatkan referensi bacaan baru yang dikurasi langsung oleh para kurator buku.',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80',
    category: 'Reading',
    locationType: 'Offline (Tahura Bandung)',
    datetime: 'Sabtu, 14 Desember 2025 • 15:00 - 18:00 WIB',
    address: 'Taman Hutan Raya Ir. H. Djuanda, Jl. Ir. H. Juanda No. 99, Bandung',
    shortAddress: 'Tahura, Bandung',
    capacity: '150 peserta',
    price: 'Rp 25.000',
    certificate: 'Tanpa sertifikat',
    contact: 'buku@aksara.id',
    tags: ['#Book', '#Knowledge', '#Reading']
  },
  'book-festival-2025': {
    id: 'book-festival-2025',
    title: 'Book Festivals 2025',
    subtitle: 'Book Festival 2025',
    hostedBy: 'Dispusipda Jawa Barat',
    description: 'Festival literasi tahunan yang mempertemukan penulis, penerbit, dan pembaca melalui diskusi panel, launching buku, serta pertunjukan seni.',
    objectives: 'Menginspirasi pengunjung untuk mengeksplorasi ragam genre buku dan mendukung ekosistem literasi lokal.',
    benefits: 'Nikmati diskon buku khusus festival dan akses eksklusif ke sesi meet and greet dengan penulis.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    category: 'Festival',
    locationType: 'Offline (Dispusipda Jawa Barat)',
    datetime: 'Sabtu, 22 November 2025 • 09:00 - 17:00 WIB',
    address: 'Dispusipda Jawa Barat, Jl. Kawaluyaan Indah II No.4, Bandung',
    shortAddress: 'Dispusipda Jabar, Bandung',
    capacity: '500 pengunjung',
    price: 'Gratis',
    certificate: 'Merchandise eksklusif',
    contact: 'festival@aksara.id',
    tags: ['#Festival', '#Book', '#Literature']
  },
  'litverse-2025': {
    id: 'litverse-2025',
    title: 'LitVerse 2025',
    subtitle: 'LitVerse 2025: Festival Literasi dan Imajinasi',
    hostedBy: 'Aksara Collective',
    description: 'Perayaan literasi dan kreativitas dengan sesi tematik, kelas master, dan instalasi interaktif untuk mengeksplorasi dunia imajinasi.',
    objectives: 'Menyajikan pengalaman hybrid yang mempertemukan pembaca dengan kreator konten literasi lintas medium.',
    benefits: 'Akses ke rekaman sesi premium dan jaringan komunitas kreatif nasional.',
    image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80',
    category: 'Festival',
    locationType: 'Hybrid (Bandung Convention Center + Livestream)',
    datetime: 'Minggu, 29 Desember 2025 • 10:00 - 21:00 WIB',
    address: 'Bandung Convention Center, Jl. Soekarno Hatta No. 354, Bandung',
    shortAddress: 'Bandung Convention Center',
    capacity: '1,200 peserta onsite & online',
    price: 'Mulai Rp 99.000',
    certificate: 'E-sertifikat & rekaman sesi',
    contact: 'litverse@aksara.id',
    tags: ['#LitVerse', '#Festival', '#Imajinasi']
  }
};

const route = useRoute();
const showFullAddress = ref(false);
const heroImage = ref('');
const fallbackHeroImage = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80';
const fallbackEvent = eventDetails['creative-writing-workshop'];

const event = computed<EventData>(() => {
  const id = String(route.params.id ?? '');
  return (eventDetails[id] ?? fallbackEvent) as EventData;
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

const relatedEventsSource: RelatedEventCard[] = [
  { title: 'Creative Writing Workshop', type: 'Online', date: '20 Nov 2025', color: 'green' },
  { title: 'Book Events', type: 'Offline', date: '14 Des 2025', color: 'green' },
  { title: 'Book Festivals 2025', type: 'Offline', date: '22 Nov 2025', color: 'green' },
  { title: 'LitVerse 2025', type: 'Hybrid', date: '29 Des 2025', color: 'green' }
];

const relatedEvents = computed<RelatedEventCard[]>(() =>
  relatedEventsSource.filter((item) => item.title !== event.value.title).slice(0, 3)
);

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
