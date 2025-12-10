<template>
  <div class="profile-page">
    <!-- Profile Header Section -->
    <div class="profile-header">
      <div class="profile-banner">
        <img src="https://via.placeholder.com/1200x300/FFA500/FFFFFF?text=Banner" alt="Profile Banner" class="banner-image">
        <div class="profile-avatar-overlay">
          <img src="https://via.placeholder.com/120/4CAF50/FFFFFF?text=Avatar" alt="Profile Avatar" class="profile-avatar">
        </div>
      </div>
      
      <div class="profile-info-section">
        <div class="profile-name-section">
          <h1 class="profile-name">Zurthr .zur</h1>
          <p class="profile-tagline">'He's the girl in the bubble, his big shiny bubble'</p>
        </div>
        
        <div class="profile-tabs">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            :class="['tab-button', { active: activeTab === tab.id }]"
            @click="activeTab = tab.id"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="profile-content">
      <main class="feed-section">
        <ForumCard 
          v-for="post in posts" 
          :key="post.id" 
          :post="post" 
        />
      </main>
      
      <RightSideBar>
        <!-- Profile Summary Card -->
        <div class="sidebar-card">
          <div class="profile-summary">
            <img src="https://via.placeholder.com/80/4CAF50/FFFFFF?text=Avatar" alt="Profile Avatar" class="summary-avatar">
            <h3 class="summary-name">Zurthr .zur</h3>
            <p class="summary-title">The Maestro</p>
            <div class="summary-stats">
              <div class="stat-item">
                <span class="stat-value">8213</span>
                <span class="stat-label">Posts</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">123</span>
                <span class="stat-label">Reads</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">13232</span>
                <span class="stat-label">Followers</span>
              </div>
            </div>
            <p class="summary-tagline">'He's the girl in the bubble, his big shiny bubble'</p>
            <div class="summary-actions">
              <button class="btn-follow">Follow</button>
              <button class="btn-chat">Chat</button>
              <button class="btn-menu-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- About Me Card -->
        <div class="sidebar-card">
          <div class="about-me">
            <h3 class="card-title">About Me</h3>
            <p class="about-tagline">'He's the girl in the bubble, his big shiny bubble'</p>
            <div class="about-actions">
              <button class="btn-follow">Follow</button>
              <button class="btn-chat">Chat</button>
              <button class="btn-menu-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Book Recommendations Card -->
        <div class="sidebar-card">
          <h3 class="card-title">Book Recommendations</h3>
          <div class="book-recommendations">
            <div 
              v-for="book in recommendedBooks" 
              :key="book.id"
              class="book-recommendation-item"
            >
              <img :src="book.image" :alt="book.title" class="book-cover-small">
            </div>
          </div>
        </div>
      </RightSideBar>
    </div>
  </div>
</template>

<script setup lang="ts">
import RightSideBar from '~/components/General/RightSideBar.vue';
import ForumCard from '~/components/Forum/ForumCard.vue';

const activeTab = ref('posts');

const tabs = [
  { id: 'posts', label: 'Posts' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'communities', label: 'Communities' },
  { id: 'books', label: 'Books' }
];

const recommendedBooks = [
  {
    id: 1,
    title: 'DIFFERENT WINTER',
    image: 'https://via.placeholder.com/120x180/87CEEB/FFFFFF?text=DIFFERENT+WINTER'
  },
  {
    id: 2,
    title: 'DIFFERENT WINTER',
    image: 'https://via.placeholder.com/120x180/87CEEB/FFFFFF?text=DIFFERENT+WINTER'
  }
];

// Sample posts data - in a real app, this would come from an API
const posts = ref([
  {
    id: 1,
    author: {
      name: 'Orang Kmplang',
      avatar: 'https://via.placeholder.com/48/FFA500/FFFFFF?text=OK',
      tagline: 'A stupid one',
      badge: undefined
    },
    timeAgo: 'an hr ago',
    title: 'LF Best Books for Aspiring Web Developers',
    content: 'Hey everyone! I\'ve been diving deeper into web development lately, and I realized there\'s a ton of great books out there that can really help you level up beyond just YouTube tutorials. Thought I\'d share a few and see what you all recommend too!',
    tags: [
      { label: 'Web Dev', type: 'category' as const },
      { label: '#NewDev', type: 'topic' as const },
      { label: '#WebDev', type: 'topic' as const },
      { label: '#Stacking', type: 'topic' as const }
    ],
    stars: 80
  },
  {
    id: 2,
    author: {
      name: 'Orang Kmplang',
      avatar: 'https://via.placeholder.com/48/FFA500/FFFFFF?text=OK',
      tagline: 'A stupid one',
      badge: undefined
    },
    timeAgo: 'an hr ago',
    title: 'LF Best Books for Aspiring Web Developers',
    content: 'Hey everyone! I\'ve been diving deeper into web development lately, and I realized there\'s a ton of great books out there that can really help you level up beyond just YouTube tutorials. Thought I\'d share a few and see what you all recommend too!',
    tags: [
      { label: 'Web Dev', type: 'category' as const },
      { label: '#NewDev', type: 'topic' as const },
      { label: '#WebDev', type: 'topic' as const },
      { label: '#Stacking', type: 'topic' as const }
    ],
    stars: 80
  },
  {
    id: 3,
    author: {
      name: 'Orang Kmplang',
      avatar: 'https://via.placeholder.com/48/FFA500/FFFFFF?text=OK',
      tagline: 'A stupid one',
      badge: undefined
    },
    timeAgo: 'an hr ago',
    title: 'LF Best Books for Aspiring Web Developers',
    content: 'Hey everyone! I\'ve been diving deeper into web development lately, and I realized there\'s a ton of great books out there that can really help you level up beyond just YouTube tutorials. Thought I\'d share a few and see what you all recommend too!',
    tags: [
      { label: 'Web Dev', type: 'category' as const },
      { label: '#NewDev', type: 'topic' as const },
      { label: '#WebDev', type: 'topic' as const },
      { label: '#Stacking', type: 'topic' as const }
    ],
    stars: 80
  }
]);
</script>

<style scoped>
.profile-page {
  width: 100%;
  background-color: #f8fafc;
  min-height: 100vh;
}

.profile-header {
  background: white;
  margin-bottom: 24px;
}

.profile-banner {
  position: relative;
  width: 100%;
  height: 300px;
  overflow: hidden;
  background: linear-gradient(135deg, #FFA500 0%, #FF8C00 100%);
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-avatar-overlay {
  position: absolute;
  bottom: -60px;
  left: 24px;
  z-index: 10;
}

.profile-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid white;
  object-fit: cover;
  background: #4CAF50;
}

.profile-info-section {
  padding: 80px 24px 24px 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.profile-name-section {
  margin-bottom: 24px;
}

.profile-name {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-black);
  margin: 0 0 8px 0;
}

.profile-tagline {
  font-size: 16px;
  color: var(--color-dark-gray);
  margin: 0;
  font-style: italic;
}

.profile-tabs {
  display: flex;
  gap: 8px;
  border-bottom: 2px solid #e2e8f0;
}

.tab-button {
  padding: 12px 24px;
  background: none;
  border: none;
  font-size: 16px;
  font-weight: 600;
  color: #94a3b8;
  cursor: pointer;
  position: relative;
  transition: color 0.2s;
}

.tab-button:hover {
  color: var(--color-primary);
}

.tab-button.active {
  color: var(--color-primary);
}

.tab-button.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--color-primary);
}

.profile-content {
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  gap: 24px;
  padding: 0 24px 24px 24px;
}

.feed-section {
  flex: 1;
  min-width: 0;
}

.sidebar-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.profile-summary {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.summary-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 12px;
  background: #4CAF50;
}

.summary-name {
  font-size: 20px;
  font-weight: 700;
  color: var(--color-black);
  margin: 0 0 4px 0;
}

.summary-title {
  font-size: 14px;
  color: var(--color-dark-gray);
  margin: 0 0 16px 0;
}

.summary-stats {
  display: flex;
  gap: 24px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
  width: 100%;
  justify-content: center;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-value {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-black);
}

.stat-label {
  font-size: 12px;
  color: #94a3b8;
}

.summary-tagline {
  font-size: 14px;
  color: var(--color-dark-gray);
  margin: 0 0 16px 0;
  font-style: italic;
  text-align: center;
}

.summary-actions {
  display: flex;
  gap: 8px;
  width: 100%;
}

.btn-follow,
.btn-chat {
  flex: 1;
  padding: 10px 16px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-follow {
  background-color: var(--color-yellow);
  color: var(--color-black);
}

.btn-follow:hover {
  background-color: var(--color-highlight2);
  transform: translateY(-1px);
}

.btn-chat {
  background-color: var(--color-light-blue);
  color: var(--color-primary);
}

.btn-chat:hover {
  background-color: #d4e0f0;
}

.btn-menu-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: none;
  background-color: var(--color-light-blue);
  color: var(--color-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn-menu-icon:hover {
  background-color: #d4e0f0;
}

.about-me {
  display: flex;
  flex-direction: column;
}

.card-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-black);
  margin: 0 0 12px 0;
}

.about-tagline {
  font-size: 14px;
  color: var(--color-dark-gray);
  margin: 0 0 16px 0;
  font-style: italic;
}

.about-actions {
  display: flex;
  gap: 8px;
}

.book-recommendations {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.book-recommendation-item {
  width: 100%;
}

.book-cover-small {
  width: 100%;
  aspect-ratio: 2 / 3;
  border-radius: 8px;
  object-fit: cover;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
