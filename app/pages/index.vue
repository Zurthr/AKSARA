<template>
  <div class="index-page">
    <EventsSection />
    <div class="index-page-content">
      <div class="index-page-content-left">
        <ReadsSection />
        <section class="recommendations-section" v-if="recommendationsLoaded && recommendedItems.length">
          <div class="recommendations-header">
            <div>
              <h2 class="recommendations-title">For you, right now</h2>
              <p class="recommendations-subtitle">Threads, reads, events, and communities picked from your activity</p>
            </div>
          </div>
          <div class="recommendations-grid">
            <NuxtLink
              v-for="item in recommendedItems"
              :key="`${item.type}-${item.id}`"
              :to="item.href"
              class="recommendation-card"
              :data-type="item.type"
              @click="handleRecommendationClick(item)"
            >
              <div class="rec-header">
                <span class="rec-type">{{ item.label }}</span>
                <span class="rec-score">★ {{ item.score.toFixed(2) }}</span>
              </div>
              <h3>{{ item.title }}</h3>
              <p>{{ item.subtitle }}</p>
              <div class="rec-meta">
                <span v-if="item.meta">{{ item.meta }}</span>
              </div>
            </NuxtLink>
          </div>
        </section>
        <section class="recommendations-empty" v-else-if="recommendationsLoaded && !recommendedItems.length">
          <div class="empty-pill">Recommendations</div>
          <h3>Nothing to recommend yet</h3>
          <p>Open a few threads, books, or events and we will surface personalized picks here.</p>
        </section>
        <ForumCard 
          v-for="post in posts" 
          :key="post.id" 
          :post="post" 
        />
        
        <div class="lazy-load-section">
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
import { useRecommendations } from '~/composables/useRecommendations';
import { useClickTracking } from '~/composables/useClickTracking';

// Use lazy loading for posts with infinite scroll
const { posts, isLoading, hasMore, loadMore } = useLazyPosts(10);
const sentinelRef = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;
const config = useRuntimeConfig();
const { fetchRecommendations } = useRecommendations();
const { trackPostClick, trackBookClick, trackEventClick, trackCommunityClick } = useClickTracking();
const recommendedItems = ref<Array<{
  id: string;
  type: 'post' | 'book' | 'event' | 'community';
  label: string;
  title: string;
  subtitle: string;
  meta?: string;
  href: string;
  score: number;
}>>([]);
const recommendationsLoaded = ref(false);

type ThreadResponse = {
  success: boolean;
  data: {
    id: string;
    title: string;
    content: string;
    communityId: string;
    createdAt: string;
    updatedAt: string;
    stars?: number;
    community?: {
      id: string;
      name: string;
    };
    author?: {
      id: string;
      email?: string;
      profile?: {
        displayName?: string;
        avatarUrl?: string | null;
      };
    };
  };
};

const formatTimeAgo = (value?: string) => {
  if (!value) return 'just now';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'just now';

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes} min ago`;
  if (diffHours < 24) return `${diffHours} hr ago`;
  return `${diffDays} d ago`;
};

const resolveAuthorName = (author?: ThreadResponse['data']['author']) => {
  return author?.profile?.displayName || author?.email || 'Unknown';
};


type ResourceResponse = {
  success: boolean;
  data: {
    id: string;
    title: string;
    author?: string;
    cover?: string;
    rating?: number;
    tags?: Array<{ name: string } | string>;
  };
};

type EventResponse = {
  success: boolean;
  data: {
    id: string;
    title: string;
    description?: string;
    date?: string;
    location?: string;
  };
};

type CommunityResponse = {
  success: boolean;
  data: {
    id: string;
    name: string;
    description?: string;
    members?: string | number;
  };
};

const fetchHomeRecommendations = async () => {
  recommendationsLoaded.value = false;
  const baseUrl = config.public.apiBaseUrl;

  try {
    const [posts, books, events, communities] = await Promise.all([
      fetchRecommendations('post', 3),
      fetchRecommendations('book', 2),
      fetchRecommendations('event', 2),
      fetchRecommendations('community', 2)
    ]);

    const postDetails = await Promise.all(
      posts.map(item => $fetch<ThreadResponse>(`${baseUrl}/threads/${item.id}`))
    );
    const bookDetails = await Promise.all(
      books.map(item => $fetch<ResourceResponse>(`${baseUrl}/resources/${item.id}`))
    );
    const eventDetails = await Promise.all(
      events.map(item => $fetch<EventResponse>(`${baseUrl}/events/${item.id}`))
    );
    const communityDetails = await Promise.all(
      communities.map(item => $fetch<CommunityResponse>(`${baseUrl}/communities/${item.id}`))
    );

    const mappedPosts = postDetails
      .filter(detail => detail?.success && detail.data)
      .map((detail, index) => ({
        id: detail.data.id,
        type: 'post' as const,
        label: 'Thread',
        title: detail.data.title,
        subtitle: resolveAuthorName(detail.data.author),
        meta: detail.data.community?.name,
        href: `/forums/${detail.data.id}`,
        score: posts[index]?.score ?? 0
      }));

    const mappedBooks = bookDetails
      .filter(detail => detail?.success && detail.data)
      .map((detail, index) => ({
        id: detail.data.id,
        type: 'book' as const,
        label: 'Resource',
        title: detail.data.title,
        subtitle: detail.data.author || 'AKSARA Library',
        meta: detail.data.rating ? `★ ${detail.data.rating}` : undefined,
        href: `/literature/${detail.data.id}`,
        score: books[index]?.score ?? 0
      }));

    const mappedEvents = eventDetails
      .filter(detail => detail?.success && detail.data)
      .map((detail, index) => ({
        id: detail.data.id,
        type: 'event' as const,
        label: 'Event',
        title: detail.data.title,
        subtitle: detail.data.location || 'Online',
        meta: detail.data.date ? formatTimeAgo(detail.data.date) : undefined,
        href: `/events/${detail.data.id}`,
        score: events[index]?.score ?? 0
      }));

    const mappedCommunities = communityDetails
      .filter(detail => detail?.success && detail.data)
      .map((detail, index) => ({
        id: detail.data.id,
        type: 'community' as const,
        label: 'Community',
        title: detail.data.name,
        subtitle: detail.data.description || 'Join the discussion',
        meta: detail.data.members ? `${detail.data.members} members` : undefined,
        href: `/Community/${detail.data.id}`,
        score: communities[index]?.score ?? 0
      }));

    recommendedItems.value = [
      ...mappedPosts,
      ...mappedBooks,
      ...mappedEvents,
      ...mappedCommunities
    ];
  } catch (err) {
    console.error('Failed to load recommendations:', err);
  } finally {
    recommendationsLoaded.value = true;
  }
};

const handleRecommendationClick = (item: typeof recommendedItems.value[number]) => {
  if (item.type === 'post') {
    trackPostClick({
      id: item.id,
      title: item.title,
      tags: [{ label: item.meta || 'Thread' }],
      author: { name: item.subtitle },
      stars: 0
    });
  } else if (item.type === 'book') {
    trackBookClick({
      id: item.id,
      title: item.title,
      tags: [],
      author: item.subtitle
    });
  } else if (item.type === 'event') {
    trackEventClick({
      id: item.id,
      title: item.title,
      date: item.meta
    });
  } else if (item.type === 'community') {
    trackCommunityClick({
      id: item.id,
      name: item.title,
      members: 0
    });
  }
};

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
        rootMargin: '100px', 
        threshold: 0
      }
    );
  }

  fetchHomeRecommendations();
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

.recommendations-section {
  margin-left: 16px;
  background: #ffffff;
  border-radius: 16px;
  padding: 20px 20px 24px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 12px 26px rgba(15, 23, 42, 0.08);
}

.recommendations-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.recommendations-title {
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 4px;
}

.recommendations-subtitle {
  font-size: 13px;
  color: #64748b;
  margin: 0;
}

.recommendations-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.recommendation-card {
  background: #f8fafc;
  border-radius: 14px;
  padding: 16px;
  border: 1px solid #e2e8f0;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.recommendation-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 18px rgba(15, 23, 42, 0.12);
}

.recommendation-card[data-type='post'] {
  background: linear-gradient(135deg, #fff7d6, #ffffff);
}

.recommendation-card[data-type='book'] {
  background: linear-gradient(135deg, #e0f2fe, #ffffff);
}

.recommendation-card[data-type='event'] {
  background: linear-gradient(135deg, #ecfdf3, #ffffff);
}

.recommendation-card[data-type='community'] {
  background: linear-gradient(135deg, #f5f3ff, #ffffff);
}

.rec-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.rec-type {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 700;
  color: #1f2937;
}

.rec-score {
  font-size: 11px;
  font-weight: 700;
  color: #64748b;
}

.recommendation-card h3 {
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 8px;
  color: #0f172a;
}

.recommendation-card p {
  margin: 0 0 12px;
  color: #475569;
  font-size: 13px;
}

.rec-meta {
  font-size: 12px;
  color: #64748b;
}

.recommendations-empty {
  margin-left: 16px;
  background: linear-gradient(135deg, #fff7d6, #eef2ff);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #e2e8f0;
  color: #0f172a;
}

.recommendations-empty h3 {
  font-size: 18px;
  font-weight: 700;
  margin: 12px 0 8px;
}

.recommendations-empty p {
  font-size: 14px;
  color: #475569;
  margin: 0;
}

.empty-pill {
  display: inline-flex;
  padding: 4px 12px;
  border-radius: 999px;
  background: #fff1a8;
  color: #92400e;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

@media (max-width: 900px) {
  .recommendations-grid {
    grid-template-columns: 1fr;
  }
}
</style>
