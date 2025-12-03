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
    thumbnailUrl: "data:image/svg+xml,%3Csvg width='80' height='60' viewBox='0 0 80 60' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='80' height='60' rx='8' fill='%23F3F4F6'/%3E%3Crect x='10' y='8' width='15' height='20' rx='2' fill='%233B5379'/%3E%3Crect x='28' y='8' width='15' height='20' rx='2' fill='%23FFDA49'/%3E%3Crect x='46' y='8' width='15' height='20' rx='2' fill='%233B5379'/%3E%3Ctext x='40' y='42' text-anchor='middle' font-size='8' fill='%236B7280' font-family='sans-serif'Best Books 2024%3C/text%3E%3C/svg%3E",
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
    thumbnailUrl: "data:image/svg+xml,%3Csvg width='80' height='60' viewBox='0 0 80 60' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='80' height='60' rx='8' fill='%23F3F4F6'/%3E%3Crect x='10' y='15' width='60' height='30' rx='4' fill='%233B5379'/%3E%3Ccircle cx='20' cy='30' r='8' fill='%23FFDA49'/%3E%3Ctext x='20' y='33' text-anchor='middle' font-size='8' fill='%231A1A1A' font-weight='bold' font-family='sans-serif'%3C/text%3E%3Cpath d='M30 28 L50 28 M30 32 L40 32' stroke='white' stroke-width='2'/%3E%3C/svg%3E",
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
    thumbnailUrl: "data:image/svg+xml,%3Csvg width='80' height='60' viewBox='0 0 80 60' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='80' height='60' rx='8' fill='%23F3F4F6'/%3E%3Crect x='10' y='12' width='60' height='36' rx='4' fill='%233B5379'/%3E%3Ccircle cx='18' cy='22' r='3' fill='%23FFDA49'/%3E%3Ccircle cx='18' cy='30' r='3' fill='%23FFDA49'/%3E%3Ccircle cx='18' cy='38' r='3' fill='%23FFDA49'/%3E%3Crect x='26' y='19' width='20' height='2' fill='white'/%3E%3Crect x='26' y='27' width='15' height='2' fill='white'/%3E%3Crect x='26' y='35' width='18' height='2' fill='white'/%3E%3Ctext x='40' y='55' text-anchor='middle' font-size='8' fill='%236B7280' font-family='sans-serif'Community Forum%3C/text%3E%3C/svg%3E",
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
    thumbnailUrl: "data:image/svg+xml,%3Csvg width='80' height='60' viewBox='0 0 80 60' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='80' height='60' rx='8' fill='%23F3F4F6'/%3E%3Crect x='15' y='10' width='50' height='40' rx='4' fill='%233B5379'/%3E%3Ccircle cx='25' cy='30' r='6' fill='%23FFDA49'/%3E%3Cpath d='M32 30 L50 30 M32 25 L45 25 M32 35 L48 35' stroke='white' stroke-width='2'/%3E%3Ctext x='40' y='55' text-anchor='middle' font-size='8' fill='%236B7280' font-family='sans-serif'Recommend AI%3C/text%3E%3C/svg%3E",
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
    thumbnailUrl: "data:image/svg+xml,%3Csvg width='80' height='60' viewBox='0 0 80 60' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='80' height='60' rx='8' fill='%23F3F4F6'/%3E%3Crect x='15' y='20' width='50' height='8' rx='4' fill='%23E5E7EB'/%3E%3Crect x='15' y='20' width='32' height='8' rx='4' fill='%23FFDA49'/%3E%3Ctext x='40' y='45' text-anchor='middle' font-size='8' fill='%236B7280' font-family='sans-serif'Progress: 64%25%3C/text%3E%3C/svg%3E",
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
    thumbnailUrl: "data:image/svg+xml,%3Csvg width='80' height='60' viewBox='0 0 80 60' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='80' height='60' rx='8' fill='%23F3F4F6'/%3E%3Crect x='10' y='10' width='18' height='24' rx='2' fill='%233B5379'/%3E%3Crect x='31' y='10' width='18' height='24' rx='2' fill='%23FFDA49'/%3E%3Crect x='52' y='10' width='18' height='24' rx='2' fill='%233B5379'/%3E%3Ctext x='40' y='48' text-anchor='middle' font-size='7' fill='%236B7280' font-family='sans-serif'Clean Code%3C/text%3E%3Ctext x='40' y='55' text-anchor='middle' font-size='7' fill='%236B7280' font-family='sans-serif'Top Dev Books%3C/text%3E%3C/svg%3E",
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
    thumbnailUrl: "data:image/svg+xml,%3Csvg width='80' height='60' viewBox='0 0 80 60' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='80' height='60' rx='8' fill='%23F3F4F6'/%3E%3Cpath d='M20 15 L30 25 L25 40 L15 40 L10 25 Z' fill='%233B5379'/%3E%3Cpath d='M50 15 L60 25 L55 40 L45 40 L40 25 Z' fill='%23FFDA49'/%3E%3Ctext x='40' y='52' text-anchor='middle' font-size='8' fill='%236B7280' font-family='sans-serif'Fantasy Books%3C/text%3E%3C/svg%3E",
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
    thumbnailUrl: "data:image/svg+xml,%3Csvg width='80' height='60' viewBox='0 0 80 60' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='80' height='60' rx='8' fill='%23F3F4F6'/%3E%3Ccircle cx='20' cy='20' r='6' fill='%233B5379'/%3E%3Ccircle cx='40' cy='20' r='6' fill='%23FFDA49'/%3E%3Ccircle cx='60' cy='20' r='6' fill='%233B5379'/%3E%3Crect x='12' y='30' width='16' height='8' rx='2' fill='%23E5E7EB'/%3E%3Crect x='32' y='30' width='16' height='8' rx='2' fill='%23E5E7EB'/%3E%3Crect x='52' y='30' width='16' height='8' rx='2' fill='%23E5E7EB'/%3E%3Ctext x='40' y='50' text-anchor='middle' font-size='8' fill='%236B7280' font-family='sans-serif'Members%3C/text%3E%3C/svg%3E",
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
    thumbnailUrl: "data:image/svg+xml,%3Csvg width='80' height='60' viewBox='0 0 80 60' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='80' height='60' rx='8' fill='%23F3F4F6'/%3E%3Crect x='10' y='15' width='60' height='4' rx='2' fill='%23E5E7EB'/%3E%3Crect x='10' y='25' width='50' height='4' rx='2' fill='%23FFDA49'/%3E%3Crect x='10' y='35' width='40' height='4' rx='2' fill='%233B5379'/%3E%3Ctext x='40' y='52' text-anchor='middle' font-size='8' fill='%236B7280' font-family='sans-serif'JavaScript Path%3C/text%3E%3C/svg%3E",
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
    thumbnailUrl: "data:image/svg+xml,%3Csvg width='80' height='60' viewBox='0 0 80 60' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='80' height='60' rx='8' fill='%23F3F4F6'/%3E%3Crect x='15' y='10' width='50' height='35' rx='4' fill='%233B5379'/%3E%3Crect x='22' y='18' width='36' height='4' rx='2' fill='%23FFDA49'/%3E%3Crect x='22' y='26' width='30' height='3' rx='1' fill='white'/%3E%3Crect x='22' y='32' width='25' height='3' rx='1' fill='white'/%3E%3Ctext x='40' y='54' text-anchor='middle' font-size='8' fill='%236B7280' font-family='sans-serif'Book Club%3C/text%3E%3C/svg%3E",
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
    thumbnailUrl: "data:image/svg+xml,%3Csvg width='80' height='60' viewBox='0 0 80 60' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='80' height='60' rx='8' fill='%23F3F4F6'/%3E%3Ccircle cx='25' cy='25' r='8' fill='%233B5379'/%3E%3Crect x='38' y='15' width='32' height='20' rx='4' fill='%23FFDA49'/%3E%3Ctext x='40' y='50' text-anchor='middle' font-size='8' fill='%236B7280' font-family='sans-serif'Author Spotlight%3C/text%3E%3C/svg%3E",
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
    thumbnailUrl: "data:image/svg+xml,%3Csvg width='80' height='60' viewBox='0 0 80 60' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='80' height='60' rx='8' fill='%23F3F4F6'/%3E%3Cpath d='M30 20 L50 20 L45 30 L35 30 Z' fill='%233B5379'/%3E%3Cpath d='M25 35 L55 35 L50 40 L30 40 Z' fill='%23FFDA49'/%3E%3Ctext x='40' y='52' text-anchor='middle' font-size='8' fill='%236B7280' font-family='sans-serif'Vue.js Tutorials%3C/text%3E%3C/svg%3E",
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
    thumbnailUrl: "data:image/svg+xml,%3Csvg width='80' height='60' viewBox='0 0 80 60' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='80' height='60' rx='8' fill='%23F3F4F6'/%3E%3Ccircle cx='40' cy='30' r='12' fill='none' stroke='%233B5379' stroke-width='4'/%3E%3Cpath d='M40 30 L40 20 M40 30 L48 36' stroke='%23FFDA49' stroke-width='2'/%3E%3Ctext x='40' y='52' text-anchor='middle' font-size='8' fill='%236B7280' font-family='sans-serif'Reading Challenge%3C/text%3E%3C/svg%3E",
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
