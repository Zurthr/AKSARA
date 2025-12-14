<template>
  <div class="auth-page">
    <div class="icon-wrapper">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="mail-icon">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
        <polyline points="22,6 12,13 2,6"></polyline>
      </svg>
    </div>

    <div class="header">
      <h1 class="title">Check your email</h1>
      <p class="subtitle">We sent a verification link to <br><strong>{{ email }}</strong></p>
    </div>

    <div class="actions">
      <button class="btn-primary" @click="handleOpenEmail">Open Email App</button>
      
      <p class="resend-text">
        Didn't receive the email? 
        <button class="btn-link" @click="handleResend">Click to resend</button>
      </p>
    </div>

    <p class="footer-text">
      <NuxtLink to="/auth/login" class="link back-link">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Back to Login
      </NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth'
});

// In a real app, this would come from the route query or state
const email = ref('user@example.com');

const handleOpenEmail = () => {
  // Logic to open email app or redirect
  console.log('Open email app');
};

const handleResend = () => {
  console.log('Resend verification email');
  // Logic to resend email
};
</script>

<style scoped>
.auth-page {
  display: flex;
  flex-direction: column;
  gap: 32px;
  align-items: center;
}

.icon-wrapper {
  width: 80px;
  height: 80px;
  background-color: #fefce8;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mail-icon {
  color: #eab308;
}

.header {
  text-align: center;
}

.title {
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 8px;
}

.subtitle {
  color: #64748b;
  font-size: 14px;
  line-height: 1.5;
}

.actions {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.btn-primary {
  width: 100%;
  background-color: #FFDA49;
  color: #0f172a;
  font-weight: 700;
  padding: 12px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  transition: transform 0.1s;
}

.btn-primary:active {
  transform: scale(0.98);
}

.resend-text {
  text-align: center;
  font-size: 14px;
  color: #64748b;
}

.btn-link {
  background: none;
  border: none;
  color: #0f172a;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
  font-size: inherit;
}

.btn-link:hover {
  text-decoration: underline;
}

.footer-text {
  text-align: center;
  font-size: 14px;
  color: #64748b;
}

.link {
  color: #0f172a;
  font-weight: 700;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.back-link {
  color: #64748b;
}

.back-link:hover {
  color: #0f172a;
}
</style>
