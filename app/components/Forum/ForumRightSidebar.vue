<template>
  <aside class="forum-sidebar">
    <div class="sidebar-section" v-if="relatedCommunity || (relatedBooks && relatedBooks.length > 0)">
      <h3 class="section-title">Related Topics</h3>
      
      <!-- Related Community -->
      <!-- Related Community -->
      <NuxtLink 
        v-if="relatedCommunity" 
        :to="`/Community/${relatedCommunity.id}`"
        class="related-topic-card clickable-card"
      >
        <div class="topic-icon">
          <!-- Placeholder icon if no specific icon logic -->
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
        </div>
        <div class="topic-info">
          <h4>{{ relatedCommunity.name }}</h4>
          <span class="tag">{{ relatedCommunity.members }} members</span>
          <button class="btn-subscribe">Join</button>
        </div>
      </NuxtLink>

      <!-- Related Books -->
      <div v-for="book in relatedBooks" :key="book.title" class="related-topic-card">
        <div class="book-cover">
          <img v-if="book.cover" :src="book.cover" :alt="book.title" class="cover-img">
          <div v-else class="cover-placeholder"></div>
        </div>
        <div class="topic-info">
          <span class="tag">{{ book.author }}</span>
          <button class="btn-subscribe">View</button>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
defineProps<{
  relatedCommunity?: {
    id: string;
    name: string;
    icon: string;
    members: string;
  } | null;
  relatedBooks?: Array<{
    title: string;
    author: string;
    cover: string;
    rating: number;
  }> | null;
  externalPosts?: Array<{
    id: number;
    platform: string;
    user?: {
      name: string;
      handle: string;
      avatar: string;
    };
    subreddit?: {
      name: string;
      members: string;
      avatar: string;
    };
    content?: string;
    title?: string;
    image?: string;
    date?: string;
    stats: {
      replies?: number;
      retweets?: number;
      likes?: number;
      comments?: string | number;
      views?: string;
    };
  }> | null;
}>();
</script>

<style scoped>
.forum-sidebar {
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-left: 24px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.related-topic-card {
  display: flex;
  gap: 12px;
  background: white;
  padding: 12px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  margin-bottom: 12px;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s, box-shadow 0.2s;
}

.clickable-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
}

.topic-icon {
  width: 48px;
  height: 48px;
  background-color: #f1f5f9;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
}

.book-cover {
  width: 60px;
  height: 80px;
  background-color: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 0;
}

.cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
}

.topic-info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
}

.topic-info h4 {
  font-size: 14px;
  font-weight: 600;
  margin: 0;
  color: var(--color-black);
  line-height: 1.3;
}

.tag {
  font-size: 12px;
  color: #64748b;
  background: #f1f5f9;
  padding: 2px 8px;
  border-radius: 12px;
  width: fit-content;
  margin-top: 4px;
}

.btn-subscribe {
  font-size: 12px;
  padding: 4px 12px;
  background: #fef08a;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  width: fit-content;
  margin-top: auto;
}

.social-card {
  background: #f8fafc;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
  border: 1px solid #e2e8f0;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.platform-icon {
  width: 20px;
  height: 20px;
}

.twitter-icon { color: #1da1f2; }
.reddit-icon { color: #ff4500; }
.youtube-icon { color: #ff0000; }

.platform-name {
  font-weight: 600;
  font-size: 14px;
}

.user-info, .subreddit-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.avatar-small {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.user-details, .subreddit-details {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.name {
  font-size: 12px;
  font-weight: 700;
}

.handle, .members {
  font-size: 11px;
  color: #64748b;
}

.btn-follow, .btn-join {
  background: black;
  color: white;
  border: none;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
}

.tweet-text, .post-title {
  font-size: 13px;
  margin-bottom: 8px;
  line-height: 1.4;
}

.tweet-date {
  font-size: 11px;
  color: #94a3b8;
  display: block;
  margin-bottom: 8px;
}

.tweet-actions, .post-actions {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #64748b;
}

.post-image img {
  width: 100%;
  border-radius: 8px;
  margin-bottom: 8px;
}
</style>
