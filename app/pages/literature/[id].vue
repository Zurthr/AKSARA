<template>
  <div class="book-detail-page">
    <!-- Loading state -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading book...</p>
    </div>
    
    <!-- Error state -->
    <div v-else-if="bookError" class="error-state">
      <h3>Failed to load book</h3>
      <p>{{ bookError }}</p>
      <button @click="fetchBook" class="retry-btn">Try Again</button>
    </div>
    
    <!-- Book content -->
    <main v-else-if="book" class="book-main">
        <!-- Book Header Section -->
        <div class="book-header">
          <div class="book-cover-section">
            <img 
              :src="book.cover" 
              :alt="book.title" 
              class="book-cover-image" 
              @error="handleImageError"
            />
          </div>
          <div class="book-info-section">
            <h1 class="book-title-main">{{ book.title }}</h1>
            <p class="book-author-main" v-if="book.author">by {{ book.author }}</p>
            <div class="book-rating-section" v-if="book.rating">
              <span class="rating-number">{{ book.rating.toFixed(1) }}</span>
              <div class="stars-container">
                <div
                  v-for="starIndex in 5"
                  :key="starIndex"
                  class="star-wrapper"
                >
                  <img
                    v-if="starIndex > Math.ceil(book.rating)"
                    src="~/assets/icons/StarDark.svg"
                    alt="star"
                    class="star star-empty"
                  />
                  <template v-else>
                    <img
                      src="~/assets/icons/StarDark.svg"
                      alt="star"
                      class="star star-background"
                    />
                    <img
                      src="~/assets/icons/Star.svg"
                      alt="star"
                      class="star star-filled"
                      :style="{
                        clipPath: starIndex <= Math.floor(book.rating)
                          ? 'inset(0 0% 0 0)'
                          : starIndex - 1 < book.rating
                          ? `inset(0 ${100 - ((book.rating - (starIndex - 1)) * 100)}% 0 0)`
                          : 'inset(0 100% 0 0)'
                      }"
                    />
                  </template>
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
            <WorkInProgress/>
          </div>

          <!-- Sourcing Options Tab -->
          <div v-if="activeTab === 'sourcing'" class="sourcing-tab">
            <SourcingOptions :copy-types="book.copy_types" />
          </div>
        </div>
    </main>

    <RightSideBar v-if="book">
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
              :class="{ 
                'primary': option.primary, 
                'disabled': option.disabled 
              }"
              :disabled="option.disabled"
              @click="handlePurchaseClick(option)"
            >
              {{ option.label }}
            </button>
          </div>
        </div>
      </div>
    </RightSideBar>
    
    <div v-else-if="!loading && !bookError" class="book-not-found">
      <p>Book not found</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import RightSideBar from '~/components/General/RightSideBar.vue';
import ForumCard from '~/components/Forum/ForumCard.vue';
import SourcingOptions from '~/components/Literature/SourcingOptions.vue';

// Literature API integration
import { useLiterature } from '~/composables/useLiterature'
import { LOCAL_BOOKS_STORAGE_KEY } from '~/composables/useLocalBooks'
import mockBooks from '../../../mock-backend/data/books.json'
import { findBookById, mergeBookCollections, normalizeBookCollection, readLocalBooksSnapshot } from '~/utils/books-normalizer'

type RawBookRecord = Record<string, unknown>

const route = useRoute();
const bookId = route.params.id;

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

const activeTab = ref<'posts' | 'reviews' | 'sourcing'>('posts');

const tabs = [
  { id: 'posts' as const, label: 'Related Posts' },
  { id: 'reviews' as const, label: 'Reviews' },
  { id: 'sourcing' as const, label: 'Sourcing Options' },
];

// Fetch book data from Laravel API with fallback
const { getBookById, loading, error, clearError } = useLiterature()
const staticBooks = normalizeBookCollection(mockBooks as RawBookRecord[])

const book = ref<RawBook | null>(null);
const bookError = ref<string | null>(null);

// Fetch related posts
const relatedPosts = ref<Post[]>([]);

const fetchRelatedPosts = async () => {
  if (!book.value?.related_posts?.length) {
    relatedPosts.value = [];
    return;
  }

  try {
    const query = book.value.related_posts.map(id => `id=${id}`).join('&');
    const data = await $fetch<Post[]>(`http://localhost:3002/posts?${query}`);
    relatedPosts.value = data || [];
  } catch (err) {
    console.error('Error fetching related posts:', err);
    relatedPosts.value = [];
  }
};

// Fetch book with fallback mechanism
const fetchBook = async () => {
  bookError.value = null;
  
  try {
    // Check if ID exists in our available data first
    const localSnapshot = readLocalBooksSnapshot(LOCAL_BOOKS_STORAGE_KEY);
    const allAvailableBooks = mergeBookCollections([staticBooks, localSnapshot]);
    const bookExists = allAvailableBooks.find(book => String(book.id) === String(bookId));
    
    // Only try Laravel API if book might exist there or we haven't found it locally
    if (!bookExists || (bookExists && (bookExists as any).source === 'laravel')) {
      clearError();
      const remote = await getBookById(bookId as string);
      if (remote) {
        book.value = remote as RawBook;
        await fetchRelatedPosts();
        return;
      }
    }
    
    // Fallback to static + local storage
    const fallback = findBookById(bookId as string, [staticBooks, localSnapshot]);
    if (fallback) {
      book.value = fallback as RawBook;
      clearError();
      await fetchRelatedPosts();
      return;
    }
    
    // If no fallback found
    book.value = null;
    bookError.value = 'Book not found';
  } catch (err) {
    bookError.value = err instanceof Error ? err.message : 'Failed to load book';
    console.error('Error fetching book:', err);
  }
};

// Fetch on mount and route change
onMounted(() => {
  fetchBook();
});

watch(() => route.params.id, () => {
  fetchBook();
});


const purchaseOptions = computed(() => {
  const options = [];
  
  if (!book?.value?.copy_types) {
    // If no copy_types, return default options
    options.push(
      { label: 'No Preview Available', url: null, primary: false, disabled: true },
      { label: 'Buy on Amazon', url: null, primary: false, disabled: false },
      { label: 'Other Options', url: null, primary: false, disabled: false }
    );
    return options;
  }
  
  // 1. Find Preview option (highlighted/primary)
  // Check for preview, free, or free_download types
  let previewSource = null;
  const digitalCopy = book.value.copy_types.Digital;
  if (digitalCopy?.sources) {
    previewSource = digitalCopy.sources.find(source => 
      source.type === 'preview' || 
      source.type === 'free' || 
      source.type === 'free_download'
    );
  }
  
  if (previewSource) {
    options.push({
      label: `Read Book on ${previewSource.name}`,
      url: previewSource.url,
      primary: true,
      disabled: false,
    });
  } else {
    options.push({
      label: 'No Preview Available',
      url: null,
      primary: false,
      disabled: true,
    });
  }
  
  // 2. Find Purchase option
  // First, check for Digital copy with type "purchase"
  let purchaseSource = null;
  if (digitalCopy?.sources) {
    purchaseSource = digitalCopy.sources.find(source => source.type === 'purchase');
  }
  
  // If no Digital purchase, check Physical copy with type "online_retailer"
  if (!purchaseSource) {
    const physicalCopy = book.value.copy_types.Physical;
    if (physicalCopy?.sources) {
      purchaseSource = physicalCopy.sources.find(source => source.type === 'online_retailer');
    }
  }
  
  if (purchaseSource) {
    options.push({
      label: `Buy on ${purchaseSource.name}`,
      url: purchaseSource.url,
      primary: false,
      disabled: false,
    });
  } else {
    options.push({
      label: 'Buy on Amazon',
      url: null,
      primary: false,
      disabled: false,
    });
  }
  
  // 3. Add "Other Options"
  options.push({
    label: 'Other Options',
    url: null,
    primary: false,
    disabled: false,
  });
  
  return options;
});

const handlePurchaseClick = (option: { label: string; url: string | null; primary: boolean; disabled: boolean }) => {
  if (option.url && !option.disabled) {
    window.open(option.url, '_blank', 'noopener,noreferrer');
  }
};

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.src = '/images/book-cover-placeholder.svg';
};
</script>

<style scoped>
.book-detail-page {
  width: 100%;
  padding: 24px;
  background-color: #f8fafc;
  min-height: 100%;
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  gap: 24px;
}

.book-main {
  flex: 1;
  min-width: 0;
}

.book-header {
  display: flex;
  gap: 32px;
  margin-bottom: 32px;
  margin-top:20px;
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
  width: fit-content;
  gap: 8px;
  align-items: center;
}

.rating-number {
  margin-top: 2px;
  font-size: 18px;
  font-weight: 600;
  color: var(--color-black);
  line-height: 1;
}

.stars-container {
  display: flex;
  gap: 4px;
  align-items: center;
}

.star-wrapper {
  position: relative;
  display: inline-block;
  width: 24px;
  height: 24px;
}

.star {
  width: 24px;
  height: 24px;
  display: block;
  object-fit: contain;
}

.star-empty {
  opacity: 0.6;
}

.star-background {
  opacity: 0.6;
}

.star-filled {
  position: absolute;
  top: 0;
  left: 0;
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
  border-radius: 16px;}

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

.sidebar-content {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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
  flex-direction: row;
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

.purchase-button.disabled {
  background: #f1f5f9;
  color: #94a3b8;
  border-color: #e2e8f0;
  cursor: not-allowed;
  opacity: 0.6;
}

.purchase-button.disabled:hover {
  background: #f1f5f9;
  border-color: #e2e8f0;
}

.book-not-found {
  padding: 48px;
  text-align: center;
  color: #64748b;
  width: 100%;
}

.loading-state,
.error-state {
  width: 100%;
  padding: 48px;
  text-align: center;
}

@media (max-width: 1080px) {
  .book-detail-page {
    flex-direction: column;
    padding: 16px;
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

