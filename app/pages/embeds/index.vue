<template>
  <div class="embeds-index">
    <main class="embeds-content">
      <div class="embeds-grid">
        <EmbedCard
          v-for="embed in paginatedEmbeds"
          :key="embed.id"
          :embed="embed"
          @edit="handleEditEmbed"
          @duplicate="handleDuplicateEmbed"
          @delete="handleDeleteEmbed"
          @get-link="handleGetLink"
        />
      </div>

      <Pagination
        :current-page="currentPage"
        :total-pages="totalPages"
        @page-change="handlePageChange"
      />
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
  title: string;
  description: string;
  category: string;
  type: "draft" | "active";
  createdAt: string;
  views: number;
  clicks: number;
  thumbnailUrl?: string;
  embedUrl?: string;
}

// Page meta
definePageMeta({
  title: "Embeds",
  description: "Manage and track your embedded content",
});

// Helper function to get thumbnail URL based on category
const getThumbnailUrl = (category: string): string => {
  const categoryMap: Record<string, string> = {
    'Literature': '/images/embeds/literature-placeholder.svg',
    'Events': '/images/embeds/events-placeholder.svg',
    'Community': '/images/embeds/community-placeholder.svg',
    'Learning': '/images/embeds/learning-placeholder.svg',
    'Technology': '/images/embeds/technology-placeholder.svg',
  };
  return categoryMap[category] || '/images/embeds/default-placeholder.svg';
};

// Mock data - replace with actual API call
const embeds = ref<Embed[]>([
  {
    id: "1",
    title: "Featured Books Widget",
    description: "Showcase top-rated literature from AKSARA's collection",
    category: "Literature",
    type: "active",
    createdAt: "2024-01-15T10:30:00Z",
    views: 3420,
    clicks: 287,
    thumbnailUrl: getThumbnailUrl("Literature"),
    embedUrl: "https://aksara.io/embed/featured-books",
  },
  {
    id: "2",
    title: "Upcoming Events Countdown",
    description: "Display countdown timer for community workshops and meetups",
    category: "Events",
    type: "active",
    createdAt: "2024-01-10T14:20:00Z",
    views: 2156,
    clicks: 423,
    thumbnailUrl: getThumbnailUrl("Events"),
    embedUrl: "https://aksara.io/embed/events-countdown",
  },
  {
    id: "3",
    title: "Community Discussion Thread",
    description: "Embed trending forum discussions about web development",
    category: "Community",
    type: "active",
    createdAt: "2024-01-08T16:45:00Z",
    views: 1876,
    clicks: 156,
    thumbnailUrl: getThumbnailUrl("Community"),
    embedUrl: "https://aksara.io/embed/discussion-thread",
  },
  {
    id: "4",
    title: "Book Recommendation Engine",
    description: "AI-powered book suggestions based on reading preferences",
    category: "Learning",
    type: "active",
    createdAt: "2024-01-05T09:15:00Z",
    views: 983,
    clicks: 78,
    thumbnailUrl: getThumbnailUrl("Learning"),
    embedUrl: "https://aksara.io/embed/book-recommendations",
  },
  {
    id: "5",
    title: "Reading Progress Tracker",
    description: "Track and display reading goals and achievements",
    category: "Learning",
    type: "draft",
    createdAt: "2024-01-03T11:30:00Z",
    views: 245,
    clicks: 18,
    thumbnailUrl: getThumbnailUrl("Learning"),
    embedUrl: "https://aksara.io/embed/reading-progress",
  },
  {
    id: "6",
    title: "Top Web Development Books",
    description: "Curated list of essential programming and development books",
    category: "Technology",
    type: "active",
    createdAt: "2024-01-01T13:20:00Z",
    views: 4123,
    clicks: 567,
    thumbnailUrl: getThumbnailUrl("Technology"),
    embedUrl: "https://aksara.io/embed/dev-books",
  },
  {
    id: "7",
    title: "Fantasy Literature Showcase",
    description: "Display trending fantasy and sci-fi books from the community",
    category: "Literature",
    type: "active",
    createdAt: "2023-12-28T09:45:00Z",
    views: 2789,
    clicks: 342,
    thumbnailUrl: getThumbnailUrl("Literature"),
    embedUrl: "https://aksara.io/embed/fantasy-books",
  },
  {
    id: "8",
    title: "Member Directory Widget",
    description: "Showcase active community members and their contributions",
    category: "Community",
    type: "active",
    createdAt: "2023-12-25T14:20:00Z",
    views: 1523,
    clicks: 89,
    thumbnailUrl: getThumbnailUrl("Community"),
    embedUrl: "https://aksara.io/embed/member-directory",
  },
  {
    id: "9",
    title: "JavaScript Learning Path",
    description: "Interactive roadmap for mastering JavaScript development",
    category: "Learning",
    type: "active",
    createdAt: "2023-12-20T11:15:00Z",
    views: 3456,
    clicks: 278,
    thumbnailUrl: getThumbnailUrl("Learning"),
    embedUrl: "https://aksara.io/embed/js-learning-path",
  },
  {
    id: "10",
    title: "Book Club Event Calendar",
    description: "Monthly book club meetings and reading schedules",
    category: "Events",
    type: "draft",
    createdAt: "2023-12-18T16:30:00Z",
    views: 567,
    clicks: 45,
    thumbnailUrl: getThumbnailUrl("Events"),
    embedUrl: "https://aksara.io/embed/book-club-calendar",
  },
  {
    id: "11",
    title: "Author Spotlight Widget",
    description: "Featured authors with their top-rated books and bio",
    category: "Literature",
    type: "active",
    createdAt: "2023-12-15T10:00:00Z",
    views: 2234,
    clicks: 198,
    thumbnailUrl: getThumbnailUrl("Literature"),
    embedUrl: "https://aksara.io/embed/author-spotlight",
  },
  {
    id: "12",
    title: "Vue.js Tutorial Series",
    description: "Step-by-step Vue.js development tutorials and examples",
    category: "Technology",
    type: "active",
    createdAt: "2023-12-12T13:45:00Z",
    views: 4890,
    clicks: 612,
    thumbnailUrl: getThumbnailUrl("Technology"),
    embedUrl: "https://aksara.io/embed/vue-tutorials",
  },
  {
    id: "13",
    title: "Reading Challenge Tracker",
    description: "Annual reading challenge progress and community rankings",
    category: "Learning",
    type: "active",
    createdAt: "2023-12-10T09:20:00Z",
    views: 1876,
    clicks: 234,
    thumbnailUrl: getThumbnailUrl("Learning"),
    embedUrl: "https://aksara.io/embed/reading-challenge",
  },
]);

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
  activeEmbeds: embeds.value.filter((e) => e.type === "active").length,
  views30d: embeds.value.reduce((sum, e) => sum + e.views, 0),
  clicks30d: embeds.value.reduce((sum, e) => sum + e.clicks, 0),
  viewsTrend: 12.5, // Mock trend data
  clicksTrend: -3.2,
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

const handleEditEmbed = (embed: Embed) => {
  editingEmbed.value = embed;
  showModal.value = true;
};

const handleDuplicateEmbed = (embed: Embed) => {
  const newEmbed = {
    ...embed,
    id: Date.now().toString(),
    title: `${embed.title} (Copy)`,
    createdAt: new Date().toISOString(),
    views: 0,
    clicks: 0,
    type: "draft" as const,
  };
  embeds.value.push(newEmbed);
};

const handleDeleteEmbed = (embedId: string) => {
  if (confirm("Are you sure you want to delete this embed?")) {
    embeds.value = embeds.value.filter((e) => e.id !== embedId);
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

const handleSaveEmbed = (embedData: Partial<Embed>) => {
  if (editingEmbed.value) {
    // Update existing embed
    const index = embeds.value.findIndex(
      (e) => e.id === editingEmbed.value!.id,
    );
    if (index !== -1) {
      embeds.value[index] = { ...embeds.value[index], ...embedData };
    }
  } else {
    // Create new embed
    const newEmbed: Embed = {
      id: Date.now().toString(),
      title: embedData.title || "New Embed",
      description: embedData.description || "",
      category: embedData.category || "General",
      type: "draft",
      createdAt: new Date().toISOString(),
      views: 0,
      clicks: 0,
      ...embedData,
    };
    embeds.value.push(newEmbed);
  }
  handleCloseModal();
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
