<template>
  <section class="not-found">
    <img src="assets/images/404.png" style="width:480px;">
    <p class="eyebrow">Error 404</p>
    <h1>Oops, that page isn't available</h1>
    <p class="body">
      The link you followed might be broken or the page may have been removed.
    </p>
    <NuxtLink to="/" class="back-home">Back to dashboard</NuxtLink>
  </section>
</template>

<style scoped>
.not-found {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  padding: 16px 20px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
  align-items: center;
  justify-items: center;
}

.eyebrow {
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #f97316;
}

h1 {
  margin: 0;
  font-size: 32px;
  font-weight: 700;
  color: #111827;
}

.body {
  margin: 0;
  max-width: 420px;
  color: #4b5563;
  line-height: 1.6;
}

.back-home {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding: 10px 20px;
  border-radius: 999px;
  background: #2563eb;
  color: #ffffff;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.2s ease;
}

.back-home:hover {
  background: #1d4ed8;
}
</style>

