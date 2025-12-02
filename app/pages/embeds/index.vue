<template>
  <div class="embeds-index">
    <main class="embeds-content">
      <div class="embeds-grid">
        <EmbedCard
          v-for="embed in embeds"
          :key="embed.id"
          :embed="embed"
          @edit="handleEditEmbed"
          @duplicate="handleDuplicateEmbed"
          @delete="handleDeleteEmbed"
          @get-link="handleGetLink"
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
    title: "Product Demo Widget",
    description: "Interactive product demonstration for landing pages",
    category: "Marketing",
    type: "active",
    createdAt: "2024-01-15T10:30:00Z",
    views: 1250,
    clicks: 89,
    thumbnailUrl: "data:image/svg+xml,%3Csvg width='80' height='60' viewBox='0 0 80 60' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='80' height='60' rx='8' fill='%23F3F4F6'/%3E%3Crect x='10' y='15' width='60' height='30' rx='4' fill='%233B5379'/%3E%3Ccircle cx='25' cy='30' r='8' fill='%23FFDA49'/%3E%3Cpath d='M40 25 L60 35 L60 25 Z' fill='white'/%3E%3C/svg%3E",
    embedUrl: "https://embed.example.com/product-demo",
  },
  {
    id: "2",
    title: "Newsletter Signup Form",
    description: "Convert visitors with our optimized signup form",
    category: "Lead Generation",
    type: "active",
    createdAt: "2024-01-10T14:20:00Z",
    views: 890,
    clicks: 156,
    thumbnailUrl: "data:image/svg+xml,%3Csvg width='80' height='60' viewBox='0 0 80 60' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='80' height='60' rx='8' fill='%23F3F4F6'/%3E%3Crect x='15' y='10' width='50' height='40' rx='4' fill='%233B5379'/%3E%3Crect x='22' y='18' width='36' height='3' rx='1' fill='white'/%3E%3Crect x='22' y='25' width='36' height='3' rx='1' fill='white'/%3E%3Crect x='22' y='32' width='24' height='3' rx='1' fill='white'/%3E%3Ccircle cx='58' cy='39' r='4' fill='%23FFDA49'/%3E%3C/svg%3E",
    embedUrl: "https://embed.example.com/newsletter",
  },
  {
    id: "3",
    title: "Social Media Feed",
    description: "Display your latest social media updates",
    category: "Social",
    type: "draft",
    createdAt: "2024-01-05T09:15:00Z",
    views: 45,
    clicks: 12,
    thumbnailUrl: "data:image/svg+xml,%3Csvg width='80' height='60' viewBox='0 0 80 60' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='80' height='60' rx='8' fill='%23F3F4F6'/%3E%3Crect x='10' y='10' width='60' height='40' rx='4' fill='%233B5379'/%3E%3Ccircle cx='20' cy='25' r='4' fill='%23FFDA49'/%3E%3Ccircle cx='20' cy='35' r='4' fill='%23FFDA49'/%3E%3Crect x='28' y='20' width='15' height='2' rx='1' fill='white'/%3E%3Crect x='28' y='25' width='25' height='2' rx='1' fill='white'/%3E%3Crect x='28' y='30' width='20' height='2' rx='1' fill='white'/%3E%3Crect x='28' y='35' width='30' height='2' rx='1' fill='white'/%3E%3C/svg%3E",
    embedUrl: "https://embed.example.com/social-feed",
  },
]);

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
