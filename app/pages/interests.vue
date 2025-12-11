<template>
  <div class="interests-page">
    <div class="header">
      <h1 class="title">Choose Your Interests</h1>
      <p class="subtitle">Select topics you're passionate about to personalize your experience</p>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
      </div>
      <p class="progress-text">{{ selectedInterests.length }} of {{ minRequired }} minimum selected</p>
    </div>

    <div class="interests-grid">
      <div 
        v-for="interest in availableInterests" 
        :key="interest.id"
        class="interest-card"
        :class="{ 
          'selected': isSelected(interest.id),
          'disabled': !canSelect && !isSelected(interest.id) 
        }"
        @click="toggleInterest(interest.id)"
      >
        <div class="interest-icon">{{ interest.icon }}</div>
        <h3 class="interest-title">{{ interest.name }}</h3>
        <p class="interest-description">{{ interest.description }}</p>
        <div v-if="isSelected(interest.id)" class="selected-indicator">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
        </div>
      </div>
    </div>

    <div class="actions">
      <button 
        v-if="selectedInterests.length >= minRequired"
        @click="saveInterests" 
        class="btn-primary"
        :disabled="loading"
      >
        {{ loading ? 'Saving...' : 'Continue' }}
      </button>
      
      <button 
        v-if="selectedInterests.length < minRequired"
        class="btn-disabled" 
        disabled
      >
        Select at least {{ minRequired }} interests to continue
      </button>
      
      <button @click="skipInterests" class="btn-skip">
        Skip for now
      </button>
    </div>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  middleware: 'auth'
});

const { updateProfile } = useAuth();
const router = useRouter();

const selectedInterests = ref<string[]>([]);
const loading = ref(false);
const error = ref('');
const minRequired = 3;
const maxAllowed = 8;

const availableInterests = [
  {
    id: 'literature',
    name: 'Literature',
    icon: '📚',
    description: 'Classic and contemporary books, poetry, and literary analysis'
  },
  {
    id: 'fiction',
    name: 'Fiction',
    icon: '📖',
    description: 'Novels, short stories, and imaginative narratives'
  },
  {
    id: 'non-fiction',
    name: 'Non-Fiction',
    icon: '📰',
    description: 'Biography, history, science, and educational content'
  },
  {
    id: 'mystery',
    name: 'Mystery & Thriller',
    icon: '🔍',
    description: 'Crime, detective stories, and suspenseful plots'
  },
  {
    id: 'science-fiction',
    name: 'Science Fiction',
    icon: '🚀',
    description: 'Futuristic stories, technology, and space exploration'
  },
  {
    id: 'fantasy',
    name: 'Fantasy',
    icon: '🏰',
    description: 'Magic, mythical creatures, and imaginary worlds'
  },
  {
    id: 'romance',
    name: 'Romance',
    icon: '💕',
    description: 'Love stories, relationships, and emotional narratives'
  },
  {
    id: 'self-help',
    name: 'Self Development',
    icon: '💪',
    description: 'Personal growth, productivity, and life improvement'
  },
  {
    id: 'business',
    name: 'Business',
    icon: '💼',
    description: 'Entrepreneurship, leadership, and professional development'
  },
  {
    id: 'philosophy',
    name: 'Philosophy',
    icon: '🤔',
    description: 'Deep thinking, ethics, and existential questions'
  },
  {
    id: 'history',
    name: 'History',
    icon: '🏛️',
    description: 'Historical events, cultures, and civilizations'
  },
  {
    id: 'science',
    name: 'Science',
    icon: '🔬',
    description: 'Research, discoveries, and scientific knowledge'
  },
  {
    id: 'art',
    name: 'Arts & Culture',
    icon: '🎨',
    description: 'Visual arts, music, theater, and cultural studies'
  },
  {
    id: 'technology',
    name: 'Technology',
    icon: '💻',
    description: 'Programming, innovation, and digital transformation'
  },
  {
    id: 'health',
    name: 'Health & Wellness',
    icon: '🌱',
    description: 'Physical health, mental wellness, and lifestyle'
  },
  {
    id: 'travel',
    name: 'Travel',
    icon: '✈️',
    description: 'Adventure, cultures, and exploration stories'
  }
];

const progressPercentage = computed(() => {
  return Math.min((selectedInterests.value.length / minRequired) * 100, 100);
});

const canSelect = computed(() => {
  return selectedInterests.value.length < maxAllowed;
});

const isSelected = (interestId: string) => {
  return selectedInterests.value.includes(interestId);
};

const toggleInterest = (interestId: string) => {
  if (isSelected(interestId)) {
    // Remove interest
    selectedInterests.value = selectedInterests.value.filter(id => id !== interestId);
  } else if (canSelect.value) {
    // Add interest
    selectedInterests.value.push(interestId);
  }
};

const saveInterests = async () => {
  if (selectedInterests.value.length < minRequired) {
    error.value = `Please select at least ${minRequired} interests.`;
    return;
  }
  
  loading.value = true;
  error.value = '';
  
  try {
    // Create interest scores object
    const interestScores: Record<string, number> = {};
    selectedInterests.value.forEach((interest, index) => {
      // Give higher scores to first selected interests (user preference priority)
      interestScores[interest] = 10 - (index * 0.5);
    });
    
    const success = await updateProfile({ interestScores });
    
    if (success) {
      // Redirect to dashboard
      await router.push('/dashboard');
    } else {
      error.value = 'Failed to save interests. Please try again.';
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to save interests. Please try again.';
  } finally {
    loading.value = false;
  }
};

const skipInterests = async () => {
  // Redirect to dashboard without saving interests
  await router.push('/dashboard');
};
</script>

<style scoped>
.interests-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px;
}

.header {
  text-align: center;
  margin-bottom: 40px;
}

.title {
  font-size: 28px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 8px;
}

.subtitle {
  color: #64748b;
  font-size: 16px;
  margin-bottom: 24px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background-color: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 12px;
}

.progress-fill {
  height: 100%;
  background-color: #FFDA49;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  color: #64748b;
  font-size: 14px;
  font-weight: 600;
}

.interests-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.interest-card {
  position: relative;
  padding: 24px;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: white;
  text-align: center;
}

.interest-card:hover {
  border-color: #FFDA49;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 218, 73, 0.15);
}

.interest-card.selected {
  border-color: #FFDA49;
  background-color: #fffbeb;
  box-shadow: 0 4px 12px rgba(255, 218, 73, 0.2);
}

.interest-card.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.interest-card.disabled:hover {
  transform: none;
  box-shadow: none;
  border-color: #e2e8f0;
}

.interest-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.interest-title {
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 8px;
}

.interest-description {
  font-size: 14px;
  color: #64748b;
  line-height: 1.5;
}

.selected-indicator {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  background-color: #FFDA49;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0f172a;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
}

.btn-primary {
  background-color: #FFDA49;
  color: #0f172a;
  font-weight: 700;
  padding: 16px 32px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 16px;
  min-width: 200px;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 218, 73, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-disabled {
  background-color: #f1f5f9;
  color: #94a3b8;
  font-weight: 600;
  padding: 16px 32px;
  border-radius: 12px;
  border: none;
  cursor: not-allowed;
  font-size: 16px;
  min-width: 200px;
}

.btn-skip {
  background: none;
  border: none;
  color: #64748b;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
  text-decoration: underline;
  padding: 8px 16px;
}

.btn-skip:hover {
  color: #0f172a;
}

.error-message {
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 16px;
  border-radius: 8px;
  font-size: 14px;
  text-align: center;
  margin-top: 20px;
}

@media (max-width: 768px) {
  .interests-grid {
    grid-template-columns: 1fr;
  }
  
  .interest-card {
    padding: 20px;
  }
  
  .interest-icon {
    font-size: 40px;
  }
}
</style>