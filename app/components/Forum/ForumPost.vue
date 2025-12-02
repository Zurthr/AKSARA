<template>
  <article class="forum-post">
    <div class="post-header">
      <div class="author-info">
        <img :src="post.author.avatar" alt="Author" class="author-avatar">
        <div class="author-meta">
          <span class="author-name">{{ post.author.name }}</span>
          <span v-if="post.author.badge" class="author-badge">{{ post.author.badge }}</span>
          <span class="post-time">{{ post.timeAgo }}</span>
        </div>
      </div>
      <button class="btn-more">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="1" />
          <circle cx="19" cy="12" r="1" />
          <circle cx="5" cy="12" r="1" />
        </svg>
      </button>
    </div>

    <h1 class="post-title">{{ post.title }}</h1>

    <div class="post-content">
      <p>{{ post.content }}</p>
    </div>

    <div class="post-tags">
      <span v-for="tag in post.tags" :key="tag" class="post-tag">#{{ tag }}</span>
    </div>

    <div class="post-actions">
      <div class="action-group">
        <button class="btn-action">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
          </svg>
          {{ post.stats.comments }}
        </button>
        <button class="btn-action">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
          </svg>
          {{ post.stats.likes }} Upvotes
        </button>
        <button class="btn-action">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
            <polyline points="16 6 12 2 8 6"/>
            <line x1="12" y1="2" x2="12" y2="15"/>
          </svg>
          {{ post.stats.shares }}
        </button>
      </div>
      <button class="btn-action">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
        </svg>
      </button>
    </div>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  post: {
    author: {
      name: string;
      avatar: string;
      badge?: string;
    };
    timeAgo: string;
    title: string;
    content: string;
    tags: string[];
    stats: {
      comments: number;
      likes: number;
      shares: number;
    };
  }
}>();
</script>

<style scoped>
.forum-post {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  margin-bottom: 24px;
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.author-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.author-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.author-name {
  font-weight: 600;
  color: var(--color-black);
}

.author-badge {
  background: #fef08a;
  color: #854d0e;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 700;
}

.post-time {
  color: #94a3b8;
  font-size: 12px;
}

.post-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-black);
  margin-bottom: 16px;
  line-height: 1.3;
}

.post-content {
  color: #475569;
  line-height: 1.6;
  margin-bottom: 20px;
}

.post-tags {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
}

.post-tag {
  color: #3b82f6;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.post-tag:hover {
  text-decoration: underline;
}

.post-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #f1f5f9;
  padding-top: 16px;
}

.action-group {
  display: flex;
  gap: 24px;
}

.btn-action {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 8px;
  transition: background 0.2s;
}

.btn-action:hover {
  background: #f1f5f9;
  color: var(--color-black);
}

.btn-more {
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
}
</style>
