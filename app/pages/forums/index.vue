<template>
  <div class="forum-index">
      <main class="feed-section">
        <ForumCard 
          v-for="post in posts" 
          :key="post.id" 
          :post="post" 
        />
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

interface Post {
  id: number;
  author: {
    name: string;
    avatar: string;
    tagline: string;
  };
  timeAgo: string;
  title: string;
  content: string;
  tags: Array<{ label: string; type: 'category' | 'topic' }>;
  stars: number;
  community_id: string;
  created_at: string;
  updated_at: string;
}

const { data: posts, error } = await useFetch<Post[]>('http://localhost:3002/posts');

if (error.value) {
  console.error('Error fetching posts:', error.value);
}
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
</style>
