<template>
  <div class="book-section">
    <div class="section-header">
      <div class="section-title">
        {{ title }}
      </div>
      <div class="section-actions">
        <NuxtLink :to="seeMoreLink" class="see-more-link">
          <span>See more</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 12a8 8 0 0 1 8-8 8 8 0 0 1 8 8 8 8 0 0 1-8 8 8 8 0 0 1-8-8zm2 0a6 6 0 0 0 6 6 6 6 0 0 0 6-6 6 6 0 0 0-6-6 6 6 0 0 0-6 6zm5-3l3 3-3 3v-2H8v-2h3V9z" fill="currentColor"/>
          </svg>
        </NuxtLink>
        <button class="refresh-button" @click="refresh" aria-label="Refresh">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" fill="currentColor"/>
          </svg>
        </button>
      </div>
    </div>

    <div class="carousel-wrapper">
      <button 
        class="carousel-nav carousel-nav-left" 
        style="left: -16px;"
        @click="previousSlide"
        :disabled="currentIndex === 0"
        aria-label="Previous book"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <div class="carousel-container">
        <div class="carousel-track" :style="{ transform: `translateX(-${currentIndex * 180}px)` }">
          <div
            v-for="book in displayedBooks"
            :key="book.id"
            class="book-card"
          >
            <BookCard :book="book" />
          </div>
        </div>
      </div>

      <button 
        class="carousel-nav carousel-nav-right" 
        @click="nextSlide"
        :disabled="currentIndex >= maxIndex"
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
import BookCard, { type BookCardBook } from '~/components/Literature/BookCard.vue';

interface Book extends BookCardBook {
  description?: string;
}

const props = defineProps<{
  title: string;
  books: Book[];
  seeMoreLink?: string;
}>();

const currentIndex = ref(0);
const visibleBooks = 4;

const displayedBooks = computed(() => props.books);

const maxIndex = computed(() => Math.max(0, displayedBooks.value.length - visibleBooks));

const nextSlide = () => {
  currentIndex.value = Math.min(currentIndex.value + 1, maxIndex.value);
};

const previousSlide = () => {
  currentIndex.value = Math.max(0, currentIndex.value - 1);
};

const refresh = () => {
  // Emit refresh event or reload data
  currentIndex.value = 0;
};
</script>

<style scoped>
.book-section {
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
}

.section-actions {
  display: flex;
  align-items: center;
  gap: 12px;
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

.refresh-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-black);
  transition: color 0.2s ease;
}

.refresh-button:hover {
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
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
}

.carousel-nav {
  position: absolute;
  top: 30%;
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

.carousel-nav:hover:not(:disabled) {
  background: var(--color-primary);
}

.carousel-nav:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.carousel-nav-left {
  left: 0;
}

.carousel-nav-right {
  right: 0;
}
</style>

