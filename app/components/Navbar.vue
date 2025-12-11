<template>
  <header class="navbar">
    <div class="search-center">
        <div class="search-wrapper">
          <!-- TODO: replace with actual search icon component -->
          <span class="icon-placeholder">!</span>
          <input
            type="search"
            class="search-input"
            placeholder="Search something..."
          />
        </div>
    </div>
    <div class="action-icons">
      <!-- TODO: swap placeholders with bell/profile icons -->
      <button type="button" class="icon-button">!</button>
      
      <!-- Authentication actions -->
      <div v-if="!isAuthenticated" class="auth-buttons">
        <NuxtLink to="/auth/login" class="login-btn">Login</NuxtLink>
        <NuxtLink to="/auth/register" class="register-btn">Register</NuxtLink>
      </div>
      
      <div v-else class="user-menu">
        <ProfileDropdown />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const { isAuthenticated } = useAuth()
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
  color: #0f172a;
}

.search-input::placeholder {
  color: #94a3b8;
}

.action-icons {
  display: flex;
  align-items: center;
  gap: 12px;
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
}

.auth-buttons {
  display: flex;
  align-items: center;
  gap: 12px;
}

.login-btn {
  padding: 8px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  text-decoration: none;
  color: #374151;
  font-weight: 500;
  transition: all 0.2s;
}

.login-btn:hover {
  background-color: #f9fafb;
  border-color: #d1d5db;
}

.register-btn {
  padding: 8px 16px;
  background-color: #4f46e5;
  color: white;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;
}

.register-btn:hover {
  background-color: #4338ca;
}

.user-menu {
  display: flex;
  align-items: center;
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

