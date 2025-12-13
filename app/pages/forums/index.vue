<template>
  <div class="forum-index">
      <main class="feed-section">
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
      </main>
      
    <RightSideBar>
      <NuxtLink to="/forums/create" class="btn-create-post">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        Create New Post
      </NuxtLink>
      <TrendingSidebar />
    </RightSideBar>
  </div>
</template>

<script setup lang="ts">
import RightSideBar from '~/components/General/RightSideBar.vue';
import { useLazyPosts } from '~/composables/useLazyPosts';

// Use lazy loading for posts
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
.forum-index {
  width: 100%;
  padding: 24px;
  background-color: #f8fafc;
  min-height: 100%;
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  gap: 24px;
}


.feed-section {
  flex: 1;
  min-width: 0;
}

.btn-create-post {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: #FFDA49;
  color: var(--color-black);
  padding: 12px 20px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  width: 100%;
  margin-bottom: 24px;
}

.btn-create-post:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
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


