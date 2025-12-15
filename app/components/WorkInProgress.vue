<template>
  <section class="not-found">
    <img src="assets/images/WorkInProgress.png" style="width:480px;">
    <p class="eyebrow">Work In Progress</p>
    <h1>Oops, this feature is still in progress!</h1>
    <p class="body">
      We're still working on the feature you're looking for! Come back next time :O
    </p>
  </section>
</template>

<style scoped>
.not-found {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  padding: 0px 20px 40px;
  border-radius: 12px;
  margin-top: -16px;
  align-items: center;
  justify-items: center;
}

.eyebrow {
  padding: 0 2px;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-black);
  background-color: var(--color-highlight);
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
  color: var(--color-secondary);
  line-height: 1.6;
  text-align: center;
}

.back-home {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding: 8px 32px;
  border-radius:12px;
  background: var(--color-primary);
  color: #ffffff;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.2s ease;
}

.back-home:hover {
  background: var(--color-secondary);
}
</style>

