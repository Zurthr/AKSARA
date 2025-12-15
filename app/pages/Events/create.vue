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

        <div class="form-row">
          <div class="form-section">
            <label for="location">Location</label>
            <input
              id="location"
              type="text"
              :placeholder="locationPlaceholder"
              v-model="formData.location"
              required
            />
          </div>

          <div class="form-section">
            <label for="organizer">Organizer</label>
            <input
              id="organizer"
              type="text"
              placeholder="Nama penyelenggara"
              v-model="formData.organizer"
              required
            />
          </div>
        </div>

        <div class="form-section">
          <label>Ticket Type</label>
          <div class="radio-group">
            <label class="radio-option">
              <input type="radio" :value="true" v-model="formData.isFree" />
              <span>Gratis</span>
            </label>
            <label class="radio-option">
              <input type="radio" :value="false" v-model="formData.isFree" />
              <span>Berbayar</span>
            </label>
          </div>
        </div>

        <div v-if="!formData.isFree" class="form-section">
          <label for="price">Ticket Price (IDR)</label>
          <input
            id="price"
            type="number"
            min="0"
            placeholder="cth. 50000"
            v-model="formData.price"
          />
          <p class="hint">Masukkan harga dalam Rupiah tanpa tanda titik atau koma.</p>
        </div>

        <div class="form-row">
          <div class="form-section">
            <label for="capacity">Capacity (optional)</label>
            <input
              id="capacity"
              type="number"
              min="0"
              placeholder="cth. 100"
              v-model="formData.capacity"
            />
          </div>

          <div class="form-section">
            <label for="imageUrl">Banner Image URL</label>
            <input
              id="imageUrl"
              type="url"
              placeholder="https://contoh.com/banner.jpg"
              v-model="formData.imageUrl"
            />
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
        <p v-if="submissionError" class="form-error">{{ submissionError }}</p>
        <div class="actions-group">
          <button type="button" class="button ghost" @click="cancel">Cancel</button>
          <button type="submit" class="button primary" :disabled="isSubmitting">
            {{ isSubmitting ? 'Creating...' : 'Create Event' }}
          </button>
        </div>
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { navigateTo } from '#imports'

import { useLocalEvents } from '~/composables/useLocalEvents'
// import { useEvents, type EventCreateData } from '~/composables/useEvents'

interface CreateEventForm {
  title: string
  description: string
  category: string
  community: string
  date: string
  time: string
  locationType: 'online' | 'onsite'
  location: string
  organizer: string
  capacity: string
  isFree: boolean
  price: string
  imageUrl: string
}

const formData = ref<CreateEventForm>({
  title: '',
  description: '',
  category: '',
  community: '',
  date: '',
  time: '',
  locationType: 'online',
  location: '',
  organizer: '',
  capacity: '',
  isFree: true,
  price: '',
  imageUrl: ''
})

const selectedTags = ref<string[]>([])
const currentTag = ref('')


const { addLocalEvent } = useLocalEvents()
const isSubmitting = ref(false)
const submissionError = ref<string | null>(null)

watch(
  () => formData.value.isFree,
  (isFree) => {
    if (isFree) {
      formData.value.price = ''
    }
  }
)

watch(
  () => formData.value.locationType,
  (type) => {
    if (type === 'online' && !formData.value.location.trim()) {
      formData.value.location = 'Online'
    }
    if (type === 'onsite' && formData.value.location === 'Online') {
      formData.value.location = ''
    }
  },
  { immediate: true }
)

const locationPlaceholder = computed(() =>
  formData.value.locationType === 'online'
    ? 'Tambahkan tautan atau platform (Zoom, Google Meet, dll)'
    : 'Masukkan alamat venue atau lokasi acara'
)

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

const addTag = (event: KeyboardEvent) => {
  event.preventDefault()
  const tag = currentTag.value.trim()
  if (tag && !selectedTags.value.includes(tag)) {
    selectedTags.value.push(tag)
    currentTag.value = ''
  }
}

const removeTag = (tagToRemove: string) => {
  selectedTags.value = selectedTags.value.filter((tag) => tag !== tagToRemove)
}

const handleSubmit = async (event: Event) => {
  event.preventDefault()
  if (isSubmitting.value) {
    return
  }
  submissionError.value = null
  isSubmitting.value = true

  if (!formData.value.location.trim()) {
    submissionError.value = 'Lokasi acara wajib diisi.'
    isSubmitting.value = false
    return
  }

  if (!formData.value.organizer.trim()) {
    submissionError.value = 'Nama penyelenggara wajib diisi.'
    isSubmitting.value = false
    return
  }

  // Generate unique id (timestamp + random)
  const id = `local-${Date.now()}-${Math.floor(Math.random() * 10000)}`

  // Map form data to event object
  const newEvent = {
    id,
    title: formData.value.title.trim(),
    description: formData.value.description.trim(),
    date: formData.value.date,
    time: formData.value.time || undefined,
    location: formData.value.location.trim(),
    organizer: formData.value.organizer.trim(),
    is_free: formData.value.isFree,
    price: formData.value.isFree ? 0 : Number(formData.value.price) || 0,
    capacity: formData.value.capacity ? Number(formData.value.capacity) : undefined,
    category: formData.value.category,
    community: formData.value.community,
    image_url: formData.value.imageUrl?.trim() || '',
    tags: selectedTags.value,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    // Add any other fields as needed
  }

  try {
    addLocalEvent(newEvent)
    await navigateTo('/events')
  } catch (e) {
    submissionError.value = 'Gagal menyimpan event lokal.'
  } finally {
    isSubmitting.value = false
  }
}

const cancel = () => {
  void navigateTo('/events')
}
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
  flex-wrap: wrap;
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
  flex-direction: column;
  gap: 12px;
  align-items: flex-end;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.actions-group {
  display: flex;
  gap: 12px;
}

.form-error {
  color: #dc2626;
  font-size: 14px;
  margin: 0;
  align-self: stretch;
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

  .form-actions {
    align-items: stretch;
  }

  .actions-group {
    flex-direction: column;
  }

  .actions-group .button {
    width: 100%;
  }
}
</style>