<template>
  <header class="navbar">
    <div class="search-center">
        <div class="search-wrapper">
          <img src="~/assets/icons/Search.svg" alt="Search" style="width: 20px; height: 20px;">
          <input
            type="search"
            class="search-input"
            placeholder="Search something..."
            v-model="searchQuery"
            @keyup.enter="handleSearch"
          />
          <button
            v-if="searchQuery"
            type="button"
            class="clear-search-button"
            @click="clearSearch"
            aria-label="Clear search"
          >
          <img src="~/assets/icons/Close.svg" alt="Close" style="width: 20px; height: 20px;">

          </button>
        </div>
    </div>
    <div class="action-icons">
      <div class="notification-wrapper">
        <button
          type="button"
          class="icon-button"
          @click="toggleNotificationModal"
          :class="{ 'active': showNotificationModal }"
          aria-label="Notifications"
        >
          <img src="~/assets/icons/Notifications.svg" alt="Bell" style="width: 20px; height: 20px;">
        </button>

        <!-- Notification Dropdown -->
        <NotificationModal
          v-if="showNotificationModal"
          @close="closeNotificationModal"
        />
      </div>
      <div class="profile-wrapper">
        <button
          type="button"
          class="icon-button"
          @click="toggleProfileDropdown"
          :class="{ 'active': showProfileDropdown }"
          aria-label="Profile"
        >
          <img src="~/assets/icons/Person.svg" alt="Profile" style="width: 20px; height: 20px;">
        </button>

        <!-- Profile Dropdown -->
        <ProfileDropdown
          v-if="showProfileDropdown"
          @close="closeProfileDropdown"
        />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();

const searchQuery = ref<string>((route.query.q as string) || (route.query.search as string) || '');

// Notification modal state
const showNotificationModal = ref(false);

// Profile dropdown state
const showProfileDropdown = ref(false);

// Click tracking
const { trackSearch } = useClickTracking();

// Update search query from URL when route changes
watch(() => route.query, (newQuery) => {
  searchQuery.value = (newQuery.q as string) || (newQuery.search as string) || '';
}, { immediate: true });

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    // Redirect to literature page with search query
    // You can add logic here to determine content type (literature, forums, events, etc.)
    // For now, defaulting to literature
    const query: Record<string, string | string[]> = {
      q: searchQuery.value.trim()
    };

    // Preserve filter params if already on literature page
    if (route.path === '/literature') {
      if (route.query.copyType) {
        query.copyType = Array.isArray(route.query.copyType)
          ? route.query.copyType as string[]
          : [route.query.copyType as string];
      }
      if (route.query.licensingType) {
        query.licensingType = Array.isArray(route.query.licensingType)
          ? route.query.licensingType as string[]
          : [route.query.licensingType as string];
      }
      if (route.query.sources) query.sources = route.query.sources as string;
      if (route.query.tags) {
        query.tags = Array.isArray(route.query.tags)
          ? route.query.tags as string[]
          : route.query.tags as string ? [route.query.tags as string] : [];
      }
    }

    // Track search query
    trackSearch({
      query: searchQuery.value.trim(),
      source_page: route.path,
      filters: {
        copyType: query.copyType,
        licensingType: query.licensingType,
        tags: query.tags,
        sources: query.sources
      }
    });

    router.push({
      path: '/literature',
      query
    });
  }
};

const clearSearch = () => {
  searchQuery.value = '';

  const query: Record<string, string | string[]> = {};

  // If we're on the literature page, preserve filters but drop search params
  if (route.path === '/literature') {
    if (route.query.copyType) {
      query.copyType = Array.isArray(route.query.copyType)
        ? route.query.copyType as string[]
        : [route.query.copyType as string];
    }
    if (route.query.licensingType) {
      query.licensingType = Array.isArray(route.query.licensingType)
        ? route.query.licensingType as string[]
        : [route.query.licensingType as string];
    }
    if (route.query.sources) {
      query.sources = route.query.sources as string;
    }
    if (route.query.tags) {
      query.tags = Array.isArray(route.query.tags)
        ? route.query.tags as string[]
        : (route.query.tags as string ? [route.query.tags as string] : []);
    }

    router.push({
      path: '/literature',
      query
    });
  } else {
    // From any other page, go to root literature without search
    router.push({
      path: '/literature'
    });
  }
};

// Notification modal functions
const toggleNotificationModal = () => {
  showNotificationModal.value = !showNotificationModal.value;
  // Close profile dropdown when opening notifications
  if (showNotificationModal.value) {
    showProfileDropdown.value = false;
  }
};

const closeNotificationModal = () => {
  showNotificationModal.value = false;
};

// Profile dropdown functions
const toggleProfileDropdown = () => {
  showProfileDropdown.value = !showProfileDropdown.value;
  // Close notification dropdown when opening profile
  if (showProfileDropdown.value) {
    showNotificationModal.value = false;
  }
};

const closeProfileDropdown = () => {
  showProfileDropdown.value = false;
};

// Close dropdowns when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement;
  const notificationWrapper = target.closest('.notification-wrapper');
  const profileWrapper = target.closest('.profile-wrapper');

  if (!notificationWrapper && showNotificationModal.value) {
    closeNotificationModal();
  }

  if (!profileWrapper && showProfileDropdown.value) {
    closeProfileDropdown();
  }
};

// Add and remove click outside listener
watch([showNotificationModal, showProfileDropdown], ([notificationOpen, profileOpen]) => {
  if (notificationOpen || profileOpen) {
    nextTick(() => {
      document.addEventListener('click', handleClickOutside);
    });
  } else {
    document.removeEventListener('click', handleClickOutside);
  }
});

// Clean up on unmount
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
  height: 64px;
  background-color: var(--color-white);
  border-bottom: 1px solid #e5e7eb;
  padding:12px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.search-wrapper {
  display: flex;
  height: 40px;
  padding: 8px 12px;
  align-items: center;
  gap: 10px;
  border-radius: 16px;
  width:50vw;
  max-width: 800px;
  min-width: 420px;
  margin-left: 92px;
  background-color: var(--color-light-blue);
}

.icon-placeholder {
  font-size: 14px;
  color: #94a3b8;
}

.search-center {
  width: 100vw;
  display: flex;
  justify-content: center;
}

.search-input {
  width: 100%;
  border: none;
  background: transparent;
  outline: none;
  font-size: 14px;
  color: var(--color-black);
}

.clear-search-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0 4px;
  font-size: 16px;
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-search-button:hover {
  color: #64748b;
}

.search-input::placeholder {
  color: #94a3b8;
}

/* Hide browser's default search clear button */
.search-input::-webkit-search-cancel-button {
  display: none;
}

.search-input::-ms-clear {
  display: none;
}

.action-icons {
  display: flex;
  align-items: center;
  gap: 12px;
}

.notification-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.profile-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.icon-button {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: none;
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s ease;
}

.icon-button:hover {
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
  transform: translateY(-1px);
}

.icon-button.active {
  background-color: var(--color-light-blue);
  box-shadow: 0 4px 12px rgba(59, 83, 121, 0.2);
  border: 1px solid var(--color-primary);
}


@media screen and (max-width: 1040px) {
  .search-center {
    justify-content: start;
  }
  .search-wrapper {
    margin: 0;
  }
}
.icon-button:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
</style>

