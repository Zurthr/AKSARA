<template>
  <div class="app-container">
    <Sidebar />
    <div class="content">
      <Navbar />
      <Slug>
        <slot />
      </Slug>
    </div>
  </div>
</template>

<style>
.app-container {
  display: flex;
  min-height: 100vh;
  overflow: hidden;
}

.content {
  flex: 1;
  margin-left: 240px;
  display: flex;
  flex-direction: column;
  width: calc(100vw - 240px);
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  align-items: center;
}
</style>

