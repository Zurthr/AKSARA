<template>
  <div class="literature-page">
      <div class="literature-main">

        <div v-if="!searchQuery && !hasActiveFilters" class="literature-sections">
          <BookSection
            title="Top Books For you"
            :books="topBooks"
            see-more-link="/literature?sort=top"
          />
          
          <BookSection
            v-if="suggestedTag"
            :title="`Looking for ${suggestedTag}?`"
            :books="suggestedBooks"
            :see-more-link="`/literature?tag=${suggestedTag}`"
          />
        </div>

        <div v-else-if="searchQuery || hasActiveFilters" class="search-results">
          <BookGrid
            :title="searchQuery ? `Results for '${searchQuery}'` : 'Filtered Results'"
            :books="filteredBooks"
            see-more-link="/literature"
          />
          <p v-if="filteredBooks.length === 0" style="color: #64748b; font-size: 16px; line-height: 1.6; align-self: center; justify-self: center; margin-bottom:32px;">No results found. Try adjusting your filters or search query.</p>
        </div>

        <div v-else class="literature-sections">
          <BookSection
            title="Top Books For you"
            :books="topBooks"
            see-more-link="/literature?sort=top"
          />
          
          <BookSection
            v-if="suggestedTag"
            :title="`Looking for ${suggestedTag}?`"
            :books="suggestedBooks"
            :see-more-link="`/literature?tag=${suggestedTag}`"
          />
        </div>

        <!-- All Books Section - Always visible at the bottom -->
        <div class="all-books-section">
          <BookGrid
            title="A Library of Books to See"
            :books="allBooks"
            see-more-link="/literature"
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

// Use the real books data from the mock backend JSON
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - JSON module typing is handled by the bundler
import rawBooksData from '../../../mock-backend/data/books.json';

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
}

interface Book {
  id: number;
  title: string;
  author?: string;
  image: string;
  tags: string[];
  rating?: number;
  bookmarks?: number;
  copyType?: string[];
  licensingType?: string[];
  sources?: string[];
}

const route = useRoute();

const normalizeKey = (value: string | undefined | null) => {
  return (value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-');
};

const rawBooks = rawBooksData as unknown as RawBook[];

// Map backend books.json structure into the simpler Book shape used by the UI
const allBooks: Book[] = (rawBooks || []).map((book) => {
  const tags = (book.tags || []).map((tag) => tag.name);

  const copyType = book.copy_types
    ? Object.keys(book.copy_types).map((key) => normalizeKey(key)).filter(Boolean)
    : [];

  const licensingType = book.licensing_type
    ? [normalizeKey(book.licensing_type)]
    : [];

  const sourceNames: string[] = [];

  if (book.sources) {
    sourceNames.push(...book.sources.map((source) => source.name));
  }

  if (book.copy_types) {
    Object.values(book.copy_types).forEach((copyTypeEntry) => {
      if (copyTypeEntry.sources) {
        sourceNames.push(...copyTypeEntry.sources.map((source) => source.name));
      }
    });
  }

  return {
    id: book.id,
    title: book.title,
    author: book.author,
    image: book.cover,
    tags,
    rating: book.rating,
    bookmarks: book.total_bookmarked,
    copyType,
    licensingType,
    sources: Array.from(new Set(sourceNames))
  };
});

const searchQuery = computed(() => route.query.q as string || route.query.search as string || '');

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

const hasActiveFilters = computed(() => {
  return filters.value.copyType.length > 0 || 
         filters.value.licensingType.length > 0 || 
         filters.value.sources || 
         filters.value.tags.length > 0;
});

// Filter books based on search query and filters
const filteredBooks = computed(() => {
  let books = [...allBooks];

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
  return allBooks
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 8);
});

// Get user's most searched tag from search history
// In production, this would come from user's search history/analytics
const getUserSearchHistory = (): string[] => {
  // Simulated search history - in production, fetch from localStorage/API
  // This would track user's frequent searches
  const searchHistory = ['PHP', 'Vue', 'JavaScript', 'Python', 'React'];
  return searchHistory;
};

// Suggested tag based on user's search history
const suggestedTag = computed(() => {
  if (filters.value.tags.length > 0) {
    return filters.value.tags[0];
  }
  if (searchQuery.value) {
    return searchQuery.value;
  }
  // Get most frequent tag from user's search history
  const searchHistory = getUserSearchHistory();
  return searchHistory[0] || 'PHP'; // Default to first item in history or fallback
});

// Suggested books based on tag
const suggestedBooks = computed(() => {
  const tag = suggestedTag.value;
  if (!tag) return [];
  return allBooks
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
  flex-direction: column;
  gap: 20px;
}

@media (max-width: 1024px) {
  .literature-content {
    flex-direction: column;
  }
  
  .literature-main {
    max-width: 100%;
  }
}
</style>

