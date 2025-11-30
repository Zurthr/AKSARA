<template>
  <section class="events-page">
    <div class="events-content">
      <div class="events-main">
        <header class="events-header">
          <h1>Events</h1>
          <p>Bergabunglah dalam acara tentang pendidikan, perpustakaan, dan komunitas. Mulai diskusi baru atau ikuti yang sudah ada.</p>
        </header>

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
        
        <div class="load-more">
          <button class="load-more-btn">Load More Events</button>
        </div>
      </div>
      
      <aside class="events-sidebar">
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
      </aside>
    </div>
  </section>
</template>

<script setup lang="ts">
import eventsData from '~/data/events.json';

const events = eventsData;

const popularTags = [
  { name: 'Harry Potter', class: 'tag-primary' },
  { name: 'College', class: 'tag-secondary' },
  { name: '#Book', class: 'tag-dark' },
  { name: 'Literasi', class: 'tag-info' },
  { name: 'LMS', class: 'tag-warning' },
  { name: '#Sejarah', class: 'tag-success' },
  { name: 'Website', class: 'tag-danger' },
  { name: 'Course', class: 'tag-light' },
  { name: '#API', class: 'tag-purple' }
];
</script>

<style scoped>
.events-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
}

.events-content {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.events-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.events-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: var(--color-black);
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
}

.event-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.12);
}

.event-image {
  position: relative;
  width: 300px;
  min-height: 200px;
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
  color: var(--color-black);
  margin-bottom: 8px;
}

.event-description {
  color: #475569;
  line-height: 1.6;
  margin-bottom: 16px;
  flex: 1;
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
  color: var(--color-black);
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

.events-sidebar {
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: sticky;
  top: 24px;
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
  color: var(--color-black);
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

.tag-primary { background: #dbeafe; color: #1d4ed8; }
.tag-secondary { background: #f1f5f9; color: #475569; }
.tag-dark { background: #1e293b; color: #ffffff; }
.tag-info { background: #ecfeff; color: #0891b2; }
.tag-warning { background: #fef3c7; color: #d97706; }
.tag-success { background: #dcfce7; color: #16a34a; }
.tag-danger { background: #fecaca; color: #dc2626; }
.tag-light { background: #f8fafc; color: #64748b; }
.tag-purple { background: #ede9fe; color: #7c3aed; }

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
  background: var(--color-black);
  transform: translateY(-2px);
}

.initiate-btn svg {
  width: 20px;
  height: 20px;
}

@media (max-width: 1024px) {
  .events-content {
    flex-direction: column;
  }
  
  .events-sidebar {
    width: 100%;
    position: static;
  }
}

@media (max-width: 768px) {
  .event-card {
    flex-direction: column;
  }
  
  .event-image {
    width: 100%;
    min-height: 180px;
  }
  
  .events-header h1 {
    font-size: 24px;
  }
}
</style>