<template>
  <div class="auth-page">
    <div class="header">
      <h1 class="title">Create Account</h1>
      <p class="subtitle">Join the community today</p>
    </div>

    <form @submit.prevent="handleRegister" class="auth-form">
      <div v-if="displayError" class="error-message">
        {{ displayError }}
      </div>
      
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

      <button type="submit" class="btn-primary" :disabled="loading">
        {{ loading ? 'Creating Account...' : 'Create Account' }}
      </button>
    </form>

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

const auth = useAuth()
const router = useRouter()

const form = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
});

const localError = ref('')
const loading = computed(() => auth.isLoading.value)
const displayError = computed(() => localError.value || auth.error.value || '')
const hasCompletedInterests = computed(() => {
  const scores = auth.user.value?.interestScores
  return !!scores && Object.keys(scores).length > 0
})

const handleRegister = async () => {
  localError.value = ''
  
  // Validation
  if (form.value.password !== form.value.confirmPassword) {
    localError.value = 'Passwords do not match'
    return
  }
  
  if (form.value.password.length < 8) {
    localError.value = 'Password must be at least 8 characters'
    return
  }
  
  const nameParts = form.value.name.trim().split(/\s+/)

  if (nameParts.length < 2) {
    localError.value = 'Please enter your full name (first and last name)'
    return
  }

  const firstName = nameParts[0]!
  const lastName = nameParts.slice(1).join(' ')
  
  const success = await auth.register({
    email: form.value.email,
    password: form.value.password,
    // Remove password_confirmation - backend doesn't expect it
    firstName,
    lastName
  })
  
  if (success) {
    await router.push('/auth/interests')
  } else {
    localError.value = auth.error.value || 'Registration failed. Please try again.'
  }
}

// Redirect if already authenticated
watchEffect(() => {
  if (!auth.isAuthenticated.value) return

  if (hasCompletedInterests.value) {
    router.replace('/')
  } else {
    router.replace('/auth/interests')
  }
});
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
