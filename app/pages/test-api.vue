<template>
  <div class="test-api">
    <h1>Test Laravel API Connection</h1>
    
    <div class="test-section">
      <button @click="testConnection" :disabled="loading" class="test-btn">
        {{ loading ? 'Testing...' : 'Test API Connection' }}
      </button>
    </div>

    <div v-if="error" class="error">
      <h3>Error:</h3>
      <p>{{ error }}</p>
    </div>

    <div v-if="events.length > 0" class="success">
      <h3>Success! Events from Laravel:</h3>
      <pre>{{ JSON.stringify(events, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEvents } from '~/composables/useEvents'
import type { Event } from '~/composables/useEvents'

const { getAllEvents, loading, error } = useEvents()
const events = ref<Event[]>([])

const testConnection = async () => {
  console.log('Testing connection to Laravel API...')
  const response = await getAllEvents()
  
  if (response && response.data) {
    events.value = response.data
    console.log('API test successful:', response)
  }
}
</script>

<style scoped>
.test-api {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.test-btn {
  background: #3b82f6;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
}

.test-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.error {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 16px;
  border-radius: 8px;
  margin-top: 16px;
}

.success {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #166534;
  padding: 16px;
  border-radius: 8px;
  margin-top: 16px;
}

pre {
  background: #f3f4f6;
  padding: 12px;
  border-radius: 4px;
  overflow: auto;
  font-size: 12px;
}
</style>