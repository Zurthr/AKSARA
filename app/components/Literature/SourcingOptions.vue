<template>
  <div class="sourcing-options">
    <div v-if="!copyTypes || Object.keys(copyTypes).length === 0" class="empty-state">
      <p>No sourcing options available.</p>
    </div>
    
    <div v-else class="sources-grid">
      <a
        v-for="(source, index) in flattenedSources"
        :key="`${source.copyType}-${index}`"
        :href="source.url"
        target="_blank"
        rel="noopener noreferrer"
        class="source-card"
      >
        <div class="source-logo">
          <img 
            v-if="getSourceLogo(source.name)" 
            :src="getSourceLogo(source.name)" 
            :alt="source.name"
            class="logo-image"
          />
          <div v-else class="logo-placeholder">
            {{ getSourceInitials(source.name) }}
          </div>
        </div>
        
        <div class="source-info">
          <div class="source-label">
            <!-- Book icon for Digital/Public Preview -->
            <svg v-if="isDigitalType(source.copyType)" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="label-icon">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
            <!-- Graduation cap for Academic -->
            <svg v-else-if="isAcademicType(source.copyType)" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="label-icon">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
              <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
            </svg>
            <!-- Dollar sign for Physical/Paid -->
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="label-icon">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
            <span class="label-text">{{ getCopyTypeLabel(source.copyType, source.type) }}</span>
          </div>
          <div class="source-name">
            {{ source.name }}
            <span v-if="getOnPremiseTag(source.type)" class="onpremise-tag">
              {{ getOnPremiseTag(source.type) }}
            </span>
          </div>
        </div>
        
        <div class="source-arrow">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </div>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
interface CopyTypeSource {
  name: string;
  url: string;
  type?: string;
  shipping_available?: boolean;
  maps_url?: string;
  address?: string;
  phone?: string;
  real_time_inventory?: boolean;
}

interface CopyType {
  description: string;
  sources?: CopyTypeSource[];
}

const props = defineProps<{
  copyTypes?: Record<string, CopyType>;
}>();

interface FlattenedSource extends CopyTypeSource {
  copyType: string;
}

const flattenedSources = computed<FlattenedSource[]>(() => {
  if (!props.copyTypes) return [];
  
  const sources: FlattenedSource[] = [];
  
  Object.entries(props.copyTypes).forEach(([copyTypeName, copyType]) => {
    if (copyType.sources) {
      copyType.sources.forEach(source => {
        sources.push({
          ...source,
          copyType: copyTypeName
        });
      });
    }
  });
  
  return sources;
});

const getSourceLogo = (sourceName: string): string | undefined => {
  const name = sourceName.toLowerCase();
  
  // Map common source names to logo URLs or paths
  if (name.includes('google')) {
    return 'https://www.google.com/favicon.ico';
  }
  if (name.includes('ieee')) {
    return 'https://www.ieee.org/favicon.ico';
  }
  if (name.includes('kindle') || name.includes('amazon')) {
    return 'https://www.amazon.com/favicon.ico';
  }
  if (name.includes('mit press')) {
    return 'https://mitpress.mit.edu/favicon.ico';
  }
  if (name.includes('arxiv')) {
    return 'https://arxiv.org/favicon.ico';
  }
  
  return undefined;
};

const getSourceInitials = (sourceName: string): string => {
  const words = sourceName.split(' ').filter(Boolean);
  if (words.length >= 2) {
    const first = words[0]?.[0] || '';
    const second = words[1]?.[0] || '';
    return (first + second).toUpperCase();
  }
  return sourceName.substring(0, 2).toUpperCase();
};

const getCopyTypeLabel = (copyType: string, sourceType?: string): string => {
  const type = copyType.toLowerCase();
  
  if (type === 'digital') {
    if (sourceType === 'free' || sourceType === 'free_download') {
      return 'Public Preview';
    }
    if (sourceType === 'preview') {
      return 'Preview';
    }
    return 'Digital Copy';
  }
  if (type === 'academic') {
    return 'Academic Copy';
  }
  if (type === 'physical') {
    return 'Physical Copy';
  }
  
  return 'Available';
};

const isDigitalType = (copyType: string): boolean => {
  return copyType.toLowerCase() === 'digital';
};

const isAcademicType = (copyType: string): boolean => {
  return copyType.toLowerCase() === 'academic';
};

const getOnPremiseTag = (sourceType?: string): string | null => {
  if (!sourceType) return null;
  
  // On-premise Purchase (for onsite sales)
  if (sourceType === 'bookstore_chain' || sourceType === 'academic_bookstore') {
    return 'On-premise Purchase';
  }
  
  // On-premise Copy (for free readable physical copies)
  if (sourceType === 'university_library') {
    return 'On-premise Copy';
  }
  
  return null;
};
</script>

<style scoped>
.sourcing-options {
  width: 100%;
}

.empty-state {
  background: white;
  border-radius: 16px;
  padding: 48px 24px;
  text-align: center;
  color: var(--color-dark-gray);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.sources-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.source-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: 1px solid transparent;
}

.source-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-color: #e2e8f0;
}

.source-logo {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: #f8fafc;
  overflow: hidden;
}

.logo-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 8px;
}

.logo-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  color: var(--color-primary);
  background: var(--color-light-blue);
}

.source-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.source-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #3b82f6;
  font-weight: 600;
}

.label-icon {
  width: 16px;
  height: 16px;
  color: #3b82f6;
  flex-shrink: 0;
  display: inline-block;
}

.label-text {
  line-height: 1;
}

.source-name {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-black);
  line-height: 1.3;
}

.onpremise-tag {
  display: inline-block;
  margin-left: 8px;
  padding: 4px 8px;
  border-radius: 6px;
  background-color: #f0f9ff;
  color: #0369a1;
  font-size: 11px;
  font-weight: 600;
  line-height: 1;
}

.source-arrow {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  flex-shrink: 0;
  transition: color 0.2s, transform 0.2s;
}

.source-card:hover .source-arrow {
  color: var(--color-primary);
  transform: translateX(2px);
}
</style>

