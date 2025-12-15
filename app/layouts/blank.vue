<template>
  <div class="embed-root antialiased min-h-screen">
    <slot />
  </div>
</template>

<style>
/* Override default body margins for seamless embedding */
body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

/* Transparent background if you want the parent site color to show */
.embed-root {
  background: transparent;
}

/* Remove any default margins for embed content */
.embed-root * {
  box-sizing: border-box;
}
</style>