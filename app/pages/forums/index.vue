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
</style>
