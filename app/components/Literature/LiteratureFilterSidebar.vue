<template>
  <div class="filter-sidebar">
    <h3 class="filter-title">Search Filter - Literature</h3>
    
    <div class="filter-group">
      <label class="filter-label">Copy Type</label>
      <div class="filter-options">
        <label 
          v-for="option in copyTypeOptions" 
          :key="option.value"
          class="filter-option"
        >
          <input 
            type="radio" 
            name="copyType" 
            :value="option.value"
            :checked="filters.copyType === option.value"
            @change="updateFilter('copyType', option.value)"
          />
          <span>{{ option.label }}</span>
        </label>
      </div>
    </div>

    <div class="filter-group">
      <label class="filter-label">Licensing Type</label>
      <div class="filter-options">
        <label 
          v-for="option in licensingTypeOptions" 
          :key="option.value"
          class="filter-option"
        >
          <input 
            type="radio" 
            name="licensingType" 
            :value="option.value"
            :checked="filters.licensingType === option.value"
            @change="updateFilter('licensingType', option.value)"
          />
          <span>{{ option.label }}</span>
        </label>
      </div>
    </div>

    <div class="filter-group">
      <label class="filter-label">Sources</label>
      <select 
        class="filter-select"
        :value="filters.sources"
        @change="updateFilter('sources', ($event.target as HTMLSelectElement).value)"
      >
        <option value="">Select Sources</option>
        <option 
          v-for="source in sourceOptions" 
          :key="source"
          :value="source"
        >
          {{ source }}
        </option>
      </select>
    </div>

    <div class="filter-group">
      <label class="filter-label">Related Tags</label>
      <select 
        class="filter-select"
        multiple
        :value="filters.tags"
        @change="handleTagChange($event)"
      >
        <option value="">Select Tags</option>
        <option 
          v-for="tag in tagOptions" 
          :key="tag"
          :value="tag"
        >
          {{ tag }}
        </option>
      </select>
      <div class="selected-tags" v-if="filters.tags.length > 0">
        <span 
          v-for="tag in filters.tags" 
          :key="tag"
          class="tag-pill"
        >
          {{ tag }}
          <button 
            type="button"
            @click="removeTag(tag)"
            class="tag-remove"
            aria-label="Remove tag"
          >
            ×
          </button>
        </span>
      </div>
    </div>

    <div class="filter-actions">
      <button 
        type="button"
        class="clear-filters-btn"
        @click="clearAllFilters"
        :disabled="!hasActiveFilters"
      >
        Clear Filters
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();

interface Filters {
  copyType: string;
  licensingType: string;
  sources: string;
  tags: string[];
}

const copyTypeOptions = [
  { label: 'Onsite Exclusive', value: 'onsite' },
  { label: 'Physical', value: 'physical' },
  { label: 'Online', value: 'online' }
];

const licensingTypeOptions = [
  { label: 'Pay-to-own', value: 'pay-to-own' },
  { label: 'Rent', value: 'rent' },
  { label: 'Free', value: 'free' }
];

const sourceOptions = [
  'IEEE',
  'ACM',
  'Springer',
  'Elsevier',
  'Wiley',
  'Google Books',
  'Project Gutenberg'
];

const tagOptions = [
  'PHP',
  'Vue',
  'JavaScript',
  'Python',
  'React',
  'Node.js',
  'Web Development',
  'Programming',
  'Software Engineering'
];

const filters = ref<Filters>({
  copyType: (route.query.copyType as string) || '',
  licensingType: (route.query.licensingType as string) || '',
  sources: (route.query.sources as string) || '',
  tags: Array.isArray(route.query.tags) 
    ? route.query.tags as string[]
    : route.query.tags 
      ? [route.query.tags as string]
      : []
});

const updateFilter = (key: keyof Filters, value: string) => {
  filters.value[key] = value as any;
  updateQueryParams();
};

const handleTagChange = (event: Event) => {
  const select = event.target as HTMLSelectElement;
  const selectedTags = Array.from(select.selectedOptions)
    .map(option => option.value)
    .filter(value => value !== '');
  
  filters.value.tags = selectedTags;
  updateQueryParams();
};

const removeTag = (tag: string) => {
  filters.value.tags = filters.value.tags.filter(t => t !== tag);
  updateQueryParams();
};

const hasActiveFilters = computed(() => {
  return filters.value.copyType || 
         filters.value.licensingType || 
         filters.value.sources || 
         filters.value.tags.length > 0;
});

const clearAllFilters = () => {
  filters.value = {
    copyType: '',
    licensingType: '',
    sources: '',
    tags: []
  };
  
  const query: Record<string, string | string[]> = {};
  
  // Copy only non-filter query params (like search query 'q')
  Object.keys(route.query).forEach(key => {
    if (key !== 'copyType' && key !== 'licensingType' && key !== 'sources' && key !== 'tags') {
      const value = route.query[key];
      if (value !== null && value !== undefined) {
        if (Array.isArray(value)) {
          query[key] = value.filter(v => v !== null) as string[];
        } else {
          query[key] = value as string;
        }
      }
    }
  });
  
  router.push({ query });
};

const updateQueryParams = () => {
  const query: Record<string, string | string[]> = {};
  
  // Copy existing non-filter query params (like search query 'q')
  Object.keys(route.query).forEach(key => {
    if (key !== 'copyType' && key !== 'licensingType' && key !== 'sources' && key !== 'tags') {
      const value = route.query[key];
      if (value !== null && value !== undefined) {
        if (Array.isArray(value)) {
          query[key] = value.filter(v => v !== null) as string[];
        } else {
          query[key] = value as string;
        }
      }
    }
  });
  
  // Add filter params if they have values
  if (filters.value.copyType) {
    query.copyType = filters.value.copyType;
  }
  
  if (filters.value.licensingType) {
    query.licensingType = filters.value.licensingType;
  }
  
  if (filters.value.sources) {
    query.sources = filters.value.sources;
  }
  
  if (filters.value.tags.length > 0) {
    query.tags = filters.value.tags;
  }
  
  router.push({ query });
};

watch(() => route.query, (newQuery) => {
  filters.value = {
    copyType: (newQuery.copyType as string) || '',
    licensingType: (newQuery.licensingType as string) || '',
    sources: (newQuery.sources as string) || '',
    tags: Array.isArray(newQuery.tags) 
      ? newQuery.tags as string[]
      : newQuery.tags 
        ? [newQuery.tags as string]
        : []
  };
}, { deep: true });
</script>

<style scoped>
.filter-sidebar {
  background: #ffffff;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid #e2e8f0;
}

.filter-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-black);
  margin: 0 0 20px 0;
}

.filter-group {
  margin-bottom: 24px;
}

.filter-group:last-child {
  margin-bottom: 0;
}

.filter-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-black);
  margin-bottom: 12px;
}

.filter-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-option {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #475569;
}

.filter-option input[type="radio"] {
  cursor: pointer;
}

.filter-option:hover {
  color: var(--color-primary);
}

.filter-select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  color: var(--color-black);
  background: #ffffff;
  cursor: pointer;
}

.filter-select:focus {
  outline: none;
  border-color: var(--color-primary);
}

.filter-select[multiple] {
  min-height: 100px;
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.tag-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  background-color: var(--color-primary);
  color: var(--color-white);
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
}

.tag-remove {
  background: none;
  border: none;
  color: var(--color-white);
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  padding: 0;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.tag-remove:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.filter-actions {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
}

.clear-filters-btn {
  width: 100%;
  padding: 12px 20px;
  background-color: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.clear-filters-btn:hover:not(:disabled) {
  background-color: #e2e8f0;
  color: var(--color-black);
}

.clear-filters-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>

