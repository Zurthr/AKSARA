<template>
  <div class="filter-sidebar">
    <h3 class="filter-title">Search Filter - Literature</h3>
    
    <div class="filter-group">
      <label class="filter-label">Copy Type</label>
      <div class="filter-options">
        <label 
          v-for="option in copyTypeOptions" 
          :key="option.value"
          class="filter-option-checkbox"
          :class="{ 'filter-option-checkbox--active': filters.copyType.includes(option.value) }"
        >
          <input 
            type="checkbox" 
            :value="option.value"
            :checked="filters.copyType.includes(option.value)"
            @change="handleCopyTypeChange(option.value, ($event.target as HTMLInputElement).checked)"
            class="filter-option-checkbox-input"
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
          class="filter-option-checkbox"
          :class="{ 'filter-option-checkbox--active': filters.licensingType.includes(option.value) }"
        >
          <input 
            type="checkbox" 
            :value="option.value"
            :checked="filters.licensingType.includes(option.value)"
            @change="handleLicensingTypeChange(option.value, ($event.target as HTMLInputElement).checked)"
            class="filter-option-checkbox-input"
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
      <div class="tag-input-container">
        <input
          type="text"
          v-model="tagInput"
          @keydown.enter.prevent="addTag"
          @keydown.escape="tagInput = ''"
          class="tag-input"
          placeholder="Type a tag and press Enter"
          autocomplete="off"
        />
        <div class="tag-suggestions" v-if="tagSuggestions.length > 0 && tagInput">
          <button
            v-for="suggestion in tagSuggestions"
            :key="suggestion"
            type="button"
            class="tag-suggestion"
            @click="addTagFromSuggestion(suggestion)"
          >
            {{ suggestion }}
          </button>
        </div>
      </div>
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

import { useLiterature } from '~/composables/useLiterature';
import type { LiteratureBook } from '~/composables/useLiterature';

interface Filters {
  copyType: string[];
  licensingType: string[];
  sources: string;
  tags: string[];
}

const normalizeKey = (value: string | undefined | null) => {
  return (value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-');
};

const toTitleCaseFromKey = (value: string) => {
  return value
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

const { getAllBooks } = useLiterature();
const rawBooks = ref<LiteratureBook[]>([]);

const unique = <T>(items: T[]) => Array.from(new Set(items));

const copyTypeOptions = computed(() => {
  const keys: string[] = [];

  rawBooks.value.forEach((book) => {
    if (book.copy_types) {
      keys.push(...Object.keys(book.copy_types));
    }
  });

  const normalized = unique(
    keys.map((key) => normalizeKey(key)).filter(Boolean)
  );

  return normalized.map((value) => ({
    value,
    label: toTitleCaseFromKey(value)
  }));
});

const licensingTypeOptions = computed(() => {
  const rawValues: string[] = [];

  rawBooks.value.forEach((book) => {
    if (book.licensing_type) {
      rawValues.push(book.licensing_type);
    }
  });

  const uniqueRaw = unique(rawValues);

  return uniqueRaw.map((raw) => ({
    value: normalizeKey(raw),
    label: raw
  }));
});

const sourceOptions = computed(() => {
  const names: string[] = [];

  rawBooks.value.forEach((book) => {
    if (book.sources) {
      names.push(...book.sources.map((source) => source.name));
    }

    if (book.copy_types) {
      Object.values(book.copy_types).forEach((copyTypeEntry) => {
        const entry = copyTypeEntry as { sources?: Array<{ name: string }> };
        if (entry.sources) {
          names.push(...entry.sources.map((source) => source.name));
        }
      });
    }
  });

  return unique(names).sort();
});

const tagOptions = computed(() => {
  const names: string[] = [];

  rawBooks.value.forEach((book) => {
    if (book.tags) {
      names.push(...book.tags.map((tag) => (typeof tag === 'string' ? tag : tag.name)));
    }
  });

  return unique(names).sort();
});

const filters = ref<Filters>({
  copyType: Array.isArray(route.query.copyType) 
    ? route.query.copyType as string[]
    : route.query.copyType 
      ? [route.query.copyType as string]
      : [],
  licensingType: Array.isArray(route.query.licensingType) 
    ? route.query.licensingType as string[]
    : route.query.licensingType 
      ? [route.query.licensingType as string]
      : [],
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

const handleCopyTypeChange = (value: string, checked: boolean) => {
  if (checked) {
    filters.value.copyType = [...filters.value.copyType, value];
  } else {
    filters.value.copyType = filters.value.copyType.filter(v => v !== value);
  }
  updateQueryParams();
};

const handleLicensingTypeChange = (value: string, checked: boolean) => {
  if (checked) {
    filters.value.licensingType = [...filters.value.licensingType, value];
  } else {
    filters.value.licensingType = filters.value.licensingType.filter(v => v !== value);
  }
  updateQueryParams();
};

const tagInput = ref('');

const tagSuggestions = computed(() => {
  if (!tagInput.value.trim()) return [];
  const input = tagInput.value.toLowerCase().trim();
  const currentTagsLower = filters.value.tags.map(t => t.toLowerCase());
  return tagOptions.value.filter((tag: any) => 
    tag.toLowerCase().includes(input) && 
    !currentTagsLower.includes(tag.toLowerCase())
  ).slice(0, 5);
});

const normalizeTag = (tag: string): string => {
  return tag.trim();
};

const addTag = () => {
  const tag = normalizeTag(tagInput.value);
  if (tag) {
    const tagLower = tag.toLowerCase();
    const alreadyExists = filters.value.tags.some(t => t.toLowerCase() === tagLower);
    if (!alreadyExists) {
      filters.value.tags = [...filters.value.tags, tag];
      tagInput.value = '';
      updateQueryParams();
    } else {
      tagInput.value = '';
    }
  }
};

const addTagFromSuggestion = (tag: string) => {
  const tagLower = tag.toLowerCase();
  const alreadyExists = filters.value.tags.some(t => t.toLowerCase() === tagLower);
  if (!alreadyExists) {
    filters.value.tags = [...filters.value.tags, tag];
    tagInput.value = '';
    updateQueryParams();
  }
};

const removeTag = (tag: string) => {
  filters.value.tags = filters.value.tags.filter(t => t !== tag);
  updateQueryParams();
};

const hasActiveFilters = computed(() => {
  return filters.value.copyType.length > 0 || 
         filters.value.licensingType.length > 0 || 
         filters.value.sources || 
         filters.value.tags.length > 0;
});

const clearAllFilters = () => {
  filters.value = {
    copyType: [],
    licensingType: [],
    sources: '',
    tags: []
  };
  
  const query: Record<string, string | string[]> = {};
  
  // Copy only non-filter, non-search query params
  Object.keys(route.query).forEach(key => {
    if (
      key !== 'copyType' &&
      key !== 'licensingType' &&
      key !== 'sources' &&
      key !== 'tags' &&
      key !== 'q' &&
      key !== 'search'
    ) {
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
  
  // Copy existing non-filter, non-search query params
  Object.keys(route.query).forEach(key => {
    if (
      key !== 'copyType' &&
      key !== 'licensingType' &&
      key !== 'sources' &&
      key !== 'tags' &&
      key !== 'q' &&
      key !== 'search'
    ) {
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
  if (filters.value.copyType.length > 0) {
    query.copyType = filters.value.copyType;
  }
  
  if (filters.value.licensingType.length > 0) {
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
    copyType: Array.isArray(newQuery.copyType) 
      ? newQuery.copyType as string[]
      : newQuery.copyType 
        ? [newQuery.copyType as string]
        : [],
    licensingType: Array.isArray(newQuery.licensingType) 
      ? newQuery.licensingType as string[]
      : newQuery.licensingType 
        ? [newQuery.licensingType as string]
        : [],
    sources: (newQuery.sources as string) || '',
    tags: Array.isArray(newQuery.tags) 
      ? newQuery.tags as string[]
      : newQuery.tags 
        ? [newQuery.tags as string]
        : []
  };
}, { deep: true });

onMounted(async () => {
  try {
    const response = await getAllBooks(1, 200);
    rawBooks.value = Array.isArray(response?.data) ? response.data : [];
  } catch (err) {
    console.warn('Failed to load books for filter options:', err);
    rawBooks.value = [];
  }
});
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

.filter-group:has(.filter-option-checkbox) .filter-options {
  flex-direction: row;
  flex-wrap: wrap;
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

.filter-option-checkbox {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #ffffff;
  color: #475569;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

.filter-option-checkbox:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.filter-option-checkbox--active {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-white);
}

.filter-option-checkbox--active:hover {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-white);
  opacity: 0.9;
}

.filter-option-checkbox-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  pointer-events: none;
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

.tag-input-container {
  position: relative;
  width: 100%;
}

.tag-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  color: var(--color-black);
  background: #ffffff;
  transition: border-color 0.2s;
}

.tag-input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.tag-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 10;
  max-height: 200px;
  overflow-y: auto;
}

.tag-suggestion {
  display: block;
  width: 100%;
  padding: 8px 12px;
  text-align: left;
  background: none;
  border: none;
  font-size: 14px;
  color: var(--color-black);
  cursor: pointer;
  transition: background-color 0.2s;
}

.tag-suggestion:hover {
  background-color: #f1f5f9;
}

.tag-suggestion:first-child {
  border-radius: 8px 8px 0 0;
}

.tag-suggestion:last-child {
  border-radius: 0 0 8px 8px;
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
