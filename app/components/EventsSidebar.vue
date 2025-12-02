<template>
  <aside class="events-detail-sidebar">
    <!-- Additional Information Card -->
    <section class="sidebar-card info-card">
      <div class="card-header">
        <h3>Informasi Event</h3>
      </div>
      <ul class="info-list">
        <li v-for="item in informasiTambahan" :key="`info-${item.label}`" class="info-item">
          <div class="info-icon">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" v-html="getIconSymbol(item.icon)">
            </svg>
          </div>
          <div class="info-content">
            <p class="info-label">{{ item.label }}</p>
            <p class="info-value">{{ item.value }}</p>
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
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.sidebar-card {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  will-change: transform; /* Optimize for animations */
  contain: layout style; /* CSS containment for better performance */
}

.card-header {
  padding: 16px 16px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.card-header h3 {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  letter-spacing: -0.025em;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  background: linear-gradient(135deg, #1a1a1a 0%, #374151 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.info-icon-accent {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: #f9fafb;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e5e7eb;
}

.events-count {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 11px;
  color: #475569;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  padding: 4px 10px;
  border-radius: 10px;
  font-weight: 600;
  letter-spacing: 0.3px;
  border: 1px solid rgba(71, 85, 105, 0.1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.info-list {
  list-style: none;
  padding: 0 16px 16px;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 6px 0;
  border-bottom: 1px solid #f3f4f6;
}

.info-item:last-child {
  border-bottom: none;
}

.info-icon {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  background: #f9fafb;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  flex-shrink: 0;
}

.info-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #4b5563;
  flex-shrink: 0;
}

.info-content {
  flex: 1;
  min-width: 0;
}

.info-label {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 600;
  color: #6366f1;
  font-size: 11px;
  margin: 0 0 4px 0;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.9;
  transition: all 0.2s ease;
}

.info-value {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 15px;
  color: #1e293b;
  margin: 0;
  line-height: 1.5;
  font-weight: 600;
  letter-spacing: -0.01em;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

@media (max-width: 768px) {
  .events-detail-sidebar {
    width: 100%;
    gap: 12px;
  }
  
  .card-header {
    padding: 12px 12px 0;
  }
  
  .info-list {
    padding: 0 12px 12px;
  }
  
  .related-events {
    padding: 0 12px;
  }
  
  .card-footer {
    padding: 0 12px 12px;
  }
}
</style>