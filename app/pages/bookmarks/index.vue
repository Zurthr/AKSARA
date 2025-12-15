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

        <article
          v-for="item in visibleNonPostBookmarks"
          :key="item.id"
          class="bookmark-card"
        >
          <div
            class="card-body"
            :class="{ 'card-body--with-cover': item.type === 'literature' }"
          >
            <div v-if="item.type === 'literature'" class="book-cover-wrap">
              <img
                v-if="getBookCover(item)"
                :src="getBookCover(item)"
                :alt="`Cover of ${item.title}`"
                class="book-cover"
              />
            </div>

            <div class="card-body-main">
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
          </div>
        </article>
      </div>
    </div>

    <RightSideBar>
      <section class="sidebar-card">
        <h3>Your Bookmarks</h3>
        <p class="sidebar-quote">All your little things—from posts to <br>events—in one petite place.🐝</p>
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

      <EventsFilter v-if="activeTab === 'event'" />
      <LiteratureFilterSidebar v-if="activeTab === 'literature'" />
    </RightSideBar>
  </div>
</template>

<script setup lang="ts">
import type { LocationQueryRaw } from 'vue-router';
import RightSideBar from '~/components/General/RightSideBar.vue';
import LiteratureFilterSidebar from '~/components/Literature/LiteratureFilterSidebar.vue';
import EventsFilter from '~/components/Events/EventsFilter.vue';
import ForumCard from '~/components/Forum/ForumCard.vue';
import books from '~/../mock-backend/data/books.json';
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

type Book = {
  id: number;
  cover: string;
};

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

const bookCoverById = new Map<number, string>(
  (books as Book[]).map((b) => [b.id, b.cover])
);

const getBookCover = (item: BookmarkItem): string | undefined => {
  if (item.type !== 'literature') return undefined;
  // Prefer parsing from refId, e.g. "book-3"
  const refMatch = item.refId.match(/^book-(\d+)$/);
  const idFromRef = refMatch ? Number(refMatch[1]) : NaN;

  // Fallback: parse from link, e.g. "/literature/3"
  const linkMatch = item.link.match(/\/literature\/(\d+)$/);
  const idFromLink = linkMatch ? Number(linkMatch[1]) : NaN;

  const id = !Number.isNaN(idFromRef) ? idFromRef : idFromLink;
  if (Number.isNaN(id)) return undefined;

  return bookCoverById.get(id);
};

const bookmarkItems = ref<BookmarkItem[]>([
  // Forum posts – shaped after entries in mock-backend/db.json "posts"
  {
    id: 'bm-post-1',
    refId: 'post-1',
    type: 'post',
    title: "Applying 'Atomic Habits' to Learning to Code",
    content:
      "I've been struggling to stay consistent with my Vue.js learning. I started applying the '2-minute rule' from James Clear's book. Instead of saying 'I will code for 2 hours', I just say 'I will open VS Code'. It's surprisingly effective.",
    timeAgo: '2 hours ago',
    stars: 342,
    link: '/forums/1',
    tags: ['#Productivity', '#Coding'],
    author: {
      name: 'Sarah Chen',
      tagline: 'Product Designer',
      avatar: 'https://i.pravatar.cc/150?u=sarah',
    },
  },
  {
    id: 'bm-post-2',
    refId: 'post-2',
    type: 'post',
    title: "Is 'Clean Code' still relevant in 2024?",
    content:
      "Uncle Bob's examples are in Java, and some people say the advice is outdated. However, I feel the core principles of meaningful naming and small functions are timeless. Thoughts?",
    timeAgo: '4 hours ago',
    stars: 128,
    link: '/forums/2',
    tags: ['#Discussion', '#SoftwareEngineering'],
    author: {
      name: 'Mike Ross',
      tagline: 'Backend Dev',
      avatar: 'https://i.pravatar.cc/150?u=mike',
    },
  },
  {
    id: 'bm-post-3',
    refId: 'post-3',
    type: 'post',
    title: 'The cozy beginning of The Hobbit',
    content:
      'Re-reading The Hobbit this weekend. I forgot how whimsical the opening chapter is compared to the epic scale of LOTR. Bilbo fretting over his doilies while Gandalf plots an adventure is peak comedy.',
    timeAgo: '5 hours ago',
    stars: 560,
    link: '/forums/3',
    tags: ['#Tolkien', '#Fantasy'],
    author: {
      name: 'Jane Smith',
      tagline: 'Fantasy Reader',
      avatar: 'https://i.pravatar.cc/150?u=jane',
    },
  },
  {
    id: 'bm-post-4',
    refId: 'post-4',
    type: 'post',
    title: 'Why you should master Vanilla JS before Frameworks',
    content:
      "Reading 'JavaScript: The Good Parts' reminded me why understanding closures and prototypes is crucial, even if you use React or Vue every day. Don't skip the basics, guys.",
    timeAgo: '6 hours ago',
    stars: 210,
    link: '/forums/4',
    tags: ['#JavaScript', '#Advice'],
    author: {
      name: 'Alfan Gunadar',
      tagline: 'Frontend Ninja',
      avatar: 'https://i.pravatar.cc/150?u=alfan',
    },
  },
  {
    id: 'bm-post-5',
    refId: 'post-5',
    type: 'post',
    title: 'HCI principles in modern Game UI',
    content:
      "I've been analyzing the inventory systems in RPGs. The principles from the 'Human-Computer Interaction' book regarding cognitive load are totally applicable here. Minimalist UI isn't just aesthetic; it's functional.",
    timeAgo: '8 hours ago',
    stars: 89,
    link: '/forums/5',
    tags: ['#UXDesign', '#Gaming'],
    author: {
      name: 'Donna Paulsen',
      tagline: 'UX Researcher',
      avatar: 'https://i.pravatar.cc/150?u=donna',
    },
  },
  {
    id: 'bm-post-6',
    refId: 'post-6',
    type: 'post',
    title: 'MVP vs Polished Product',
    content:
      'The Lean Startup methodology saved my latest project. We were about to spend 6 months building a feature nobody wanted. "Build-Measure-Learn" is the only way to go.',
    timeAgo: '10 hours ago',
    stars: 445,
    link: '/forums/6',
    tags: ['#Business', '#Startup'],
    author: {
      name: 'Harvey Specter',
      tagline: 'Startup Founder',
      avatar: 'https://i.pravatar.cc/150?u=harvey',
    },
  },
  {
    id: 'bm-post-7',
    refId: 'post-7',
    type: 'post',
    title: 'Growth Mindset changed how I study',
    content:
      "I used to think I was just 'bad at math'. After reading Carol Dweck's book, I realized I just hadn't found the right method yet. It's a subtle shift but it changes everything.",
    timeAgo: '12 hours ago',
    stars: 670,
    link: '/forums/7',
    tags: ['#Psychology', '#Studying'],
    author: {
      name: 'Rachel Zane',
      tagline: 'Student',
      avatar: 'https://i.pravatar.cc/150?u=rachel',
    },
  },
  {
    id: 'bm-post-8',
    refId: 'post-8',
    type: 'post',
    title: 'The math behind Deep Learning',
    content:
      "Finally diving into the 'Deep Learning' book by Goodfellow. The linear algebra chapter is dense but necessary. Anyone else working through this text?",
    timeAgo: '14 hours ago',
    stars: 112,
    link: '/forums/8',
    tags: ['#AI', '#Math'],
    author: {
      name: 'John Doe',
      tagline: 'AI Enthusiast',
      avatar: 'https://i.pravatar.cc/150?u=john',
    },
  },

  // Literature – shaped after entries in mock-backend/db.json "books"
  {
    id: 'bm-lit-1',
    refId: 'book-1',
    type: 'literature',
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    content:
      "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees. Every year, countless hours and significant resources are lost because of poorly written code.",
    timeAgo: '2 days ago',
    stars: 3420,
    link: '/literature/1',
    tags: ['Software Engineering', 'Programming', 'Best Practices', 'Code Quality'],
    author: {
      name: 'Robert C. Martin',
      tagline: 'Author',
      badge: 'Book',
      avatar: 'https://i.pravatar.cc/150?u=unclebob',
    },
    copyType: ['Physical', 'Digital'],
    licensingType: ['Pay-to-own'],
    sources: ['IEEE Xplore', 'Springer', 'ACM Digital Library'],
  },
  {
    id: 'bm-lit-2',
    refId: 'book-2',
    type: 'literature',
    title: 'The Hobbit',
    content:
      'Bilbo Baggins is a hobbit who enjoys a comfortable, unambitious life, but his contentment is disturbed when Gandalf and a company of dwarves arrive to take him on an adventure to the Lonely Mountain.',
    timeAgo: '3 days ago',
    stars: 8934,
    link: '/literature/2',
    tags: ['Fantasy', 'Adventure', 'Classic Literature', 'Epic'],
    author: {
      name: 'J.R.R. Tolkien',
      tagline: 'Author',
      badge: 'Book',
      avatar: 'https://i.pravatar.cc/150?u=tolkien',
    },
    copyType: ['Physical', 'Audio', 'Digital'],
    licensingType: ['Pay-to-own'],
    sources: ['Amazon', 'Audible', 'Internet Archive'],
  },
  {
    id: 'bm-lit-3',
    refId: 'book-3',
    type: 'literature',
    title: 'Atomic Habits: An Easy & Proven Way to Build Good Habits & Break Bad Ones',
    content:
      'Atomic Habits offers a proven framework for improving every day, with practical strategies for forming good habits, breaking bad ones, and mastering tiny behaviors that lead to remarkable results.',
    timeAgo: '4 days ago',
    stars: 15678,
    link: '/literature/3',
    tags: ['Self-Help', 'Personal Development', 'Productivity', 'Psychology'],
    author: {
      name: 'James Clear',
      tagline: 'Author',
      badge: 'Book',
      avatar: 'https://i.pravatar.cc/150?u=jamesclear',
    },
    copyType: ['Physical', 'Digital', 'Subscription'],
    licensingType: ['Rent'],
    sources: ['Amazon Kindle', 'Apple Books', 'Scribd'],
  },
  {
    id: 'bm-lit-4',
    refId: 'book-5',
    type: 'literature',
    title: 'The Pragmatic Programmer: Your Journey to Mastery',
    content:
      'Written as a series of self-contained sections with anecdotes and examples, The Pragmatic Programmer illustrates best approaches and major pitfalls across many aspects of software development.',
    timeAgo: '5 days ago',
    stars: 8912,
    link: '/literature/5',
    tags: ['Programming', 'Career Development', 'Software Development', 'Best Practices'],
    author: {
      name: 'David Thomas & Andrew Hunt',
      tagline: 'Authors',
      badge: 'Book',
      avatar: 'https://i.pravatar.cc/150?u=pragprog',
    },
    copyType: ['Physical', 'Digital', 'Academic'],
    licensingType: ['Pay-to-own'],
    sources: ['Amazon', "O'Reilly", 'ACM Digital Library'],
  },

  // Events – shaped after entries in mock-backend/db.json "events"
  {
    id: 'bm-event-1',
    refId: 'event-1',
    type: 'event',
    title: 'Photo Walk Jakarta',
    content:
      "Join us for a morning photo walk through the historic streets of Kota Tua. We'll explore colonial architecture, street photography techniques, and end with a gallery review session at a local café.",
    timeAgo: 'upcoming',
    stars: 12,
    link: '/events/1',
    tags: ['#Photography', '#Jakarta', '#Walking', '#Learning'],
    author: {
      name: 'Photography Club',
      tagline: 'Community Event',
      badge: 'Event',
      avatar: 'https://i.pravatar.cc/150?u=photography-club',
    },
    eventDate: '2023-10-15T08:00:00Z',
    access: 'offline',
  },
  {
    id: 'bm-event-2',
    refId: 'event-2',
    type: 'event',
    title: 'Book Club: Harry Potter Marathon',
    content:
      'A full day marathon discussing all seven Harry Potter books. Bring your favorite theories and cosplay as your favorite character!',
    timeAgo: 'upcoming',
    stars: 8,
    link: '/events/2',
    tags: ['#Books', '#Harry Potter', '#Reading', '#Community'],
    author: {
      name: 'Literacy Circle',
      tagline: 'Book Club Community',
      badge: 'Event',
      avatar: 'https://i.pravatar.cc/150?u=literacy-circle',
    },
    eventDate: '2023-10-20T14:00:00Z',
    access: 'offline',
  },
]);

// Which real posts are bookmarked, derived from bookmarkItems mock data
const bookmarkedPostIds = computed<number[]>(() =>
  bookmarkItems.value
    .filter((b) => b.type === 'post')
    .map((b) => {
      // Prefer parsing from refId, e.g. "post-2"
      const refMatch = b.refId.match(/^post-(\d+)$/);
      if (refMatch) return Number(refMatch[1]);

      // Fallback: parse from link, e.g. "/forums/2"
      const linkMatch = b.link.match(/\/forums\/(\d+)$/);
      return linkMatch ? Number(linkMatch[1]) : NaN;
    })
    .filter((id) => !Number.isNaN(id))
);

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
  margin-top:20px;
}


.book-cover-wrap {
  flex: 0 0 200px;
}

.book-cover{
  width:200px;
  height:300px;
  object-fit: cover;
  border-radius:12px;
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

.card-body--with-cover {
  flex-direction: row;
  align-items: flex-start;
  gap: 16px;
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
  font-size: 18px;
  font-weight: 700;
  color: var(--color-black);
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
  background: var(--color-primary, #2563eb);
}

.bookmark-tab.active .tab-label {
  color: #ffffff;
}

.bookmark-tab.active .tab-count {
  background: var(--color-tertiary, #2563eb);
}

.filter-card {
  border: 1px solid #e2e8f0;
  padding:20px;
  border-radius:16px;
}

.card-body-main {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Event filter styles moved to components/Events/EventsFilter.vue */
</style>
