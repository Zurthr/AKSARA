<template>
  <div class="book-detail-page">
    <div v-if="book" class="book-detail-container">
      <!-- Main Content -->
      <main class="book-main">
        <!-- Book Header Section -->
        <div class="book-header">
          <div class="book-cover-section">
            <img :src="book.cover" :alt="book.title" class="book-cover-image" />
          </div>
          <div class="book-info-section">
            <h1 class="book-title-main">{{ book.title }}</h1>
            <p class="book-author-main" v-if="book.author">by {{ book.author }}</p>
            <div class="book-rating-section">
              <div class="stars-container">
                <div class="star-wrapper" v-for="i in 5" :key="i">
                  <svg
                    class="star"
                    :class="{ 'star-filled': i <= Math.round(book.rating || 0) }"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
              </div>
            </div>
            <div class="book-description">
              <p>{{ book.description || 'No description available.' }}</p>
            </div>
          </div>
        </div>

        <!-- Tabs Section -->
        <div class="tabs-section">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            class="tab-button"
            :class="{ active: activeTab === tab.id }"
            @click="activeTab = tab.id"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- Tab Content -->
        <div class="tab-content">
          <!-- Related Posts Tab -->
          <div v-if="activeTab === 'posts'" class="posts-tab">
            <div v-if="relatedPosts.length > 0">
              <ForumCard
                v-for="post in relatedPosts"
                :key="post.id"
                :post="post"
              />
            </div>
            <div v-else class="no-posts">
              <p>No related posts found for this book.</p>
            </div>
          </div>

          <!-- Reviews Tab -->
          <div v-if="activeTab === 'reviews'" class="reviews-tab">
            <p>Reviews section coming soon...</p>
          </div>

          <!-- Sourcing Options Tab -->
          <div v-if="activeTab === 'sourcing'" class="sourcing-tab">
            <div class="sourcing-content">
              <h3>Available Sources</h3>
              <div v-if="book.sources && book.sources.length > 0" class="sources-list">
                <a
                  v-for="source in book.sources"
                  :key="source.name"
                  :href="source.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="source-link"
                >
                  {{ source.name }}
                </a>
              </div>
              <div v-else>
                <p>No sources available.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- Sidebar -->
      <aside class="book-sidebar">
        <div class="sidebar-content">
          <h2 class="sidebar-title">Book Details</h2>
          
          <div class="sidebar-section">
            <h3 class="sidebar-book-title">{{ book.title }}</h3>
            <div class="bookmark-count">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
              </svg>
              <span>{{ book.total_bookmarked || 0 }}</span>
            </div>
            <p class="sidebar-author" v-if="book.author">by {{ book.author }}</p>
            <p class="sidebar-edition" v-if="book.year_edition">{{ book.year_edition }}</p>
          </div>

          <!-- Tags -->
          <div class="sidebar-section" v-if="book.tags && book.tags.length > 0">
            <h4 class="sidebar-section-title">Related Tags</h4>
            <div class="tags-list">
              <span
                v-for="tag in book.tags"
                :key="tag.name"
                class="tag-item"
              >
                {{ tag.name }}
              </span>
            </div>
          </div>

          <!-- Book Licensing -->
          <div class="sidebar-section" v-if="book.licensing_type">
            <h4 class="sidebar-section-title">Book Licensing</h4>
            <div class="licensing-list">
              <span class="licensing-item">{{ book.licensing_type }}</span>
            </div>
          </div>

          <!-- Copy Availability -->
          <div class="sidebar-section" v-if="book.copy_types">
            <h4 class="sidebar-section-title">Copy Availability</h4>
            <div class="copy-types-list">
              <span
                v-for="(copyType, key) in book.copy_types"
                :key="key"
                class="copy-type-item"
              >
                {{ key }}
              </span>
            </div>
          </div>

          <!-- Purchase Options -->
          <div class="sidebar-section purchase-section">
            <h4 class="sidebar-section-title">Get your hands on this book</h4>
            <div class="purchase-options">
              <button
                v-for="option in purchaseOptions"
                :key="option.label"
                class="purchase-button"
                :class="option.primary ? 'primary' : ''"
                @click="handlePurchaseClick(option)"
              >
                {{ option.label }}
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
    <div v-else class="book-not-found">
      <p>Book not found</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import ForumCard from '~/components/Forum/ForumCard.vue';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - JSON module typing is handled by the bundler
import rawBooksData from '../../../mock-backend/data/books.json';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - JSON module typing is handled by the bundler
import rawPostsData from '../../../mock-backend/data/posts.json';

interface RawBookTag {
  name: string;
  type?: string;
}

interface RawBookSource {
  name: string;
  url: string;
}

interface RawCopyTypeSource {
  name: string;
  url: string;
  type?: string;
  shipping_available?: boolean;
}

interface RawCopyType {
  description: string;
  sources?: RawCopyTypeSource[];
}

interface RawBook {
  id: number;
  title: string;
  author?: string;
  cover: string;
  rating?: number;
  description?: string;
  year_edition?: string;
  total_bookmarked?: number;
  tags?: RawBookTag[];
  copy_types?: Record<string, RawCopyType>;
  licensing_type?: string;
  sources?: RawBookSource[];
  related_posts?: number[];
}

interface Post {
  id: number;
  author: {
    name: string;
    avatar: string;
    tagline: string;
    badge?: string;
  };
  timeAgo: string;
  title: string;
  content: string;
  tags: Array<{ label: string; type: 'category' | 'topic' }>;
  stars: number;
}

const route = useRoute();
const activeTab = ref<'posts' | 'reviews' | 'sourcing'>('posts');

const tabs = [
  { id: 'posts' as const, label: 'Related Posts' },
  { id: 'reviews' as const, label: 'Reviews' },
  { id: 'sourcing' as const, label: 'Sourcing Options' },
];

const rawBooks = rawBooksData as unknown as RawBook[];
const rawPosts = rawPostsData as unknown as Post[];

const bookId = computed(() => {
  const id = route.params.id;
  return typeof id === 'string' ? parseInt(id, 10) : id;
});

const book = computed(() => {
  return rawBooks.find((b) => b.id === bookId.value);
});

const relatedPosts = computed(() => {
  if (!book.value || !book.value.related_posts) return [];
  return rawPosts.filter((post) => book.value!.related_posts!.includes(post.id));
});


const purchaseOptions = computed(() => {
  const options = [];
  
  // Find Kindle option from copy_types
  if (book.value?.copy_types) {
    for (const [copyType, details] of Object.entries(book.value.copy_types)) {
      if (details.sources) {
        for (const source of details.sources) {
          if (source.name.toLowerCase().includes('kindle')) {
            options.push({
              label: 'Buy at Kindle',
              url: source.url,
              primary: false,
            });
            break;
          }
        }
      }
    }
  }
  
  // Find IEEE option from sources
  if (book.value?.sources) {
    for (const source of book.value.sources) {
      if (source.name.toLowerCase().includes('ieee')) {
        options.push({
          label: 'Read Book on IEEE',
          url: source.url,
          primary: true,
        });
        break;
      }
    }
  }
  
  // Add "Other Options" if we have any sources
  if (book.value?.sources && book.value.sources.length > 0) {
    options.push({
      label: 'Other Options',
      url: null,
      primary: false,
    });
  }
  
  // Default options if none found
  if (options.length === 0) {
    options.push(
      { label: 'Buy at Kindle', url: null, primary: false },
      { label: 'Other Options', url: null, primary: false },
      { label: 'Read Book on IEEE', url: null, primary: true }
    );
  }
  
  return options;
});

const handlePurchaseClick = (option: { label: string; url: string | null; primary: boolean }) => {
  if (option.url) {
    window.open(option.url, '_blank', 'noopener,noreferrer');
  }
};
</script>

<style scoped>
.book-detail-page {
  width: 100%;
  padding: 24px;
  background-color: #f8fafc;
  min-height: 100vh;
}

.book-detail-container {
  display: flex;
  max-width: 1400px;
  margin: 0 auto;
  gap: 32px;
}

.book-main {
  flex: 1;
  min-width: 0;
}

.book-header {
  display: flex;
  gap: 32px;
  margin-bottom: 32px;
  background: white;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.book-cover-section {
  flex-shrink: 0;
}

.book-cover-image {
  width: 200px;
  height: 300px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.book-info-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.book-title-main {
  font-size: 32px;
  font-weight: 700;
  color: var(--color-black);
  margin: 0;
  line-height: 1.2;
}

.book-author-main {
  font-size: 18px;
  color: #64748b;
  margin: 0;
}

.book-rating-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stars-container {
  display: flex;
  gap: 4px;
}

.star-wrapper {
  display: flex;
  align-items: center;
}

.star {
  color: #e2e8f0;
  width: 24px;
  height: 24px;
}

.star.star-filled {
  color: #fbbf24;
}

.book-description {
  font-size: 16px;
  line-height: 1.6;
  color: #334155;
}

.book-description p {
  margin: 0;
}

.tabs-section {
  display: flex;
  gap: 8px;
  border-bottom: 2px solid #e2e8f0;
  margin-bottom: 24px;
}

.tab-button {
  padding: 12px 24px;
  background: none;
  border: none;
  font-size: 16px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  transition: color 0.2s;
}

.tab-button:hover {
  color: var(--color-primary);
}

.tab-button.active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

.tab-content {
  min-height: 400px;
}

.posts-tab {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.no-posts {
  padding: 48px;
  text-align: center;
  color: #64748b;
  background: white;
  border-radius: 16px;
}

.reviews-tab,
.sourcing-tab {
  padding: 32px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.sourcing-content h3 {
  font-size: 20px;
  font-weight: 700;
  color: var(--color-black);
  margin-bottom: 16px;
}

.sources-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.source-link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.2s;
}

.source-link:hover {
  opacity: 0.8;
  text-decoration: underline;
}

.book-sidebar {
  width: 360px;
  flex-shrink: 0;
}

.sidebar-content {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 24px;
}

.sidebar-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-black);
  margin: 0 0 24px 0;
}

.sidebar-section {
  margin-bottom: 24px;
}

.sidebar-section:last-child {
  margin-bottom: 0;
}

.sidebar-book-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-black);
  margin: 0 0 12px 0;
  line-height: 1.3;
}

.bookmark-count {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--color-primary);
  font-weight: 600;
  margin-bottom: 12px;
}

.bookmark-count svg {
  width: 16px;
  height: 16px;
}

.sidebar-author {
  font-size: 14px;
  color: #64748b;
  margin: 0 0 8px 0;
}

.sidebar-edition {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.sidebar-section-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-black);
  margin: 0 0 12px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-item {
  display: inline-block;
  padding: 6px 12px;
  background-color: var(--color-primary);
  color: white;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
}

.licensing-list,
.copy-types-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.licensing-item,
.copy-type-item {
  display: inline-block;
  padding: 6px 12px;
  background-color: #f1f5f9;
  color: var(--color-black);
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  width: fit-content;
}

.purchase-section {
  border-top: 1px solid #e2e8f0;
  padding-top: 24px;
}

.purchase-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.purchase-button {
  padding: 12px 24px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  color: var(--color-black);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.purchase-button:hover {
  border-color: var(--color-primary);
  background: #f8fafc;
}

.purchase-button.primary {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.purchase-button.primary:hover {
  background: #3b5379;
  border-color: #3b5379;
}

.book-not-found {
  padding: 48px;
  text-align: center;
  color: #64748b;
}

@media (max-width: 1024px) {
  .book-detail-container {
    flex-direction: column;
  }

  .book-sidebar {
    width: 100%;
  }

  .sidebar-content {
    position: static;
  }

  .book-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .book-cover-image {
    width: 160px;
    height: 240px;
  }
}
</style>

