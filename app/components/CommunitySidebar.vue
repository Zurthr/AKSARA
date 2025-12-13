<template>
  <aside class="community-sidebar" :class="layout === 'inline' ? 'layout-inline' : ''">
    <section v-if="communityDetails" class="sidebar-card community-details-card">
      <header>
        <div class="community-header">
          <div class="community-avatar">{{ communityDetails.initials }}</div>
          <div>
            <h3>{{ communityDetails.name }}</h3>
            <p class="community-meta">{{ communityDetails.members }} members • {{ communityDetails.posts }} posts</p>
          </div>
        </div>
      </header>
      <div class="community-description">
        <p>{{ communityDetails.description }}</p>
      </div>
      <div v-if="communityDetails.tags" class="community-tags">
        <span v-for="tag in communityDetails.tags" :key="tag" class="community-tag">{{ tag }}</span>
      </div>
    </section>
    
    <section class="sidebar-card">
      <header>
        <h3>Communities</h3>
        <p>Discover and join communities that match your interests</p>
      </header>
      <div class="hashtag-list">
        <span v-for="hashtag in hashtags" :key="hashtag" class="hashtag">{{ hashtag }}</span>
      </div>
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
    <section class="sidebar-card action-card">
      <h3>Initiate a Community</h3>
      <p>Start a new conversation space and invite others to collaborate.</p>
      <NuxtLink to="/community/create" class="action-button">Create Community</NuxtLink>
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

interface CommunityDetails {
  initials: string;
  name: string;
  description: string;
  members: string;
  posts: string;
  tags?: string[];
}

const props = defineProps<{
  hashtags: string[];
  tweet: Tweet;
  relatedCommunities: RelatedCommunity[];
  communityDetails?: CommunityDetails;
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
  scrollbar-color: #ffffff transparent;
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

.community-details-card {
  border: 1px solid #FFDA49;
  background: linear-gradient(135deg, #fffbeb 0%, #ffffff 100%);
}

.community-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.community-avatar {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  background: linear-gradient(135deg, #FFDA49 0%, #fbbf24 100%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: var(--color-black);
  font-size: 18px;
}

.community-meta {
  font-size: 13px;
  color: #64748b;
  margin-top: 2px;
}

.community-description {
  line-height: 1.6;
  color: #475569;
}

.community-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.community-tag {
  padding: 4px 10px;
  border-radius: 999px;
  background-color: #FFDA49;
  color: var(--color-black);
  font-size: 12px;
  font-weight: 600;
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
