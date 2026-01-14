<template>
  <div class="auth-page">
    <div class="header">
      <h1 class="title">Welcome Back</h1>
      <p class="subtitle">Please enter your details to sign in</p>
    </div>

    <form @submit.prevent="handleLogin" class="auth-form">
      <div v-if="displayError" class="error-message">
        {{ displayError }}
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

      <button type="submit" class="btn-primary" :disabled="loading">
        {{ loading ? 'Signing in...' : 'Sign In' }}
      </button>
    </form>

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

const auth = useAuth()
const router = useRouter()

const form = ref({
  email: '',
  password: '',
  rememberMe: false
});

const localError = ref('')
const loading = computed(() => auth.isLoading.value)

function mapAuthErrorMessage(message: string): string {
  const normalized = message.toLowerCase()

  if (normalized.includes('credential') || normalized.includes('password') || normalized.includes('unauthorized')) {
    return 'Email atau kata sandi yang Anda masukkan salah. Silakan periksa kembali.'
  }

  if (normalized.includes('email') && (normalized.includes('not') || normalized.includes('exist') || normalized.includes('found'))) {
    return 'Kami tidak menemukan akun dengan email tersebut. Silakan daftar terlebih dahulu.'
  }

  if (normalized.includes('inactive') || normalized.includes('verify') || normalized.includes('unverified')) {
    return 'Akun Anda belum aktif. Periksa email Anda untuk menyelesaikan verifikasi.'
  }

  if (normalized.includes('throttle') || normalized.includes('too many') || normalized.includes('attempt')) {
    return 'Terlalu banyak percobaan login. Coba lagi dalam beberapa menit.'
  }

  if (normalized.includes('network') || normalized.includes('status 5') || normalized.includes('server')) {
    return 'Terjadi masalah pada server. Silakan coba lagi nanti.'
  }

  return message
}

const displayError = computed(() => {
  const message = localError.value || auth.error.value || ''
  return message ? mapAuthErrorMessage(message) : ''
})

const handleLogin = async () => {
  localError.value = ''
  auth.clearError()

  const success = await auth.login({
    email: form.value.email,
    password: form.value.password
  })

  if (success) {
    const redirectTo = router.currentRoute.value.query.redirect as string || '/'
    await router.push(redirectTo)
    return
  }

  const fallbackMessage = auth.error.value || 'Login gagal. Silakan coba lagi.'
  localError.value = fallbackMessage
}

// Redirect if already authenticated
watchEffect(() => {
  if (auth.isAuthenticated.value) {
    router.push('/')
  }
})
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
