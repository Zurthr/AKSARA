<template>
  <div class="book-detail-page">
    <div v-if="isLoading" class="book-loading">
      <div class="loading-spinner"></div>
      <p>Loading book details...</p>
    </div>
    <div v-else-if="book" class="book-detail-container">
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
      <RightSideBar>
        <div class="sidebar-stack">
          <section class="sidebar-card">
            <h2 class="sidebar-title">Book Details</h2>
            <h3 class="sidebar-book-title">{{ book.title }}</h3>
            <div class="bookmark-count">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
              </svg>
              <span>{{ book.total_bookmarked || 0 }}</span>
            </div>
            <p class="sidebar-author" v-if="book.author">by {{ book.author }}</p>
            <p class="sidebar-edition" v-if="book.year_edition">{{ book.year_edition }}</p>
          </section>

          <section class="sidebar-card" v-if="book.tags && book.tags.length > 0">
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
          </section>

          <section class="sidebar-card" v-if="licensingLabel">
            <h4 class="sidebar-section-title">Book Licensing</h4>
            <div class="licensing-list">
              <span class="licensing-item">{{ licensingLabel }}</span>
            </div>
          </section>

          <section class="sidebar-card" v-if="copyTypeLabels.length > 0">
            <h4 class="sidebar-section-title">Copy Availability</h4>
            <div class="copy-types-list">
              <span
                v-for="typeLabel in copyTypeLabels"
                :key="typeLabel"
                class="copy-type-item"
              >
                {{ typeLabel }}
              </span>
            </div>
          </section>

          <section class="sidebar-card">
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
          </section>
        </div>
      </RightSideBar>
    </div>
    <div v-else class="book-not-found">
      <p>{{ loadError || 'Book not found' }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import RightSideBar from '~/components/General/RightSideBar.vue';
import ForumCard from '~/components/Forum/ForumCard.vue';
import { useBooks, type Book as ApiBook, type CopyType } from '~/composables/useBooks';

const route = useRoute();
const parsedId = Number(route.params.id);
const bookId = Number.isNaN(parsedId) ? null : parsedId;

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

interface PurchaseOption {
  label: string;
  url: string | null;
  primary: boolean;
  disabled: boolean;
}

type ApiBookWithRelations = ApiBook & { related_posts?: number[] | null };

const { getBookById } = useBooks();

const book = ref<ApiBookWithRelations | null>(null);
const relatedPosts = ref<Post[]>([]);
const isLoading = ref(true);
const loadError = ref<string | null>(null);

const runtimeConfig = useRuntimeConfig();
const mockApiBaseUrl = runtimeConfig.public.mockApiBaseUrl ?? 'http://localhost:3002';

const activeTab = ref<'posts' | 'reviews' | 'sourcing'>('posts');

const tabs = [
  { id: 'posts' as const, label: 'Related Posts' },
  { id: 'reviews' as const, label: 'Reviews' },
  { id: 'sourcing' as const, label: 'Sourcing Options' },
];

const fetchBookDetail = async () => {
  if (bookId === null) {
    loadError.value = 'Invalid book identifier.';
    isLoading.value = false;
    return;
  }

  isLoading.value = true;
  loadError.value = null;

  try {
    const response = await getBookById(bookId);

    if (!response) {
      loadError.value = 'Book not found.';
      book.value = null;
      return;
    }

    book.value = response as ApiBookWithRelations;
  } catch (err) {
    loadError.value = err instanceof Error ? err.message : 'Failed to load book detail.';
    book.value = null;
  } finally {
    isLoading.value = false;
  }
};

const fetchRelatedPosts = async () => {
  if (!book.value?.related_posts || book.value.related_posts.length === 0) {
    relatedPosts.value = [];
    return;
  }

  const query = book.value.related_posts.map((id) => `id=${id}`).join('&');

  try {
    const posts = await $fetch<Post[]>(`${mockApiBaseUrl}/posts?${query}`);
    relatedPosts.value = posts ?? [];
  } catch (err) {
    console.error('Error fetching related posts:', err);
    relatedPosts.value = [];
  }
};

const normalizeCopyTypes = (copyTypes?: Record<string, CopyType>) => {
  if (!copyTypes) {
    return undefined;
  }

  return Object.fromEntries(
    Object.entries(copyTypes).map(([key, value]) => [key.trim(), value])
  );
};

const findCopyType = (copyTypes: Record<string, CopyType>, typeName: string) => {
  const entry = Object.entries(copyTypes).find(([key]) => key.toLowerCase() === typeName.toLowerCase());
  return entry ? entry[1] : undefined;
};

const formatLabel = (value: string | undefined | null) => {
  if (!value) {
    return '';
  }

  return value
    .toString()
    .replace(/[_-]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
};

const licensingLabel = computed(() => formatLabel(book.value?.licensing_type));

const copyTypeLabels = computed(() => {
  const copyTypes = normalizeCopyTypes(book.value?.copy_types);
  if (!copyTypes) {
    return [] as string[];
  }

  return Object.keys(copyTypes).map((key) => formatLabel(key));
});

const purchaseOptions = computed<PurchaseOption[]>(() => {
  const currentBook = book.value;
  const options: PurchaseOption[] = [];

  if (!currentBook) {
    return options;
  }

  const copyTypes = normalizeCopyTypes(currentBook.copy_types);

  if (!copyTypes) {
    options.push(
      { label: 'No Preview Available', url: null, primary: false, disabled: true },
      { label: 'Buy on Amazon', url: null, primary: false, disabled: false },
      { label: 'Other Options', url: null, primary: false, disabled: false }
    );
    return options;
  }

  const digitalCopy = findCopyType(copyTypes, 'Digital');

  const previewSource = digitalCopy?.sources?.find((source) => source.type === 'preview' && source.url);

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

  let purchaseSource = digitalCopy?.sources?.find((source) => source.type === 'purchase' && source.url);

  if (!purchaseSource) {
    const physicalCopy = findCopyType(copyTypes, 'Physical');
    purchaseSource = physicalCopy?.sources?.find((source) => source.type === 'online_retailer' && source.url);
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

  options.push({
    label: 'Other Options',
    url: null,
    primary: false,
    disabled: false,
  });

  return options;
});

const handlePurchaseClick = (option: PurchaseOption) => {
  if (option.url && !option.disabled) {
    window.open(option.url, '_blank', 'noopener,noreferrer');
  }
};

onMounted(async () => {
  await fetchBookDetail();
  await fetchRelatedPosts();
});

watch(() => book.value?.related_posts, async (newPosts, oldPosts) => {
  if (newPosts !== oldPosts) {
    await fetchRelatedPosts();
  }
});
</script>

<style scoped>
.book-detail-page {
  width: 100%;
  margin: 8px 0 0 32px;
  background-color: #f8fafc;
  min-height: 100vh;
}

.book-detail-container {
  display: flex;
  width:100%;
  margin: 0 auto;
  gap: 8px;
}

.book-main {
  flex: 1;
  margin-top: 20px;
  min-width: 640px;
  max-width: 920px;
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

.sidebar-stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.sidebar-card {
  background: #ffffff;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.12);
  margin-right: 40px  ;
}

.sidebar-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-secondary);
  margin: 0 0 12px 0;
  text-transform: uppercase;
  letter-spacing: 0.12em;
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
}

.book-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 320px;
  gap: 16px;
  color: #64748b;
}

.book-loading .loading-spinner {
  width: 36px;
  height: 36px;
  border-radius: 9999px;
  border: 4px solid #e2e8f0;
  border-top-color: var(--color-primary);
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 1040px) {
  .book-detail-container {
    flex-direction: column;
  }

  .sidebar-stack {
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

