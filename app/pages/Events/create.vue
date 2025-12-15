<template>
  <div class="create-event-container">
    <div class="header-section">
      <NuxtLink to="/events" class="back-link">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Back
      </NuxtLink>
      <h1 class="page-title">Create Event</h1>
      <p class="page-subtitle">Build a space where people with shared interests can connect and collaborate</p>
    </div>

    <form class="event-form" @submit="handleSubmit">
      <div class="form-content">
        <!-- Event Title -->
        <div class="form-group">
          <label for="eventTitle" class="form-label">Event Name <span class="required">*</span></label>
          <input 
            id="eventTitle" 
            type="text" 
            class="form-input" 
            placeholder="Enter your event name" 
            v-model="formData.title"
            required 
          />
        </div>

        <!-- Description -->
        <div class="form-group">
          <label for="description" class="form-label">Description <span class="required">*</span></label>
          <textarea
            id="description"
            class="form-textarea"
            rows="5"
            placeholder="Describe the purpose and focus of your event. What brings members together?"
            v-model="formData.description"
            required
          ></textarea>
          <p class="helper-text">Minimum 50 characters</p>
        </div>

        <!-- Category & Community Grid -->
        <div class="form-row">
          <div class="form-group">
            <label for="category" class="form-label">Category <span class="required">*</span></label>
            <div class="select-wrapper">
              <select id="category" class="form-select" v-model="formData.category" required>
                <option value="" disabled selected>Select a category</option>
                <option v-for="category in categories" :key="category" :value="category">
                  {{ category }}
                </option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="community" class="form-label">Community</label>
            <div class="select-wrapper">
              <select id="community" class="form-select" v-model="formData.community" required>
                <option value="" disabled selected>Select community</option>
                <option v-for="community in communities" :key="community" :value="community">
                  {{ community }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- Date & Time Grid -->
        <div class="form-row">
          <div class="form-group">
            <label for="date" class="form-label">Date <span class="required">*</span></label>
            <input 
              id="date" 
              type="date" 
              class="form-input"
              v-model="formData.date"
              required 
            />
          </div>

          <div class="form-group">
            <label for="time" class="form-label">Time <span class="required">*</span></label>
            <input 
              id="time" 
              type="time" 
              class="form-input"
              v-model="formData.time"
              required 
            />
          </div>
        </div>

        <!-- Location Section -->
         <div class="form-group">
            <label class="form-label">Location Type</label>
            <div class="pill-group">
              <label class="pill-option">
                <input type="radio" value="online" v-model="formData.locationType" />
                <span>Online</span>
              </label>
              <label class="pill-option">
                <input type="radio" value="onsite" v-model="formData.locationType" />
                <span>Onsite</span>
              </label>
            </div>
          </div>

          <div class="form-group">
            <label for="location" class="form-label">Location Details <span class="required">*</span></label>
            <input
              id="location"
              type="text"
              class="form-input"
              :placeholder="locationPlaceholder"
              v-model="formData.location"
              required
            />
          </div>
          
          <div class="form-group">
             <label for="organizer" class="form-label">Organizer <span class="required">*</span></label>
              <input
                id="organizer"
                type="text"
                class="form-input"
                placeholder="Organizer name"
                v-model="formData.organizer"
                required
              />
          </div>

        <!-- Image Upload Section (Styled as URL input) -->
        <div class="form-group">
          <label class="form-label">Event Banner</label>
          <div class="image-upload-area">
            <div class="image-preview">
              <img v-if="formData.imageUrl" :src="formData.imageUrl" alt="Preview" class="preview-img" @error="handleImageError"/>
              <div v-else class="placeholder-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19ZM8.5 13.5L11 16.51L14.5 12L19 18H5L8.5 13.5Z" fill="#CBD5E1"/>
                </svg>
              </div>
            </div>
            <div class="upload-input-container">
              <div class="upload-content">
                <div class="cloud-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4C9.11 4 6.6 5.64 5.35 8.04C2.34 8.36 0 10.91 0 14C0 17.31 2.69 20 6 20H19C21.76 20 24 17.76 24 15C24 12.36 21.95 10.22 19.35 10.04ZM14 13V17H10V13H7L12 8L17 13H14Z" fill="#94A3B8"/>
                  </svg>
                </div>
                <!-- We simulate upload but stick to URL input for now as per logic -->
                <p class="upload-text">Paste image URL here</p>
                <input 
                  type="url" 
                  class="url-input-transparent" 
                  placeholder="https://..." 
                  v-model="formData.imageUrl"
                />
                <p class="upload-hint">PNG, JPG or JPEG (max. 2MB)<br>Recommended: 400×400px</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Ticket Type (Radio Cards) -->
        <div class="form-group">
          <label class="form-label">Ticket Setting <span class="required">*</span></label>
          <div class="radio-cards">
            <label class="radio-card" :class="{ active: formData.isFree }">
              <div class="radio-indicator">
                <input type="radio" :value="true" v-model="formData.isFree" name="ticketType">
                <div class="radio-circle"></div>
              </div>
              <div class="radio-content">
                <span class="radio-title">Free Event</span>
                <span class="radio-description">Anyone can register and join this event for free</span>
              </div>
            </label>

            <label class="radio-card" :class="{ active: !formData.isFree }">
              <div class="radio-indicator">
                <input type="radio" :value="false" v-model="formData.isFree" name="ticketType">
                <div class="radio-circle"></div>
              </div>
              <div class="radio-content">
                <span class="radio-title">Paid Event</span>
                <span class="radio-description">Attendees must purchase a ticket to join</span>
                <input 
                  v-if="!formData.isFree"
                  type="number" 
                  class="price-input-inline"
                  placeholder="IDR Price"
                  v-model="formData.price"
                  @click.stop
                />
              </div>
            </label>
          </div>
        </div>

         <div class="form-group">
             <label for="capacity" class="form-label">Capacity (Optional)</label>
              <input
                id="capacity"
                type="number"
                class="form-input"
                placeholder="e.g. 100"
                v-model="formData.capacity"
              />
          </div>

        <!-- Tags -->
        <div class="form-group">
          <label class="form-label">Tags / Interest Topics</label>
          <div class="tag-input-group">
            <div class="tags-display" v-if="selectedTags.length">
              <span v-for="tag in selectedTags" :key="tag" class="tag-chip">
                {{ tag }}
                <button type="button" @click="removeTag(tag)" class="tag-remove">×</button>
              </span>
            </div>
            <div class="tag-input-wrapper">
              <input 
                type="text" 
                class="tag-input" 
                placeholder="Type a tag and press Enter"
                v-model="currentTag"
                @keypress.enter="addTag"
              />
              <button type="button" class="add-tag-btn" @click="addTagTrigger">
                + Add
              </button>
            </div>
          </div>
          <p class="helper-text">Add up to 10 relevant tags to help people discover your event</p>
        </div>

        <div class="form-footer">
          <button type="button" class="btn-cancel" @click="cancel">Cancel</button>
          <button type="submit" class="btn-submit" :disabled="isSubmitting">
            <svg v-if="isSubmitting" class="spinner" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="4"></circle>
            </svg>
            {{ isSubmitting ? 'Creating...' : 'Create Event' }}
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { navigateTo } from '#imports'
import { useLocalEvents } from '~/composables/useLocalEvents'

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

watch(() => formData.value.isFree, (isFree) => {
  if (isFree) formData.value.price = ''
})

watch(() => formData.value.locationType, (type) => {
  if (type === 'online' && !formData.value.location.trim()) {
    formData.value.location = 'Online'
  }
  if (type === 'onsite' && formData.value.location === 'Online') {
    formData.value.location = ''
  }
}, { immediate: true })

const locationPlaceholder = computed(() =>
  formData.value.locationType === 'online'
    ? 'Add link or platform (Zoom, Google Meet, etc)'
    : 'Enter venue address or event location'
)

const categories = ['Workshop', 'Seminar', 'Conference', 'Book Reading', 'Discussion', 'Festival', 'Exhibition', 'Training']
const communities = ['Literatura Bandung', 'Book Lovers', 'Creative Writers', 'Academic Community', 'Public Library', 'Student Union']

const addTag = (event?: KeyboardEvent) => {
  if (event) event.preventDefault()
  const tag = currentTag.value.trim()
  if (tag && !selectedTags.value.includes(tag) && selectedTags.value.length < 10) {
    selectedTags.value.push(tag)
    currentTag.value = ''
  }
}

const addTagTrigger = () => {
  const tag = currentTag.value.trim()
  if (tag && !selectedTags.value.includes(tag) && selectedTags.value.length < 10) {
    selectedTags.value.push(tag)
    currentTag.value = ''
  }
}

const removeTag = (tagToRemove: string) => {
  selectedTags.value = selectedTags.value.filter((tag) => tag !== tagToRemove)
}

const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.src = 'https://via.placeholder.com/150?text=Error'
}

const handleSubmit = async (event: Event) => {
  event.preventDefault()
  if (isSubmitting.value) return
  
  submissionError.value = null
  isSubmitting.value = true

  if (!formData.value.location.trim()) {
    alert('Event location is required.')
    isSubmitting.value = false
    return
  }

  // Generate unique id
  const id = `local-${Date.now()}-${Math.floor(Math.random() * 10000)}`

  const newEvent = {
    id,
    title: formData.value.title.trim(),
    description: formData.value.description.trim(),
    date: formData.value.date,
    time: formData.value.time,
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
  }

  try {
    addLocalEvent(newEvent)
    await navigateTo('/events')
  } catch (e) {
    alert('Failed to save local event.')
  } finally {
    isSubmitting.value = false
  }
}

const cancel = () => {
  void navigateTo('/events')
}
</script>

<style scoped>
.create-event-container {
  max-width: 1200px;
  margin: 0 auto; 
  padding: 40px 20px;
  font-family: 'Inter', sans-serif;
}

.header-section {
  margin-bottom: 32px;
  padding-left: 0;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #64748B;
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  margin-bottom: 24px;
  transition: color 0.2s;
}

.back-link:hover {
  color: #0F172A;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: #0F172A;
  margin-bottom: 8px;
  letter-spacing: -0.5px;
}

.page-subtitle {
  color: #64748B;
  font-size: 16px;
  margin: 0;
}

.event-form {
  /* Removed card style (background/radius) to make it flatter and cleaner */
  /* If specific background is needed, better applied to the whole page or section */
}

/* We need to ensure the visual start of the text in Title aligns with the start of the input box border */

.form-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.form-label {
  font-weight: 600;
  font-size: 14px;
  color: #0F172A;
}

.required {
  color: #EF4444;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 12px 16px;
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 14px;
  color: #0F172A;
  transition: all 0.2s;
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: #94A3B8;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #6366F1; /* Primary purple/blue */
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
}

.helper-text {
  font-size: 12px;
  color: #94A3B8;
  margin-top: 4px;
}

/* Image Upload Area */
.image-upload-area {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.image-preview {
  width: 100px;
  height: 100px;
  background: #F1F5F9;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-input-container {
  flex: 1;
  border: 2px dashed #E2E8F0;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  transition: border-color 0.2s;
  background: #FCFCFD;
  position: relative;
}

.upload-input-container:hover {
  border-color: #6366F1;
}

.cloud-icon {
  margin-bottom: 12px;
}

.upload-text {
  font-weight: 600;
  font-size: 14px;
  color: #0F172A;
  margin-bottom: 4px;
}

.url-input-transparent {
  width: 100%;
  max-width: 400px;
  border: 1px solid #CBD5E1;
  background: #FFFFFF;
  text-align: center;
  font-size: 14px;
  color: #0F172A;
  margin-bottom: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.2s;
}

.url-input-transparent:focus {
  outline: none;
  border-color: #6366F1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.upload-hint {
  font-size: 12px;
  color: #94A3B8;
  line-height: 1.5;
}

/* Radio Cards (Ticket Setting) */
.radio-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.radio-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.radio-card.active {
  background: #F5F3FF; /* Light purple tint */
  border-color: #6366F1;
}

.radio-indicator {
  position: relative;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  margin-top: 2px;
}

.radio-indicator input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.radio-circle {
  width: 20px;
  height: 20px;
  border: 2px solid #CBD5E1;
  border-radius: 50%;
  transition: all 0.2s;
}

.radio-card.active .radio-circle {
  border-color: #6366F1;
  border-width: 6px;
}

.radio-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.radio-title {
  font-weight: 600;
  font-size: 14px;
  color: #0F172A;
}

.radio-description {
  font-size: 13px;
  color: #64748B;
}

.price-input-inline {
  margin-top: 8px;
  padding: 8px 12px;
  border: 1px solid #E2E8F0;
  border-radius: 6px;
  font-size: 14px;
  width: 150px;
}

/* Tag Input */
.tag-input-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tags-display {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-chip {
  background: #EEF2FF;
  color: #6366F1;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.tag-remove {
  background: none;
  border: none;
  font-size: 16px;
  color: #6366F1;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  display: flex;
}

.tag-input-wrapper {
  display: flex;
  gap: 8px;
}

.tag-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 14px;
}

.tag-input:focus {
  outline: none;
  border-color: #6366F1;
}

.add-tag-btn {
  padding: 0 20px;
  background: #F1F5F9;
  border: none;
  border-radius: 8px;
  color: #0F172A;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.add-tag-btn:hover {
  background: #E2E8F0;
}

/* Pills for Location Type */
.pill-group {
    display: flex;
    gap: 12px;
}

.pill-option {
    cursor: pointer;
}

.pill-option input {
    display: none;
}

.pill-option span {
    display: inline-block;
    padding: 10px 24px;
    background: #F1F5F9;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    color: #64748B;
    transition: all 0.2s;
}

.pill-option input:checked + span {
    background: #6366F1; 
    color: #fff;
    font-weight: 600;
}


/* Footer Buttons */
.form-footer {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #F1F5F9;
}

.btn-cancel {
  padding: 12px 24px;
  background: transparent;
  border: none;
  color: #64748B;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
}

.btn-cancel:hover {
  color: #0F172A;
}

.btn-submit {
  padding: 12px 32px;
  background: #6366F1;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s;
}

.btn-submit:hover:not(:disabled) {
  background: #4F46E5;
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>