<template>
  <div class="reads-section">
    <div class="section-header">
      <div class="section-title">
        <div style="background-color: var(--color-highlight); width:fit-content; text-decoration: underline;">Reads</div> you may enjoy
      </div>
      <NuxtLink to="/reads" class="see-more-link">
        <span>See more</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 12a8 8 0 0 1 8-8 8 8 0 0 1 8 8 8 8 0 0 1-8 8 8 8 0 0 1-8-8zm2 0a6 6 0 0 0 6 6 6 6 0 0 0 6-6 6 6 0 0 0-6-6 6 6 0 0 0-6 6zm5-3l3 3-3 3v-2H8v-2h3V9z" fill="currentColor"/>
        </svg>
      </NuxtLink>
    </div>

    <div class="carousel-wrapper">
      <button 
        class="carousel-nav carousel-nav-left" 
        style="left: -16px;"
        @click="previousSlide"
        aria-label="Previous book"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <div class="carousel-container">
        <div class="carousel-track" :style="{ transform: `translateX(-${currentIndex * 180}px)` }">
          <NuxtLink
            v-for="book in books"
            :key="book.id"
            :to="`/literature/${book.id}`"
            class="book-card book-link"
            @click="trackBook(book)"
          >
            <div class="book-cover">
              <img :src="book.image" :alt="`Book ${book.id}`" />
            </div>
            <div class="book-info">
              <div class="book-tag">{{ book.tag }}</div>
              <div class="book-rating">
                <span class="rating-number">{{ book.rating.toFixed(1) }}</span>
                <div class="stars-container">
                  <div
                    v-for="starIndex in 5"
                    :key="starIndex"
                    class="star-wrapper"
                  >
                    <img 
                      v-if="starIndex > book.rating"
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
                          clipPath: starIndex < book.rating
                            ? 'inset(0 0% 0 0)' 
                            : `inset(0 ${100 - ((book.rating - (starIndex - 1)) * 100)}% 0 0)` 
                        }"
                      />
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>

      <button 
        class="carousel-nav carousel-nav-right" 
        @click="nextSlide"
        aria-label="Next book"
        style="right: -16px;"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLazyBooks } from '~/composables/useLiterature';
import { useClickTracking } from '~/composables/useClickTracking';

const { books: lazyBooks, isLoading } = useLazyBooks(12);
const { trackBookClick } = useClickTracking();

// Track book click
const trackBook = (book: typeof lazyBooks.value[0]) => {
  trackBookClick({
    id: book.id,
    title: book.title,
    tags: book.tags,
    author: book.author,
    rating: book.rating
  });
};

// Map/Compute books to ensure they match the template expectations, if needed.
// NormalizedBook has `tags: string[]`. Template expects `tag: string`.
// Also filtering by rating > 0.
const books = computed(() => {
  return lazyBooks.value
    .filter(book => (book.rating || 0) > 0)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .map(book => ({
      ...book,
      tag: book.tags[0] || 'General',
      rating: book.rating || 0
    }));
});

const currentIndex = ref(0);
const visibleBooks = 4; // Number of books visible at once

const nextSlide = () => {
  // Use books.value because it is a computed property wrapper around the ref
  const maxIndex = Math.max(0, books.value.length - visibleBooks);
  currentIndex.value = Math.min(currentIndex.value + 1, maxIndex);
};

const previousSlide = () => {
  currentIndex.value = Math.max(0, currentIndex.value - 1);
};
</script>

<style scoped>
.reads-section {
  height: fit-content;
  width: 100%;
  border-radius: 8px;
  padding: 20px 6px 20px 32px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-title {
  font-size: 18px;
  font-weight: 400;
  color: #111827;
  margin: 0;
  display: flex;
  flex-direction: row;
  gap: 8px;
}

.see-more-link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--color-black);
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  transition: color 0.2s ease;
}

.see-more-link:hover {
  color: var(--color-primary);
}

.carousel-wrapper {
  position: relative;
  width: 100%;
  overflow: hidden;
  height: fit-content;
}

.carousel-container {
  overflow: hidden;
  width: 100%;
  padding: 0 40px 0 0;
}

.carousel-track {
  display: flex;
  gap: 20px;
  transition: transform 0.4s ease-in-out;
  padding-left: 0;
}

.book-card {
  flex-shrink: 0;
  width: 160px;
  height: 320px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
}

.book-link {
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.book-link:hover {
  transform: translateY(-2px);
}

.book-cover {
  width: 160px;
  height: 240px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background: #f3f4f6;
}

.book-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.book-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  
  margin-top: 4px;
}

.book-rating {
  display: flex;
  width:fit-content;
  gap: 6px;
}

.rating-number {
  margin-top:2px;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-black);
  line-height: 1;
}

.stars-container {
  display: flex;
  gap: 2px;
  align-items: center;
}

.star-wrapper {
  position: relative;
  display: inline-block;
  width: 16px;
  height: 16px;
}

.star {
  width: 16px;
  height: 16px;
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
  /* Keep original yellow color from SVG */
}

.book-tag {
  display: inline-block;
  padding: 4px 12px;
  background-color: var(--color-primary);
  color: var(--color-white);
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  width: fit-content;
  text-align: center;
}

.carousel-nav {
  position: absolute;
  top: 40%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: var(--color-secondary);
  backdrop-filter: blur(4px);
  color: var(--color-white);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: all 0.3s ease;
}

.carousel-nav:hover {
  background: var(--color-primary);
}

.carousel-nav-left {
  left: 0;
}

.carousel-nav-right {
  right: 0;
}

.carousel-nav:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
</style>

