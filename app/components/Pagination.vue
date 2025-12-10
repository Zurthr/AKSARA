<template>
  <div class="pagination">
    <button
      class="pagination-btn nav-btn"
      :disabled="currentPage === 1"
      @click="goToPrev"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="15 18 9 12 15 6"></polyline>
      </svg>
      Previous
    </button>

    <div class="page-numbers">
      <button
        v-for="page in visiblePages"
        :key="page"
        class="page-btn"
        :class="{ active: page === currentPage, ellipsis: page === '...' }"
        :disabled="page === '...'"
        @click="page !== '...' && goToPage(page)"
      >
        {{ page }}
      </button>
    </div>

    <button
      class="pagination-btn nav-btn"
      :disabled="currentPage === totalPages"
      @click="goToNext"
    >
      Next
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="9 18 15 12 9 6"></polyline>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  currentPage: number;
  totalPages: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'page-change': [page: number];
}>();

// Calculate which page numbers to show
const visiblePages = computed(() => {
  const { currentPage, totalPages } = props;
  const delta = 2; // Number of pages to show on each side

  let range = [];
  let rangeWithDots = [];
  let l;

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
      range.push(i);
    }
  }

  range.forEach((i, index) => {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (i - l !== 1) {
        rangeWithDots.push('...');
      }
    }
    rangeWithDots.push(i);
    l = i;
  });

  return rangeWithDots;
});

const goToPrev = () => {
  if (props.currentPage > 1) {
    emit('page-change', props.currentPage - 1);
  }
};

const goToNext = () => {
  if (props.currentPage < props.totalPages) {
    emit('page-change', props.currentPage + 1);
  }
};

const goToPage = (page: number) => {
  emit('page-change', page);
};
</script>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 32px;
  padding: 20px 0;
}

.pagination-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background-color: white;
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #f8fafc;
  border-color: #cbd5e1;
  color: #475569;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: #f8fafc;
}

.nav-btn {
  min-width: 100px;
  justify-content: center;
}

.nav-btn svg {
  flex-shrink: 0;
}

.page-numbers {
  display: flex;
  align-items: center;
  gap: 4px;
}

.page-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background-color: white;
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  padding: 0;
}

.page-btn:hover:not(:disabled):not(.ellipsis) {
  background-color: #f8fafc;
  border-color: #cbd5e1;
  color: #475569;
}

.page-btn.active {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.page-btn.ellipsis {
  border: none;
  background-color: transparent;
  cursor: default;
  color: #94a3b8;
}

.page-btn.ellipsis:hover {
  background-color: transparent;
}

/* Mobile Responsive */
@media (max-width: 640px) {
  .pagination {
    gap: 4px;
    margin-top: 24px;
    padding: 16px 0;
  }

  .nav-btn {
    min-width: 80px;
    padding: 8px 12px;
    font-size: 13px;
  }

  .nav-btn span {
    display: none;
  }

  .page-btn {
    width: 36px;
    height: 36px;
    font-size: 13px;
  }

  .page-numbers {
    gap: 2px;
  }
}
</style>