<template>
  <div class="profile-dropdown" ref="templateRef">
    <button @click="toggleDropdown" class="profile-button">
      <div class="profile-avatar">
        {{ user?.firstName?.charAt(0) || 'U' }}
      </div>
      <span class="profile-name">{{ user?.firstName || 'User' }}</span>
      <svg class="dropdown-icon" :class="{ 'open': isOpen }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    
    <div v-if="isOpen" class="dropdown-menu">
      <div class="user-info">
        <div class="user-avatar">
          {{ user?.firstName?.charAt(0) || 'U' }}
        </div>
        <div class="user-details">
          <p class="user-name">{{ user?.firstName }} {{ user?.lastName }}</p>
          <p class="user-email">{{ user?.email }}</p>
          <span class="user-role">{{ user?.role || 'User' }}</span>
        </div>
      </div>
      
      <div class="dropdown-divider"></div>
      
      <nav class="dropdown-nav">
        <NuxtLink to="/profile" class="dropdown-item" @click="closeDropdown">
          <span class="item-icon">👤</span>
          Profile
        </NuxtLink>
        <NuxtLink to="/settings" class="dropdown-item" @click="closeDropdown">
          <span class="item-icon">⚙️</span>
          Settings
        </NuxtLink>
        <NuxtLink to="/dashboard" class="dropdown-item" @click="closeDropdown">
          <span class="item-icon">📊</span>
          Dashboard
        </NuxtLink>
      </nav>
      
      <div class="dropdown-divider"></div>
      
      <button @click="handleLogout" class="dropdown-item logout-item">
        <span class="item-icon">🚪</span>
        Logout
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user, logout } = useAuth()
const router = useRouter()

const isOpen = ref(false)
const templateRef = ref()

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const closeDropdown = () => {
  isOpen.value = false
}

const handleLogout = async () => {
  try {
    await logout()
    await router.push('/auth/login')
  } catch (error) {
    console.error('Logout failed:', error)
  }
  closeDropdown()
}

// Close dropdown when clicking outside
if (process.client) {
  onMounted(() => {
    document.addEventListener('click', (e) => {
      if (templateRef.value && !templateRef.value.contains(e.target as Node)) {
        isOpen.value = false
      }
    })
  })
}
</script>

<style scoped>
.profile-dropdown {
  position: relative;
}

.profile-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: none;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.profile-button:hover {
  background-color: #f3f4f6;
}

.profile-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #4f46e5;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
}

.profile-name {
  font-weight: 500;
  color: #374151;
}

.dropdown-icon {
  width: 16px;
  height: 16px;
  color: #6b7280;
  transition: transform 0.2s;
}

.dropdown-icon.open {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  min-width: 280px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  z-index: 50;
  overflow: hidden;
}

.user-info {
  padding: 16px;
  display: flex;
  gap: 12px;
  align-items: center;
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #4f46e5;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 18px;
}

.user-details {
  flex: 1;
}

.user-name {
  font-weight: 600;
  color: #111827;
  margin: 0 0 4px 0;
}

.user-email {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 4px 0;
}

.user-role {
  font-size: 12px;
  color: #4f46e5;
  background-color: #eef2ff;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 500;
}

.dropdown-divider {
  height: 1px;
  background-color: #e5e7eb;
}

.dropdown-nav {
  padding: 8px 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  text-decoration: none;
  color: #374151;
  font-size: 14px;
  transition: background-color 0.2s;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: #f3f4f6;
}

.logout-item {
  color: #dc2626;
  border-top: 1px solid #e5e7eb;
}

.logout-item:hover {
  background-color: #fef2f2;
}

.item-icon {
  font-size: 16px;
}
</style>