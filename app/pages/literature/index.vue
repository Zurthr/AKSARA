<template>
  <div class="literature-page">
      <div class="literature-main">
        <header class="literature-header" v-if="searchQuery">
          <h1>Search Results for "{{ searchQuery }}"</h1>
          <p v-if="filteredBooks.length > 0">
            Found {{ filteredBooks.length }} result{{ filteredBooks.length !== 1 ? 's' : '' }}
          </p>
          <p v-else>No results found. Try adjusting your filters or search query.</p>
        </header>

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
          <BookSection
            :title="searchQuery ? `Results for '${searchQuery}'` : 'Filtered Results'"
            :books="filteredBooks"
            see-more-link="/literature"
          />
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

interface Book {
  id: number;
  title: string;
  author?: string;
  image: string;
  tags: string[];
  rating?: number;
  bookmarks?: number;
  copyType?: 'onsite' | 'physical' | 'online';
  licensingType?: 'pay-to-own' | 'rent' | 'free';
  sources?: string;
}

const route = useRoute();

// Sample book data - in production, this would come from an API
const allBooks: Book[] = [
  {
    id: 1,
    title: 'DIFFERENT WINTER',
    author: 'Mia Jackson',
    image: 'https://img.freepik.com/free-vector/abstract-elegant-winter-book-cover_23-2148798745.jpg?semt=ais_hybrid&w=740&q=80',
    tags: ['Web Development'],
    rating: 4.2,
    bookmarks: 120,
    copyType: 'online',
    licensingType: 'free',
    sources: 'IEEE'
  },
  {
    id: 2,
    title: 'THE UNDERSTORY',
    author: 'Saner Sangsuk',
    image: 'https://via.placeholder.com/200x300/16a34a/ffffff?text=The+Understory',
    tags: ['Web Development', 'PHP'],
    rating: 4.8,
    bookmarks: 95,
    copyType: 'online',
    licensingType: 'rent',
    sources: 'IEEE'
  },
  {
    id: 3,
    title: 'JAMES and the Giant Peach',
    author: 'Roald Dahl',
    image: 'https://via.placeholder.com/200x300/fbbf24/000000?text=James+and+the+Giant+Peach',
    tags: ['Web Development'],
    rating: 3.5,
    bookmarks: 80,
    copyType: 'physical',
    licensingType: 'pay-to-own',
    sources: 'ACM'
  },
  {
    id: 4,
    title: 'BEYOND THE OCEAN DOOR',
    image: 'https://via.placeholder.com/200x300/1e3a8a/ffffff?text=Beyond+the+Ocean+Door',
    tags: ['Web Development'],
    rating: 4.0,
    bookmarks: 150,
    copyType: 'online',
    licensingType: 'free',
    sources: 'IEEE'
  },
  {
    id: 5,
    title: 'Clean Code',
    author: 'Robert C. Martin',
    image: 'https://via.placeholder.com/200x300/ef4444/ffffff?text=Clean+Code',
    tags: ['Programming', 'Software Engineering'],
    rating: 4.9,
    bookmarks: 200,
    copyType: 'physical',
    licensingType: 'pay-to-own',
    sources: 'Springer'
  },
  {
    id: 6,
    title: 'Design Patterns',
    author: 'Gang of Four',
    image: 'https://via.placeholder.com/200x300/8b5cf6/ffffff?text=Design+Patterns',
    tags: ['Software Engineering', 'Programming'],
    rating: 4.3,
    bookmarks: 180,
    copyType: 'online',
    licensingType: 'rent',
    sources: 'Elsevier'
  }
];

const searchQuery = computed(() => route.query.q as string || route.query.search as string || '');

const filters = computed(() => ({
  copyType: route.query.copyType as string || '',
  licensingType: route.query.licensingType as string || '',
  sources: route.query.sources as string || '',
  tags: Array.isArray(route.query.tags) 
    ? route.query.tags as string[]
    : route.query.tags 
      ? [route.query.tags as string]
      : []
}));

const hasActiveFilters = computed(() => {
  return filters.value.copyType || 
         filters.value.licensingType || 
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

  // Filter by copy type
  if (filters.value.copyType) {
    books = books.filter(book => book.copyType === filters.value.copyType);
  }

  // Filter by licensing type
  if (filters.value.licensingType) {
    books = books.filter(book => book.licensingType === filters.value.licensingType);
  }

  // Filter by sources
  if (filters.value.sources) {
    books = books.filter(book => book.sources === filters.value.sources);
  }

  // Filter by tags
  if (filters.value.tags.length > 0) {
    books = books.filter(book => 
      filters.value.tags.some(tag => 
        book.tags.some(bookTag => 
          bookTag.toLowerCase().includes(tag.toLowerCase())
        )
      )
    );
  }

  return books;
});

// Top books for user (sorted by rating, personalized based on user preferences)
const topBooks = computed(() => {
  // In production, this would be personalized based on user's reading history, preferences, etc.
  // For now, showing top-rated books
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
  gap: 24px;
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

