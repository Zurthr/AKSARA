<template>
  <div class="auth-page">
    <div class="header">
      <h1 class="title">Welcome Back</h1>
      <p class="subtitle">Please enter your details to sign in</p>
    </div>

    <form @submit.prevent="handleLogin" class="auth-form">
      <div class="form-group">
        <label for="email" class="label">Email Address</label>
        <input 
          type="email" 
          id="email" 
          v-model="form.email"
          class="input" 
          placeholder="Enter your email"
          required
        >
      </div>

      <div class="form-group">
        <label for="password" class="label">Password</label>
        <input 
          type="password" 
          id="password" 
          v-model="form.password"
          class="input" 
          placeholder="Enter your password"
          required
        >
      </div>

      <div class="form-actions">
        <label class="checkbox-label">
          <input type="checkbox" v-model="form.rememberMe">
          <span>Remember me</span>
        </label>
        <NuxtLink to="/auth/forgot-password" class="forgot-link">Forgot Password?</NuxtLink>
      </div>

      <button type="submit" class="btn-primary">Sign In</button>
    </form>

    <div class="divider">
      <span>Or continue with</span>
    </div>

    <button type="button" class="btn-google">
      <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" class="google-icon">
      Sign in with Google
    </button>

    <p class="footer-text">
      Don't have an account? 
      <NuxtLink to="/auth/register" class="link">Sign up</NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth'
});

const form = ref({
  email: '',
  password: '',
  rememberMe: false
});

const handleLogin = () => {
  console.log('Login attempt:', form.value);
  // TODO: Implement actual login logic
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

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
  cursor: pointer;
}

.forgot-link {
  color: #0f172a;
  font-weight: 600;
  text-decoration: none;
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

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  color: #94a3b8;
  font-size: 12px;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #e2e8f0;
}

.divider span {
  padding: 0 12px;
}

.btn-google {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background-color: white;
  border: 1px solid #e2e8f0;
  color: #0f172a;
  font-weight: 600;
  padding: 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-google:hover {
  background-color: #f8fafc;
}

.google-icon {
  width: 20px;
  height: 20px;
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
}
</style>
