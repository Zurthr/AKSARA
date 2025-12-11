<template>
  <div class="coming-soon">
    <h1>Literature Feature</h1>
    <p>Coming soon in this branch...</p>
    <NuxtLink to="/dashboard" class="btn-primary">Go to Dashboard</NuxtLink>
  </div>
</template>

<script setup lang="ts">
// Placeholder page for auth branch
</script>

<style scoped>
.coming-soon {
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  text-align: center;
}

.btn-primary {
  background-color: #4f46e5;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
}
</style>

