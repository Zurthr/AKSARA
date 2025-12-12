<template>
  <div class="profile-page">
    <main class="feed-section">
      <!-- Profile Header Section -->
      <div class="profile-header">
        <div class="profile-banner">
          <img src="https://styles.redditmedia.com/t5_2ybklx/styles/profileBanner_mkh1leb397f51.jpg?width=1280&height=384&frame=1&auto=webp&crop=1280:384,smart&s=3df61bc81c762e701bcede592b5b82e6a4a2944e" alt="Profile Banner" class="banner-image">
          <div class="profile-avatar-overlay">
            <img src="https://styles.redditmedia.com/t5_2ybklx/styles/profileIcon_ryoe6ydu77f51.png?s=8cd049bb382287c2ce1bf5e0862a6fb1d6d49310" alt="Profile Avatar" class="profile-avatar">
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

      <!-- Tab Content -->
      <div class="tab-content">
        <!-- Posts Tab -->
        <div v-if="activeTab === 'posts'" class="posts-tab">
          <ForumCard 
            v-for="post in posts" 
            :key="post.id" 
            :post="post" 
          />
        </div>

        <!-- Reviews Tab -->
        <div v-if="activeTab === 'reviews'" class="reviews-tab">
          <div class="empty-state">
            <p>No reviews yet.</p>
          </div>
        </div>

        <!-- Communities Tab -->
        <div v-if="activeTab === 'communities'" class="communities-tab">
          <div class="communities-grid">
            <NuxtLink
              v-for="community in userCommunities"
              :key="community.id"
              :to="`/community/${community.id}`"
              class="community-card"
            >
              <div class="community-card-header">
                <div
                  class="community-icon"
                  :style="{ backgroundColor: community.accent }"
                >
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path :d="iconPaths[community.icon]" fill="currentColor" />
                  </svg>
                </div>
                <div>
                  <h2>{{ community.name }}</h2>
                  <div class="community-tags">
                    <span v-for="tag in community.tags" :key="tag" class="tag">{{ tag }}</span>
                  </div>
                </div>
              </div>
              <p class="community-description">{{ community.description }}</p>
              <div class="community-stats">
                <span class="stat">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  {{ community.members }} members
                </span>
              </div>
            </NuxtLink>
          </div>
        </div>

        <!-- Books Tab -->
        <div v-if="activeTab === 'books'" class="books-tab">
          <div class="books-grid">
            <BookCard
              v-for="book in userBooks"
              :key="book.id"
              :book="book"
            />
          </div>
        </div>
      </div>
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
</template>

<script setup lang="ts">
import RightSideBar from '~/components/General/RightSideBar.vue';
import ForumCard from '~/components/Forum/ForumCard.vue';
import BookCard from '~/components/Literature/BookCard.vue';

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

const iconPaths: Record<string, string> = {
  heart: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5A4.5 4.5 0 0 1 6.5 4 4.49 4.49 0 0 1 12 6.09 4.49 4.49 0 0 1 17.5 4 4.5 4.5 0 0 1 22 8.5c0 3.78-3.4 6.86-8.55 11.54z',
  spark: 'M12 2l2.09 6.26L20 8.27l-5 3.64L16.18 18 12 14.77 7.82 18 9 11.91l-5-3.64 5.91-.01L12 2z',
  camera: 'M20 5h-3.17l-1.41-1.41A2 2 0 0 0 14.17 3H9.83a2 2 0 0 0-1.41.59L7 5H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm-8 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8z',
  chat: 'M4 4h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H8l-4 4V5a1 1 0 0 1 1-1z'
};

const userCommunities = ref([
  {
    id: 'literacy-circle',
    name: 'Literacy Circle',
    icon: 'heart',
    accent: '#FFE5EC',
    tags: ['#HarryPotter', 'LoTR', 'Book Talk'],
    description: 'Komunitas pecinta buku untuk diskusi sastra, review, dan menemukan penulis baru.',
    members: '324'
  },
  {
    id: 'creative-atelier',
    name: 'Creative Atelier',
    icon: 'heart',
    accent: '#FEEAE6',
    tags: ['Illustration', 'UI/UX', 'Workshop'],
    description: 'Komunitas kreator visual. Ada feedback session, challenge mingguan, dan kelas desain gratis.',
    members: '648'
  }
]);

const userBooks = ref([
  {
    id: 1,
    title: 'DIFFERENT WINTER',
    author: 'Author Name',
    image: 'https://via.placeholder.com/120x180/87CEEB/FFFFFF?text=DIFFERENT+WINTER',
    tags: ['Fiction', 'Drama'],
    rating: 4.5
  },
  {
    id: 2,
    title: 'DIFFERENT WINTER',
    author: 'Author Name',
    image: 'https://via.placeholder.com/120x180/87CEEB/FFFFFF?text=DIFFERENT+WINTER',
    tags: ['Fiction', 'Drama'],
    rating: 4.2
  },
  {
    id: 3,
    title: 'The Great Novel',
    author: 'Another Author',
    image: 'https://via.placeholder.com/120x180/FFB6C1/FFFFFF?text=Great+Novel',
    tags: ['Classic', 'Literature'],
    rating: 4.8
  }
]);

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
  min-height: 100%;
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  gap: 24px;
}

.feed-section {
  flex: 1;
  min-width: 0;
  max-width: 920px;
}

.profile-header {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.profile-banner {
  position: relative;
  width: 100%;
  height: 300px;
  overflow: show;
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
  padding: 80px 24px 24px;
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

.tab-content {
  width: 100%;
}

.empty-state {
  background: white;
  border-radius: 16px;
  padding: 48px 24px;
  text-align: center;
  color: var(--color-dark-gray);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.communities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.community-card {
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.community-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.community-card-header {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.community-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-black);
  flex-shrink: 0;
}

.community-icon svg {
  width: 24px;
  height: 24px;
}

.community-card h2 {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-black);
  margin: 0 0 8px 0;
}

.community-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.community-tags .tag {
  padding: 4px 10px;
  border-radius: 999px;
  background-color: var(--color-primary);
  color: #ffffff;
  font-size: 11px;
  font-weight: 600;
}

.community-description {
  color: #475569;
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.community-stats {
  display: flex;
  gap: 16px;
  color: #475569;
  font-size: 13px;
  margin-top: auto;
}

.community-stats .stat {
  display: flex;
  align-items: center;
  gap: 6px;
}

.community-stats .stat svg {
  width: 18px;
  height: 18px;
  color: #64748b;
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 20px;
}
</style>
