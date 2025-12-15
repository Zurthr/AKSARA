<template>
  <div class="embeds-index">
    <main class="embeds-content">
      <!-- Loading state -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="text-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p class="text-gray-600">Loading your embeds...</p>
        </div>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="flex items-center justify-center py-12">
        <div class="text-center">
          <div class="text-red-500 text-xl mb-4">⚠️</div>
          <p class="text-red-600 mb-4">{{ error }}</p>
          <button
            @click="fetchEmbeds"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else-if="embeds.length === 0" class="flex items-center justify-center py-12">
        <div class="text-center">
          <div class="text-gray-400 text-4xl mb-4">📦</div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No embeds yet</h3>
          <p class="text-gray-600 mb-4">Create your first embed widget to get started</p>
          <CreateEmbedCTA @create="handleCreateEmbed" />
        </div>
      </div>

      <!-- Content state -->
      <div v-else>
        <div class="embeds-grid">
          <EmbedCard
            v-for="embed in paginatedEmbeds"
            :key="embed.id"
            :embed="embed"
            @delete="handleDeleteEmbed"
            @get-link="handleGetLink"
          />
        </div>

        <Pagination
          :current-page="currentPage"
          :total-pages="totalPages"
          @page-change="handlePageChange"
        />
      </div>
    </main>

    <RightSideBar>
      <EmbedOverviewStats :stats="overviewStats" />
      <CreateEmbedCTA @create="handleCreateEmbed" />
    </RightSideBar>

    <!-- Create/Edit Embed Modal -->
    <CreateEmbedModal
      v-if="showModal"
      :embed="editingEmbed"
      @close="handleCloseModal"
      @save="handleSaveEmbed"
    />
  </div>
</template>

<script setup lang="ts">
import RightSideBar from "~/components/General/RightSideBar.vue";

interface EmbedStats {
  totalEmbeds: number;
  activeEmbeds: number;
  views30d: number;
  clicks30d: number;
  viewsTrend: number; // percentage change
  clicksTrend: number; // percentage change
}

interface Embed {
  id: string;
  name: string;
  type: "RESOURCE_LIST" | "EVENT_LIST";
  filterTags?: string[];
  limit?: number;
  sortBy?: string;
  theme?: string;
  showThumbnail?: boolean;
  allowedDomains?: string[];
  createdAt: string;
  updatedAt?: string;
  creator?: {
    id: string;
    name: string;
  };
  embedUrl: string;
}

// Page meta
definePageMeta({
  title: "Embeds",
  description: "Manage and track your embedded content",
});

// Helper function to get thumbnail URL based on embed type
const getThumbnailUrl = (type: string): string => {
  const typeMap: Record<string, string> = {
    'RESOURCE_LIST': '/images/embeds/literature-placeholder.svg',
    'EVENT_LIST': '/images/embeds/events-placeholder.svg',
  };
  return typeMap[type] || '/images/embeds/default-placeholder.svg';
};

// API integration
const { getEmbeds, createEmbed, updateEmbed, deleteEmbed } = useEmbedApi()

// State management
const embeds = ref<Embed[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

// Fetch embeds from API
const fetchEmbeds = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await getEmbeds<{ success: boolean; data: Embed[] }>()

    if (response.success) {
      // Transform API response to include embedUrl and set defaults for missing fields
      embeds.value = response.data.map(embed => ({
        ...embed,
        embedUrl: `${window.location.origin}/embed/${embed.id}`,
        filterTags: embed.filterTags || [],
        limit: embed.limit || 5,
        sortBy: embed.sortBy || 'rating',
        theme: embed.theme || 'light',
        showThumbnail: embed.showThumbnail ?? true,
        allowedDomains: embed.allowedDomains || []
      }))
    } else {
      throw new Error('Failed to fetch embeds')
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load embeds'
    console.error('Error fetching embeds:', err)
  } finally {
    loading.value = false
  }
}

// Load embeds on mount
onMounted(() => {
  fetchEmbeds()
})

// Pagination state
const currentPage = ref(1);
const itemsPerPage = 5;

// Computed properties for pagination
const paginatedEmbeds = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return embeds.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(embeds.value.length / itemsPerPage);
});

const overviewStats = computed<EmbedStats>(() => ({
  totalEmbeds: embeds.value.length,
  activeEmbeds: embeds.value.length, // All embeds are considered active in the new API
  views30d: 0, // Will be implemented when analytics are available
  clicks30d: 0, // Will be implemented when analytics are available
  viewsTrend: 0,
  clicksTrend: 0,
}));

const showModal = ref(false);
const editingEmbed = ref<Embed | null>(null);

// Pagination handlers
const handlePageChange = (page: number) => {
  currentPage.value = page;
};

const handleCreateEmbed = () => {
  editingEmbed.value = null;
  showModal.value = true;
};

const handleDeleteEmbed = async (embedId: string) => {
  if (confirm("Are you sure you want to delete this embed?")) {
    try {
      const response = await deleteEmbed<{ success: boolean }>(embedId);

      if (response.success) {
        await fetchEmbeds(); // Refresh the list
        // You could add a success toast here
      } else {
        throw new Error('Failed to delete embed');
      }
    } catch (err) {
      console.error('Error deleting embed:', err);
      alert('Failed to delete embed');
    }
  }
};

const handleGetLink = (embed: Embed) => {
  if (embed.embedUrl) {
    navigator.clipboard.writeText(embed.embedUrl);
    // You could add a toast notification here
    alert("Embed link copied to clipboard!");
  }
};

const handleCloseModal = () => {
  showModal.value = false;
  editingEmbed.value = null;
};

const handleSaveEmbed = async (embedData: any) => {
  try {
    // Log the data being sent for debugging
    console.log('Saving embed data:', embedData);

    let response;

    if (editingEmbed.value) {
      // Update existing embed
      response = await updateEmbed<{ success: boolean; data: Embed }>(
        editingEmbed.value.id,
        embedData
      );
    } else {
      // Create new embed
      response = await createEmbed<{ success: boolean; data: Embed }>(embedData);
    }

    if (response.success) {
      await fetchEmbeds(); // Refresh the list
      handleCloseModal();
      // You could add a success toast here
    } else {
      throw new Error(editingEmbed.value ? 'Failed to update embed' : 'Failed to create embed');
    }
  } catch (err) {
    console.error('Error saving embed:', err);
    console.error('Error details:', err.message);
    alert(editingEmbed.value ? 'Failed to update embed' : 'Failed to create embed');
  }
};
</script>

<style scoped>
.embeds-index {
  width: 100%;
  padding: 24px;
  background-color: #f8fafc;
  min-height: 100%;
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  gap: 24px;
}

.embeds-content {
  flex: 1;
  min-width: 0;
}

.embeds-header {
  margin-bottom: 32px;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 8px;
  font-family: 'Roboto', sans-serif;
}

.page-subtitle {
  font-size: 1.1rem;
  color: var(--color-secondary);
  margin: 0;
  font-family: 'Roboto', sans-serif;
}

.embeds-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

@media (max-width: 768px) {
  .embeds-index {
    flex-direction: column;
    padding: 16px;
  }

  .page-title {
    font-size: 2rem;
  }

  .page-subtitle {
    font-size: 1rem;
  }
}
</style>
