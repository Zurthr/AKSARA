<template>
  <section class="community-detail-page">
    <transition name="toast">
      <div v-if="showJoinToast" class="join-toast" role="status">
        <span class="toast-icon" aria-hidden="true">✓</span>
        <div>
          <p class="toast-title">Berhasil bergabung</p>
          <p class="toast-body">Kamu sekarang menjadi bagian dari komunitas ini.</p>
        </div>
      </div>
    </transition>

    <NuxtLink to="/community" class="back-link">&larr; Kembali</NuxtLink>

    <div class="community-detail-content">
      <div class="community-detail-main">
        <div class="community-detail-body">
          <div class="community-detail-feed">
            <article class="community-hero">
              <div class="hero-media" :style="heroBackgroundStyle">
                <div class="hero-overlay">
                  <p class="hero-badge">{{ community.eventTag }}</p>
                  <h1>{{ community.name }}</h1>
                  <p class="hero-subtitle">{{ community.subtitle }}</p>
                  <div class="hero-actions">
                    <button
                      type="button"
                      class="hero-button primary"
                      :class="{ joined: hasJoined }"
                      :disabled="hasJoined || isJoining"
                      @click="handleJoinCommunity"
                    >
                      <span v-if="hasJoined" aria-hidden="true">✓</span>
                      {{ joinButtonLabel }}
                    </button>
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

              <NuxtLink
                v-for="post in posts"
                :key="post.id"
                :to="getPostDetailRoute(post.id)"
                class="post-card-link"
              >
                <article class="post-card">
                  <div class="post-header">
                    <img :src="post.author.avatar" :alt="post.author.name" class="avatar" />
                    <div>
                      <p class="author-name">{{ post.author.name }}</p>
                      <p class="author-role">{{ post.author.title }}</p>
                    </div>
                    <span class="post-time"> {{ post.timeAgo }}</span>
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
              </NuxtLink>
            </section>
          </div>

          <div class="community-detail-insights">
            <section class="sidebar-card details-card">
              <h3>Details Communities</h3>
              <div class="details-location">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" fill="currentColor"/>
                </svg>
                {{ community.location }}
              </div>

              <div class="details-date">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" stroke="currentColor" stroke-width="2" fill="none"/>
                </svg>
                {{ community.date }}
              </div>

              <div class="details-members">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5z" fill="currentColor"/>
                </svg>
                {{ community.members }} members
              </div>

              <p class="community-description">{{ community.description }}</p>

              <div class="community-tags">
                <span v-for="tag in community.tags" :key="tag" class="tag">{{ tag }}</span>
              </div>
            </section>

            

            <section class="sidebar-card activities-card">
              <header class="activities-header">
                <h3>Activities</h3>
                <button type="button" class="explore-button">Explore Event</button>
              </header>
              <div class="activities-preview">
                <transition name="activity-fade" mode="out-in">
                  <img
                    :key="activityImages[activityImageIndex]"
                    :src="activityImages[activityImageIndex]"
                    alt="Community activities"
                  />
                </transition>
                <div v-if="activityImages.length > 1" class="activity-dots" aria-hidden="true">
                  <span
                    v-for="(image, idx) in activityImages"
                    :key="image"
                    :class="['dot', { active: idx === activityImageIndex }]"
                  />
                </div>
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
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

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
  gallery: string[];
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
      'https://images.unsplash.com/photo-1582711012124-a56cf82307a0?q=80&w=1540&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
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
      gallery: [
        'https://images.unsplash.com/photo-1526481280695-3c46973ed205?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1558979158-65a1eaa08691?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80'
      ],
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
      'data:image/png;base64,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',
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
      gallery: [
        'https://images.unsplash.com/photo-1513475382585-d06e58bcb0cf?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1455884398076-9d08be0bf0ff?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80'
      ],
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
      gallery: [
        'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=800&q=80'
      ],
      list: ['Ranked grind party', 'Tournament watch-along', 'Strategy breakdown session']
    },
    related: [
      { initials: 'CN', name: 'CodeNesia', members: '324' },
      { initials: 'RB', name: 'Ruang Belajar Bersama', members: '324' }
    ]
  },
  {
    id: 'wellness-warriors',
    name: 'Wellness Warriors',
    subtitle: 'Mindful Living & Balance',
    eventTag: 'Wellness Workshop',
    cover:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80',
    location: 'Yogyakarta, Indonesia',
    date: '15 October, 2025',
    members: '512',
    description:
      'Berbagi rutinitas sehat, dukung perjalanan mindfulness, dan saling menguatkan dalam perjalanan menuju hidup yang lebih seimbang.',
    tags: ['#Mindful', '#Balance', '#Habits', '#Wellness'],
    posts: [
      {
        id: 'ww-post-1',
        author: {
          name: 'Sari Dewi',
          title: 'Wellness Coach',
          avatar:
            'https://images.unsplash.com/photo-1494790108755-2616b612b830?auto=format&fit=crop&w=200&q=80'
        },
        timeAgo: 'posted 2 hrs ago',
        title: 'Morning routine yang mengubah hidupku',
        summary:
          '5 menit meditasi + journaling setiap pagi ternyata bisa bikin mindset jadi lebih positif. Yuk share rutinmu!',
        tags: ['#MorningRoutine', '#Mindfulness'],
        stats: { likes: 32, comments: 12 }
      },
      {
        id: 'ww-post-2',
        author: {
          name: 'Andi Pratama',
          title: 'Yoga Instructor',
          avatar:
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
        },
        timeAgo: 'posted 4 hrs ago',
        title: 'Tips yoga untuk pemula — mulai dari mana?',
        summary:
          'Banyak yang mau mulai yoga tapi bingung. Ini panduan simple untuk memulai praktik yoga di rumah.',
        tags: ['#Yoga', '#BeginnerTips'],
        stats: { likes: 28, comments: 9 }
      }
    ],
    infoItems: [
      { icon: '🧘', label: 'Focus', value: 'Mind & Body Wellness' },
      { icon: '📅', label: 'Sessions', value: 'Daily 07:00 & 19:00' },
      { icon: '💬', label: 'Support', value: '24/7 Community Chat' },
      { icon: '🎯', label: 'Goal', value: 'Sustainable Habits' }
    ],
    activities: {
      image:
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=800&q=80'
      ],
      list: ['Guided meditation', 'Weekly wellness challenge', 'Healthy recipe sharing']
    },
    related: [
      { initials: 'PC', name: 'Photography Club', members: '287' },
      { initials: 'CA', name: 'Creative Atelier', members: '648' },
      { initials: 'LC', name: 'Literacy Circle', members: '324' }
    ]
  },
  {
    id: 'photography-club',
    name: 'Photography Club',
    subtitle: 'Capture Life Through Lens',
    eventTag: 'Photo Walk',
    cover:
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1200&q=80',
    location: 'Bali, Indonesia',
    date: '22 September, 2025',
    members: '287',
    description:
      'Belajar teknik fotografi, ikut photo walk, dan diskusi kritik konstruktif setiap minggu. Dari pemula hingga pro!',
    tags: ['#PhotoWalk', '#Tips', '#Critique', '#Photography'],
    posts: [
      {
        id: 'pc-post-1',
        author: {
          name: 'Maya Kusuma',
          title: 'Professional Photographer',
          avatar:
            'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80'
        },
        timeAgo: 'posted 5 hrs ago',
        title: 'Golden hour di Ubud — tips komposisi',
        summary:
          'Kemarin photo walk di Ubud dapat spot golden hour yang amazing. Ini beberapa tips komposisi yang bisa diterapin.',
        tags: ['#GoldenHour', '#Composition'],
        stats: { likes: 45, comments: 15 }
      },
      {
        id: 'pc-post-2',
        author: {
          name: 'Reza Fahmi',
          title: 'Street Photographer',
          avatar:
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80'
        },
        timeAgo: 'posted 7 hrs ago',
        title: 'Review kamera mirrorless budget — worth it?',
        summary:
          'Nyobain beberapa kamera mirrorless di bawah 10 juta. Ini perbandingan hasil dan performanya.',
        tags: ['#CameraReview', '#Budget'],
        stats: { likes: 38, comments: 22 }
      }
    ],
    infoItems: [
      { icon: '📷', label: 'Equipment', value: 'All camera types welcome' },
      { icon: '🗺️', label: 'Photo Walks', value: 'Every Sunday' },
      { icon: '🎨', label: 'Workshop', value: 'Monthly editing session' },
      { icon: '🏆', label: 'Contest', value: 'Quarterly photo contest' }
    ],
    activities: {
      image:
        'https://images.unsplash.com/photo-1455853828816-0c301a011711?auto=format&fit=crop&w=600&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1455853828816-0c301a011711?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1469474968028-44952bb6c72c?auto=format&fit=crop&w=800&q=80'
      ],
      list: ['Weekend photo walks', 'Editing workshops', 'Portfolio reviews']
    },
    related: [
      { initials: 'CA', name: 'Creative Atelier', members: '648' },
      { initials: 'WW', name: 'Wellness Warriors', members: '512' },
      { initials: 'GH', name: 'Gaming Hub Indonesia', members: '1.2k' }
    ]
  },
  {
    id: 'creative-atelier',
    name: 'Creative Atelier',
    subtitle: 'Design & Visual Arts Hub',
    eventTag: 'Design Workshop',
    cover:
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=80',
    location: 'Surabaya, Indonesia',
    date: '8 October, 2025',
    members: '648',
    description:
      'Komunitas kreator visual. Ada feedback session, challenge mingguan, dan kelas desain gratis untuk semua level.',
    tags: ['#Illustration', '#UIUX', '#Workshop', '#Design'],
    posts: [
      {
        id: 'ca-post-1',
        author: {
          name: 'Lia Permata',
          title: 'UI/UX Designer',
          avatar:
            'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=200&q=80'
        },
        timeAgo: 'posted 3 hrs ago',
        title: 'Design system dari nol — part 1',
        summary:
          'Tutorial lengkap bikin design system yang konsisten. Mulai dari color palette, typography, sampai component library.',
        tags: ['#DesignSystem', '#Tutorial'],
        stats: { likes: 52, comments: 18 }
      },
      {
        id: 'ca-post-2',
        author: {
          name: 'Budi Santoso',
          title: 'Illustrator',
          avatar:
            'https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=200&q=80'
        },
        timeAgo: 'posted 6 hrs ago',
        title: 'Digital illustration workflow — Procreate vs Photoshop',
        summary:
          'Perbandingan workflow digital illustration antara Procreate dan Photoshop. Mana yang lebih cocok untuk style kalian?',
        tags: ['#DigitalArt', '#Workflow'],
        stats: { likes: 41, comments: 14 }
      }
    ],
    infoItems: [
      { icon: '🎨', label: 'Focus', value: 'Visual Design & Illustration' },
      { icon: '💡', label: 'Workshops', value: 'Weekly design sessions' },
      { icon: '📱', label: 'Tools', value: 'All design software' },
      { icon: '🎯', label: 'Level', value: 'Beginner to Advanced' }
    ],
    activities: {
      image:
        'https://images.unsplash.com/photo-1541462608143-67571c6738dd?auto=format&fit=crop&w=600&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1541462608143-67571c6738dd?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1475724017904-b712052c192a?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80'
      ],
      list: ['Design challenges', 'Portfolio feedback', 'Tool masterclasses']
    },
    related: [
      { initials: 'PC', name: 'Photography Club', members: '287' },
      { initials: 'LC', name: 'Literacy Circle', members: '324' },
      { initials: 'WW', name: 'Wellness Warriors', members: '512' }
    ]
  }
];

const fallbackId = 'jump-fest-2025';

const community = computed(() => {
  const targetId = String(route.params.id ?? fallbackId);
  return communityDirectory.find((entry) => entry.id === targetId) ??
    communityDirectory.find((entry) => entry.id === fallbackId)!;
});

const heroBackgroundStyle = computed(() => ({
  backgroundImage: `url("${community.value.cover}")`
}));

const hasJoined = ref(false);
const isJoining = ref(false);
const showJoinToast = ref(false);
const activityImageIndex = ref(0);
let toastTimeout: ReturnType<typeof setTimeout> | null = null;
let activityInterval: ReturnType<typeof setInterval> | null = null;

const joinButtonLabel = computed(() => {
  if (hasJoined.value) {
    return 'Sudah Bergabung';
  }
  if (isJoining.value) {
    return 'Menghubungkan...';
  }
  return '+ Gabung Komunitas';
});

const handleJoinCommunity = () => {
  if (hasJoined.value || isJoining.value) {
    return;
  }

  isJoining.value = true;

  setTimeout(() => {
    hasJoined.value = true;
    isJoining.value = false;
    showJoinToast.value = true;

    if (toastTimeout) {
      clearTimeout(toastTimeout);
    }

    toastTimeout = setTimeout(() => {
      showJoinToast.value = false;
      toastTimeout = null;
    }, 2800);
  }, 600);
};

const getPostDetailRoute = (postId: string) => `/forums/${postId}`;

const posts = computed(() => community.value.posts);
const infoItems = computed(() => community.value.infoItems);
const activitiesPreview = computed(() => community.value.activities);
const relatedCommunities = computed(() => community.value.related);
const activityImages = computed(() => {
  const gallery = activitiesPreview.value.gallery?.length
    ? activitiesPreview.value.gallery
    : [activitiesPreview.value.image];
  return gallery;
});

const clearActivityRotation = () => {
  if (activityInterval) {
    clearInterval(activityInterval);
    activityInterval = null;
  }
};

const startActivityRotation = () => {
  clearActivityRotation();
  if (!import.meta.client) {
    return;
  }
  if (activityImages.value.length <= 1) {
    return;
  }

  activityInterval = setInterval(() => {
    activityImageIndex.value = (activityImageIndex.value + 1) % activityImages.value.length;
  }, 3600);
};

watch(activityImages, (images) => {
  activityImageIndex.value = 0;
  if (images.length > 1) {
    startActivityRotation();
  } else {
    clearActivityRotation();
  }
}, { immediate: true });

watch(community, () => {
  activityImageIndex.value = 0;
});

onMounted(() => {
  if (activityImages.value.length > 1) {
    startActivityRotation();
  }
});

onBeforeUnmount(() => {
  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }
  clearActivityRotation();
});
</script>

<style scoped>
.community-detail-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  position: relative;
}

.join-toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #0f172a;
  color: #ffffff;
  padding: 20px 24px;
  border-radius: 16px;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.35);
  display: flex;
  align-items: flex-start;
  gap: 16px;
  z-index: 20;
  border: 1px solid rgba(148, 163, 184, 0.35);
  max-width: min(90vw, 360px);
}

.toast-icon {
  display: inline-flex;
  width: 28px;
  height: 28px;
  border-radius: 999px;
  background: rgba(34, 197, 94, 0.18);
  color: #22c55e;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.toast-title {
  font-weight: 600;
  margin: 0;
  font-size: 14px;
}

.toast-body {
  margin: 0;
  font-size: 13px;
  color: #cbd5f5;
}

.back-link {
  color: #3b5379;
  font-weight: 600;
  text-decoration: none;
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, calc(-50% - 16px));
}

.community-detail-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.community-detail-main {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
}

.community-detail-body {
  display: grid;
  grid-template-columns: minmax(0, 1fr) clamp(260px, 26vw, 320px);
  gap: 24px;
  align-items: start;
}

.community-detail-feed {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.community-detail-insights {
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: sticky;
  top: 82px;
}

.community-hero {
  background: #ffffff;
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
  flex-shrink: 0;
  width: 100%;
}

.hero-media {
  position: relative;
  min-height: clamp(140px, 26vh, 180px);
  aspect-ratio: 18 / 6;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-color: #0f172a;
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
  color: var(--color-black);
  box-shadow: 0 12px 24px rgba(250, 204, 21, 0.4);
}

.hero-button.primary.joined {
  background: #22c55e;
  color: #ffffff;
  box-shadow: 0 12px 24px rgba(34, 197, 94, 0.35);
}

.hero-button span[aria-hidden="true"] {
  margin-right: 6px;
}

.hero-button.ghost {
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

.hero-button:hover {
  transform: translateY(-2px);
}

.hero-button:disabled {
  opacity: 0.85;
  cursor: not-allowed;
  transform: none;
}

.community-posts {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.post-card-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.community-posts header h2 {
  font-size: 20px;
  font-weight: 700;
  color: var(--color-black);
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
  color: var(--color-black);
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
  color: var(--color-black);
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
  background-color: #3B5379;
  font-size: 13px;
  font-weight: 600;
  color: #ffffff;
}

.post-stats {
  display: flex;
  gap: 16px;
  color: #64748b;
  font-size: 13px;
}

.community-detail-insights .sidebar-card {
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
}

.sidebar-card {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
}

.sidebar-card h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-black);
  margin: 0;
}

.details-location,
.details-date,
.details-members {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #64748b;
  margin: 4px 0;
}

.details-location svg,
.details-date svg,
.details-members svg {
  width: 16px;
  height: 16px;
  color: #64748b;
}

.community-description {
  font-size: 14px;
  color: #64748b;
  line-height: 1.5;
  margin: 8px 0;
}

.community-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}

.community-tags .tag {
  padding: 4px 8px;
  border-radius: 12px;
  background-color: #3B5379;
  font-size: 12px;
  font-weight: 500;
  color: #ffffff;
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
  background: #3B5379;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.info-label {
  font-weight: 600;
  color: var(--color-black);
}

.info-value {
  font-size: 14px;
  color: #475569;
}

.activities-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.explore-button {
  padding: 6px 12px;
  border-radius: 8px;
  border: none;
  background: #3b82f6;
  color: white;
  font-weight: 500;
  font-size: 12px;
  cursor: pointer;
  text-transform: uppercase;
}

.activities-preview {
  margin: 12px 0;
  position: relative;
  height: 140px;
  border-radius: 12px;
  overflow: hidden;
  background: #0f172a;
}

.activities-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.activity-dots {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
}

.activity-dots .dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.35);
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.activity-dots .dot.active {
  background: #3b82f6;
  transform: scale(1.15);
}

.activities-list {
  list-style: none;
  margin: 0;
  padding: 0;
  font-size: 14px;
  color: #64748b;
}

.activities-list li {
  margin: 4px 0;
  padding-left: 16px;
  position: relative;
}

.activities-list li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #3b82f6;
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

.activity-fade-enter-active,
.activity-fade-leave-active {
  transition: opacity 0.35s ease;
}

.activity-fade-enter-from,
.activity-fade-leave-to {
  opacity: 0;
}

@media (max-width: 1280px) {
  .community-detail-body {
    grid-template-columns: minmax(0, 1fr) clamp(240px, 32vw, 300px);
    gap: 20px;
  }
}

@media (max-width: 1024px) {
  .community-detail-body {
    grid-template-columns: minmax(0, 1fr) clamp(220px, 40vw, 280px);
    gap: 18px;
  }

  .community-detail-insights {
    max-height: none;
    overflow: visible;
  }
}

@media (max-width: 768px) {
  .community-detail-body {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .community-detail-insights {
    position: static;
  }

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
