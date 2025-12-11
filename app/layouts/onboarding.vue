<template>
  <div class="onboarding-layout">
    <header class="onboarding-header">
      <div class="onboarding-logo">
        <img src="assets/images/AKSARALogo.png" alt="AKSARA Logo">
      </div>
      <p class="onboarding-tagline">Akses Literasi Juara</p>
    </header>
    <main class="onboarding-content">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.onboarding-layout {
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 48px 24px;
}

.onboarding-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 32px;
}

.onboarding-logo img {
  height: 52px;
  width: auto;
}

.onboarding-tagline {
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.onboarding-content {
  width: 100%;
  max-width: 1200px;
}

@media (max-width: 768px) {
  .onboarding-layout {
    padding: 32px 16px;
  }

  .onboarding-tagline {
    font-size: 12px;
  }
}
</style>
