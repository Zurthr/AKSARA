<template>
  <div class="auth-page">
    <div class="header">
      <h1 class="title">Forgot Password?</h1>
      <p class="subtitle">No worries, we'll send you reset instructions.</p>
    </div>

    <form @submit.prevent="handleReset" class="auth-form">
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      
      <div v-if="success" class="success-message">
        {{ success }}
      </div>
      
      <div class="form-group">
        <label for="email" class="label">Email Address</label>
        <input 
          type="email" 
          id="email" 
          v-model="email"
          class="input" 
          placeholder="Enter your email"
          required
          :disabled="loading"
        >
      </div>

      <button type="submit" class="btn-primary" :disabled="loading || !email">
        {{ loading ? 'Sending...' : 'Send Reset Link' }}
      </button>
    </form>

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

const email = ref('');
const loading = ref(false);
const error = ref('');
const success = ref('');

const handleReset = async () => {
  error.value = '';
  success.value = '';
  loading.value = true;
  
  try {
    const response = await $fetch('/api/auth/forgot-password', {
      method: 'POST',
      body: {
        email: email.value
      }
    });
    
    success.value = 'Password reset link has been sent to your email address.';
    email.value = ''; // Clear form
  } catch (err: any) {
    error.value = err?.data?.message || err?.message || 'Failed to send reset email. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.auth-page {
  display: flex;
  flex-direction: column;
  gap: 32px;
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
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.label {
  font-size: 14px;
  font-weight: 600;
  color: #334155;
}

.input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  font-size: 14px;
  color: #0f172a;
  outline: none;
  transition: border-color 0.2s;
}

.input:focus {
  border-color: #FFDA49;
  box-shadow: 0 0 0 3px rgba(255, 218, 73, 0.2);
}

.btn-primary {
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

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
}

.success-message {
  background-color: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #16a34a;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
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
