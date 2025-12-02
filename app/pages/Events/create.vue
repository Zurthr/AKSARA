<template>
  <section class="create-event-page">
    <NuxtLink to="/events" class="back-link">&larr; Back to Events</NuxtLink>

    <header class="page-header">
      <h1>Create Event</h1>
      <p>Organize and share events with your community</p>
      <p class="subtitle">Organize and share events with your community</p>
    </header>

    <form class="event-form" @submit="handleSubmit">
      <div class="form-grid">
        <div class="form-section">
          <label for="eventTitle">Event Title</label>
          <input 
            id="eventTitle" 
            type="text" 
            placeholder="Enter event title.." 
            v-model="formData.title"
            required 
          />
        </div>

        <div class="form-section">
          <label for="description">Description</label>
          <textarea
            id="description"
            rows="4"
            placeholder="Describe your event in detail..."
            v-model="formData.description"
            required
          ></textarea>
        </div>

        <div class="form-row">
          <div class="form-section">
            <label for="category">Category</label>
            <select id="category" v-model="formData.category" required>
              <option value="" disabled selected>Select category</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>

          <div class="form-section">
            <label for="community">Community</label>
            <select id="community" v-model="formData.community" required>
              <option value="" disabled selected>Select community</option>
              <option v-for="community in communities" :key="community" :value="community">
                {{ community }}
              </option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-section">
            <label for="date">Date</label>
            <input 
              id="date" 
              type="date" 
              v-model="formData.date"
              required 
            />
          </div>

          <div class="form-section">
            <label for="time">Time</label>
            <input 
              id="time" 
              type="time" 
              v-model="formData.time"
              required 
            />
          </div>
        </div>

        <div class="form-section">
          <label>Location Type</label>
          <div class="radio-group">
            <label class="radio-option">
              <input 
                type="radio" 
                name="locationType" 
                value="online" 
                v-model="formData.locationType"
              />
              <span>Online</span>
            </label>
            <label class="radio-option">
              <input 
                type="radio" 
                name="locationType" 
                value="onsite" 
                v-model="formData.locationType"
              />
              <span>Onsite</span>
            </label>
          </div>
        </div>

        <div class="form-section">
          <label>Event Banner Image</label>
          <div class="file-upload">
            <div class="upload-area">
              <div class="upload-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <polyline points="10,9 9,9 8,9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <p>Click to upload banner image</p>
              <p class="file-hint">PNG, JPG up to 10MB</p>
            </div>
          </div>
        </div>

        <div class="form-section">
          <label for="tags">Tags</label>
          <div class="tag-input-container">
            <div class="selected-tags">
              <span v-for="tag in selectedTags" :key="tag" class="tag-pill">
                {{ tag }}
                <button type="button" @click="removeTag(tag)" class="remove-tag">×</button>
              </span>
            </div>
            <input 
              id="tags"
              type="text" 
              placeholder="Add tags..."
              v-model="currentTag"
              @keypress.enter="addTag"
            />
          </div>
          <p class="hint">Press Enter to add tags</p>
        </div>
      </div>

      <div class="form-actions">
        <button type="button" class="button ghost" @click="cancel">Cancel</button>
        <button type="submit" class="button primary" :disabled="isSubmitting">
          {{ isSubmitting ? 'Creating...' : 'Create Event' }}
        </button>
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const formData = ref({
  title: '',
  description: '',
  category: '',
  community: '',
  date: '',
  time: '',
  locationType: 'online',
  bannerImage: null
});

const selectedTags = ref([]);
const currentTag = ref('');
const isSubmitting = ref(false);

const categories = [
  'Workshop',
  'Seminar',
  'Conference',
  'Book Reading',
  'Discussion',
  'Festival',
  'Exhibition',
  'Training'
];

const communities = [
  'Literatura Bandung',
  'Book Lovers',
  'Creative Writers',
  'Academic Community',
  'Public Library',
  'Student Union'
];

const addTag = (event) => {
  event.preventDefault();
  const tag = currentTag.value.trim();
  if (tag && !selectedTags.value.includes(tag)) {
    selectedTags.value.push(tag);
    currentTag.value = '';
  }
};

const removeTag = (tagToRemove) => {
  selectedTags.value = selectedTags.value.filter(tag => tag !== tagToRemove);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  
  if (isSubmitting.value) return;
  
  try {
    isSubmitting.value = true;
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Here you would normally send data to API
    console.log('Event data:', {
      ...formData.value,
      tags: selectedTags.value
    });
    
    // Navigate to events page or show success message
    await navigateTo('/events');
    
  } catch (error) {
    console.error('Failed to create event:', error);
    alert('Gagal membuat event. Silakan coba lagi.');
  } finally {
    isSubmitting.value = false;
  }
};

const cancel = () => {
  navigateTo('/events');
};
</script>

<style scoped>
.create-event-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  padding-bottom: 40px;
}

.back-link {
  color: #3b5379;
  font-weight: 600;
  text-decoration: none;
}

.page-header h1 {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-black);
  margin-bottom: 8px;
}

.page-header p {
  color: #475569;
  margin-bottom: 4px;
}

.subtitle {
  color: #64748b !important;
  font-size: 14px;
}

.event-form {
  background: #ffffff;
  border-radius: 24px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.form-grid {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-section label {
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}

.form-section input,
.form-section textarea,
.form-section select {
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  font-size: 14px;
  transition: border-color 0.2s ease;
}

.form-section input:focus,
.form-section textarea:focus,
.form-section select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.radio-group {
  display: flex;
  gap: 16px;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.radio-option input[type="radio"] {
  width: 16px;
  height: 16px;
}

.file-upload {
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  padding: 32px;
  text-align: center;
  background: #f9fafb;
  cursor: pointer;
  transition: all 0.2s ease;
}

.file-upload:hover {
  border-color: #3b82f6;
  background: #f0f9ff;
}

.upload-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.upload-icon {
  width: 48px;
  height: 48px;
  color: #9ca3af;
}

.file-hint {
  font-size: 13px;
  color: #6b7280;
}

.tag-input-container {
  border: 1px solid #d1d5db;
  border-radius: 12px;
  padding: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  min-height: 48px;
  align-items: center;
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag-pill {
  background: #eff6ff;
  color: #1d4ed8;
  padding: 4px 8px;
  border-radius: 16px;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.remove-tag {
  background: none;
  border: none;
  color: #1d4ed8;
  cursor: pointer;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.tag-input-container input {
  border: none;
  outline: none;
  flex: 1;
  min-width: 120px;
  padding: 4px 8px;
}

.hint {
  font-size: 13px;
  color: #6b7280;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.button {
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  font-size: 14px;
}

.button.ghost {
  background: transparent;
  color: #6b7280;
  border: 1px solid #d1d5db;
}

.button.ghost:hover {
  background: #f3f4f6;
}

.button.primary {
  background: #fbbf24;
  color: var(--color-black);
  box-shadow: 0 4px 12px rgba(251, 191, 36, 0.3);
}

.button.primary:hover:not(:disabled) {
  background: #f59e0b;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(251, 191, 36, 0.4);
}

.button.primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .event-form {
    padding: 20px;
  }
  
  .page-header h1 {
    font-size: 24px;
  }
}
</style>