<template>
  <div class="book-grid-section">
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

    <div class="books-grid">
      <div
        v-for="book in books"
        :key="book.id"
        class="book-card"
      >
        <NuxtLink :to="`/literature/${book.id}`" class="book-link">
          <div class="book-cover">
            <img :src="book.image" :alt="book.title || `Book ${book.id}`" />
          </div>
          <div class="book-info">
            <h4 class="book-title">{{ book.title }}</h4>
            <p class="book-author" v-if="book.author">by {{ book.author }}</p>
            <div class="book-tags">
              <span 
                v-for="tag in book.tags" 
                :key="tag" 
                class="book-tag"
              >
                {{ tag }}
              </span>
            </div>
            <div class="book-rating" v-if="book.rating">
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
  </div>
</template>

<script setup lang="ts">
interface Book {
  id: number;
  title: string;
  author?: string;
  image: string;
  tags: string[];
  rating?: number;
}

const props = defineProps<{
  title: string;
  books: Book[];
  seeMoreLink?: string;
}>();

const refresh = () => {
  // Emit refresh event or reload data
};
</script>

<style scoped>
.book-grid-section {
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

.books-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  width: 100%;
}

.book-card {
  flex: 0 0 calc(20% - 16px);
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
}

.book-link {
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.book-cover {
  width: 100%;
  aspect-ratio: 2 / 3;
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
  gap: 6px;
  align-items: center;
  text-align: center;
  width: 100%;
  margin-top: 4px;
}

.book-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-black);
  margin: 0;
  line-height: 1.3;
}

.book-author {
  font-size: 12px;
  color: #64748b;
  margin: 0;
}

.book-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  justify-content: center;
  margin-top: 4px;
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

.book-rating {
  display: flex;
  width: fit-content;
  gap: 6px;
  align-items: center;
  margin-top: 4px;
}

.rating-number {
  margin-top: 2px;
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
}

@media (max-width: 1400px) {
  .book-card {
    flex: 0 0 calc(25% - 15px);
  }
}

@media (max-width: 1100px) {
  .book-card {
    flex: 0 0 calc(33.333% - 14px);
  }
}

@media (max-width: 768px) {
  .book-card {
    flex: 0 0 calc(50% - 10px);
  }
}

@media (max-width: 480px) {
  .book-card {
    flex: 0 0 100%;
  }
}
</style>


