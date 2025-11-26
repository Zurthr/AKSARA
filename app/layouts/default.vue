<template>
    <Sidebar />
    <div class="content">
      <Navbar />
      <Slug>
        <slot />
      </Slug>
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
  margin-left: 250px;
  display: flex;
  flex-direction: column;
  width: calc(100vw - 250px);
  overflow-x: hidden;
}
</style>

