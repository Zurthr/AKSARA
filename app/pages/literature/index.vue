<template>
  <div class="literature-page">
      <div class="literature-main">

        <div v-if="!searchQuery && !hasActiveFilters" class="literature-sections">
          <BookSection
            title="Top Books for you"
            :books="topBooks"
            see-more-link="/literature?sort=top"
            section-type="top"
            title-prefix="Top Books"
            title-suffix="for you"
          />
          
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

        <!-- All Books Section - Always visible at the bottom -->
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

// Literature API integration
import { useLiterature } from '~/composables/useLiterature'
import type { Book as BookItem } from '~/composables/useLiterature'
import { useLocalBooks } from '~/composables/useLocalBooks'
import mockBooks from 'mockData/books.json'
import { mergeBookCollections, normalizeBookCollection } from '~/utils/books-normalizer'

type RawBookRecord = Record<string, unknown>

// Use Laravel API
const { getAllBooks, loading, error } = useLiterature()

const originalBooks = ref<BookItem[]>([])
const staticBooks = normalizeBookCollection(mockBooks as RawBookRecord[])
const { localBooks } = useLocalBooks()

const normalizedLocalBooks = computed<BookItem[]>(() => {
  const raw = Array.isArray(localBooks.value) ? localBooks.value : []
  return normalizeBookCollection(raw as RawBookRecord[])
})

const mergedBooksData = computed<BookItem[]>(() => {
  const remote = Array.isArray(originalBooks.value) ? originalBooks.value : []
  const local = Array.isArray(normalizedLocalBooks.value) ? normalizedLocalBooks.value : []
  const static_books = Array.isArray(staticBooks) ? staticBooks : []
  
  // Ensure stable merge order and prevent duplicates
  const merged = mergeBookCollections([static_books, local, remote])
  
  // Always ensure we have books available
  const result = merged.length > 0 ? merged : static_books
  
  // Stable sort to prevent flickering
  return result.sort((a, b) => {
    const idA = typeof a.id === 'string' ? parseInt(a.id) || 0 : (a.id as number)
    const idB = typeof b.id === 'string' ? parseInt(b.id) || 0 : (b.id as number)
    return idA - idB
  })
})

const route = useRoute()

const fetchBooks = async () => {
  try {
    const response = await getAllBooks()
    
    // Handle nested Laravel response structure: response.data.data
    if (response && response.data && response.data.data) {
      const laravelBooksWithUniqueIds = response.data.data.map((book, index) => ({
        ...book,
        id: book.id || `laravel-${index + 1}`,
        source: 'laravel'
      }))
      
      originalBooks.value = laravelBooksWithUniqueIds
    } else {
      originalBooks.value = []
    }
  } catch (apiError) {
    console.warn('Literature API not available, using local data only')
    originalBooks.value = []
  }
}

// Ensure books are fetched when component is mounted and on route change
onMounted(async () => {
  await fetchBooks()
})

// Refetch when route changes
watch(() => route.fullPath, async () => {
  await fetchBooks()
}, { immediate: false })

// Convert normalized books to UI format for compatibility
const allBooks = computed(() => {
  return mergedBooksData.value.map((book): Book => {
    const tags = Array.isArray(book.tags) 
      ? book.tags.map(tag => typeof tag === 'string' ? tag : tag.name)
      : []
    
    const copyType = book.copy_types
      ? Object.keys(book.copy_types).map(key => normalizeKey(key)).filter(Boolean)
      : []
    
    const licensingType = book.licensing_type
      ? [normalizeKey(book.licensing_type)]
      : []
    
    const sources = Array.isArray(book.sources)
      ? book.sources.map(s => typeof s === 'string' ? s : s.name)
      : []
    
    // Handle image URL with fallback and better filtering
    let imageUrl = book.cover || book.image_url
    
    // Only use placeholder for clearly invalid URLs
    if (!imageUrl || imageUrl === 'null' || imageUrl === 'undefined' || imageUrl.trim() === '') {
      imageUrl = '/images/book-cover-placeholder.svg'
    }
    
    // Let the BookCard component handle image loading errors gracefully
    
    return {
      id: typeof book.id === 'string' ? parseInt(book.id) || 0 : (book.id as number),
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
  id: number
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
  width: 100%;
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

