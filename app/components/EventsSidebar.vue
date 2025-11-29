<template>
  <aside class="events-detail-sidebar">
    <section class="sidebar-card info-card">
      <h3>Informasi Tambahan</h3>
      <ul class="info-list">
        <li v-for="item in informasiTambahan" :key="item.label">
          <span class="info-icon">{{ item.icon }}</span>
          <div>
            <p class="info-label">{{ item.label }}</p>
            <p class="info-value">{{ item.value }}</p>
          </div>
        </li>
      </ul>
    </section>

    <section class="sidebar-card tags-card">
      <h3>Tags</h3>
      <div class="tags-container">
        <span v-for="tag in tags" :key="tag.name" :class="tag.class" class="tag">
          {{ tag.name }}
        </span>
      </div>
    </section>

    <section class="sidebar-card related-card">
      <h3>Related Events</h3>
      <div class="related-events">
        <div v-for="event in relatedEvents" :key="event.title" class="related-event">
          <div class="event-indicator" :class="`indicator-${event.color}`"></div>
          <div class="event-details">
            <p class="event-title">{{ event.title }}</p>
            <p class="event-type">{{ event.type }}</p>
            <p class="event-date">{{ event.date }}</p>
          </div>
        </div>
      </div>
      
      <div class="more-events">
        <button class="more-events-btn">More Events</button>
      </div>
    </section>
  </aside>
</template>

<script setup lang="ts">
interface InfoItem {
  icon: string;
  label: string;
  value: string;
}

interface Tag {
  name: string;
  class: string;
}

interface RelatedEvent {
  title: string;
  type: string;
  date: string;
  color: string;
}

defineProps<{
  informasiTambahan: InfoItem[];
  tags: Tag[];
  relatedEvents: RelatedEvent[];
}>();
</script>

<style scoped>
.events-detail-sidebar {
  width: clamp(240px, 24vw, 320px);
  flex: 0 0 clamp(240px, 24vw, 320px);
  position: sticky;
  top: 32px;
  align-self: flex-start;
  max-height: calc(100vh - 160px);
  overflow-y: auto;
  padding-right: 4px;
  scrollbar-width: thin;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.events-detail-sidebar::-webkit-scrollbar {
  width: 4px;
}

.events-detail-sidebar::-webkit-scrollbar-thumb {
  background-color: rgba(148, 163, 184, 0.35);
  border-radius: 999px;
}

.sidebar-card {
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.05);
}

.sidebar-card h3 {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
}

.info-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-list li {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  color: #475569;
}

.info-icon {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  background: #f1f5f9;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.info-label {
  font-weight: 600;
  color: #0f172a;
  font-size: 14px;
  margin-bottom: 4px;
}

.info-value {
  font-size: 14px;
  color: #475569;
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

.tag-blue { background: #dbeafe; color: #1d4ed8; }
.tag-dark { background: #1e293b; color: #ffffff; }
.tag-purple { background: #ede9fe; color: #7c3aed; }
.tag-orange { background: #fed7aa; color: #ea580c; }
.tag-red { background: #fecaca; color: #dc2626; }

.tag:hover {
  transform: translateY(-1px);
}

.related-events {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.related-event {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.event-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-top: 4px;
  flex-shrink: 0;
}

.indicator-green {
  background: #10b981;
}

.event-details {
  flex: 1;
}

.event-title {
  font-weight: 600;
  color: #0f172a;
  font-size: 14px;
  margin-bottom: 4px;
}

.event-type {
  color: #64748b;
  font-size: 13px;
  margin-bottom: 2px;
}

.event-date {
  color: #64748b;
  font-size: 13px;
}

.more-events {
  margin-top: 12px;
}

.more-events-btn {
  width: 100%;
  background: #fbbf24;
  color: #0f172a;
  padding: 10px 16px;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.more-events-btn:hover {
  background: #f59e0b;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .events-detail-sidebar {
    width: 100%;
    position: static;
    max-height: none;
    overflow: visible;
    padding-right: 0;
    flex: 1 1 auto;
  }
}
</style>