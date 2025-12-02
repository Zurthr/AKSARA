<template>
  <aside class="sidebar">
    <div style="padding-left:4px;">
      <img src="assets/images/AKSARALogo.png" style="width:160px;">
    </div>

    <nav class="nav">
      <div v-for="group in navGroups" :key="group.label" class="nav-group">
        <div class="nav-group-label">{{ group.label }}</div>
        <ul class="nav-list">
          <li v-for="item in group.items" :key="item.label">
            <NuxtLink
              :to="item.href"
              class="nav-item"
              :class="{ active: isActive(item.href) }"
            >
              <img
                class="nav-icon"
                :src="item.icon"
                alt=""
                aria-hidden="true"
              >
              <span>{{ item.label }}</span>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
const route = useRoute();
import HomeIcon from '~/assets/icons/Home.svg';
import BookOpenIcon from '~/assets/icons/BookOpen.svg';
import Community from '~/assets/icons/Community.svg';
import Forum from '~/assets/icons/Forum.svg';
import Events from '~/assets/icons/Event.svg';
import Embeds from '~/assets/icons/Embed.svg';
import Bookmarks from '~/assets/icons/Bookmarks.svg';


const navGroups = [
  {
    label: 'Main',
    items: [
      {
        label: 'Home',
        href: '/',
        icon: HomeIcon
      },
      {
        label: 'Literature',
        href: '/literature',
        icon: BookOpenIcon
      }
    ]
  },
  {
    label: 'Communities',
    items: [
      {
        label: 'Community',
        href: '/community',
        icon: Community
      },
      {
        label: 'Forums',
        href: '/forums',
        icon: Forum
      },
      {
        label: 'Events',
        href: '/events',
        icon: Events
      }
    ]
  },
  {
    label: 'My Content',
    items: [
      {
        label: 'Embeds',
        href: '/embeds',
        icon: Embeds
      },
      {
        label: 'My Bookmarks',
        href: '/bookmarks',
        icon: Bookmarks
      }
    ]
  }
];

const isActive = (href: string) => {
  if (href === '/') {
    return route.path === '/';
  }
  return route.path.startsWith(href);
};
</script>

<style scoped>
.sidebar {
  width: 240px;
  min-height: 100vh;
  background-color: #fdfdfd;
  border-right: 1px solid #e0e0e0;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.05);
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 100;
}


.nav {
  flex: 1;
}

.nav-group {
  margin-bottom: 24px;
}

.nav-group:last-child {
  margin-bottom: 0;
}

.nav-group-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #64748b;
  padding: 0 12px;
  margin-bottom: 8px;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 8px;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  color: var(--color-black);
  text-decoration: none;
  font-weight: 400;
  transition: background-color 0.2s, color 0.2s;
}

.nav-item:hover {
  background-color: var(--color-tertiary);
}

.nav-item.active {
  background-color: var(--color-highlight);
  color: var(--color-black);
  font-weight: 600;
}

.nav-icon {
  display: inline-flex;
  width: 18px;
  height: 18px;
}

.nav-icon svg {
  width: 100%;
  height: 100%;
}
</style>