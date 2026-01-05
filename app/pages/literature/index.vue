<template>
  <div class="literature-page">
      <div class="literature-main">

        <div v-if="!searchQuery && !hasActiveFilters" class="literature-sections">
          <BookSection
            title="Top Books for you"
            :books="topBooksForYou"
            see-more-link="/literature?sort=top"
            section-type="top"
            title-prefix="Top Books"
            title-suffix="for you"
          />
          <div v-if="recommendationsLoaded && !recommendedBooks.length" class="recommendations-empty">
            <span class="empty-pill">Recommendations</span>
            <h3>Still learning your taste</h3>
            <p>Browse a few books and we will personalize this section for you.</p>
          </div>
          
          <BookSection
            v-if="suggestedTag"
            :title="`Looking for ${suggestedTag}?`"
            :books="suggestedBooks"
            :see-more-link="`/literature?tag=${suggestedTag}`"
            section-type="recommendation"
            :highlighted-tag="suggestedTag"
          />
        </div>

        <div v-else-if="searchQuery || hasActiveFilters" class="search-results">
          <BookGrid
            v-if="searchQuery"
            :title="`Our results for '${searchQuery}'`"
            :books="filteredBooks"
            see-more-link="/literature"
            section-type="search"
            title-prefix="results"
            :highlighted-query="searchQuery"
            title-suffix="'"
          />
          <BookGrid
            v-else
            title="Filtered Results"
            :books="filteredBooks"
            see-more-link="/literature"
          />
          <p v-if="filteredBooks.length === 0" class="no-results-text">No results found. Try adjusting your filters or search query.</p>
        </div>

        <!-- All Books Section - Always visible at the bottom showing merged catalogue -->
        <div class="all-books-section">
          <BookGrid
            title="Our Library, just for you."
            :books="allBooks"
            see-more-link="/literature"
            section-type="top"
            title-prefix="Library"
            title-suffix="just for you."
          />
        </div>
      </div>

      <RightSideBar>
        <LiteratureFilterSidebar />
        <TrendingSidebar />
      </RightSideBar>
  </div>
</template>

<script setup lang="ts">
import RightSideBar from '~/components/General/RightSideBar.vue';
import BookSection from '~/components/Literature/BookSection.vue';
import BookGrid from '~/components/Literature/BookGrid.vue';
import LiteratureFilterSidebar from '~/components/Literature/LiteratureFilterSidebar.vue';
import TrendingSidebar from '~/components/TrendingSidebar.vue';
import { mapToNormalizedBook } from '~/composables/useLiterature'
import { useRecommendations } from '~/composables/useRecommendations'

// Literature API integration
import { useLiterature } from '~/composables/useLiterature'
import type { LiteratureBook } from '~/composables/useLiterature'
import { useLocalBooks } from '~/composables/useLocalBooks'
import mockBooks from '../../../mock-backend/data/books.json'
import { mergeBookCollections, normalizeBookCollection } from '~/utils/books-normalizer'

type RawBookRecord = Record<string, unknown>

// Use Laravel API
const { getAllBooks } = useLiterature()

// Use lazy loading for infinite scroll
const { 
  books: lazyBooks, 
  isLoading: isLoadingBooks, 
  hasMore: hasMoreBooks, 
  loadMore: loadMoreBooks 
} = useLazyBooks()

const originalBooks = ref<LiteratureBook[]>([])
const mockApiBooks = ref<LiteratureBook[]>([])
const staticBooks = normalizeBookCollection(mockBooks as RawBookRecord[]).map((book, index) => {
  const candidateId = book.id
  const resolvedId = candidateId && String(candidateId).trim() !== '' ? candidateId : `static-${index + 1}`
  return {
    ...book,
    id: resolvedId,
    source: 'json'
  }
})
const { localBooks } = useLocalBooks()

const normalizedLocalBooks = computed<LiteratureBook[]>(() => {
  const raw = Array.isArray(localBooks.value) ? localBooks.value : []
  return normalizeBookCollection(raw as RawBookRecord[]).map((book, index) => {
    const candidateId = book.id
    const resolvedId = candidateId && String(candidateId).trim() !== '' ? candidateId : `local-${index + 1}`
    return {
      ...book,
      id: resolvedId,
      source: 'localStorage'
    }
  })
})

const mergedBooksData = computed<LiteratureBook[]>(() => {
  const remote = Array.isArray(originalBooks.value) ? originalBooks.value : []
  const mockApi = Array.isArray(mockApiBooks.value) ? mockApiBooks.value : []
  const local = Array.isArray(normalizedLocalBooks.value) ? normalizedLocalBooks.value : []
  const static_books = Array.isArray(staticBooks) ? staticBooks : []
  
  // Ensure stable merge order and prevent duplicates
  const merged = mergeBookCollections([static_books, mockApi, local, remote])
  
  // Always ensure we have books available
  const result = merged.length > 0 ? merged : static_books
  
  // Stable sort to prevent flickering
  return result.sort((a, b) => {
    const idA = typeof a.id === 'string' ? parseInt(a.id) || 0 : (a.id as number)
    const idB = typeof b.id === 'string' ? parseInt(b.id) || 0 : (b.id as number)
    return idA - idB
  })
})

const { fetchRecommendations } = useRecommendations()
const recommendedBooks = ref<ReturnType<typeof mapToNormalizedBook>[]>([])
const recommendationsLoaded = ref(false)

const topBooksForYou = computed(() => {
  if (recommendationsLoaded.value && recommendedBooks.value.length) {
    return recommendedBooks.value.slice(0, 8)
  }
  return topBooks.value
})

type ResourceResponse = {
  success: boolean;
  data: LiteratureBook;
};

const fetchRecommendedBooks = async () => {
  recommendationsLoaded.value = false
  const baseUrl = useRuntimeConfig().public.apiBaseUrl

  try {
    const items = await fetchRecommendations('book', 6)
    if (!items.length) {
      recommendedBooks.value = []
      return
    }

    const details = await Promise.all(
      items.map(item => $fetch<ResourceResponse>(`${baseUrl}/resources/${item.id}`))
    )

    recommendedBooks.value = details
      .filter(detail => detail?.success && detail.data)
      .map(detail => mapToNormalizedBook(detail.data))
  } catch (err) {
    console.error('Failed to load recommended books:', err)
    recommendedBooks.value = []
  } finally {
    recommendationsLoaded.value = true
  }
}

const route = useRoute()
const contentApiBase = useContentApiBase()

const fetchLaravelBooks = async (): Promise<LiteratureBook[]> => {
  try {
    const response = await getAllBooks()

    if (response && Array.isArray(response.data)) {
      return response.data.map((book, index) => ({
        ...book,
        id: book.id || `laravel-${index + 1}`,
        source: 'laravel'
      }))
    }
  } catch (apiError) {
    console.warn('Literature API not available, skipping Laravel merge.', apiError)
  }

  return []
}

const fetchMockBooks = async (): Promise<LiteratureBook[]> => {
  try {
    const response = await $fetch<RawBookRecord[]>(`${contentApiBase}/resources`)
    const normalized = normalizeBookCollection(response)

    return normalized.map((book, index) => ({
      ...book,
      id: book.id || `mock-api-${index + 1}`,
      source: 'mockApi'
    }))
  } catch (apiError) {
    console.warn('Mock API books not available, skipping mock merge.', apiError)
    return []
  }
}

const fetchBooks = async () => {
  const [laravelBooks, mockBooksData] = await Promise.all([fetchLaravelBooks(), fetchMockBooks()])

  mockApiBooks.value = mockBooksData
  originalBooks.value = laravelBooks.length ? laravelBooks : []

  if (!originalBooks.value.length) {
    originalBooks.value = Array.isArray(staticBooks) ? staticBooks : []
  }
}

// Ensure books are fetched when component is mounted and on route change
onMounted(async () => {
  await fetchBooks()
  await fetchRecommendedBooks()
})

// Refetch when route changes
watch(() => route.fullPath, async () => {
  await fetchBooks()
}, { immediate: false })

// Convert normalized books to UI format for compatibility
const allBooks = computed(() => {
  const seenContentKeys = new Set<string>()
  const usedDisplayIds = new Map<string, number>()

  const deduplicated = mergedBooksData.value.filter((book) => {
    const titleKey = (book.title || '').trim().toLowerCase()
    const authorKey = (book.author || '').trim().toLowerCase()
    const yearKey = book.year_edition ? String(book.year_edition).trim().toLowerCase() : ''
    const hasIdentity = titleKey !== '' || authorKey !== ''
    const dedupeKey = hasIdentity
      ? `content:${titleKey}|${authorKey}|${yearKey}`
      : `id:${String(book.id ?? '').trim()}`

    if (!dedupeKey) {
      return true
    }

    if (seenContentKeys.has(dedupeKey)) {
      return false
    }

    seenContentKeys.add(dedupeKey)
    return true
  })

  return deduplicated.map((book, index): Book => {
    const tags = Array.isArray(book.tags)
      ? book.tags.map((tag) => (typeof tag === 'string' ? tag : tag.name))
      : []

    const copyType = book.copy_types
      ? Object.keys(book.copy_types).map((key) => normalizeKey(key)).filter(Boolean)
      : []

    const licensingType = book.licensing_type
      ? [normalizeKey(book.licensing_type)]
      : []

    const sources = Array.isArray(book.sources)
      ? book.sources.map((s) => (typeof s === 'string' ? s : s.name))
      : []

    let imageUrl = book.cover || book.image_url
    if (!imageUrl || imageUrl === 'null' || imageUrl === 'undefined' || imageUrl.trim() === '') {
      imageUrl = '/images/book-cover-placeholder.svg'
    }

    const baseId = String(book.id ?? '').trim()
    const fallbackId = `book-${index + 1}`
    const rawDisplayId = baseId || fallbackId
    const occurrence = usedDisplayIds.get(rawDisplayId)
    const displayId = occurrence === undefined ? rawDisplayId : `${rawDisplayId}-${occurrence + 1}`
    usedDisplayIds.set(rawDisplayId, (occurrence ?? 0) + 1)

    return {
      id: displayId,
      title: book.title,
      author: book.author,
      image: imageUrl,
      tags,
      rating: book.rating,
      bookmarks: book.total_bookmarked,
      copyType,
      licensingType,
      sources
    }
  })
})

interface Book {
  id: string
  title: string
  author?: string
  image: string
  tags: string[]
  rating?: number
  bookmarks?: number
  copyType?: string[]
  licensingType?: string[]
  sources?: string[]
}

const normalizeKey = (value: string | undefined | null) => {
  return (value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
}

const filters = computed(() => ({
  copyType: Array.isArray(route.query.copyType) 
    ? route.query.copyType as string[]
    : route.query.copyType 
      ? [route.query.copyType as string]
      : [],
  licensingType: Array.isArray(route.query.licensingType) 
    ? route.query.licensingType as string[]
    : route.query.licensingType 
      ? [route.query.licensingType as string]
      : [],
  sources: route.query.sources as string || '',
  tags: Array.isArray(route.query.tags) 
    ? route.query.tags as string[]
    : route.query.tags 
      ? [route.query.tags as string]
      : []
}));

const searchQuery = computed(() => route.query.q as string || route.query.search as string || '');

const hasActiveFilters = computed(() => {
  return filters.value.copyType.length > 0 || 
         filters.value.licensingType.length > 0 || 
         filters.value.sources || 
         filters.value.tags.length > 0;
});

// Filter books based on search query and filters
const filteredBooks = computed(() => {
  let books = [...allBooks.value];

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    books = books.filter(book => 
      book.title.toLowerCase().includes(query) ||
      book.author?.toLowerCase().includes(query) ||
      book.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }

  // Filter by copy type - check if any of the book's copy types match any filter
  if (filters.value.copyType.length > 0) {
    books = books.filter(book => 
      book.copyType && 
      book.copyType.some(bookCopyType => filters.value.copyType.includes(bookCopyType))
    );
  }

  // Filter by licensing type - check if any of the book's licensing types match any filter
  if (filters.value.licensingType.length > 0) {
    books = books.filter(book => 
      book.licensingType && 
      book.licensingType.some(bookLicensingType => filters.value.licensingType.includes(bookLicensingType))
    );
  }

  // Filter by sources - check if any of the book's sources match the filter
  if (filters.value.sources) {
    books = books.filter(book => 
      book.sources && 
      book.sources.includes(filters.value.sources)
    );
  }

  // Filter by tags - books must have at least one matching tag
  if (filters.value.tags.length > 0) {
    const filterTagsLower = filters.value.tags.map(t => t.toLowerCase());
    
    books = books.filter(book => 
      filterTagsLower.some(filterTag => 
        book.tags.some(bookTag => 
          bookTag.toLowerCase().includes(filterTag) || filterTag.includes(bookTag.toLowerCase())
        )
      )
    );
    
    // Sort by relevance - books with more matching tags appear higher
    books = books.sort((a, b) => {
      const aMatches = filterTagsLower.filter(filterTag => 
        a.tags.some(bookTag => 
          bookTag.toLowerCase().includes(filterTag) || filterTag.includes(bookTag.toLowerCase())
        )
      ).length;
      
      const bMatches = filterTagsLower.filter(filterTag => 
        b.tags.some(bookTag => 
          bookTag.toLowerCase().includes(filterTag) || filterTag.includes(bookTag.toLowerCase())
        )
      ).length;
      
      return bMatches - aMatches; // Higher matches first
    });
  }

  return books;
});

// Top books for user (sorted by rating)
const topBooks = computed(() => {
  return allBooks.value
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 8);
});

// Tags to cycle through for suggested books
const suggestedTagsCycle = ['PHP', 'Web Development', 'Programming', 'Fantasy', 'Non-Fiction', 'Dystopia'];

// Current tag index - cycles on every page refresh
const currentTagIndex = ref(0);

// Initialize tag index on mount - cycles through tags on each refresh
onMounted(() => {
  if (process.client) {
    // Use sessionStorage to track and cycle through tags on each refresh
    const storedIndex = sessionStorage.getItem('suggestedTagIndex');
    let index = storedIndex ? parseInt(storedIndex, 10) : 0;
    
    // Increment index and cycle back to 0 when reaching the end
    index = (index + 1) % suggestedTagsCycle.length;
    
    // Store the new index for next refresh
    sessionStorage.setItem('suggestedTagIndex', index.toString());
    
    currentTagIndex.value = index;
  }
});

// Suggested tag - cycles through predefined tags on each refresh
const suggestedTag = computed(() => {
  if (filters.value.tags.length > 0) {
    return filters.value.tags[0];
  }
  if (searchQuery.value) {
    return searchQuery.value;
  }
  // Cycle through the predefined tags on each page refresh
  return suggestedTagsCycle[currentTagIndex.value];
});

// Suggested books based on tag
const suggestedBooks = computed(() => {
  const tag = suggestedTag.value;
  if (!tag) return [];
  return allBooks.value
    .filter(book => book.tags.some(bookTag => 
      bookTag.toLowerCase().includes(tag.toLowerCase())
    ))
    .slice(0, 8);
});
</script>

<style scoped>
.literature-page {
  display: flex;
  flex-direction: row;
  gap: 8px;
  max-width: 100%;
  flex:1;
}

.literature-content {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.literature-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 920px;
}

.literature-header {
  margin-bottom: 8px;
}

.literature-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: var(--color-black);
  margin-bottom: 8px;
}

.literature-header p {
  color: #64748b;
  font-size: 16px;
  line-height: 1.6;
}

.literature-sections {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.recommendations-empty {
  margin-left: 16px;
  background: linear-gradient(135deg, #fff7d6, #eef2ff);
  border-radius: 16px;
  padding: 20px 24px;
  border: 1px solid #e2e8f0;
  color: #0f172a;
}

.recommendations-empty h3 {
  font-size: 16px;
  font-weight: 700;
  margin: 12px 0 6px;
}

.recommendations-empty p {
  font-size: 13px;
  color: #475569;
  margin: 0;
}

.empty-pill {
  display: inline-flex;
  padding: 4px 12px;
  border-radius: 999px;
  background: #fff1a8;
  color: #92400e;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}


.search-results {
  display: flex;
  width:920px;
  flex-direction: column;
  gap: 20px;
}

.no-results-text {
  color: #64748b;
  font-size: 16px;
  line-height: 1.6;
  text-align: center;
  margin: 32px 0;
  padding: 24px;
  background: #f8fafc;
  border-radius: 8px;
}

@media (max-width: 768px) {
  .literature-content {
   flex-direction: column;
    padding: 16px;
  }
  
  .literature-main {
    max-width: 100%;
  }
}
</style>
