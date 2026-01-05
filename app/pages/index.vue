<template>
  <div class="index-page">
    <EventsSection />
    <div class="index-page-content">
      <div class="index-page-content-left">
        <ReadsSection />
        <div class="posts-section-header">
          <div class="section-title">
            <div style="background-color: var(--color-highlight); width:fit-content; text-decoration: underline;">Forums</div>
            curated for you
          </div>
          <NuxtLink to="/forums" class="see-more-link">
            <span>See more</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 12a8 8 0 0 1 8-8 8 8 0 0 1 8 8 8 8 0 0 1-8 8 8 8 0 0 1-8-8zm2 0a6 6 0 0 0 6 6 6 6 0 0 0 6-6 6 6 0 0 0-6-6 6 6 0 0 0-6 6zm5-3l3 3-3 3v-2H8v-2h3V9z" fill="currentColor"/>
            </svg>
          </NuxtLink>
        </div>
        <ForumCard 
          v-for="post in visiblePosts" 
          :key="post.id" 
          :post="post" 
        />
        
        <div v-if="!disableInfiniteScroll" class="lazy-load-section">
          <div v-if="isLoading" class="loading-indicator">
            <div class="spinner"></div>
            <span>Loading more posts...</span>
          </div>
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
const { posts, isLoading, hasMore, loadMore } = useLazyPosts(5);
const visiblePosts = computed(() => posts.value.slice(0, 5));
const sentinelRef = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;
const disableInfiniteScroll = true;

onMounted(() => {
  loadMore();
  if (disableInfiniteScroll) {
    return;
  }
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
        rootMargin: '100px', 
        threshold: 0
      }
    );
  }

});


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

.posts-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 8px 0 4px;
  padding: 0 16px;
}

.section-title {
  font-size: 18px;
  font-weight: 400;
  color: #111827;
  margin: 0;
  display: flex;
  flex-direction: row;
  gap: 8px;
}

.see-more-link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--color-black);
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  transition: color 0.2s ease;
}

.see-more-link:hover {
  color: var(--color-primary);
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
