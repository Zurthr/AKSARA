<template>
  <div class="index-page">
    <EventsSection />
    <div class="index-page-content">
      <div class="index-page-content-left">
        <ReadsSection />
        <ForumCard 
          v-for="post in posts" 
          :key="post.id" 
          :post="post" 
        />
        
        <!-- Lazy Load Section with Infinite Scroll -->
        <div class="lazy-load-section">
          <div v-if="isLoading" class="loading-indicator">
            <div class="spinner"></div>
            <span>Loading more posts...</span>
          </div>
          <!-- Invisible sentinel element that triggers auto-load when scrolled into view -->
          <div 
            v-else-if="hasMore" 
            ref="sentinelRef"
            class="scroll-sentinel"
          ></div>
          <p v-else class="no-more-items">You've seen all posts</p>
        </div>
      </div>
      <RightSideBar>
        <TrendingSidebar />
      </RightSideBar>
    </div>
  </div>
</template>

<script setup lang="ts">
// Auto import not working gatau kenapa jirr
import RightSideBar from '~/components/General/RightSideBar.vue';
import ReadsSection from '~/components/Literature/ReadsSection.vue';
import { useLazyPosts } from '~/composables/useLazyPosts';

// Use lazy loading for posts with infinite scroll
const { posts, isLoading, hasMore, loadMore } = useLazyPosts(10);

// Intersection Observer for infinite scroll
const sentinelRef = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

onMounted(() => {
  if (typeof window !== 'undefined') {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && hasMore.value && !isLoading.value) {
            loadMore();
          }
        });
      },
      {
        root: null,
        rootMargin: '100px', // Load when 100px before reaching the sentinel
        threshold: 0
      }
    );
  }
});

// Watch for sentinel ref changes to observe/unobserve
watch(sentinelRef, (newRef, oldRef) => {
  if (oldRef && observer) {
    observer.unobserve(oldRef);
  }
  if (newRef && observer) {
    observer.observe(newRef);
  }
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
});
</script>

<style scoped>
.index-page {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.index-page-content {
  display: flex;
  flex-direction: row;
  gap: 20px;
}
.index-page-content-left {
  display: flex;
  width: 920px;
  flex-direction: column;
  gap: 20px;
}

/* Lazy Load Styles */
.lazy-load-section {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 32px 0;
  width: 100%;
}

.loading-indicator {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #64748b;
  font-size: 14px;
}

.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid #e2e8f0;
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.scroll-sentinel {
  width: 100%;
  height: 1px;
  visibility: hidden;
}

.no-more-items {
  color: #94a3b8;
  font-size: 14px;
  font-style: italic;
  margin: 0;
}
</style>


