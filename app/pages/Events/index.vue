<template>
  <section class="events-page">
    <div class="events-main">
      <header class="events-header">
        <h1>Events</h1>
        <p>Bergabunglah dalam acara tentang pendidikan, perpustakaan, dan komunitas. Mulai diskusi baru atau ikuti yang sudah ada.</p>
      </header>

      <div class="events-body">
        <div class="events-grid">
          <NuxtLink
            v-for="event in events"
            :key="event.id"
            :to="`/events/${event.id}`"
            class="event-card"
          >
            <div class="event-image">
              <img :src="event.image" :alt="event.title" />
              <div class="event-overlay">
                <h3>{{ event.title }}</h3>
              </div>
            </div>

            <div class="event-content">
              <div class="event-meta">
                <h4>{{ event.subtitle }}</h4>
                <p class="event-description">{{ event.description }}</p>

                <div class="event-details">
                  <div class="event-location">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" fill="currentColor"/>
                    </svg>
                    {{ event.location }}
                  </div>

                  <div class="event-date">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" fill="currentColor"/>
                    </svg>
                    {{ event.date }}
                  </div>
                </div>
              </div>

              <button class="event-detail-btn">Event Detail</button>
            </div>
          </NuxtLink>
        </div>

        <div class="events-insights" aria-label="Event highlights">
          <section class="sidebar-card">
            <h3>Most Popular Tags</h3>
            <div class="tags-grid">
              <span v-for="tag in popularTags" :key="tag.name" class="tag" :class="tag.class">{{ tag.name }}</span>
            </div>
          </section>

          <section class="sidebar-card">
            <NuxtLink to="/events/create" class="initiate-btn">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor"/>
              </svg>
              Initiate a Event
            </NuxtLink>
          </section>
        </div>
      </div>

      <div class="load-more">
        <button class="load-more-btn">Load More Events</button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const events = [
  {
    id: 'creative-writing-workshop',
    title: 'Creative Writing Workshop',
    subtitle: 'A BIG WRITING WORKSHOP',
    description: 'Bigger, bolder, and more inspiring than ever. Step into a world of stories, creativity, and imagination with hands-on sessions, live readings, and workshops waiting to be written!',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80',
    location: 'Zoom (Online Feeding)',
    date: '29 Desember, 2025',
    category: 'Workshop',
    tags: ['#Workshop', '#Literasi', '#CreativeWriting', '#Menulis', '#Inspirasi']
  },
  {
    id: 'book-knowledge-sharing',
    title: 'Book Events',
    subtitle: 'MANY BOOK MANY KNOWLEDGE',
    description: 'Come together for an evening of reading insights. Share the joy of waiting to be shared. Join us for a heartwarming reading experience where words connect people, ideas spark conversations, and every voice matters.',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80',
    location: 'Tahura, Bandung',
    date: '12 Desember, 2025',
    category: 'Reading',
    tags: ['#Book', '#Knowledge', '#Reading']
  },
  {
    id: 'book-festival-2025',
    title: 'Book Festivals 2025',
    subtitle: 'BOOK FESTIVAL 2025',
    description: 'Step into a world of words and wonder as stories come alive, ideas take flight, and imagination knows no bounds. In celebrating writers, and creators in celebrating the magic of books through talks, workshops, and performances.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    location: 'Dispuspida Jabar',
    date: '22 November, 2025',
    category: 'Festival',
    tags: ['#Festival', '#Book', '#Literature']
  },
  {
    id: 'litverse-2025',
    title: 'LitVerse 2025',
    subtitle: 'LitVerse 2025: Festival Literasi dan Imajinasi',
    description: 'A celebration of reading, writing, and creativity where readers, writers, and communities come together to explore new worlds and find inspiration!',
    image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80',
    location: 'Bandung Convention Center',
    date: '29 Desember, 2025',
    category: 'Festival',
    tags: ['#LitVerse', '#Festival', '#Imajinasi']
  }
];

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
  display: grid;
  grid-template-columns: minmax(0, 1fr) clamp(240px, 28vw, 300px);
  gap: 24px;
  align-items: start;
}

.events-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: #0f172a;
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
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(37, 99, 235, 0.9));
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
  color: #0f172a;
  margin-bottom: 8px;
}

.event-description {
  color: #475569;
  line-height: 1.6;
  margin-bottom: 16px;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
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

.event-location svg,
.event-date svg {
  width: 16px;
  height: 16px;
}

.event-detail-btn {
  background: #fbbf24;
  color: #0f172a;
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
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: sticky;
  top: 84px;
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
  color: #0f172a;
  margin-bottom: 16px;
}

.tags-grid {
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
  background: #0f172a;
  transform: translateY(-2px);
}

.initiate-btn svg {
  width: 20px;
  height: 20px;
}

@media (max-width: 1024px) {
  .events-body {
    grid-template-columns: minmax(0, 1fr) clamp(260px, 40vw, 320px);
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .events-body {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .events-insights {
    position: static;
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
</style>