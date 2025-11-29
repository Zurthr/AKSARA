<template>
  <div class="auth-layout">
    <div class="auth-container">
      <div class="brand-section">
        <img src="assets/images/AKSARALogo.png" alt="AKSARA Logo" class="auth-logo">
      </div>
      <div class="auth-card">
        <slot />
      </div>
      <div class="auth-footer">
        <p>&copy; {{ new Date().getFullYear() }} AKSARA. All rights reserved.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-layout {
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8fafc;
  padding: 24px;
}

.auth-container {
  width: 100%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
}

.auth-logo {
  height: 48px;
  width: auto;
}

.auth-card {
  width: 100%;
  background: white;
  padding: 40px;
  border-radius: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.auth-footer {
  color: #94a3b8;
  font-size: 14px;
}
</style>
