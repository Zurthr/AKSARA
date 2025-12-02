<template>
  <aside class="community-sidebar" :class="layout === 'inline' ? 'layout-inline' : ''">
    <section class="sidebar-card">
      <header>
        <h3>Communities</h3>
        <p>Discover and join communities that match your interests</p>
      </header>
      <div class="hashtag-list">
        <span v-for="hashtag in hashtags" :key="hashtag" class="hashtag">{{ hashtag }}</span>
      </div>
    </section>

    <section class="sidebar-card action-card">
      <h3>Initiate a Community</h3>
      <p>Start a new conversation space and invite others to collaborate.</p>
      <NuxtLink to="/community/create" class="action-button">Create Community</NuxtLink>
    </section>

    <section class="sidebar-card tweet-card">
      <header class="tweet-header">
        <div class="avatar" aria-hidden="true">{{ tweet.initials }}</div>
        <div>
          <p class="tweet-author">{{ tweet.author }}</p>
          <p class="tweet-handle">{{ tweet.handle }}</p>
        </div>
        <button type="button" class="close-button" aria-label="Dismiss tweet">&times;</button>
      </header>
      <p class="tweet-body">{{ tweet.body }}</p>
      <footer class="tweet-footer">
        <span>{{ tweet.time }}</span>
        <div class="tweet-stats">
          <span v-for="metric in tweet.metrics" :key="metric.label">{{ metric.value }} {{ metric.label }}</span>
        </div>
      </footer>
    </section>

    <section class="sidebar-card related-card">
      <h3>Related Communities</h3>
      <ul>
        <li v-for="community in relatedCommunities" :key="community.name">
          <div class="avatar" aria-hidden="true">{{ community.initials }}</div>
          <div>
            <p class="related-name">{{ community.name }}</p>
            <p class="related-meta">{{ community.members }} members</p>
          </div>
        </li>
      </ul>
    </section>
  </aside>
</template>

<script setup lang="ts">
interface TweetMetric {
  label: string;
  value: string;
}

interface Tweet {
  initials: string;
  author: string;
  handle: string;
  body: string;
  time: string;
  metrics: TweetMetric[];
}

interface RelatedCommunity {
  initials: string;
  name: string;
  members: string;
}

const props = defineProps<{
  hashtags: string[];
  tweet: Tweet;
  relatedCommunities: RelatedCommunity[];
  layout?: 'default' | 'inline';
}>();

const { layout = 'default' } = props;
</script>

<style scoped>
.community-sidebar {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
  max-height: inherit;
  overflow-y: auto;
  padding-right: 4px;
  scrollbar-width: thin;
}

.community-sidebar:hover {
  scrollbar-color: #94a3b8 transparent;
}

.community-sidebar.layout-inline {
  max-height: none;
  overflow: visible;
  padding-right: 0;
  height: auto;
}

.community-sidebar.layout-inline:hover {
  scrollbar-color: auto;
}

.community-sidebar::-webkit-scrollbar {
  width: 4px;
}

.community-sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.community-sidebar::-webkit-scrollbar-thumb {
  background-color: rgba(148, 163, 184, 0.5);
  border-radius: 999px;
}

.sidebar-card {
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.05);
}

.sidebar-card header h3 {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-black);
}

.sidebar-card header p {
  color: #475569;
  font-size: 14px;
}

.hashtag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.hashtag {
  padding: 6px 12px;
  border-radius: 999px;
  background-color: #3B5379;
  color: #ffffff;
  font-size: 13px;
  font-weight: 600;
}

.action-card h3 {
  margin-bottom: -8px;
}

.action-button {
  padding: 12px 20px;
  border-radius: 14px;
  background: var(--color-black);
  color: #ffffff;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.action-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.2);
}

.tweet-card {
  gap: 12px;
}

.tweet-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  background-color: #e2e8f0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: var(--color-black);
}

.tweet-author {
  font-weight: 600;
  color: var(--color-black);
}

.tweet-handle {
  font-size: 13px;
  color: #64748b;
}

.close-button {
  margin-left: auto;
  width: 32px;
  height: 32px;
  border-radius: 12px;
  border: none;
  background-color: #f1f5f9;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  color: #475569;
}

.tweet-body {
  color: var(--color-black);
  font-size: 14px;
  line-height: 1.6;
}

.tweet-footer {
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: #64748b;
  font-size: 12px;
}

.tweet-stats {
  display: flex;
  gap: 12px;
  color: #475569;
}

.related-card ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.related-card li {
  display: flex;
  align-items: center;
  gap: 12px;
}

.related-name {
  font-weight: 600;
  color: var(--color-black);
}

.related-meta {
  font-size: 13px;
  color: #64748b;
}

@media (max-width: 1280px) {
  .community-sidebar {
    max-height: none;
    overflow: visible;
    padding-right: 0;
  }
}
</style>
