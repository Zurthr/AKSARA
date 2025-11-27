<template>
  <header class="navbar">
    <div class="search-wrapper">
      <!-- TODO: replace with actual search icon component -->
      <span class="icon-placeholder">!</span>
      <input
        type="search"
        class="search-input"
        placeholder="Search something..."
      />
    </div>
    <div class="action-icons">
      <!-- TODO: swap placeholders with bell/profile icons -->
      <button type="button" class="icon-button">!</button>
      <button type="button" class="icon-button">!</button>
    </div>
  </header>
</template>

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
  gap: 16px;
}

.search-wrapper {
  display: flex;
  height: 40px;
  padding: 8px 12px;
  align-items: center;
  gap: 10px;
  border-radius: 16px;
  width:465px;
  background-color: var(--color-light-blue);
}

.icon-placeholder {
  font-size: 14px;
  color: #94a3b8;
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

.icon-button:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
</style>

