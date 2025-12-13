<template>
  <aside class="events-detail-sidebar">
    <section v-if="informasiTambahan.length" class="sidebar-card info-card">
      <div class="card-header">
        <h3>Informasi Event</h3>
      </div>
      <ul class="info-list">
        <li v-for="item in informasiTambahan" :key="`info-${item.label}`" class="info-item">
          <div class="info-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" v-html="getIconSymbol(item.icon)"></svg>
          </div>
          <div class="info-content">
            <p class="info-label">{{ item.label }}</p>
            <p class="info-value">{{ item.value }}</p>
          </div>
        </li>
      </ul>
    </section>

    <section v-if="relatedEvents.length" class="sidebar-card related-card">
      <div class="card-header">
        <h3>Event Terkait</h3>
      </div>
      <ul class="related-list">
        <li v-for="event in relatedEvents" :key="event.title" class="related-item">
          <div class="related-indicator" :style="{ background: event.color }"></div>
          <div class="related-content">
            <p class="related-title">{{ event.title }}</p>
            <p class="related-meta">{{ event.type }} • {{ event.date }}</p>
          </div>
        </li>
      </ul>
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

// Optimized icon map using Object.freeze for performance
const iconMap = Object.freeze({
  'CAT': 'path d="M4 6h16v2H4V6zm0 4h16v2H4v-2zm0 4h12v2H4v-2z" fill="currentColor"',
  'LOC': 'path d="M12 2c-3.87 0-7 3.13-7 7 0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"',
  'TIME': 'path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4 6l-4 2.5L8 8 7 9.5l5 5 5-5L16 8z" fill="currentColor"',
  'CAP': 'path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 7v2h16V7H4z" fill="currentColor"',
  'CP': 'path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="currentColor"'
} as const);

// Memoized icon symbol getter
const getIconSymbol = (icon: string): string => {
  return `<${iconMap[icon as keyof typeof iconMap] || iconMap.CAT}>`;
};
</script>

<style scoped>
.events-detail-sidebar {
  position: sticky;
  top: 80px;
  margin-top: 20px;
  width: 320px;
  padding-left: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.sidebar-card {
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 18px 36px rgba(15, 23, 42, 0.08);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-header h3 {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.info-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.info-icon {
  width: 40px;
  height: 40px;
  border-radius: 14px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #334155;
  flex-shrink: 0;
}

.info-content {
  flex: 1;
  min-width: 0;
}

.info-label {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin: 0 0 4px;
}

.info-value {
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.sidebar-tag {
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  background: rgba(59, 83, 121, 0.12);
  color: #1d3557;
  border: 1px solid rgba(59, 83, 121, 0.2);
}

.sidebar-tag.tag-default {
  background: #1d4ed8;
  border-color: transparent;
  color: #ffffff;
}

.related-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.related-item {
  display: flex;
  gap: 12px;
  align-items: center;
}

.related-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.related-content {
  flex: 1;
}

.related-title {
  font-size: 15px;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 4px;
}

.related-meta {
  font-size: 12px;
  color: #64748b;
  margin: 0;
}

@media (max-width: 1024px) {
  .events-detail-sidebar {
    position: static;
    width: 100%;
    padding-left: 0;
    margin-top: 0;
  }
}

@media (max-width: 768px) {
  .sidebar-card {
    padding: 18px;
  }
}
</style>