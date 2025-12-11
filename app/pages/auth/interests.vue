<template>
  <div class="interests-page">
    <!-- Background decorative elements -->
    <div class="bg-decoration">
      <div class="decoration-circle circle-1"></div>
      <div class="decoration-circle circle-2"></div>
      <div class="decoration-shape shape-1"></div>
      <div class="decoration-shape shape-2"></div>
    </div>

    <div class="interests-container">
      <!-- Header with logo area -->
      <div class="interests-header">
        
        <div class="header-content">
          <h1 class="interests-title">Choose Your Interests</h1>
          <p class="interests-subtitle">
            Help us curate personalized content for you by selecting your favorite topics
          </p>
          <div class="progress-indicator">
            <div class="progress-step completed"></div>
            <div class="progress-step completed"></div>
            <div class="progress-step active"></div>
            <div class="progress-step"></div>
          </div>
        </div>
      </div>

      <!-- Simple Layout -->
      <div class="simple-layout">
        <!-- Selection counter -->
        <div class="selection-counter">
          <div class="counter-circle">
            <span class="counter-number">{{ selectedInterests.length }}</span>
            <span class="counter-total">/ {{ availableInterests.length }}</span>
          </div>
          <p class="counter-text">Select at least 3 interests to continue</p>
        </div>

        <!-- Interests list -->
        <div class="interests-list">
          <button
            v-for="interest in availableInterests"
            :key="interest.id"
            type="button"
            :title="interest.description"
            :class="[
              'interest-pill',
              `variant-${interest.variant}`,
              { selected: selectedInterests.includes(interest.id) }
            ]"
            @click="toggleInterest(interest.id)"
          >
            <span class="pill-icon">{{ interest.icon }}</span>
            <span class="pill-label">{{ interest.name }}</span>
            <span class="pill-check" v-if="selectedInterests.includes(interest.id)">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M12.5 4.5L7 11L3.5 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
          </button>
        </div>

        <!-- Action buttons -->
        <div class="actions">
          <button 
            @click="skipSelection" 
            class="btn-skip"
          >
            Skip for now
          </button>
          <button 
            @click="saveInterests"
            :disabled="selectedInterests.length < 3 || loading"
            class="btn-continue"
          >
            <span v-if="loading">
              <svg class="loading-spinner" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="37.7" stroke-dashoffset="37.7">
                  <animateTransform attributeName="transform" type="rotate" values="0 8 8;360 8 8" dur="1s" repeatCount="indefinite"/>
                </circle>
              </svg>
              Saving...
            </span>
            <span v-else>Continue to Dashboard</span>
          </button>
        </div>
      </div>

      <!-- Error message -->
      <div v-if="error" class="error-message">
        <div class="error-icon">⚠</div>
        <span>{{ error }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'onboarding',
  middleware: 'auth'
})

const { user, updateProfile } = useAuth()
const router = useRouter()

const selectedInterests = ref<string[]>([])
const loading = ref(false)
const error = ref('')

const availableInterests = [
  {
    id: 'fiction',
    name: 'Fiction',
    icon: '📚',
    description: 'Novels, short stories, and imaginative literature',
    variant: 'slate'
  },
  {
    id: 'non-fiction',
    name: 'Non-Fiction',
    icon: '📖',
    description: 'Biographies, essays, and factual books',
    variant: 'yellow'
  },
  {
    id: 'science',
    name: 'Science & Technology',
    icon: '🔬',
    description: 'Scientific research, technology, and innovation',
    variant: 'blue'
  },
  {
    id: 'history',
    name: 'History',
    icon: '🏛️',
    description: 'Historical events, cultures, and civilizations',
    variant: 'slate'
  },
  {
    id: 'philosophy',
    name: 'Philosophy',
    icon: '🤔',
    description: 'Philosophical thoughts, ethics, and wisdom',
    variant: 'dark'
  },
  {
    id: 'poetry',
    name: 'Poetry',
    icon: '✍️',
    description: 'Poems, verses, and lyrical expressions',
    variant: 'blue'
  },
  {
    id: 'business',
    name: 'Business',
    icon: '💼',
    description: 'Entrepreneurship, management, and economics',
    variant: 'yellow'
  },
  {
    id: 'self-help',
    name: 'Self-Help',
    icon: '🌟',
    description: 'Personal development and self-improvement',
    variant: 'blue'
  },
  {
    id: 'mystery',
    name: 'Mystery & Thriller',
    icon: '🔍',
    description: 'Suspenseful and detective stories',
    variant: 'dark'
  },
  {
    id: 'romance',
    name: 'Romance',
    icon: '💕',
    description: 'Love stories and romantic literature',
    variant: 'slate'
  },
  {
    id: 'fantasy',
    name: 'Fantasy',
    icon: '🐉',
    description: 'Magical worlds and supernatural adventures',
    variant: 'dark'
  },
  {
    id: 'health',
    name: 'Health & Wellness',
    icon: '🏃',
    description: 'Fitness, nutrition, and mental health',
    variant: 'yellow'
  }
]

const getInterestById = (id: string) => {
  return availableInterests.find(interest => interest.id === id)
}

const toggleInterest = (interestId: string) => {
  const index = selectedInterests.value.indexOf(interestId)
  if (index > -1) {
    selectedInterests.value.splice(index, 1)
  } else {
    selectedInterests.value.push(interestId)
  }
}

const saveInterests = async () => {
  if (selectedInterests.value.length < 3) {
    error.value = 'Please select at least 3 interests'
    return
  }

  loading.value = true
  error.value = ''

  try {
    // Create interest scores object
    const interestScores: Record<string, number> = {}
    selectedInterests.value.forEach(interest => {
      interestScores[interest] = 1.0 // Initial score of 1.0 for selected interests
    })

    // Update user profile with interest scores
    const success = await updateProfile({
      interestScores
    })

    if (success) {
      // Redirect to dashboard
      await router.push('/dashboard')
    } else {
      error.value = 'Failed to save interests. Please try again.'
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to save interests'
  } finally {
    loading.value = false
  }
}

const skipSelection = async () => {
  // Go to dashboard without saving interests
  await router.push('/dashboard')
}

// Pre-select interests if user already has them
onMounted(() => {
  if (user.value?.interestScores) {
    selectedInterests.value = Object.keys(user.value.interestScores)
  }
})
</script>

<style scoped>
.interests-page {
  min-height: 100vh;
  height: 100vh;
  background: linear-gradient(135deg, #e0f2fe 0%, #eef2ff 35%, #fef3c7 100%);
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  justify-content: center;
  scrollbar-width: none;
}

.interests-page::-webkit-scrollbar {
  display: none;
}

/* Background decorative elements */
.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 0;
}

.decoration-circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.08;
}

.circle-1 {
  width: 400px;
  height: 400px;
  background: #4F8CF4;
  top: -200px;
  right: -200px;
}

.circle-2 {
  width: 300px;
  height: 300px;
  background: #F4D03F;
  bottom: -150px;
  left: -150px;
}

.decoration-shape {
  position: absolute;
  opacity: 0.04;
}

.shape-1 {
  width: 200px;
  height: 200px;
  background: #5DADE2;
  border-radius: 30px;
  top: 15%;
  left: 5%;
  transform: rotate(45deg);
}

.shape-2 {
  width: 150px;
  height: 150px;
  background: #4F8CF4;
  border-radius: 50%;
  bottom: 20%;
  right: 10%;
}

.interests-container {
  position: relative;
  z-index: 1;
  max-width: 1600px;
  margin: 0 auto;
  padding: 40px 24px;
}

/* Header section */
.interests-header {
  text-align: center;
  margin-bottom: 40px;
}

.brand-section {
  margin-bottom: 24px;
}

.brand-logo {
  display: inline-flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 8px;
}

.logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-name {
  font-size: 36px;
  font-weight: 700;
  color: #1e293b;
  letter-spacing: 3px;
}

.brand-tagline {
  font-size: 16px;
  color: #64748b;
  font-weight: 500;
}

.header-content {
  background: white;
  border-radius: 24px;
  padding: 40px 48px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(226, 232, 240, 0.6);
  max-width: 700px;
  margin: 0 auto;
}

.interests-title {
  font-size: 36px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #4F8CF4, #5DADE2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.interests-subtitle {
  font-size: 18px;
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 24px;
}

.progress-indicator {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.progress-step {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #e2e8f0;
  transition: all 0.3s ease;
}

.progress-step.completed {
  background: #4F8CF4;
}

.progress-step.active {
  background: #F4D03F;
  transform: scale(1.3);
}

/* Simple Layout */
.simple-layout {
  max-width: 960px;
  margin: 0 auto;
  background: white;
  border-radius: 28px;
  padding: 56px 64px;
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08);
  border: 1px solid rgba(226, 232, 240, 0.6);
}

/* Selection counter */
.selection-counter {
  text-align: center;
  margin-bottom: 48px;
}

.counter-circle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4F8CF4, #5DADE2);
  color: white;
  margin-bottom: 16px;
  box-shadow: 0 4px 16px rgba(79, 140, 244, 0.3);
}

.counter-number {
  font-size: 24px;
  font-weight: 700;
}

.counter-total {
  font-size: 14px;
  font-weight: 500;
  margin-left: 2px;
}

.counter-text {
  color: #64748b;
  font-size: 16px;
  font-weight: 500;
}

/* Interests list */
.interests-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
  margin-bottom: 56px;
}

.interest-pill {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 14px 28px;
  border-radius: 999px;
  border: none;
  background: rgba(255, 255, 255, 0.65);
  color: #1e293b;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease, color 0.2s ease;
  position: relative;
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.08);
}

.interest-pill:focus-visible {
  outline: 3px solid rgba(79, 140, 244, 0.4);
  outline-offset: 2px;
}

.interest-pill:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.12);
}

.interest-pill.selected {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 18px 36px rgba(15, 23, 42, 0.18);
}

.pill-icon {
  font-size: 20px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.pill-label {
  white-space: nowrap;
}

.pill-check {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.85);
}

.interest-pill.selected .pill-check svg {
  display: block;
}

.interest-pill:not(.selected) .pill-check {
  display: none;
}

.interest-pill.variant-blue {
  background: rgba(59, 130, 246, 0.12);
  color: #1d4ed8;
}

.interest-pill.variant-blue.selected {
  background: #2563eb;
  color: #f8fafc;
}

.interest-pill.variant-blue.selected .pill-check {
  color: #2563eb;
}

.interest-pill.variant-yellow {
  background: rgba(250, 204, 21, 0.18);
  color: #FFDA49;
}

.interest-pill.variant-yellow.selected {
  background: #f59e0b;
  color: #fff7ed;
}

.interest-pill.variant-yellow.selected .pill-check {
  color: #f59e0b;
}

.interest-pill.variant-slate {
  background: rgba(148, 163, 184, 0.2);
  color: #1f2937;
}

.interest-pill.variant-slate.selected {
  background: #1f2937;
  color: #f8fafc;
}

.interest-pill.variant-slate.selected .pill-check {
  color: #1f2937;
}

.interest-pill.variant-dark {
  background: rgba(15, 23, 42, 0.85);
  color: #f8fafc;
}

.interest-pill.variant-dark.selected {
  background: #0f172a;
  color: #f8fafc;
}

.interest-pill.variant-dark .pill-check {
  background: rgba(248, 250, 252, 0.9);
  color: #0f172a;
}

/* Actions */
.actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.btn-skip {
  padding: 14px 32px;
  border: 2px solid #e2e8f0;
  background: white;
  color: #64748b;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-skip:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
  color: #475569;
}

.btn-continue {
  padding: 16px 40px;
  background: linear-gradient(135deg, #4F8CF4, #5DADE2);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(79, 140, 244, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 200px;
}

.btn-continue:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(79, 140, 244, 0.4);
}

.btn-continue:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: 0 4px 16px rgba(79, 140, 244, 0.2);
}

.loading-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Error message */
.error-message {
  background: linear-gradient(135deg, #fef2f2, #fee2e2);
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 16px 24px;
  border-radius: 12px;
  margin-top: 24px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 500;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.error-icon {
  font-size: 18px;
}

/* Responsive design */
@media (max-width: 768px) {
  .interests-container {
    padding: 20px 16px;
  }

  .header-content {
    padding: 32px 24px;
  }

  .interests-title {
    font-size: 28px;
  }

  .brand-name {
    font-size: 28px;
  }

  .simple-layout {
    padding: 32px 24px;
  }

  .interest-content {
    gap: 16px;
  }

  .interest-icon {
    font-size: 28px;
  }

  .interest-name {
    font-size: 16px;
  }

  .actions {
    flex-direction: column;
    align-items: center;
  }

  .btn-skip,
  .btn-continue {
    width: 100%;
    max-width: 300px;
  }
}

@media (max-width: 480px) {
  .interest-item {
    padding: 16px 20px;
  }

  .interests-title {
    font-size: 24px;
  }

  .brand-logo {
    flex-direction: column;
    gap: 8px;
  }
  
  .brand-name {
    font-size: 24px;
  }

  .counter-circle {
    width: 70px;
    height: 70px;
  }

  .counter-number {
    font-size: 20px;
  }

  .interest-content {
    gap: 12px;
  }

  .interest-icon {
    font-size: 24px;
  }

  .interest-name {
    font-size: 15px;
  }

  .interest-description {
    font-size: 13px;
  }
}
</style>