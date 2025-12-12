<template>
  <div class="right-sidebar-wrapper">
    <div class="right-sidebar">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.right-sidebar-wrapper {
  width: 348px;
  align-self: flex-start; /* ensure sticky calculates from the scroll container */
}

.right-sidebar {
  position: sticky;
  top: 80px;
  margin-top: 20px;
  width: 100%;
  padding-left: 0;
  margin-left: 24px;
}
</style>