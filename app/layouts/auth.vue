<template>
  <div class="auth-layout">
    <div class="auth-card">
       <div class="logo-wrapper">
          <NuxtLink to="/">
            <img src="~/assets/images/AKSARALogo.png" alt="AKSARA" class="logo" />
          </NuxtLink>
       </div>
      <slot />
    </div>
  </div>
</template>

<style scoped>
.auth-layout {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f8fafc;
  padding: 24px;
}

.auth-card {
  width: 100%;
  max-width: 440px;
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
}

.logo-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 32px;
}

.logo {
  height: 32px;
  width: auto;
}
</style>
