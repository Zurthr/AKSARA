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
          <div class="source-label" :class="getLabelClass(source.copyType, source.type)">
            <img v-if="isDigitalFreeType(source.copyType, source.type)" src="~/assets/icons/SourceBook.svg" class="label-icon">
            <img v-else-if="isAcademicType(source.copyType)" src="~/assets/icons/SourceAcademic.svg" class="label-icon">
            <img v-else src="~/assets/icons/SourcePaid.svg" class="label-icon">
            <span class="label-text">{{ getCopyTypeLabel(source.copyType, source.type) }}</span>
          </div>
          <div class="source-name">
            {{ source.name }}
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

const getSourcePriority = (copyType: string, sourceType?: string): number => {
  const type = copyType.toLowerCase();
  
  // 1. Readables/Previews (Digital with free/free_download/preview)
  if (type === 'digital' && (sourceType === 'free' || sourceType === 'free_download' || sourceType === 'preview')) {
    return 1;
  }
  
  // 2. Academic Copies
  if (type === 'academic') {
    return 2;
  }
  
  // 3. Digital Copies (other digital types)
  if (type === 'digital') {
    return 3;
  }
  
  // 4. Physical Copies
  if (type === 'physical') {
    return 4;
  }
  
  // Default for unknown types
  return 99;
};

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
  
  // Sort by priority: Readables/Previews, Academic, Digital, Physical
  return sources.sort((a, b) => {
    const priorityA = getSourcePriority(a.copyType, a.type);
    const priorityB = getSourcePriority(b.copyType, b.type);
    return priorityA - priorityB;
  });
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
    // On-Premise Sale for bookstore_chain and academic_bookstore
    if (sourceType === 'bookstore_chain' || sourceType === 'academic_bookstore') {
      return 'On-Premise Sale';
    }
    // On-Premise Copy for university_library
    if (sourceType === 'university_library') {
      return 'On-Premise Copy';
    }
    return 'Physical Copy';
  }
  
  return 'Available';
};

const isDigitalType = (copyType: string): boolean => {
  return copyType.toLowerCase() === 'digital';
};

const isDigitalFreeType = (copyType: string, sourceType?: string): boolean => {
  const type = copyType.toLowerCase();
  return type === 'digital' && (sourceType === 'free' || sourceType === 'free_download' || sourceType === 'preview');
};

const isAcademicType = (copyType: string): boolean => {
  return copyType.toLowerCase() === 'academic';
};

const getLabelClass = (copyType: string, sourceType?: string): string => {
  const type = copyType.toLowerCase();
  
  // Public Preview (Digital with free/free_download/preview) gets light blue
  if (type === 'digital' && (sourceType === 'free' || sourceType === 'free_download' || sourceType === 'preview')) {
    return 'label-preview';
  }
  
  // All other types get black
  return 'label-default';
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
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
}

.label-preview {
  color: #3b82f6;
}

.label-preview .label-icon {
  color: #3b82f6;
}

.label-default {
  color: var(--color-black);
}

.label-default .label-icon {
  color: var(--color-black);
}

.label-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  display: inline-block;
}

.label-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
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

