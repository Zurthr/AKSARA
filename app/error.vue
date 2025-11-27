<script setup lang="ts">
import { clearError } from '#app'
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const resetError = () => {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div v-if="props.error?.statusCode === 404" class="error-layout">
    <Sidebar />
    <div class="content">
      <Navbar />
      <Slug>
        <NotFoundContent />
      </Slug>
    </div>
  </div>
  <div v-else class="error-fallback">
    <div class="error-card">
      <p class="eyebrow">Unexpected error</p>
      <h1>{{ props.error?.statusMessage || 'Something went wrong' }}</h1>
      <p class="body">
        Please try again or head back to the dashboard while we look into it.
      </p>
      <button class="back-home" type="button" @click="resetError">
        Back to dashboard
      </button>
    </div>
  </div>
</template>

<style scoped>
.error-layout {
  display: flex;
  min-height: 100vh;
  overflow: hidden;
}

.content {
  flex: 1;
  margin-left: 240px;
  display: flex;
  flex-direction: column;
  width: calc(100vw - 240px);
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
}

.error-fallback {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9fafb;
  padding: 24px;
}

.error-card {
  width: 100%;
  max-width: 540px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 32px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.1);
}

.eyebrow {
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #f97316;
}

h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: #111827;
}

.body {
  margin: 0;
  color: #475467;
  line-height: 1.6;
}

.back-home {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
  padding: 10px 20px;
  border-radius: 999px;
  background: #2563eb;
  color: #ffffff;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background 0.2s ease;
}

.back-home:hover {
  background: #1d4ed8;
}
</style>

