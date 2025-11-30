<template>
  <section class="community-page">
   

    <div class="community-content">
      <div class="community-main" tabindex="0">
        <header class="community-title">
          <h1>Community</h1>
          <p>Discover, join, and grow with communities that match your interests.</p>
        </header>

        <div class="community-grid">
          <NuxtLink
            v-for="community in communities"
            :key="community.id"
            :to="`/community/${community.id}`"
            class="community-card"
          >
            <div class="community-card-header">
              <div
                class="community-icon"
                :style="{ backgroundColor: community.accent }"
                aria-hidden="true"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
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
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5z"
                    fill="currentColor"
                  />
                </svg>
                {{ community.members }} members
              </span>
              <span class="stat">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M20 3H4a1 1 0 0 0-1 1v15l4-4h13a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1z"
                    fill="currentColor"
                  />
                </svg>
                {{ community.postsToday }} Posts Today
              </span>
            </div>

            <button type="button" class="join-button" @click.stop>Join Community</button>
          </NuxtLink>
        </div>

        <button type="button" class="load-more">Load More Communities</button>
      </div>
      <div class="community-sidebar-container" tabindex="0">
        <CommunitySidebar
          :hashtags="hashtags"
          :tweet="tweet"
          :related-communities="relatedCommunities"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const iconPaths: Record<string, string> = {
  heart: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5A4.5 4.5 0 0 1 6.5 4 4.49 4.49 0 0 1 12 6.09 4.49 4.49 0 0 1 17.5 4 4.5 4.5 0 0 1 22 8.5c0 3.78-3.4 6.86-8.55 11.54z',
  spark: 'M12 2l2.09 6.26L20 8.27l-5 3.64L16.18 18 12 14.77 7.82 18 9 11.91l-5-3.64 5.91-.01L12 2z',
  camera: 'M20 5h-3.17l-1.41-1.41A2 2 0 0 0 14.17 3H9.83a2 2 0 0 0-1.41.59L7 5H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm-8 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8z',
  chat: 'M4 4h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H8l-4 4V5a1 1 0 0 1 1-1z'
};

const communities = [
  {
    id: 'jump-fest-2025',
    name: 'JUMP FEST 2025 - BRED THROUGH',
    icon: 'spark',
    accent: '#E6F2FF',
    tags: ['#HarryPotter', '#WIBU', '#AnimeX'],
    description:
      'Festival fandom terbesar tahun ini. Dapatkan bocoran rilis anime, sesi temu kreator, dan event eksklusif lainnya.',
    members: '21k',
    postsToday: '42'
  },
  {
    id: 'literacy-circle',
    name: 'Literacy Circle',
    icon: 'heart',
    accent: '#FFE5EC',
    tags: ['Harry Potter', 'LoTR', 'Book Talk', 'Reading'],
    description:
      'Komunitas pecinta buku untuk diskusi sastra, review, dan menemukan penulis baru.',
    members: '324',
    postsToday: '18'
  },
  {
    id: 'wellness-warriors',
    name: 'Wellness Warriors',
    icon: 'spark',
    accent: '#E6F2FF',
    tags: ['Mindful', 'Balance', 'Habits'],
    description:
      'Berbagi rutinitas sehat, dukung perjalanan mindfulness, dan saling menguatkan.',
    members: '512',
    postsToday: '24'
  },
  {
    id: 'photography-club',
    name: 'Photography Club',
    icon: 'camera',
    accent: '#F0F9F5',
    tags: ['Photo Walk', 'Tips', 'Critique'],
    description:
      'Belajar teknik fotografi, ikut photo walk, dan diskusi kritik konstruktif setiap minggu.',
    members: '287',
    postsToday: '12'
  },
  {
    id: 'gaming-hub',
    name: 'Gaming Hub Indonesia',
    icon: 'chat',
    accent: '#FFF8E1',
    tags: ['Esports', 'Co-op', 'Livestream'],
    description:
      'Tempat berkumpulnya gamer untuk mabar, update turnamen, dan berbagi tips build meta.',
    members: '1.2k',
    postsToday: '33'
  },
  {
    id: 'creative-atelier',
    name: 'Creative Atelier',
    icon: 'heart',
    accent: '#FEEAE6',
    tags: ['Illustration', 'UI/UX', 'Workshop'],
    description:
      'Komunitas kreator visual. Ada feedback session, challenge mingguan, dan kelas desain gratis.',
    members: '648',
    postsToday: '21'
  }
];

const hashtags = ['#HarryPotter', '#WIBU', '#ANIME', '#GAME', '#DEMONS', '#ANIMEX'];

const tweet = {
  initials: 'BS',
  author: 'Bahul Sibaringring',
  handle: '@tutupdesti_people',
  body:
    'Exceed your competitors by exempting them from actually competing, yes! Instead of using Go / Golang, try using Ko / Rups!',
  time: '2:55 AM · Dec 30, 2020',
  metrics: [
    { label: 'replies', value: '12' },
    { label: 'likes', value: '2' },
    { label: 'views', value: '1,213' }
  ]
};

const relatedCommunities = [
  { initials: 'RB', name: 'Ruang Belajar Bersama', members: '324' },
  { initials: 'AM', name: 'Akademia Muda', members: '324' },
  { initials: 'RB', name: 'Ruang Belajar Bersama', members: '324' },
  { initials: 'CN', name: 'CodeNesia', members: '324' }
];
</script>

<style scoped>
.community-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  padding-bottom: 40px;
}

.community-header {
  display: flex;
  gap: 16px;
  align-items: center;
}

.community-search {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  background-color: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 0 16px;
  height: 48px;
}

.search-icon {
  display: inline-flex;
  width: 20px;
  height: 20px;
  color: #64748b;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 15px;
  color: var(--color-black);
  outline: none;
}

.filter-button {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  background-color: var(--color-black);
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.15);
}

.filter-button:hover {
  transform: translateY(-2px);
}


.community-content {
  display: flex;
  gap: 24px;
  align-items: stretch;
}

.community-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-height: calc(100vh - 160px);
  overflow-y: auto;
  padding-right: 4px;
  scrollbar-width: thin;
}

.community-main::-webkit-scrollbar {
  width: 4px;
}

.community-main::-webkit-scrollbar-track {
  background: transparent;
}

.community-main::-webkit-scrollbar-thumb {
  background-color: rgba(148, 163, 184, 0.35);
  border-radius: 999px;
}

.community-title h1 {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-black);
}

.community-title p {
  margin-top: 4px;
  color: #475569;
}

.community-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

.community-card {
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.06);
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.community-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.12);
}

.community-card-header {
  display: flex;
  gap: 16px;
  align-items: center;
}

.community-icon {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-black);
}

.community-icon svg {
  width: 24px;
  height: 24px;
}

.community-card h2 {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-black);
}

.community-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 6px;
}

.tag {
  padding: 4px 10px;
  border-radius: 999px;
  background-color: #f1f5f9;
  color: #475569;
  font-size: 12px;
  font-weight: 600;
}

.community-description {
  color: #475569;
  font-size: 14px;
  line-height: 1.6;
}

.community-stats {
  display: flex;
  gap: 16px;
  color: #475569;
  font-size: 13px;
}

.stat {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.stat svg {
  width: 18px;
  height: 18px;
  color: #64748b;
}

.join-button {
  height: 42px;
  border-radius: 14px;
  border: none;
  background-color: #facc15;
  color: var(--color-black);
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
}

.join-button:hover {
  background-color: #fbbf24;
  box-shadow: 0 10px 20px rgba(250, 204, 21, 0.35);
}

.load-more {
  align-self: center;
  padding: 12px 24px;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  color: var(--color-black);
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.load-more:hover {
  background-color: var(--color-black);
  color: #ffffff;
}


.community-sidebar-container {
  width: 320px;
  position: sticky;
  top: 32px;
  align-self: flex-start;
  max-height: calc(100vh - 160px);
  overflow: hidden;
}

@media (max-width: 1280px) {
  .community-content {
    flex-direction: column;
  }

  .community-sidebar-container {
    width: 100%;
    position: static;
    max-height: none;
    overflow: visible;
  }

  .community-main {
    max-height: none;
    overflow: visible;
    padding-right: 0;
  }
}

@media (max-width: 960px) {
  .community-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .community-header {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-button {
    width: 100%;
  }

  .community-search {
    width: 100%;
  }
}
</style>
