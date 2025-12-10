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
          <p v-if="filteredBooks.length === 0" style="color: #64748b; font-size: 16px; line-height: 1.6; align-self: center; justify-self: center; margin-bottom:32px;">No results found. Try adjusting your filters or search query.</p>
        </div>

        <div v-else class="literature-sections">
          <BookSection
            title="Top Books For you"
            :books="topBooks"
            see-more-link="/literature?sort=top"
            section-type="top"
            title-prefix="Top Books"
            title-suffix="For you"
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
import { ref, computed, onMounted, watch } from 'vue';
import RightSideBar from '~/components/General/RightSideBar.vue';
import BookSection from '~/components/Literature/BookSection.vue';
import BookGrid from '~/components/Literature/BookGrid.vue';
import LiteratureFilterSidebar from '~/components/Literature/LiteratureFilterSidebar.vue';
import TrendingSidebar from '~/components/TrendingSidebar.vue';
import { useBooks, type Book as ApiBook, type CopyType } from '~/composables/useBooks';

// UI Interface for books (maintaining existing structure)
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
const { getAllBooks, error: booksError } = useBooks();

// Reactive data
const allBooks = ref<Book[]>([]);

const normalizeKey = (value: string | undefined | null) => {
  return (value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-');
};

// Transform API book data to UI format
const transformApiBookToUIBook = (apiBook: ApiBook): Book => {
  const tags = (apiBook.tags || []).map((tag) => tag.name);

  const copyType = apiBook.copy_types
    ? Object.keys(apiBook.copy_types).map((key) => normalizeKey(key)).filter(Boolean)
    : [];

  const licensingType = apiBook.licensing_type
    ? [normalizeKey(apiBook.licensing_type)]
    : [];

  const sourceNames: string[] = [];

  if (apiBook.sources) {
    sourceNames.push(...apiBook.sources.map((source) => source.name));
  }

  const copyTypes = apiBook.copy_types as Record<string, CopyType> | undefined;
  if (copyTypes) {
    Object.values(copyTypes).forEach((copyTypeEntry) => {
      const sources = copyTypeEntry.sources || [];
      sources.forEach((source) => {
        sourceNames.push(source.name);
      });
    });
  }

  return {
    id: apiBook.id,
    title: apiBook.title,
    author: apiBook.author,
    image: apiBook.cover,
    tags,
    rating: apiBook.rating,
    bookmarks: apiBook.total_bookmarked,
    copyType,
    licensingType,
    sources: Array.from(new Set(sourceNames))
  };
};

const extractBooksFromResponse = (response: unknown): ApiBook[] => {
  if (!response) {
    return [];
  }

  if (Array.isArray(response)) {
    return response as ApiBook[];
  }

  if (typeof response === 'object') {
    const payload = response as Record<string, unknown>;

    if (Array.isArray(payload.data)) {
      return payload.data as ApiBook[];
    }

    const nestedData = payload.data as Record<string, unknown> | undefined;
    if (nestedData && Array.isArray(nestedData.data)) {
      return nestedData.data as ApiBook[];
    }

    if (Array.isArray(payload.books)) {
      return payload.books as ApiBook[];
    }
  }

  return [];
};

const loadBooksFromApi = async () => {
  const response = await getAllBooks(1, 100);
  const apiBooks = extractBooksFromResponse(response);

  if (apiBooks.length === 0) {
    console.warn('[Literature] Books API returned no data. Raw response:', response);
    allBooks.value = [];
    return;
  }

  allBooks.value = apiBooks.map(transformApiBookToUIBook);
};

watch(booksError, (message) => {
  if (message) {
    console.error('[Literature] Failed to load books:', message);
  }
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
  let books = [...allBooks.value];

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    books = books.filter((book) =>
      book.title.toLowerCase().includes(query) ||
      book.author?.toLowerCase().includes(query) ||
      book.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  }

  if (filters.value.copyType.length > 0) {
    books = books.filter((book) =>
      book.copyType &&
      book.copyType.some((bookCopyType) => filters.value.copyType.includes(bookCopyType))
    );
  }

  if (filters.value.licensingType.length > 0) {
    books = books.filter((book) =>
      book.licensingType &&
      book.licensingType.some((bookLicensingType) => filters.value.licensingType.includes(bookLicensingType))
    );
  }

  if (filters.value.sources) {
    const sourceQuery = filters.value.sources.toLowerCase();
    books = books.filter((book) =>
      book.sources &&
      book.sources.some((source) => source.toLowerCase().includes(sourceQuery))
    );
  }

  if (filters.value.tags.length > 0) {
    const filterTagsLower = filters.value.tags.map((tag) => tag.toLowerCase());

    books = books.filter((book) =>
      book.tags &&
      filterTagsLower.some((filterTag) =>
        book.tags.some((bookTag) =>
          bookTag.toLowerCase().includes(filterTag) || filterTag.includes(bookTag.toLowerCase())
        )
      )
    );

    // Sort to prioritize books with the most matching tags
    books.sort((a, b) => {
      const aMatches = filterTagsLower.filter((filterTag) =>
        a.tags.some((bookTag) =>
          bookTag.toLowerCase().includes(filterTag) || filterTag.includes(bookTag.toLowerCase())
        )
      ).length;

      const bMatches = filterTagsLower.filter((filterTag) =>
        b.tags.some((bookTag) =>
          bookTag.toLowerCase().includes(filterTag) || filterTag.includes(bookTag.toLowerCase())
        )
      ).length;

      return bMatches - aMatches;
    });
  }

  return books;
});

// Top books for user (sorted by rating)
const topBooks = computed(() => {
  const books = [...allBooks.value];
  return books
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 8);
});

// Tags to cycle through for suggested books
const suggestedTagsCycle = ['PHP', 'Web Development', 'Programming', 'Fantasy', 'Non-Fiction', 'Dystopia'];

// Current tag index - cycles on every page refresh
const currentTagIndex = ref(0);

// Initialize tag index and load data on mount
onMounted(async () => {
  await loadBooksFromApi();
  
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
  if (!tag) {
    return [];
  }

  return allBooks.value
    .filter((book) => book.tags.some((bookTag) =>
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

@media (max-width: 1024px) {
  .literature-content {
    flex-direction: column;
  }
  
  .literature-main {
    max-width: 100%;
  }
}
</style>

