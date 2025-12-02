<template>
  <div class="book-section">
    <div class="section-header">
      <div class="section-title">
        <template v-if="sectionType === 'top'">
          <span class="title-highlight">{{ titlePrefix }}</span>
          <span v-if="titleSuffix">{{ titleSuffix }}</span>
        </template>
        <template v-else-if="sectionType === 'recommendation'">
          <span>{{ titlePrefix }}</span>
          <span v-if="highlightedTag" class="tag-highlight">{{ highlightedTag }}</span>
          <span style="margin-left:-6px;">?</span>
        </template>
        <template v-else>
          {{ title }}
        </template>
      </div>
      <!-- <div class="section-actions">
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
      </div> -->
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
  sectionType?: 'top' | 'recommendation' | 'default';
  highlightedTag?: string;
  titlePrefix?: string;
  titleSuffix?: string;
}>();

const currentIndex = ref(0);
const visibleBooks = 4;

const displayedBooks = computed(() => props.books);

// Parse title based on section type (only if prefix/suffix not provided)
const titleParts = computed(() => {
  if (props.sectionType === 'top') {
    // If prefix/suffix are provided via props, use them
    if (props.titlePrefix !== undefined || props.titleSuffix !== undefined) {
      return {
        prefix: props.titlePrefix || '',
        suffix: props.titleSuffix || ''
      };
    }
    
    // Otherwise, parse from title
    // For "Top Books For you" or "Top Books on Web Development"
    const match = props.title.match(/^(Top Books)(?:\s+(.+))?$/i);
    if (match) {
      return {
        prefix: match[1],
        suffix: match[2] || ''
      };
    }

    // Fallback: try to split on common patterns
    const parts = props.title.split(/\s+(on|for|in)\s+/i);
    if (parts.length > 1) {
      return {
        prefix: parts[0],
        suffix: parts.slice(1).join(' ')
      };
    }
    return { prefix: props.title, suffix: '' };
  } else if (props.sectionType === 'recommendation') {
    // For "Looking for PHP?" or "Looking for Web Development?"
    const match = props.title.match(/^(Looking for)\s+(.+?)(\?)?$/i);
    if (match) {
      return {
        prefix: match[1],
        tag: match[2],
        suffix: match[3] || '' // Question mark goes with the tag
      };
    }
    return { prefix: props.title, tag: '', suffix: '' };
  }
  return { prefix: props.title, suffix: '' };
});

const titlePrefix = computed(() => {
  if (props.sectionType === 'top' && props.titlePrefix !== undefined) {
    return props.titlePrefix;
  }
  return titleParts.value.prefix;
});

const titleSuffix = computed(() => {
  if (props.sectionType === 'top' && props.titleSuffix !== undefined) {
    return props.titleSuffix;
  }
  return titleParts.value.suffix;
});
const highlightedTag = computed(() => {
  if (props.highlightedTag) {
    return props.highlightedTag;
  }
  return titleParts.value.tag || '';
});

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
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.title-highlight {
  background-color: var(--color-highlight);
  text-decoration: underline;
  color: #000;
font-family: Inter;
font-size: 18px;
font-style: normal;
font-weight: 400;
line-height: normal;
text-decoration-line: underline;
text-decoration-style: solid;
text-decoration-skip-ink: auto;
text-decoration-thickness: auto;
text-underline-offset: auto;
text-underline-position: from-font;
margin-right:-4px;
}

.tag-highlight {
  margin-left:-2px;
  background-color: var(--color-secondary);
  color: var(--color-white);
  font-weight: 600;
font-family: Inter;
font-size: 18px;
font-style: normal;
font-weight: 400;
line-height: normal;
text-decoration-style: solid;
text-decoration-skip-ink: auto;
text-decoration-thickness: auto;
text-underline-offset: auto;
text-underline-position: from-font;
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

