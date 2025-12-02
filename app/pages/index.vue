<template>
  <div class="index-page">
    <EventsSection />
    <div class="index-page-content">
      <div class="index-page-content-left">
        <ReadsSection />
        <ForumCard 
          v-for="post in posts" 
          :key="post.id" 
          :post="post" 
        />
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
</style>

