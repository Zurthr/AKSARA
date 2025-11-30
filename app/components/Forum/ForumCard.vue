<template>
  <div class="forum-card" @click="navigateToDetail">
    <div class="card-header">
      <div class="author-section">
        <img :src="post.author.avatar" :alt="post.author.name" class="avatar">
        <div class="author-info">
          <div class="name-row">
            <span class="author-name">{{ post.author.name }}</span>
            <span v-if="post.author.badge" class="author-badge">{{ post.author.badge }}</span>
          </div>
          <span class="author-tagline">{{ post.author.tagline }}</span>
        </div>
      </div>
      <div class="meta-section">
        <span class="post-time">Posted {{ post.timeAgo }}</span>
        <button class="btn-menu">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="1" />
            <circle cx="19" cy="12" r="1" />
            <circle cx="5" cy="12" r="1" />
          </svg>
        </button>
      </div>
    </div>

    <h2 class="post-title">{{ post.title }}</h2>
    <p class="post-preview">{{ post.content }}</p>

    <div class="card-footer">
      <div class="tags">
        <span 
          v-for="tag in post.tags" 
          :key="tag.label" 
          class="tag"
          :class="tag.type"
        >
          {{ tag.label }}
        </span>
      </div>
      <div class="stats">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="star-icon">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
        <span class="star-count">{{ post.stars }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  post: {
    id: string | number;
    author: {
      name: string;
      avatar: string;
      tagline: string;
      badge?: string;
    };
    timeAgo: string;
    title: string;
    content: string;
    tags: Array<{ label: string; type: 'category' | 'topic' }>;
    stars: number;
  }
}>();

const router = useRouter();

const navigateToDetail = () => {
  router.push(`/forums/${props.post.id}`);
};
</script>

<style scoped>
.forum-card {
  background: none;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  border-bottom: #e2e8f0 1.6px solid;
}

.forum-card:hover {
  transform: translateY(-2px);
  border: 1px solid transparent;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  border-color: #e2e8f0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.author-section {
  display: flex;
  gap: 12px;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.author-info {
  display: flex;
  flex-direction: column;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.author-name {
  font-weight: 700;
  color: var(--color-black);
  font-size: 16px;
}

.author-badge {
  background: #fef08a;
  color: #854d0e;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 700;
}

.author-tagline {
  font-size: 14px;
  font-weight:400;
  color: var(--color-dark-gray);
}

.meta-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.post-time {
  font-size: 12px;
  color: #94a3b8;
}

.btn-menu {
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px;
}

.post-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-black);
  margin-bottom: 8px;
  line-height: 1.4;
}

.post-preview {
  font-size: 14px;
  color: #334155;
  line-height: 1.6;
  margin-bottom: 20px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 16px;
  font-weight: 600;
  background-color: var(--color-primary);
  color: white;
}

.tag.category {
  color: white;
}
/* Specific overrides based on design colors */ /* A Level / Hobbies */
.tag:nth-child(1) { background-color: var(--color-secondary) }
.tag:nth-child(2) { background-color: var(--color-secondary) }

.stats {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--color-black);
  font-weight: 600;
  font-size: 14px;
}

.star-icon {
  width: 16px;
  height: 16px;
}
</style>
