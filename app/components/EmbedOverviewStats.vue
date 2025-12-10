<template>
  <div class="embed-overview-stats">
    <h3 class="sidebar-title">Overview</h3>

    <div class="stats-list">
      <div class="stat-item">
        <span class="stat-label">Total Embeds</span>
        <span class="stat-value">{{ stats.totalEmbeds }}</span>
      </div>

      <div class="stat-item">
        <span class="stat-label">Active Embeds</span>
        <span class="stat-value">{{ stats.activeEmbeds }}</span>
      </div>

      <div class="stat-item">
        <span class="stat-label">Views (30d)</span>
        <div class="stat-value-with-trend">
          <span class="stat-value">{{ formatNumber(stats.views30d) }}</span>
          <div class="trend-indicator" :class="getTrendClass(stats.viewsTrend)">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline v-if="stats.viewsTrend >= 0" points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
              <polyline v-else points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
            </svg>
            <span>{{ Math.abs(stats.viewsTrend) }}%</span>
          </div>
        </div>
      </div>

      <div class="stat-item">
        <span class="stat-label">Clicks (30d)</span>
        <div class="stat-value-with-trend">
          <span class="stat-value">{{ formatNumber(stats.clicks30d) }}</span>
          <div class="trend-indicator" :class="getTrendClass(stats.clicksTrend)">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline v-if="stats.clicksTrend >= 0" points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
              <polyline v-else points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
            </svg>
            <span>{{ Math.abs(stats.clicksTrend) }}%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  stats: {
    totalEmbeds: number;
    activeEmbeds: number;
    views30d: number;
    clicks30d: number;
    viewsTrend: number;
    clicksTrend: number;
  }
}>();

const formatNumber = (num: number) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

const getTrendClass = (trend: number) => {
  return {
    'trend-positive': trend >= 0,
    'trend-negative': trend < 0
  };
};

const clickRate = computed(() => {
  if (props.stats.views30d === 0) return '0.0';
  return ((props.stats.clicks30d / props.stats.views30d) * 100).toFixed(1);
});

const avgViewsPerEmbed = computed(() => {
  if (props.stats.activeEmbeds === 0) return '0';
  return Math.round(props.stats.views30d / props.stats.activeEmbeds);
});
</script>

<style scoped>
.embed-overview-stats {
  width: 100%;
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  border: 1px solid #e2e8f0;
}

.sidebar-title {
  font-weight: 400;
  font-size: 18px;
  margin-bottom: 20px;
  color: var(--color-primary);
}

.stats-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f1f5f9;
}

.stat-item:last-child {
  border-bottom: none;
}

.stat-label {
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
}

.stat-value {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-primary);
  line-height: 1;
}

.stat-value-with-trend {
  display: flex;
  align-items: center;
  gap: 8px;
}

.trend-indicator {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 12px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 12px;
}

.trend-positive {
  color: #059669;
  background-color: #ecfdf5;
}

.trend-negative {
  color: #dc2626;
  background-color: #fef2f2;
}

@media (max-width: 768px) {
  .embed-overview-stats {
    padding: 16px;
  }

  .stat-item {
    padding: 10px 0;
  }

  .stat-value {
    font-size: 16px;
  }
}
</style>