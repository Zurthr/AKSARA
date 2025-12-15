<template>
  <div class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2 class="modal-title">
          {{ isEditing ? 'Edit Embed Widget' : 'Create New Embed Widget' }}
        </h2>
        <button class="btn-close" @click="$emit('close')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="modal-form">
        <div class="form-group">
          <label for="name" class="form-label">Widget Name *</label>
          <input
            id="name"
            v-model="formData.name"
            type="text"
            class="form-input"
            placeholder="e.g. My Science Books Widget"
            required
            :maxlength="100"
          />
          <div class="form-hint">
            This is for your internal reference
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="type" class="form-label">Content Type *</label>
            <select
              id="type"
              v-model="formData.type"
              class="form-select"
              required
            >
              <option value="RESOURCE_LIST">Books & Resources</option>
              <option value="EVENT_LIST">Events & Workshops</option>
            </select>
          </div>

          <div class="form-group">
            <label for="limit" class="form-label">Items to Show *</label>
            <input
              id="limit"
              v-model.number="formData.limit"
              type="number"
              class="form-input"
              min="1"
              max="20"
              required
            />
          </div>
        </div>

        <div class="form-group">
          <label for="filterTags" class="form-label">Filter Tags</label>
          <input
            id="filterTags"
            v-model="tagsInput"
            type="text"
            class="form-input"
            placeholder="e.g. science, history, technology"
          />
          <div class="form-hint">
            Comma-separated tags to filter content. Leave empty to show all.
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="sortBy" class="form-label">Sort By *</label>
            <select
              id="sortBy"
              v-model="formData.sortBy"
              class="form-select"
              required
            >
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest First</option>
              <option value="title">Alphabetical (A-Z)</option>
            </select>
          </div>

          <div class="form-group">
            <label for="theme" class="form-label">Theme *</label>
            <select
              id="theme"
              v-model="formData.theme"
              class="form-select"
              required
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="blue">Blue</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="checkbox-label">
            <input
              v-model="formData.showThumbnail"
              type="checkbox"
              class="checkbox-input"
            />
            <span class="checkbox-text">Show cover images</span>
          </label>
        </div>

        <div class="form-group">
          <label for="allowedDomains" class="form-label">Allowed Domains</label>
          <input
            id="allowedDomains"
            v-model="domainsInput"
            type="text"
            class="form-input"
            placeholder="e.g. https://myschool.edu, https://partner.com"
          />
          <div class="form-hint">
            Comma-separated domains that can embed this widget. Leave empty to allow all domains.
          </div>
        </div>

        <div class="form-actions">
          <button
            type="button"
            class="btn btn-secondary"
            @click="$emit('close')"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="btn btn-primary"
            :disabled="isSubmitting"
          >
            <span v-if="isSubmitting" class="btn-spinner"></span>
            {{ isSubmitting ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Widget') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
interface EmbedConfig {
  id?: string;
  name: string;
  type: "RESOURCE_LIST" | "EVENT_LIST";
  filterTags: string[];
  limit: number;
  sortBy: string;
  theme: string;
  showThumbnail: boolean;
  allowedDomains: string[];
}

const props = defineProps<{
  embed?: EmbedConfig | null;
}>();

const emit = defineEmits<{
  close: [];
  save: [embedData: EmbedConfig];
}>();

const isEditing = computed(() => !!props.embed);
const isSubmitting = ref(false);

// Reactive form data
const formData = ref<EmbedConfig>({
  name: props.embed?.name || '',
  type: props.embed?.type || 'RESOURCE_LIST',
  filterTags: props.embed?.filterTags ? [...props.embed.filterTags] : [],
  limit: props.embed?.limit || 5,
  sortBy: props.embed?.sortBy || 'rating',
  theme: props.embed?.theme || 'light',
  showThumbnail: props.embed?.showThumbnail ?? true,
  allowedDomains: props.embed?.allowedDomains ? [...props.embed.allowedDomains] : [],
});

// Computed inputs for comma-separated values
const tagsInput = computed({
  get: () => formData.value.filterTags.join(', '),
  set: (value: string) => {
    formData.value.filterTags = value
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
  }
});

const domainsInput = computed({
  get: () => formData.value.allowedDomains.join(', '),
  set: (value: string) => {
    formData.value.allowedDomains = value
      .split(',')
      .map(domain => domain.trim())
      .filter(domain => domain.length > 0);
  }
});

const handleSubmit = async () => {
  isSubmitting.value = true;

  try {
    // Validate form data
    if (!formData.value.name.trim()) {
      throw new Error('Widget name is required');
    }

    if (formData.value.limit < 1 || formData.value.limit > 20) {
      throw new Error('Limit must be between 1 and 20');
    }

    // Emit the save event with the form data
    emit('save', { ...formData.value });
  } catch (error) {
    console.error('Error validating embed:', error);
    alert(error instanceof Error ? error.message : 'Validation failed');
  } finally {
    isSubmitting.value = false;
  }
};

const handleOverlayClick = () => {
  emit('close');
};

// Close on escape key
onMounted(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      emit('close');
    }
  };

  document.addEventListener('keydown', handleEscape);

  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape);
  });
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  border-radius: 16px;
  max-width: 650px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 0;
  margin-bottom: 24px;
}

.modal-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--color-primary);
  margin: 0;
}

.btn-close {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  transition: all 0.2s;
}

.btn-close:hover {
  background: #f1f5f9;
  color: var(--color-primary);
}

.modal-form {
  padding: 0 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: 6px;
}

.form-input,
.form-select {
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 14px;
  transition: all 0.2s;
  background: white;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(59, 83, 121, 0.1);
}

.form-hint {
  font-size: 12px;
  color: #64748b;
  margin-top: 4px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: var(--color-primary);
}

.checkbox-input {
  width: 16px;
  height: 16px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  cursor: pointer;
}

.checkbox-text {
  user-select: none;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 16px;
  border-top: 1px solid #f3f4f6;
  margin-top: 8px;
}

.btn {
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f3f4f6;
  color: #6b7280;
}

.btn-secondary:hover:not(:disabled) {
  background: #e5e7eb;
}

.btn-primary {
  background: var(--color-primary);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2c3542;
}

.btn-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 640px) {
  .modal-overlay {
    padding: 8px;
  }

  .modal-content {
    margin: 8px;
    max-height: calc(100vh - 16px);
  }

  .modal-header,
  .modal-form {
    padding-left: 16px;
    padding-right: 16px;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>