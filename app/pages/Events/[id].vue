<template>
  <section class="event-detail-page">
    <NuxtLink to="/events" class="back-link">&larr; Back to Events</NuxtLink>

    <div class="event-detail-content">
      <div class="event-detail-main">
        <!-- Hero Media Section -->
        <div class="hero-media-section">
          <div class="hero-media-container">
            <img :src="event.image" :alt="event.title" @error="handleImageError" class="hero-media-image" />
            <div class="hero-media-overlay">
              <div class="hero-media-content">
                <span class="hero-category-badge">{{ event.category }}</span>
                <h1 class="hero-media-title">{{ event.title }}</h1>
                <p class="hero-media-subtitle">{{ event.subtitle }}</p>
              </div>
            </div>
          </div>
        </div>


        <!-- Title and Info Section -->
        <div class="event-info">
          <div class="event-header">
            <p class="hosted-by">Hosted by: <span class="host-link">{{ event.hostedBy }}</span></p>
          </div>

          <section class="event-description">
            <h3>Deskripsi Event</h3>
            <p>{{ event.description }}</p>
            
            <div class="event-objectives" v-if="event.objectives">
              <p>{{ event.objectives }}</p>
            </div>
            
            <div class="event-benefits" v-if="event.benefits">
              <p>{{ event.benefits }}</p>
            </div>
          </section>

          <section class="event-details-section">
            <h3>Detail Event</h3>
            <div class="details-grid">
              <div class="detail-item">
                <div class="detail-icon category">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" fill="currentColor"/>
                  </svg>
                </div>
                <div>
                  <p class="detail-label">Kategori</p>
                  <p class="detail-value">{{ event.category }}</p>
                </div>
              </div>

              <div class="detail-item">
                <div class="detail-icon location">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" fill="currentColor"/>
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
                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" fill="currentColor"/>
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
                    <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" fill="currentColor"/>
                  </svg>
                </div>
                <div>
                  <p class="detail-label">Alamat</p>
                  <p class="detail-value">{{ event.address }}</p>
                </div>
              </div>
            </div>
          </section>

          <section class="event-tags">
            <h3>Tags</h3>
            <div class="tags-container">
              <span v-for="tag in event.tags" :key="tag" :class="getTagClass(tag)" class="tag">
                {{ tag }}
              </span>
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

      <!-- Events Sidebar -->
      <EventsSidebar 
        :informasiTambahan="event.informasiTambahan"
        :tags="popularEventTags"
        :relatedEvents="relatedEvents"
      />
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

const popularEventTags: PopularTag[] = [
  { name: '#Workshop', class: 'tag-blue' },
  { name: '#FNAF', class: 'tag-dark' },
  { name: '#FNAJ', class: 'tag-purple' },
  { name: '#Bocor', class: 'tag-orange' },
  { name: '#Horror', class: 'tag-red' }
];

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
  color: #0f172a;
  margin-bottom: 8px;
}

.event-title {
  font-size: 32px;
  font-weight: 800;
  color: #0f172a;
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
  color: #0f172a;
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
  font-size: 13px;
  margin-bottom: 4px;
}

.detail-value {
  color: #6b7280;
  font-size: 14px;
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
}

.tag-workshop { background: #eff6ff; color: #1d4ed8; }
.tag-literasi { background: #f0fdf4; color: #166534; }
.tag-creative { background: #fdf4ff; color: #a21caf; }
.tag-menulis { background: #fffbeb; color: #d97706; }
.tag-inspirasi { background: #fef2f2; color: #dc2626; }
.tag-default { background: #f1f5f9; color: #475569; }

.event-actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

.register-btn,
.share-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.register-btn {
  background: #fbbf24;
  color: #0f172a;
  flex: 1;
}

.register-btn:hover {
  background: #f59e0b;
  transform: translateY(-2px);
}

.share-btn {
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
}

.share-btn:hover {
  background: #e2e8f0;
}

.register-btn svg,
.share-btn svg {
  width: 18px;
  height: 18px;
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
  
  .event-actions {
    flex-direction: column;
  }
}
</style>