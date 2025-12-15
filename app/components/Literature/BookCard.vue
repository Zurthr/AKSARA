<template>
  <NuxtLink :to="`/literature/${book.id}`" class="book-link" @click="handleClick">
    <div class="book-cover">
      <img 
        :src="imageUrl" 
        :alt="book.title || `Book ${book.id}`" 
        @error="handleImageError"
        @load="handleImageLoad"
      />
    </div>
    <div class="book-info">
      <h4 class="book-title" :class="titleWidthClass">
        {{ displayTitle }}
      </h4>
      <p class="book-author" v-if="book.author">by {{ displayAuthor }}</p>
      <div class="book-tags" v-if="book.tags && book.tags.length > 0">
        <span class="book-tag">
          {{ displayTag }}
        </span>
        <span v-if="book.tags.length > 1" class="book-tag-more">
          +{{ book.tags.length - 1 }}
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
</template>

<script setup lang="ts">
import { useClickTracking } from '~/composables/useClickTracking';

export interface BookCardBook {
  id: string | number;
  title: string;
  author?: string;
  image: string;
  tags: string[];
  rating?: number;
}

const props = defineProps<{
  book: BookCardBook;
}>();

const imageUrl = ref(props.book.image);
const imageError = ref(false);

// Click tracking
const { trackBookClick } = useClickTracking();

const handleClick = () => {
  trackBookClick({
    id: props.book.id,
    title: props.book.title,
    tags: props.book.tags,
    author: props.book.author,
    rating: props.book.rating
  });
};

const handleImageError = () => {
  if (!imageError.value) {
    imageError.value = true;
    imageUrl.value = '/images/book-cover-placeholder.svg';
  }
};

const handleImageLoad = () => {
  imageError.value = false;
};

const displayTag = computed(() => {
  const firstTag = props.book.tags?.[0] || '';
  if (firstTag.length > 8) {
    return firstTag.substring(0, 8) + '..';
  }
  return firstTag;
});

const displayTitle = computed(() => {
  const title = props.book.title || '';
  if (title.length > 36) {
    return title.substring(0, 36) + '..';
  }
  return title;
});

const titleWidthClass = computed(() => {
  const titleLength = (props.book.title || '').trim().length;
  if (titleLength > 0 && titleLength < 16) return 'book-title--narrow-12';
  if (titleLength < 24) return 'book-title--narrow-18';
  return '';
});

const displayAuthor = computed(() => {
  const author = props.book.author || '';
  if (!author) return '';
  
  // Split by comma and trim each author name
  const authors = author.split(',').map(a => a.trim()).filter(a => a.length > 0);
  
  if (authors.length <= 1) {
    return authors[0];
  } else {
    return `${authors[0]} and ${authors.length - 1} others`;
  }
});
</script>

<style scoped>
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
  word-break: break-word;
}

.book-title--narrow-12 {
  max-width: 50%;
  letter-spacing: 0.03em;
}

.book-title--narrow-18 {
  max-width: 60%;
  letter-spacing: 0.01em;
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
  height: 26px;
}

.book-tag-more {
  display: inline-block;
  padding: 4px 12px;
  background-color: rgba(59, 83, 121, 0.1);
  color: var(--color-primary);
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  width: fit-content;
  text-align: center;
  height: 26px;
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
</style>
