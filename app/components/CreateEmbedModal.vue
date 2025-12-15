<template>
  <div class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2 class="modal-title">
          {{ isEditing ? 'Edit Embed' : 'Create New Embed' }}
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
          <label for="title" class="form-label">Title *</label>
          <input
            id="title"
            v-model="formData.title"
            type="text"
            class="form-input"
            placeholder="Enter embed title"
            required
            :maxlength="100"
          />
          <div class="form-hint">
            {{ formData.title.length }}/100 characters
          </div>
        </div>

        <div class="form-group">
          <label for="description" class="form-label">Description</label>
          <textarea
            id="description"
            v-model="formData.description"
            class="form-textarea"
            placeholder="Describe what this embed does"
            rows="3"
            :maxlength="500"
          />
          <div class="form-hint">
            {{ formData.description.length }}/500 characters
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="category" class="form-label">Category *</label>
            <select
              id="category"
              v-model="formData.category"
              class="form-select"
              required
            >
              <option value="">Select category</option>
              <option value="Marketing">Marketing</option>
              <option value="Lead Generation">Lead Generation</option>
              <option value="Social">Social</option>
              <option value="E-commerce">E-commerce</option>
              <option value="Education">Education</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Utility">Utility</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div class="form-group" v-if="isEditing">
            <label for="type" class="form-label">Status</label>
            <select
              id="type"
              v-model="formData.type"
              class="form-select"
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
            </select>
          </div>
        </div>

        <div class="form-group" v-if="!isEditing">
          <label class="form-label">Embed Type</label>
          <div class="embed-type-options">
            <label class="radio-option">
              <input
                v-model="formData.embedType"
                type="radio"
                value="widget"
                class="radio-input"
              />
              <div class="radio-content">
                <div class="radio-title">Widget</div>
                <div class="radio-description">Interactive widget for your site</div>
              </div>
            </label>
            <label class="radio-option">
              <input
                v-model="formData.embedType"
                type="radio"
                value="form"
                class="radio-input"
              />
              <div class="radio-content">
                <div class="radio-title">Form</div>
                <div class="radio-description">Contact or signup form</div>
              </div>
            </label>
            <label class="radio-option">
              <input
                v-model="formData.embedType"
                type="radio"
                value="content"
                class="radio-input"
              />
              <div class="radio-content">
                <div class="radio-title">Content</div>
                <div class="radio-description">Display content or media</div>
              </div>
            </label>
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
            {{ isSubmitting ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Embed') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  embed?: {
    id: string;
    title: string;
    description: string;
    category: string;
    type: 'draft' | 'active';
  } | null;
}>();

const emit = defineEmits<{
  close: [];
  save: [embedData: {
    title?: string;
    description?: string;
    category?: string;
    type?: 'draft' | 'active';
    embedType?: string;
  }];
}>();

const isEditing = computed(() => !!props.embed);
const isSubmitting = ref(false);

const formData = ref({
  title: props.embed?.title || '',
  description: props.embed?.description || '',
  category: props.embed?.category || '',
  type: props.embed?.type || 'draft',
  embedType: 'widget'
});

const handleSubmit = async () => {
  isSubmitting.value = true;

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const saveData = {
      title: formData.value.title,
      description: formData.value.description,
      category: formData.value.category,
      ...(isEditing.value ? { type: formData.value.type } : { embedType: formData.value.embedType })
    };

    emit('save', saveData);
  } catch (error) {
    console.error('Error saving embed:', error);
    // You could show an error message here
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
  max-width: 600px;
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
.form-textarea,
.form-select {
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 14px;
  transition: all 0.2s;
  background: white;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(59, 83, 121, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
}

.form-hint {
  font-size: 12px;
  color: #64748b;
  margin-top: 4px;
  text-align: right;
}

.embed-type-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.radio-option {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.radio-option:hover {
  border-color: #d1d5db;
  background: #f9fafb;
}

.radio-option:has(.radio-input:checked) {
  border-color: var(--color-primary);
  background: #eff6ff;
}

.radio-input {
  margin-top: 2px;
}

.radio-content {
  flex: 1;
}

.radio-title {
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: 2px;
}

.radio-description {
  font-size: 13px;
  color: #64748b;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 8px;
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