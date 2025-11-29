<template>
  <div class="auth-page">
    <div class="header">
      <h1 class="title">Create Account</h1>
      <p class="subtitle">Join the community today</p>
    </div>

    <form @submit.prevent="handleRegister" class="auth-form">
      <div class="form-group">
        <label for="name" class="label">Full Name</label>
        <input 
          type="text" 
          id="name" 
          v-model="form.name"
          class="input" 
          placeholder="Enter your full name"
          required
        >
      </div>

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
          placeholder="Create a password"
          required
        >
      </div>

      <div class="form-group">
        <label for="confirmPassword" class="label">Confirm Password</label>
        <input 
          type="password" 
          id="confirmPassword" 
          v-model="form.confirmPassword"
          class="input" 
          placeholder="Confirm your password"
          required
        >
      </div>

      <button type="submit" class="btn-primary">Sign Up</button>
    </form>

    <div class="divider">
      <span>Or continue with</span>
    </div>

    <button type="button" class="btn-google">
      <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" class="google-icon">
      Sign up with Google
    </button>

    <p class="footer-text">
      Already have an account? 
      <NuxtLink to="/auth/login" class="link">Sign in</NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth'
});

const form = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
});

const handleRegister = () => {
  console.log('Register attempt:', form.value);
  // TODO: Implement actual register logic
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
