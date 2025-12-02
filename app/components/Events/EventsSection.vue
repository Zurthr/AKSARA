<template>
  <div class="events-section">
    <div class="section-header">
      <div class="section-title"><div style="background-color: var(--color-highlight); width:fit-content; text-decoration: underline;">Events</div> being held, curated for you.</div>
      <NuxtLink to="/events" class="see-more-link">
        <span>See more</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 12a8 8 0 0 1 8-8 8 8 0 0 1 8 8 8 8 0 0 1-8 8 8 8 0 0 1-8-8zm2 0a6 6 0 0 0 6 6 6 6 0 0 0 6-6 6 6 0 0 0-6-6 6 6 0 0 0-6 6zm5-3l3 3-3 3v-2H8v-2h3V9z" fill="currentColor"/>
        </svg>
      </NuxtLink>
    </div>

    <div class="events-carousel-wrapper">
      <div class="events-carousel">
        <div class="carousel-container" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
          <div
            v-for="event in events"
            :key="event.id"
            class="event-card"
          >
            <div class="event-image-wrapper">
              <img :src="event.image" :alt="event.title" class="event-background" />
              <div class="event-overlay">
                <h3 class="event-title-overlay">{{ event.subtitle }}</h3>
              </div>
            </div>
            
            <div class="event-content">
              <div>
              <h3 class="event-title">{{ event.title }} - {{ event.subtitle }}</h3>
              <p class="event-description">{{ event.description }}</p>
              
              <div class="event-details">
                <div class="event-location">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" fill="currentColor"/>
                  </svg>
                  {{ event.location }}
                </div>
                
                <div class="event-date">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" fill="currentColor"/>
                  </svg>
                  {{ event.date }}
                </div>
              </div>
            </div>
              <NuxtLink :to="`/events/${event.id}`" class="explore-btn">
                Explore Event
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <div class="carousel-controls">
        <button 
          class="carousel-arrow" 
          @click="previousSlide"
          aria-label="Previous event"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <div class="carousel-dots">
          <button
            v-for="(evt, index) in events"
            :key="evt.id"
            class="dot"
            :class="{ active: index === currentIndex }"
            @click="goToSlide(index)"
            :aria-label="`Go to event ${index + 1}`"
          />
        </div>

        <button 
          class="carousel-arrow" 
          @click="nextSlide"
          aria-label="Next event"
          style="border-radius: 4px 8px 8px 4px;   padding: 0 0px 0 4px;
"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import eventsData from '~/../mock-backend/data/events.json';

const events = eventsData.slice(0, 7);
const currentIndex = ref(0);
let autoPlayInterval: ReturnType<typeof setInterval> | null = null;

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % events.length;
  resetAutoPlay();
};

const previousSlide = () => {
  currentIndex.value = (currentIndex.value - 1 + events.length) % events.length;
  resetAutoPlay();
};

const goToSlide = (index: number) => {
  currentIndex.value = index;
  resetAutoPlay();
};

const startAutoPlay = () => {
  autoPlayInterval = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % events.length;
  }, 10000); // 10 seconds
};

const resetAutoPlay = () => {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval);
  }
  startAutoPlay();
};

onMounted(() => {
  startAutoPlay();
});

onUnmounted(() => {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval);
  }
});
</script>

<style scoped>
.events-section {
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  border-radius: 12px;
  padding: 8px 32px;
  margin-bottom: 20px;
  gap: 12px;
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
  color: #2563eb;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  transition: color 0.2s ease;
}

.see-more-link:hover {
  color: #1d4ed8;
}

.events-carousel-wrapper {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.events-carousel {
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  flex: 1;
}

.carousel-container {
  display: flex;
  transition: transform 0.4s ease-in-out;
}

.event-card {
  min-width: 100%;
  height: 320px;
  display: flex;
  flex-direction: row;
  gap: 0;
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
}

@media (max-width: 1040px) {
  .event-card {
    flex-direction: column;
    height: auto;
    min-height: 320px;
  }
}

.event-image-wrapper {
  position: relative;
  flex: 1;
  height: 100%;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

@media (max-width: 1040px) {
  .event-image-wrapper {
    height: 200px;
    flex: none;
  }
}

.event-background {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.9;
}

.event-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
}

.event-title-overlay {
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
}

.event-content {
  width: 320px;
  flex-shrink: 0;
  padding: 8px 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

@media (max-width: 1040px) {
  .event-content {
    width: 100%;
    padding: 20px;
  }
}

.event-title {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 12px 0;
  line-height: 1.3;
}

.event-description {
  font-size: 14px;
  color: #4b5563;
  line-height: 1.5;
  margin: 0 0 16px 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.event-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.event-location,
.event-date {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #64748b;
}

.event-location svg,
.event-date svg {
  flex-shrink: 0;
  color: #64748b;
}

.explore-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 24px;
  background: var(--color-highlight);
  color: var(--color-black);
  font-weight: 600;
  text-decoration: none;
  border-radius: 12px;
  transition: background-color 0.2s ease;
  align-self: flex-start;
  width:100%;
}

.explore-btn:hover {
  background: var(--color-highlight2);
}

.carousel-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  gap: 16px;
  margin-top: 8px;
  position: relative;
}

.carousel-arrow {
  width: 32px;
  height: 28px;
  border-radius: 8px 4px 4px 8px;
  padding: 0 4px 0 0;
  border: 1px solid #e5e7eb;
  background: var(--color-secondary);
  color: var(--color-tertiary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.carousel-arrow:hover {
  background: var(--color-primary);
}

.carousel-dots {
  display: flex;
  gap: 8px;
  align-items: center;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  background: #d1d5db;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;
}

.dot.active {
  width: 24px;
  height: 8px;
  border-radius: 4px;
  background: #374151;
}

.dot:hover {
  background: #9ca3af;
}

</style>
