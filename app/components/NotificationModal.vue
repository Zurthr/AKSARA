<template>
  <Transition name="dropdown" appear>
    <div class="notification-dropdown" @click.stop>
      <div class="notification-dropdown-header">
        <h3 class="notification-dropdown-title">Notifications</h3>
      </div>

      <div class="notification-dropdown-body">
        <div class="no-notifications">
          <div class="no-notifications-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </div>
          <h4 class="no-notifications-title">No notifications</h4>
          <p class="no-notifications-text">You're all caught up! Check back later for updates.</p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  close: [];
}>();
</script>

<style scoped>
.notification-dropdown {
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

.notification-dropdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
  background: var(--color-white);
}

.notification-dropdown-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-primary);
  margin: 0;
}

.notification-dropdown-body {
  padding: 24px 16px;
  background: var(--color-white);
}

.no-notifications {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 10px;
}

.no-notifications-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  margin-bottom: 4px;
}

.no-notifications-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-primary);
  margin: 0;
}

.no-notifications-text {
  font-size: 13px;
  color: #64748b;
  margin: 0;
  line-height: 1.4;
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

.dropdown-enter-active .notification-dropdown,
.dropdown-leave-active .notification-dropdown {
  transition: all 0.15s ease;
}

.dropdown-enter-from .notification-dropdown,
.dropdown-leave-to .notification-dropdown {
  transform: scale(0.95);
}

/* Responsive design */
@media (max-width: 640px) {
  .notification-dropdown {
    right: -8px;
    min-width: 260px;
    max-width: calc(100vw - 40px);
  }

  .notification-dropdown-header {
    padding: 10px 14px;
  }

  .notification-dropdown-body {
    padding: 20px 14px;
  }

  .no-notifications-icon {
    width: 36px;
    height: 36px;
  }

  .no-notifications-icon svg {
    width: 36px;
    height: 36px;
  }

  .no-notifications-title {
    font-size: 14px;
  }

  .no-notifications-text {
    font-size: 12px;
  }
}
</style>