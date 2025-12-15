<template>
  <section class="sidebar-card filter-card">
    <h3 style="font-size: 18px; font-weight: 600; color: var(--color-black)">Filter Events</h3>
    <div class="filter-form">
      <div class="filter-row">
        <label class="filter-label">Start date</label>
        <div class="input-with-icon">
          <input
            ref="startInput"
            class="filter-input"
            type="date"
            v-model="startDate"
            @change="syncEventFilters"
          />
          <button
            type="button"
            class="input-icon"
            @click="openStartPicker"
            aria-label="Open start date picker"
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 10h5v5H7z" fill="currentColor" opacity="0.2" />
              <path
                d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      </div>

      <div class="filter-row">
        <label class="filter-label">End date</label>
        <div class="input-with-icon">
          <input
            ref="endInput"
            class="filter-input"
            type="date"
            v-model="endDate"
            @change="syncEventFilters"
          />
          <button
            type="button"
            class="input-icon"
            @click="openEndPicker"
            aria-label="Open end date picker"
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 10h5v5H7z" fill="currentColor" opacity="0.2" />
              <path
                d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      </div>

      <div class="filter-row">
        <label class="filter-label">Type</label>
        <div class="chip-group">
          <button
            type="button"
            :class="['chip', { 'chip-active': onlineChecked }]"
            @click="toggleEventType('online')"
          >
            Online
          </button>
          <button
            type="button"
            :class="['chip', { 'chip-active': offlineChecked }]"
            @click="toggleEventType('offline')"
          >
            Offline
          </button>
        </div>
      </div>

      <div class="filter-row">
        <label class="filter-label">Tags</label>
        <div class="tag-input-container">
          <input
            type="text"
            v-model="tagInput"
            @keydown.enter.prevent="addTag"
            @keydown.escape="tagInput = ''"
            class="filter-input"
            placeholder="Type a tag and press Enter"
          />
        </div>
        <div class="selected-tags" v-if="tags.length > 0">
          <span
            v-for="tag in tags"
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

      <div class="filter-row filter-actions">
        <button class="clear-btn" type="button" @click="clearEventFilters">
          Clear Filters
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { LocationQueryRaw } from 'vue-router';

const route = useRoute();
const router = useRouter();

const ensureArray = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.filter(Boolean).map(String);
  if (value === undefined || value === null || value === '') return [];
  return [String(value)];
};

const normalizeKey = (value: string | number | null | undefined) =>
  (value ?? '').toString().trim().toLowerCase();

const startDate = ref<string | null>((route.query.startDate as string) || null);
const endDate = ref<string | null>((route.query.endDate as string) || null);
const eventTypesFromQuery = ensureArray(route.query.eventType).map(normalizeKey);
const initialTags = ensureArray(route.query.tags);

const onlineChecked = ref(eventTypesFromQuery.includes('online'));
const offlineChecked = ref(eventTypesFromQuery.includes('offline'));
const tags = ref<string[]>(initialTags);
const tagInput = ref('');

const updateQuery = (patch: LocationQueryRaw) => {
  const next: LocationQueryRaw = { ...(route.query as LocationQueryRaw), ...patch };
  Object.keys(next).forEach((key) => {
    const value = next[key];
    const isEmptyArray = Array.isArray(value) && value.length === 0;
    if (value === undefined || value === null || value === '' || isEmptyArray) {
      delete next[key];
    }
  });
  router.replace({ query: next });
};

const syncEventFilters = () => {
  const types: string[] = [];
  if (onlineChecked.value) types.push('online');
  if (offlineChecked.value) types.push('offline');
  updateQuery({
    startDate: startDate.value || undefined,
    endDate: endDate.value || undefined,
    eventType: types,
    tags: tags.value,
  });
};

const toggleEventType = (type: 'online' | 'offline') => {
  if (type === 'online') onlineChecked.value = !onlineChecked.value;
  if (type === 'offline') offlineChecked.value = !offlineChecked.value;
  syncEventFilters();
};

const clearEventFilters = () => {
  startDate.value = null;
  endDate.value = null;
  onlineChecked.value = false;
  offlineChecked.value = false;
  tags.value = [];
  syncEventFilters();
};

const startInput = ref<HTMLInputElement | null>(null);
const endInput = ref<HTMLInputElement | null>(null);

const openPicker = (elRef: typeof startInput) => {
  const el = elRef.value as (HTMLInputElement & { showPicker?: () => void }) | null;
  if (!el) return;
  try {
    if (typeof el.showPicker === 'function') {
      el.showPicker();
      return;
    }
  } catch {
    // ignore and fallback
  }
  el.focus();
  try {
    el.click();
  } catch {
    // ignore
  }
};

const openStartPicker = () => openPicker(startInput);
const openEndPicker = () => openPicker(endInput);

const addTag = () => {
  const raw = tagInput.value.trim();
  if (!raw) return;
  const exists = tags.value.some((t) => t.toLowerCase() === raw.toLowerCase());
  if (!exists) {
    tags.value = [...tags.value, raw];
    syncEventFilters();
  }
  tagInput.value = '';
};

const removeTag = (tag: string) => {
  tags.value = tags.value.filter((t) => t !== tag);
  syncEventFilters();
};

watch(
  () => route.query,
  (q) => {
    startDate.value = (q.startDate as string) || null;
    endDate.value = (q.endDate as string) || null;
    const fromQuery = ensureArray(q.eventType).map(normalizeKey);
    onlineChecked.value = fromQuery.includes('online');
    offlineChecked.value = fromQuery.includes('offline');
     tags.value = ensureArray(q.tags);
  }
);
</script>

<style scoped>
.filter-card {
  border: 1px solid #e2e8f0;
}

.filter-form {
    margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.filter-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-label {
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
}

.input-with-icon {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px 10px;
}

.filter-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  background:none;
}

.input-icon {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: #94a3b8;
}

.tag-input-container {
  position: relative;
  width: 100%;
  border: 1px solid #e2e8f0;
    border-radius: 8px;
  padding: 8px 10px;
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

.chip-group {
  display: flex;
  gap: 8px;
}

.chip {
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s ease;
}

.chip-active {
  background: var(--color-primary, #2563eb);
  color: #ffffff;
  border-color: var(--color-primary, #2563eb);
}

.filter-actions {
  margin-top: 4px;
}

.clear-btn {
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  color: #334155;
  cursor: pointer;
}
</style>


