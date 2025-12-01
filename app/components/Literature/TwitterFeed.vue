<template>
  <div class="twitter-feed">
    <div class="feed-header">
      <h3 class="feed-title">Twitter's Web Dev Chatter</h3>
      <button 
        class="close-button" 
        @click="$emit('close')"
        aria-label="Close feed"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
    
    <div class="tweet-card" v-for="tweet in tweets" :key="tweet.id">
      <div class="tweet-header">
        <div class="tweet-author">
          <span class="author-name">{{ tweet.author.name }}</span>
          <span class="author-handle">@{{ tweet.author.handle }}</span>
        </div>
      </div>
      
      <p class="tweet-content">{{ tweet.content }}</p>
      
      <div class="tweet-footer">
        <span class="tweet-time">{{ tweet.timestamp }}</span>
        <div class="tweet-stats">
          <span class="stat-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            {{ tweet.likes }}
          </span>
          <span class="stat-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            {{ tweet.retweets }}
          </span>
          <span class="stat-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
            </svg>
            {{ tweet.views }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Tweet {
  id: number;
  author: {
    name: string;
    handle: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  retweets: number;
  views: number;
}

const props = defineProps<{
  tweets?: Tweet[];
}>();

const defaultTweets: Tweet[] = [
  {
    id: 1,
    author: {
      name: 'Bahlul Sibaringring',
      handle: 'stupidest_people'
    },
    content: 'Exceed your competitors by exempting them from actually competing, yes! Instead of using Go / Golang, try using Ko / Rupsi',
    timestamp: '2:55 AM Dec 30, 2020',
    likes: 12,
    retweets: 2,
    views: 1213
  }
];

const tweets = computed(() => props.tweets || defaultTweets);

defineEmits<{
  close: [];
}>();
</script>

<style scoped>
.twitter-feed {
  background: #ffffff;
  border-radius: 16px;
  padding: 20px;
  border: 1px solid #e2e8f0;
}

.feed-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.feed-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-black);
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  transition: color 0.2s;
}

.close-button:hover {
  color: var(--color-black);
}

.tweet-card {
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 16px;
}

.tweet-card:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.tweet-header {
  margin-bottom: 8px;
}

.tweet-author {
  display: flex;
  gap: 8px;
  align-items: center;
}

.author-name {
  font-weight: 600;
  font-size: 14px;
  color: var(--color-black);
}

.author-handle {
  font-size: 14px;
  color: #64748b;
}

.tweet-content {
  font-size: 14px;
  color: var(--color-black);
  line-height: 1.5;
  margin: 0 0 12px 0;
}

.tweet-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #64748b;
}

.tweet-stats {
  display: flex;
  gap: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.stat-item svg {
  width: 14px;
  height: 14px;
}
</style>

