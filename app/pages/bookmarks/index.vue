<template>
  <div class="bookmark-page">
    <div class="bookmark-main">

      <div v-if="!visiblePosts.length && !visibleNonPostBookmarks.length" class="empty-state">
        <p>No bookmarks match your filters yet.</p>
        <p class="muted">Try adjusting the search or filters on the right.</p>
      </div>

      <div v-else class="bookmark-list">
        <!-- Forum post bookmarks -->
        <ForumCard
          v-for="post in visiblePosts"
          :key="post.id"
          :post="post"
        />

        <!-- Non-post bookmarks (literature, events) -->
        <article
          v-for="item in visibleNonPostBookmarks"
          :key="item.id"
          class="bookmark-card"
        >
          <div class="card-header">
            <div class="author">
              <img :src="item.author.avatar" :alt="item.author.name" class="avatar" />
              <div>
                <div class="author-row">
                  <span class="author-name">{{ item.author.name }}</span>
                  <span v-if="item.author.badge" class="author-badge">{{ item.author.badge }}</span>
                  <span class="type-pill" :class="item.type">{{ typeLabel(item.type) }}</span>
                </div>
                <p class="author-tagline">{{ item.author.tagline }}</p>
              </div>
            </div>
          </div>

          <div class="card-body">
            <div class="title-row">
              <h2 class="card-title">{{ item.title }}</h2>
              <NuxtLink :to="item.link" class="ref-link">
                View {{ typeLabel(item.type) }}
              </NuxtLink>
            </div>
            <p class="card-content">{{ item.content }}</p>

            <div class="tags">
              <span v-for="tag in item.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>

            <div class="card-footer">
              <div class="stats">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="star-icon">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span class="star-count">{{ item.stars }}</span>
                <span v-if="item.type === 'event' && item.eventDate" class="event-date">
                  • {{ formatDisplayDate(item.eventDate) }}
                </span>
              </div>
              <div class="ref-id">
                Saved from ID: <span class="ref">{{ item.refId }}</span>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>

    <RightSideBar>
      <section class="sidebar-card">
        <h3>Your Bookmarks</h3>
        <p class="sidebar-quote">'a placeholder quote'</p>
        <div class="bookmark-tabs" role="tablist" aria-label="Bookmark types">
          <button
            type="button"
            class="bookmark-tab"
            :class="{ active: activeTab === 'post' }"
            role="tab"
            :aria-selected="activeTab === 'post'"
            @click="activeTab = 'post'"
          >
            <span class="tab-label">Forum Posts</span>
            <span class="tab-count">{{ bookmarkCounts.post }}</span>
          </button>
          <button
            type="button"
            class="bookmark-tab"
            :class="{ active: activeTab === 'literature' }"
            role="tab"
            :aria-selected="activeTab === 'literature'"
            @click="activeTab = 'literature'"
          >
            <span class="tab-label">Literature</span>
            <span class="tab-count">{{ bookmarkCounts.literature }}</span>
          </button>
          <button
            type="button"
            class="bookmark-tab"
            :class="{ active: activeTab === 'event' }"
            role="tab"
            :aria-selected="activeTab === 'event'"
            @click="activeTab = 'event'"
          >
            <span class="tab-label">Events</span>
            <span class="tab-count">{{ bookmarkCounts.event }}</span>
          </button>
        </div>
      </section>

      <EventsFilter />
      <LiteratureFilterSidebar />
    </RightSideBar>
  </div>
</template>

<script setup lang="ts">
import type { LocationQueryRaw } from 'vue-router';
import RightSideBar from '~/components/General/RightSideBar.vue';
import LiteratureFilterSidebar from '~/components/Literature/LiteratureFilterSidebar.vue';
import EventsFilter from '~/components/Events/EventsFilter.vue';
import ForumCard from '~/components/Forum/ForumCard.vue';
import { useLazyPosts, type Post } from '~/composables/useLazyPosts';

type BookmarkType = 'post' | 'literature' | 'event';

interface BookmarkItem {
  id: string;
  refId: string;
  type: BookmarkType;
  title: string;
  content: string;
  timeAgo: string;
  stars: number;
  link: string;
  tags: string[];
  author: {
    name: string;
    tagline: string;
    badge?: string;
    avatar: string;
  };
  eventDate?: string;
  access?: 'online' | 'offline';
  copyType?: string[];
  licensingType?: string[];
  sources?: string[];
}

const route = useRoute();
const router = useRouter();

// Real forum posts from the same source as the home page
const { posts, loadMore, hasMore, isLoading } = useLazyPosts(10);

onMounted(() => {
  if (!posts.value.length && !isLoading.value) {
    loadMore();
  }
});

const ensureArray = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.filter(Boolean).map(String);
  if (value === undefined || value === null || value === '') return [];
  return [String(value)];
};

const normalizeKey = (value: string) => value.trim().toLowerCase();

const bookmarkItems = ref<BookmarkItem[]>([
  {
    id: 'bm-post-1',
    refId: 'forum-101',
    type: 'post',
    title: 'LF Best Books for Aspiring Web Developers',
    content: 'Hey everyone! I’ve been diving deeper into web development lately, and I realized there’s a ton of great books out there that can really help you level up beyond just YouTube tutorials.',
    timeAgo: 'an hr ago',
    stars: 80,
    link: '/forums/101',
    tags: ['Web Dev', '#NewDev', '#WebDev', '#Stacking'],
    author: {
      name: 'Orang Kmplang',
      tagline: 'A stupid one',
      avatar: 'https://i.pravatar.cc/96?img=12',
    },
  },
  {
    id: 'bm-post-2',
    refId: 'forum-204',
    type: 'post',
    title: 'Building a learning path beyond tutorials',
    content: 'Collecting the best references for folks who want to move from watching to doing. What helped you the most?',
    timeAgo: '2 hrs ago',
    stars: 64,
    link: '/forums/204',
    tags: ['A Level', 'Web Dev', '#WebDev', '#Stacking'],
    author: {
      name: 'Orang Kmplang',
      tagline: 'A stupid one',
      avatar: 'https://i.pravatar.cc/96?img=32',
    },
  },
  {
    id: 'bm-lit-1',
    refId: 'literature-501',
    type: 'literature',
    title: 'Designing Data-Intensive Applications',
    content: 'A must-read for system design fundamentals, distributed patterns, and trade-offs.',
    timeAgo: 'yesterday',
    stars: 112,
    link: '/literature/501',
    tags: ['Systems', 'Data', 'Architecture'],
    author: {
      name: 'Martin Kleppmann',
      tagline: 'Author',
      badge: 'Writer',
      avatar: 'https://i.pravatar.cc/96?img=47',
    },
    copyType: ['online', 'physical'],
    licensingType: ['pay-to-own'],
    sources: ['IEEE', 'OReilly'],
  },
  {
    id: 'bm-lit-2',
    refId: 'literature-872',
    type: 'literature',
    title: 'Learning Vue 3 by Building',
    content: 'Step-by-step projects to get comfortable with the composition API and real-world UI states.',
    timeAgo: '3 days ago',
    stars: 74,
    link: '/literature/872',
    tags: ['Vue', 'Frontend', 'NewDev'],
    author: {
      name: 'Vue School',
      tagline: 'Educator',
      avatar: 'https://i.pravatar.cc/96?img=21',
    },
    copyType: ['online'],
    licensingType: ['free'],
    sources: ['VueSchool'],
  },
  {
    id: 'bm-event-1',
    refId: 'event-3201',
    type: 'event',
    title: 'Modern Vue Summit 2025',
    content: 'Live workshop covering Nuxt server routes, composables, and deployment.',
    timeAgo: '4 days ago',
    stars: 58,
    link: '/events/3201',
    tags: ['Vue', 'Workshop', 'Online'],
    author: {
      name: 'AKSARA Community',
      tagline: 'Host',
      badge: 'Event',
      avatar: 'https://i.pravatar.cc/96?img=55',
    },
    eventDate: '2025-12-29',
    access: 'online',
  },
  {
    id: 'bm-event-2',
    refId: 'event-1188',
    type: 'event',
    title: 'Jakarta Tech Readers Meetup',
    content: 'In-person book swap and lightning talks on recent engineering reads.',
    timeAgo: 'a week ago',
    stars: 33,
    link: '/events/1188',
    tags: ['Community', 'Offline', 'Book'],
    author: {
      name: 'Local Chapter',
      tagline: 'Organizer',
      avatar: 'https://i.pravatar.cc/96?img=5',
    },
    eventDate: '2025-12-20',
    access: 'offline',
  },
]);

// Placeholder: which real posts are bookmarked
const bookmarkedPostIds = ref<number[]>([1, 2, 3]);

const bookmarkedPosts = computed<Post[]>(() => {
  const idSet = new Set(bookmarkedPostIds.value.map(String));
  return posts.value.filter((p) => idSet.has(String(p.id)));
});

const activeTab = ref<BookmarkType>('post');

const searchTerm = ref((route.query.q as string) || '');
const typeFilters = ref<string[]>(ensureArray(route.query.type));

const typeChips = [
  { label: 'Forum Posts', value: 'post' },
  { label: 'Literature Material', value: 'literature' },
  { label: 'Events', value: 'event' },
];

watch(() => route.query.q, (val) => {
  if ((val as string | undefined) !== searchTerm.value) {
    searchTerm.value = (val as string) || '';
  }
});

watch(() => route.query.type, (val) => {
  const next = ensureArray(val);
  const joined = next.join('|');
  if (joined !== typeFilters.value.join('|')) {
    typeFilters.value = next;
  }
});

const updateQuery = (patch: LocationQueryRaw) => {
  const next: LocationQueryRaw = { ...(route.query as LocationQueryRaw), ...patch };
  Object.keys(next).forEach((key) => {
    const value = next[key];
    const isEmptyArray = Array.isArray(value) && value.length === 0;
    if (value === undefined || value === null || value === '' || isEmptyArray) {
      delete next[key];
    }
  });
  router.replace({ query: next });
};

watch(searchTerm, (val) => {
  updateQuery({ q: val || undefined });
});

const toggleType = (type: string) => {
  const exists = typeFilters.value.includes(type);
  typeFilters.value = exists
    ? typeFilters.value.filter((t) => t !== type)
    : [...typeFilters.value, type];
  updateQuery({ type: typeFilters.value });
};

const resetTypes = () => {
  typeFilters.value = [];
  updateQuery({ type: undefined });
};

const parseDate = (value?: string | null): Date | null => {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
};

const formatDisplayDate = (value?: string) => {
  const d = parseDate(value);
  if (!d) return '';
  return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
};

const filteredBookmarks = computed(() => {
  const q = searchTerm.value.trim().toLowerCase();
  const activeTypes = typeFilters.value;

  const copyTypeFilters = ensureArray(route.query.copyType).map(normalizeKey);
  const licensingFilters = ensureArray(route.query.licensingType).map(normalizeKey);
  const sourceFilter = ((route.query.sources as string) || '').toLowerCase();
  const tagFilters = ensureArray(route.query.tags).map(normalizeKey);

  const start = parseDate(route.query.startDate as string | undefined);
  const endRaw = parseDate(route.query.endDate as string | undefined);
  const end = endRaw ? new Date(endRaw.setHours(23, 59, 59, 999)) : null;
  const eventTypes = ensureArray(route.query.eventType).map(normalizeKey);

  return bookmarkItems.value.filter((item) => {
    // Forum posts are rendered via ForumCard using real posts data
    if (item.type === 'post') return false;
    const haystack = `${item.title} ${item.content} ${item.author.name} ${item.author.tagline}`.toLowerCase();
    if (q && !haystack.includes(q)) return false;

    if (activeTypes.length && !activeTypes.includes(item.type)) return false;

    if (tagFilters.length) {
      const normalizedTags = item.tags.map(normalizeKey);
      const allMatch = tagFilters.every((t) => normalizedTags.some((tag) => tag.includes(t)));
      if (!allMatch) return false;
    }

    if (item.type === 'literature') {
      const normalizedCopy = (item.copyType || []).map(normalizeKey);
      const normalizedLicensing = (item.licensingType || []).map(normalizeKey);
      const normalizedSources = (item.sources || []).map(normalizeKey);

      if (copyTypeFilters.length && !copyTypeFilters.some((c) => normalizedCopy.includes(c))) return false;
      if (licensingFilters.length && !licensingFilters.some((l) => normalizedLicensing.includes(l))) return false;
      if (sourceFilter && !normalizedSources.some((s) => s.includes(sourceFilter))) return false;
    }

    if (item.type === 'event') {
      const evDate = parseDate(item.eventDate);
      if (start && evDate && evDate < start) return false;
      if (end && evDate && evDate > end) return false;
      if (eventTypes.length) {
        const access = normalizeKey(item.access || '');
        if (!eventTypes.includes(access)) return false;
      }
    }

    return true;
  });
});

const literatureBookmarks = computed(() =>
  filteredBookmarks.value.filter((item) => item.type === 'literature')
);

const eventBookmarks = computed(() =>
  filteredBookmarks.value.filter((item) => item.type === 'event')
);

const bookmarkCounts = computed(() => ({
  post: bookmarkItems.value.filter((b) => b.type === 'post').length,
  literature: bookmarkItems.value.filter((b) => b.type === 'literature').length,
  event: bookmarkItems.value.filter((b) => b.type === 'event').length,
}));

const visiblePosts = computed(() =>
  activeTab.value === 'post' ? bookmarkedPosts.value : []
);

const visibleNonPostBookmarks = computed(() => {
  if (activeTab.value === 'literature') return literatureBookmarks.value;
  if (activeTab.value === 'event') return eventBookmarks.value;
  return [];
});

const typeLabel = (type: BookmarkType) => {
  if (type === 'post') return 'Forum Post';
  if (type === 'literature') return 'Literature';
  return 'Event';
};
</script>

<style scoped>
.bookmark-page {
  display: flex;
  gap: 24px;
}

.bookmark-main {
  flex: 1;
}

.bookmark-header {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 12px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f1f5f9;
  border-radius: 999px;
  padding: 10px 16px;
  border: 1px solid #e2e8f0;
}

.search-icon {
  width: 20px;
  height: 20px;
  color: #64748b;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 15px;
  outline: none;
}

.type-filters {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.type-chip {
  border: 1px solid #e2e8f0;
  background: #ffffff;
  color: #334155;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.type-chip.active {
  background: var(--color-primary, #2563eb);
  border-color: var(--color-primary, #2563eb);
  color: #ffffff;
}

.type-chip.clear {
  background: #f8fafc;
}

.bookmark-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.bookmark-card {
  border-radius: 16px;
  padding: 18px 20px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.author {
  display: flex;
  gap: 12px;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.author-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.author-name {
  font-weight: 600;
  color: #0f172a;
}

.author-badge {
  background: #e2e8f0;
  color: #334155;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 600;
}

.author-tagline {
  margin: 2px 0 0;
  color: #475569;
  font-size: 13px;
}

.type-pill {
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  color: #0f172a;
  background: #f1f5f9;
}

.type-pill.post {
  background: #e0f2fe;
  color: #0ea5e9;
}

.type-pill.literature {
  background: #ede9fe;
  color: #7c3aed;
}

.type-pill.event {
  background: #dcfce7;
  color: #16a34a;
}

.meta {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
  font-size: 13px;
}

.icon-btn {
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: #94a3b8;
}

.card-body {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.card-title {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  color: #0f172a;
}

.ref-link {
  font-size: 13px;
  color: var(--color-primary, #2563eb);
  text-decoration: none;
}

.ref-link:hover {
  text-decoration: underline;
}

.card-content {
  margin: 0;
  color: #334155;
  line-height: 1.5;
}

.tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  background: #e2e8f0;
  color: #334155;
  padding: 6px 10px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.stats {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #0f172a;
  font-weight: 600;
}

.star-icon {
  color: #f59e0b;
}

.star-count {
  font-size: 14px;
}

.event-date {
  color: #64748b;
  font-size: 13px;
}

.ref-id {
  font-size: 12px;
  color: #475569;
}

.ref {
  font-weight: 700;
  color: #0f172a;
}

.empty-state {
  padding: 40px;
  text-align: center;
  border: 1px dashed #cbd5e1;
  border-radius: 12px;
  color: #475569;
}

.muted {
  color: #94a3b8;
  margin-top: 4px;
}

.sidebar-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
}

.sidebar-card h3 {
  margin: 0 0 12px;
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
}

.sidebar-quote {
  margin: 0 0 12px;
  color: #475569;
  font-size: 14px;
}

.bookmark-tabs {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.bookmark-tab {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  cursor: pointer;
  transition: all 0.15s ease;
}

.bookmark-tab .tab-label {
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
}

.bookmark-tab .tab-count {
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
  padding: 4px 8px;
  border-radius: 999px;
  background: #e2e8f0;
}

.bookmark-tab.active {
  border-color: var(--color-primary, #2563eb);
  background: #eff6ff;
}

.bookmark-tab.active .tab-label {
  color: var(--color-primary, #2563eb);
}

.bookmark-tab.active .tab-count {
  background: var(--color-primary, #2563eb);
  color: #ffffff;
}

.filter-card {
  border: 1px solid #e2e8f0;
}

/* Event filter styles moved to components/Events/EventsFilter.vue */
</style>
