<template>
  <div class="embed-card">
    <div class="card-main">
      <div class="card-left">
        <div class="thumbnail-container">
          <div class="thumbnail-placeholder">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            <span>Embed</span>
          </div>
        </div>
      </div>

      <div class="card-content">
        <div class="embed-info">
          <div class="title-row">
            <h3 class="embed-title">{{ embed.name }}</h3>
            <div class="status-badge active">
              Active
            </div>
          </div>
          <div class="category-row">
            <span class="category-tag">{{ embed.type === 'RESOURCE_LIST' ? 'Books & Resources' : 'Events & Workshops' }}</span>
          </div>
          <p class="embed-description">
            {{ getTypeDescription(embed.type) }} • {{ embed.limit || 5 }} items • {{ embed.theme || 'light' }} theme
            <span v-if="embed.filterTags && embed.filterTags.length > 0"> • {{ embed.filterTags.join(', ') }}</span>
          </p>
        </div>

        <div class="stats-and-actions">
          <div class="stats-row">
            <div class="stat-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                <polyline points="10 17 15 12 10 7"></polyline>
                <line x1="15" y1="12" x2="3" y2="12"></line>
              </svg>
              <span class="stat-value">{{ embed.limit || 5 }}</span>
              <span class="stat-label">items</span>
            </div>
            <div class="stat-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <span class="stat-value">{{ embed.sortBy || 'rating' }}</span>
              <span class="stat-label">sort</span>
            </div>
            <div class="stat-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span class="stat-value">{{ formatDate(embed.createdAt) }}</span>
              <span class="stat-label">created</span>
            </div>
          </div>

          <div class="action-buttons">
            <button
              class="btn-action btn-primary"
              @click="$emit('get-link', embed)"
              title="Copy embed link"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
              <span>Get Link</span>
            </button>

            <button
              class="btn-action btn-delete"
              @click="$emit('delete', embed.id)"
              title="Delete embed"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  embed: {
    id: string;
    name: string;
    type: "RESOURCE_LIST" | "EVENT_LIST";
    filterTags?: string[];
    limit?: number;
    sortBy?: string;
    theme?: string;
    showThumbnail?: boolean;
    allowedDomains?: string[];
    createdAt: string;
    updatedAt?: string;
    creator?: {
      id: string;
      name: string;
    };
    embedUrl: string;
  }
}>();

const emit = defineEmits<{
  delete: [embedId: string];
  'get-link': [embed: typeof props.embed];
}>();

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return date.toLocaleDateString();
};

const formatNumber = (num: number) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

const getTypeDescription = (type: string) => {
  return type === 'RESOURCE_LIST' ? 'Books & Resources' : 'Events & Workshops';
};

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.style.display = 'none';
};
</script>

<style scoped>
.embed-card {
  background: white;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
  border: 1px solid #e2e8f0;
  transition: transform 0.2s, box-shadow 0.2s;
}

.embed-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  border-color: #cbd5e1;
}

.card-main {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.card-left {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.thumbnail-container {
  flex-shrink: 0;
}

.thumbnail {
  width: 80px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid #e2e8f0;
}

.thumbnail-placeholder {
  width: 80px;
  height: 60px;
  border-radius: 8px;
  border: 2px dashed #cbd5e1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  background-color: #f8fafc;
  color: #64748b;
}

.thumbnail-placeholder svg {
  width: 20px;
  height: 20px;
}

.thumbnail-placeholder span {
  font-size: 10px;
  font-weight: 600;
}

.stats-and-actions {
  border-top: 1px solid #f1f5f9;
  padding-top: 12px;
}

.stats-row {
  display: flex;
  gap: 16px;
  padding: 8px 0;
}

.action-buttons {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-top: 8px;
}

.embed-info {
  flex: 1;
  min-width: 0;
}

.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 12px;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.embed-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-black);
  margin: 0;
  line-height: 1.4;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  flex-shrink: 0;
}

.status-badge.active {
  background-color: #dcfce7;
  color: #166534;
}

.status-badge.draft {
  background-color: #fef3c7;
  color: #92400e;
}

.category-row {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  margin-top: 4px;
}

.category-tag {
  background-color: #FFDA49;
  color: #1a1a1a;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.embed-description {
  font-size: 14px;
  color: #475569;
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}



.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #64748b;
}

.stat-item svg {
  width: 16px;
  height: 16px;
}

.stat-value {
  font-weight: 600;
  color: var(--color-black);
}

.stat-label {
  font-size: 12px;
  color: #64748b;
}


.btn-action {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  background-color: #f8fafc;
  color: #64748b;
}

.btn-action:hover {
  transform: translateY(-1px);
}

.btn-primary {
  background-color: var(--color-primary);
  color: white;
  border: 1px solid var(--color-primary);
}

.btn-primary:hover {
  background-color: #2c3542;
  border-color: #2c3542;
}

.btn-link:hover {
  background-color: #eff6ff;
  color: #1e40af;
}

.btn-duplicate:hover {
  background-color: #f0fdf4;
  color: #166534;
}

.btn-edit:hover {
  background-color: #fef3c7;
  color: #92400e;
}

.btn-delete:hover {
  background-color: #fef2f2;
  color: #dc2626;
}

@media (max-width: 768px) {
  .card-main {
    flex-direction: column;
    gap: 12px;
  }

  .card-left {
    align-self: flex-start;
  }

  .stats-row {
    gap: 12px;
    flex-wrap: wrap;
  }

  .stat-item {
    flex: 1;
    min-width: 0;
  }

  .action-buttons {
    flex-wrap: wrap;
    gap: 6px;
  }

  .btn-action span {
    display: none;
  }

  .btn-action {
    padding: 8px;
  }
}
</style>
