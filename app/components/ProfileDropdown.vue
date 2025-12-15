<template>
  <Transition name="dropdown" appear>
    <div class="profile-dropdown" @click.stop>
      <div class="profile-dropdown-header">
        <div class="profile-info">
          <div class="profile-avatar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <div class="profile-details">
            <h4 class="profile-name">{{ user?.firstName }} {{ user?.lastName }}</h4>
            <p class="profile-email">{{ user?.email }}</p>
          </div>
        </div>
      </div>

      <div class="profile-dropdown-body">
        <div class="profile-menu">
          <NuxtLink to="/profile" class="profile-menu-item" @click="emit('close')">
            <div class="menu-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <span>Profile</span>
          </NuxtLink>

          <div class="profile-divider"></div>

          <button type="button" class="profile-menu-item" @click="handleLogout">
            <div class="menu-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </div>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const { user, logout } = useAuth()

const emit = defineEmits<{
  close: [];
}>();

const handleLogout = async () => {
  emit('close')
  await logout()
}
</script>

<style scoped>
.profile-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: white;
  border-radius: 12px;
  min-width: 280px;
  max-width: 320px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: 1px solid #e5e7eb;
  overflow: hidden;
  z-index: 1000;
}

.profile-dropdown-header {
  padding: 16px;
  border-bottom: 1px solid #f3f4f6;
  background: var(--color-white);
}

.profile-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.profile-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--color-light-blue);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
  flex-shrink: 0;
}

.profile-details {
  flex: 1;
  min-width: 0;
}

.profile-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-primary);
  margin: 0 0 2px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.profile-email {
  font-size: 13px;
  color: #64748b;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.profile-dropdown-body {
  padding: 8px 0;
  background: var(--color-white);
}

.profile-menu {
  display: flex;
  flex-direction: column;
}

.profile-menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  color: var(--color-primary);
  text-decoration: none;
  transition: all 0.2s ease;
  font-size: 14px;
}

.profile-menu-item:hover {
  background: var(--color-light-blue);
  text-decoration: none;
  color: var(--color-primary);
}

.profile-divider {
  height: 1px;
  background: #f3f4f6;
  margin: 8px 0;
}

.menu-icon {
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  flex-shrink: 0;
}

/* Dropdown transitions */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.15s ease;
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-8px) scale(0.95);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.95);
}

.dropdown-enter-active .profile-dropdown,
.dropdown-leave-active .profile-dropdown {
  transition: all 0.15s ease;
}

.dropdown-enter-from .profile-dropdown,
.dropdown-leave-to .profile-dropdown {
  transform: scale(0.95);
}

/* Responsive design */
@media (max-width: 640px) {
  .profile-dropdown {
    right: -8px;
    min-width: 260px;
    max-width: calc(100vw - 40px);
  }

  .profile-dropdown-header {
    padding: 14px;
  }

  .profile-avatar {
    width: 36px;
    height: 36px;
  }

  .profile-name {
    font-size: 14px;
  }

  .profile-email {
    font-size: 12px;
  }

  .profile-menu-item {
    padding: 8px 14px;
    font-size: 13px;
  }
}
</style>