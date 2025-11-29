<template>
  <section class="community-detail-page">
    <NuxtLink to="/community" class="back-link">&larr; Kembali</NuxtLink>

    <div class="community-detail-content">
      <div class="community-detail-main">
        <article class="community-hero">
          <div class="hero-media">
            <img :src="community.cover" :alt="community.name" />
            <div class="hero-overlay">
              <p class="hero-badge">{{ community.eventTag }}</p>
              <h1>{{ community.name }}</h1>
              <p class="hero-subtitle">{{ community.subtitle }}</p>
              <div class="hero-actions">
                <button type="button" class="hero-button primary">+ Gabung Komunitas</button>
                <button type="button" class="hero-button ghost">Bagikan</button>
              </div>
            </div>
          </div>
        </article>

        <section class="community-posts">
          <header>
            <h2>Diskusi Terbaru</h2>
            <p>{{ posts.length }} percakapan aktif hari ini</p>
          </header>

          <article v-for="post in posts" :key="post.id" class="post-card">
            <div class="post-header">
              <img :src="post.author.avatar" :alt="post.author.name" class="avatar" />
              <div>
                <p class="author-name">{{ post.author.name }}</p>
                <p class="author-role">{{ post.author.title }}</p>
              </div>
              <span class="post-time">Diposting {{ post.timeAgo }}</span>
            </div>

            <div class="post-body">
              <h3>{{ post.title }}</h3>
              <p>{{ post.summary }}</p>
            </div>

            <footer class="post-footer">
              <div class="post-tags">
                <span v-for="tag in post.tags" :key="tag" class="tag">{{ tag }}</span>
              </div>
              <div class="post-stats">
                <span class="stat">{{ post.stats.likes }} Suka</span>
                <span class="stat">{{ post.stats.comments }} Balasan</span>
                <span class="stat">Bagikan</span>
              </div>
            </footer>
          </article>
        </section>
      </div>

      <aside class="community-detail-sidebar">
        <section class="sidebar-card details-card">
          <header class="details-header">
            <h3>Details Communities</h3>
            <p class="details-location">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"
                  fill="currentColor"
                />
              </svg>
              {{ community.location }}
            </p>
          </header>

          <div class="details-meta">
            <div class="detail-chip">
              <span class="label">Date</span>
              <p>{{ community.date }}</p>
            </div>
            <div class="detail-chip">
              <span class="label">Members</span>
              <p>{{ community.members }} members</p>
            </div>
          </div>

          <p class="detail-description">{{ community.description }}</p>

          <div class="details-highlight">
            <span class="label">Trending Topic</span>
            <p>{{ community.subtitle }}</p>
          </div>

          <div class="detail-tags">
            <span v-for="tag in community.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </section>

        <section class="sidebar-card info-card">
          <h3>More Information</h3>
          <ul class="info-list">
            <li v-for="item in infoItems" :key="item.label">
              <span class="info-icon">{{ item.icon }}</span>
              <div>
                <p class="info-label">{{ item.label }}</p>
                <p class="info-value">{{ item.value }}</p>
              </div>
            </li>
          </ul>
        </section>

        <section class="sidebar-card activities-card">
          <header class="activities-header">
            <h3>Activities</h3>
            <button type="button" class="explore-button">Explore Event</button>
          </header>
          <div class="activities-preview">
            <img :src="activitiesPreview.image" alt="Community activities" />
          </div>
          <ul class="activities-list">
            <li v-for="activity in activitiesPreview.list" :key="activity">
              {{ activity }}
            </li>
          </ul>
        </section>

        <section class="sidebar-card related-card">
          <h3>Related Communities</h3>
          <ul>
            <li v-for="related in relatedCommunities" :key="related.name">
              <div class="avatar" aria-hidden="true">{{ related.initials }}</div>
              <div>
                <p class="related-name">{{ related.name }}</p>
                <p class="related-meta">{{ related.members }} members</p>
              </div>
            </li>
          </ul>
        </section>
      </aside>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface PostAuthor {
  name: string;
  title: string;
  avatar: string;
}

interface PostMeta {
  likes: number;
  comments: number;
}

interface PostItem {
  id: string;
  author: PostAuthor;
  timeAgo: string;
  title: string;
  summary: string;
  tags: string[];
  stats: PostMeta;
}

interface InfoItem {
  icon: string;
  label: string;
  value: string;
}

interface Activities {
  image: string;
  list: string[];
}

interface RelatedCommunity {
  initials: string;
  name: string;
  members: string;
}

interface CommunityDetail {
  id: string;
  name: string;
  subtitle: string;
  eventTag: string;
  cover: string;
  location: string;
  date: string;
  members: string;
  description: string;
  tags: string[];
  posts: PostItem[];
  infoItems: InfoItem[];
  activities: Activities;
  related: RelatedCommunity[];
}

const route = useRoute();

const communityDirectory: CommunityDetail[] = [
  {
    id: 'jump-fest-2025',
    name: 'JUMP FEST 2025 - BRED THROUGH',
    subtitle: 'Trending in Western Fiction',
    eventTag: 'JUMP FEST 2025',
    cover:
      'https://images.unsplash.com/photo-1529158062015-cad636e69505?auto=format&fit=crop&w=1200&q=80',
    location: 'Bedok, Singapore',
    date: '13 August, 2025',
    members: '21k',
    description:
      'Jump Fest 2025 is here! Bigger, louder, and more electrifying than ever. Dive into anime premieres, epic game demos, and electric live performances.',
    tags: ['#HarryPotter', '#WIBU', '#ANIME', '#GAME', '#DEMONS', '#ANIMEX'],
    posts: [
      {
        id: 'jf-post-1',
        author: {
          name: 'Alfan Gunadar',
          title: 'Something Vanity!',
          avatar:
            'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=200&q=80'
        },
        timeAgo: 'posted 3 hrs ago',
        title: 'Is FNAF 2 going to debut in Minecraft alongside Herobrine',
        summary:
          'Okay, so I’ve been seeing some weird stuff in the latest Minecraft teasers and community rumors — people are saying there might be a crossover event bringing FNAF 2 elements into Minecraft?! Like animatronics, the pizzeria setting, and even a Herobrine tie-in?!',
        tags: ['Hobbies', 'FNAF', '#FNAF', '#Booo', '#Horror'],
        stats: { likes: 24, comments: 8 }
      },
      {
        id: 'jf-post-2',
        author: {
          name: 'Alfan Gunadar',
          title: 'Something Vanity!',
          avatar:
            'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&q=80'
        },
        timeAgo: 'posted 3 hrs ago',
        title: 'Is FNAF 2 going to debut in Minecraft alongside Herobrine',
        summary:
          'Not sure if it’s a mod collab, an ARG, or just wild fan theory fuel, but if Mojang actually drops a spooky update mixing Herobrine lore with FNAF 2 jumpscares, that would be insane.',
        tags: ['Hobbies', 'FNAF', '#FNAF', '#Booo', '#Horror'],
        stats: { likes: 24, comments: 8 }
      }
    ],
    infoItems: [
      { icon: '🏟️', label: 'Capacity', value: '30 participants' },
      { icon: '💸', label: 'Fee', value: 'Free' },
      { icon: '📜', label: 'Certificate', value: 'Available' },
      { icon: '📞', label: 'Contact', value: '+62 812-3456-7890' }
    ],
    activities: {
      image:
        'https://images.unsplash.com/photo-1526481280695-3c46973ed205?auto=format&fit=crop&w=600&q=80',
      list: ['Weekly panel discussions', 'Cosplay workshop', 'Friday streaming party']
    },
    related: [
      { initials: 'RB', name: 'Ruang Belajar Bersama', members: '324' },
      { initials: 'AM', name: 'Akademia Muda', members: '324' },
      { initials: 'CN', name: 'CodeNesia', members: '324' }
    ]
  },
  {
    id: 'literacy-circle',
    name: 'Literacy Circle',
    subtitle: 'Spotlight on Modern Fiction',
    eventTag: 'Readers Meetup',
    cover:
      'https://images.unsplash.com/photo-1456081442814-bc4e120f337a?auto=format&fit=crop&w=1200&q=80',
    location: 'Bandung, Indonesia',
    date: '28 September, 2025',
    members: '324',
    description:
      'A cozy nook for novel lovers to exchange reviews, dissect plots, and share their latest reads without judgement.',
    tags: ['#BookClub', '#NovelTalk', '#IndieAuthor'],
    posts: [
      {
        id: 'lc-post-1',
        author: {
          name: 'Nadia Rahma',
          title: 'Moderator',
          avatar:
            'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=200&q=80'
        },
        timeAgo: 'posted 6 hrs ago',
        title: 'Diskusi bab 12 — plot twist besar!',
        summary:
          'Bab 12 benar-benar bikin aku berhenti sejenak. Siapa lagi yang kaget dengan keputusan karakter utama? Yuk bahas teorinya.',
        tags: ['#Discussion', '#PlotTwist'],
        stats: { likes: 14, comments: 6 }
      }
    ],
    infoItems: [
      { icon: '📍', label: 'Venue', value: 'Cozy Reader Space' },
      { icon: '🕒', label: 'Schedule', value: 'Every Saturday, 16:00' },
      { icon: '💬', label: 'Language', value: 'Bahasa Indonesia' }
    ],
    activities: {
      image:
        'https://images.unsplash.com/photo-1513475382585-d06e58bcb0cf?auto=format&fit=crop&w=600&q=80',
      list: ['Reading sprint', 'Author AMA', 'Poetry open mic']
    },
    related: [
      { initials: 'AM', name: 'Akademia Muda', members: '324' },
      { initials: 'CN', name: 'CodeNesia', members: '324' }
    ]
  },
  {
    id: 'gaming-hub',
    name: 'Gaming Hub Indonesia',
    subtitle: 'Esports & Multiplayer Squad',
    eventTag: 'Weekend Scrims',
    cover:
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    location: 'Jakarta, Indonesia',
    date: '5 September, 2025',
    members: '1.2k',
    description:
      'Find teammates, join tournament watch parties, and swap meta strategies for your favorite titles.',
    tags: ['#Esports', '#Coop', '#Livestream'],
    posts: [
      {
        id: 'gh-post-1',
        author: {
          name: 'Rafiq Satrio',
          title: 'Squad Captain',
          avatar:
            'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&q=80'
        },
        timeAgo: 'posted 1 hr ago',
        title: 'Scrim malam ini — slot tersisa?',
        summary:
          'Tim Valorant kita butuh dua duelist untuk scrim malam ini. Rank minimal Diamond. Comment kalau siap!',
        tags: ['#Valorant', '#Scrim'],
        stats: { likes: 18, comments: 11 }
      }
    ],
    infoItems: [
      { icon: '🎮', label: 'Platforms', value: 'PC & Console' },
      { icon: '🗓️', label: 'Match Days', value: 'Tuesday & Friday' },
      { icon: '🎙️', label: 'Voice Chat', value: 'Discord.gg/gaminghub' }
    ],
    activities: {
      image:
        'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80',
      list: ['Ranked grind party', 'Tournament watch-along', 'Strategy breakdown session']
    },
    related: [
      { initials: 'CN', name: 'CodeNesia', members: '324' },
      { initials: 'RB', name: 'Ruang Belajar Bersama', members: '324' }
    ]
  }
];

const fallbackId = 'jump-fest-2025';

const community = computed(() => {
  const targetId = String(route.params.id ?? fallbackId);
  return communityDirectory.find((entry) => entry.id === targetId) ??
    communityDirectory.find((entry) => entry.id === fallbackId)!;
});

const posts = computed(() => community.value.posts);
const infoItems = computed(() => community.value.infoItems);
const activitiesPreview = computed(() => community.value.activities);
const relatedCommunities = computed(() => community.value.related);
</script>

<style scoped>
.community-detail-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

.back-link {
  color: #3b5379;
  font-weight: 600;
  text-decoration: none;
}

.community-detail-content {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.community-detail-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-height: calc(100vh - 160px);
  overflow-y: auto;
  padding-right: 4px;
  scrollbar-width: thin;
}

.community-detail-main::-webkit-scrollbar {
  width: 4px;
}

.community-detail-main::-webkit-scrollbar-track {
  background: transparent;
}

.community-detail-main::-webkit-scrollbar-thumb {
  background-color: rgba(148, 163, 184, 0.35);
  border-radius: 999px;
}

.community-hero {
  background: #ffffff;
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
}

.hero-media {
  position: relative;
  min-height: 260px;
}

.hero-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  padding: 32px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.05) 0%, rgba(15, 23, 42, 0.8) 100%);
  color: #ffffff;
}

.hero-badge {
  display: inline-flex;
  align-self: flex-start;
  padding: 6px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.15);
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
}

.hero-overlay h1 {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
}

.hero-subtitle {
  font-size: 16px;
  margin-bottom: 24px;
}

.hero-actions {
  display: flex;
  gap: 12px;
}

.hero-button {
  padding: 12px 20px;
  border-radius: 14px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hero-button.primary {
  background: #facc15;
  color: #0f172a;
  box-shadow: 0 12px 24px rgba(250, 204, 21, 0.4);
}

.hero-button.ghost {
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

.hero-button:hover {
  transform: translateY(-2px);
}

.community-posts {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.community-posts header h2 {
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
}

.community-posts header p {
  color: #64748b;
}

.post-card {
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.05);
}

.post-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.post-header .avatar {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  object-fit: cover;
}

.author-name {
  font-weight: 600;
  color: #0f172a;
}

.author-role {
  font-size: 13px;
  color: #64748b;
}

.post-time {
  margin-left: auto;
  font-size: 13px;
  color: #94a3b8;
}

.post-body h3 {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #0f172a;
}

.post-body p {
  color: #475569;
  line-height: 1.6;
}

.post-footer {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: space-between;
  align-items: center;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  padding: 6px 12px;
  border-radius: 999px;
  background-color: #f1f5f9;
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
}

.post-stats {
  display: flex;
  gap: 16px;
  color: #64748b;
  font-size: 13px;
}

.community-detail-sidebar {
  width: 320px;
  position: sticky;
  top: 32px;
  align-self: flex-start;
  max-height: calc(100vh - 160px);
  overflow-y: auto;
  padding-right: 4px;
  scrollbar-width: thin;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.community-detail-sidebar::-webkit-scrollbar {
  width: 4px;
}

.community-detail-sidebar::-webkit-scrollbar-thumb {
  background-color: rgba(148, 163, 184, 0.35);
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

.sidebar-card h3 {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
}

.details-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.details-location {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #475569;
}

.details-location svg {
  width: 18px;
  height: 18px;
  color: #3b5379;
}

.details-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 12px;
}

.detail-chip {
  flex: 1 1 150px;
  background: #f8fafc;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #94a3b8;
}

.detail-description {
  margin-top: 16px;
  color: #475569;
  line-height: 1.6;
}

.details-highlight {
  margin-top: 16px;
  padding: 12px 16px;
  border-radius: 16px;
  background: #fff7cc;
  color: #854d0e;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}

.info-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-list li {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  color: #475569;
}

.info-icon {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  background: #f1f5f9;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.info-label {
  font-weight: 600;
  color: #0f172a;
}

.info-value {
  font-size: 14px;
  color: #475569;
}

.activities-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.explore-button {
  padding: 8px 14px;
  border-radius: 12px;
  border: none;
  background: #ffd54f;
  font-weight: 600;
  cursor: pointer;
}

.activities-preview img {
  width: 100%;
  border-radius: 16px;
  object-fit: cover;
}

.activities-list {
  list-style: disc;
  margin-left: 20px;
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
  color: #0f172a;
}

.related-meta {
  font-size: 13px;
  color: #64748b;
}

@media (max-width: 1280px) {
  .community-detail-content {
    flex-direction: column;
  }

  .community-detail-main,
  .community-detail-sidebar {
    max-height: none;
    overflow: visible;
    padding-right: 0;
  }

  .community-detail-sidebar {
    width: 100%;
    position: static;
  }
}

@media (max-width: 768px) {
  .hero-overlay {
    padding: 20px;
  }

  .hero-overlay h1 {
    font-size: 22px;
  }

  .hero-actions {
    flex-direction: column;
    align-items: flex-start;
  }

  .post-card {
    padding: 16px;
  }
}
</style>
