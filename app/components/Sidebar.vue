<template>
  <aside class="sidebar">
    <div class="brand">
      <img src="assets/images/AKSARALogo.png">
    </div>

    <nav class="nav">
      <ul class="nav-list">
        <li v-for="item in navItems" :key="item.label">
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
    </nav>
  </aside>
</template>

<script setup lang="ts">
const route = useRoute();

const navItems = [
  {
    label: 'Home',
    href: '/',
    icon: 'M12 3 4 9v10h5v-5h6v5h5V9z'
  },
  {
    label: 'Literature',
    href: '/literature',
    icon: 'M6 5h9a3 3 0 0 1 3 3v11l-3-2-3 2-3-2-3 2V8a3 3 0 0 1 3-3z'
  },
  {
    label: 'Community',
    href: '/community',
    icon: 'M5 13a3 3 0 1 1 3-3 3 3 0 0 1-3 3zm14-3a3 3 0 1 0-3 3 3 3 0 0 0 3-3zm-9 8a5 5 0 0 0-5-5H4a4 4 0 0 0-4 4v3h10zm3 0h10v-3a4 4 0 0 0-4-4h-1a5 5 0 0 0-5 5z'
  },
  {
    label: 'Forums',
    href: '/forums',
    icon: 'M4 4h16v10H7l-3 3z'
  },
  {
    label: 'Events',
    href: '/events',
    icon: 'M7 3v2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2V3h-2v2H9V3zm0 8h4v4H7z'
  },
  {
    label: 'Embeds',
    href: '/embeds',
    icon: 'M5 5h14v14H5zm2 2v10h10V7z'
  },
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
  padding: 24px 18px;
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

.brand {
  display: flex;
  gap: 12px;
  align-items: center;
}

.logo {
  width: 44px;
  height: 44px;
  border: 2px solid #00a09b;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(145deg, #e1f8f7, #ffffff);
}

.logo-dot {
  width: 16px;
  height: 16px;
  background: #00a09b;
  border-radius: 50%;
  display: inline-block;
}

.brand-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1c1c1c;
  margin: 0;
}

.brand-subtitle {
  font-size: 0.75rem;
  color: #666;
  margin: 0;
  letter-spacing: 0.02em;
}

.nav {
  flex: 1;
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
  color: #2f2f2f;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s, color 0.2s;
}

.nav-item:hover {
  background-color: #f5f5f5;
}

.nav-item.active {
  background-color: #f4c542;
  color: #2f2f2f;
  font-weight: 600;
}

.nav-icon {
  display: inline-flex;
  width: 18px;
  height: 18px;
  color: #4a4a4a;
}

.nav-icon svg {
  width: 100%;
  height: 100%;
}
</style>