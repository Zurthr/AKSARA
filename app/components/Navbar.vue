<template>
  <header class="navbar">
    <div class="search-center">
        <div class="search-wrapper">
          <!-- TODO: replace with actual search icon component -->
          <span class="icon-placeholder">!</span>
          <input
            type="search"
            class="search-input"
            placeholder="Search something..."
            v-model="searchQuery"
            @keyup.enter="handleSearch"
          />
        </div>
    </div>
    <div class="action-icons">
      <!-- TODO: swap placeholders with bell/profile icons -->
      <button type="button" class="icon-button">!</button>
      <button type="button" class="icon-button">!</button>
    </div>
  </header>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();

const searchQuery = ref<string>((route.query.q as string) || (route.query.search as string) || '');

// Update search query from URL when route changes
watch(() => route.query, (newQuery) => {
  searchQuery.value = (newQuery.q as string) || (newQuery.search as string) || '';
}, { immediate: true });

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    // Redirect to literature page with search query
    // You can add logic here to determine content type (literature, forums, events, etc.)
    // For now, defaulting to literature
    const query: Record<string, string | string[]> = {
      q: searchQuery.value.trim()
    };
    
    // Preserve filter params if already on literature page
    if (route.path === '/literature') {
      if (route.query.copyType) query.copyType = route.query.copyType as string;
      if (route.query.licensingType) query.licensingType = route.query.licensingType as string;
      if (route.query.sources) query.sources = route.query.sources as string;
      if (route.query.tags) {
        query.tags = Array.isArray(route.query.tags) 
          ? route.query.tags
          : [route.query.tags as string];
      }
    }
    
    router.push({
      path: '/literature',
      query
    });
  }
};
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
  height: 64px;
  background-color: var(--color-white);
  border-bottom: 1px solid #e5e7eb;
  padding:12px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.search-wrapper {
  display: flex;
  height: 40px;
  padding: 8px 12px;
  align-items: center;
  gap: 10px;
  border-radius: 16px;
  width:50vw;
  max-width: 800px;
  min-width: 420px;
  margin-left: 92px;
  background-color: var(--color-light-blue);
}

.icon-placeholder {
  font-size: 14px;
  color: #94a3b8;
}

.search-center {
  width: 100vw;
  display: flex;
  justify-content: center;
}

.search-input {
  width: 100%;
  border: none;
  background: transparent;
  outline: none;
  font-size: 14px;
  color: var(--color-black);
}

.search-input::placeholder {
  color: #94a3b8;
}

.action-icons {
  display: flex;
  align-items: center;
  gap: 12px;
}

.icon-button {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: none;
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
}


@media screen and (max-width: 1040px) {
  .search-center {
    justify-content: start;
  }
  .search-wrapper {
    margin: 0;
  }
}
.icon-button:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
</style>

