<template>
  <div class="profile-container">
    <div class="profile-header">
      <div class="profile-avatar-large">
        {{ user?.firstName?.charAt(0) || 'U' }}
      </div>
      <div class="profile-info">
        <h1 class="profile-name">{{ user?.firstName }} {{ user?.lastName }}</h1>
        <p class="profile-email">{{ user?.email }}</p>
        <span class="profile-role">{{ user?.role || 'User' }}</span>
      </div>
    </div>

    <div class="profile-content">
      <div class="profile-section">
        <h2 class="section-title">Personal Information</h2>
        <form @submit.prevent="submitProfile" class="profile-form">
          <div class="form-row">
            <div class="form-group">
              <label for="firstName" class="label">First Name</label>
              <input
                id="firstName"
                v-model="profileForm.firstName"
                type="text"
                class="input"
                required
              />
            </div>
            <div class="form-group">
              <label for="lastName" class="label">Last Name</label>
              <input
                id="lastName"
                v-model="profileForm.lastName"
                type="text"
                class="input"
                required
              />
            </div>
          </div>

          <div class="form-group">
            <label for="email" class="label">Email Address</label>
            <input
              id="email"
              v-model="profileForm.email"
              type="email"
              class="input"
              required
            />
          </div>

          <div v-if="profileError" class="error-message">
            {{ profileError }}
          </div>

          <div v-if="profileSuccess" class="success-message">
            Profile updated successfully!
          </div>

          <button
            type="submit"
            class="btn-primary"
            :disabled="profileLoading"
          >
            {{ profileLoading ? 'Updating...' : 'Update Profile' }}
          </button>
        </form>
      </div>

      <div class="profile-section">
        <h2 class="section-title">Change Password</h2>
        <form @submit.prevent="changePassword" class="profile-form">
          <div class="form-group">
            <label for="currentPassword" class="label">Current Password</label>
            <input
              id="currentPassword"
              v-model="passwordForm.currentPassword"
              type="password"
              class="input"
              required
            />
          </div>

          <div class="form-group">
            <label for="newPassword" class="label">New Password</label>
            <input
              id="newPassword"
              v-model="passwordForm.newPassword"
              type="password"
              class="input"
              required
            />
          </div>

          <div class="form-group">
            <label for="confirmPassword" class="label">Confirm New Password</label>
            <input
              id="confirmPassword"
              v-model="passwordForm.confirmPassword"
              type="password"
              class="input"
              required
            />
          </div>

          <div v-if="passwordError" class="error-message">
            {{ passwordError }}
          </div>

          <div v-if="passwordSuccess" class="success-message">
            Password changed successfully!
          </div>

          <button
            type="submit"
            class="btn-primary"
            :disabled="passwordLoading"
          >
            {{ passwordLoading ? 'Changing...' : 'Change Password' }}
          </button>
        </form>
      </div>

      <div class="profile-section danger-zone">
        <h2 class="section-title">Danger Zone</h2>
        <div class="danger-content">
          <div>
            <h3 class="danger-title">Delete Account</h3>
            <p class="danger-description">
              Once you delete your account, there is no going back. Please be certain.
            </p>
          </div>
          <button class="btn-danger" @click="confirmDelete">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const { user, updateProfile: updateProfileApi } = useAuth()

// Profile form
const profileForm = reactive({
  firstName: user.value?.firstName || '',
  lastName: user.value?.lastName || '',
  email: user.value?.email || ''
})

const profileLoading = ref(false)
const profileError = ref('')
const profileSuccess = ref('')

// Password form
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const passwordLoading = ref(false)
const passwordError = ref('')
const passwordSuccess = ref('')

// Update profile form when user data changes
watch(user, (newUser) => {
  if (newUser) {
    profileForm.firstName = newUser.firstName || ''
    profileForm.lastName = newUser.lastName || ''
    profileForm.email = newUser.email || ''
  }
}, { immediate: true })

const submitProfile = async () => {
  profileError.value = ''
  profileSuccess.value = ''
  profileLoading.value = true

  try {
    const success = await updateProfileApi({
      firstName: profileForm.firstName,
      lastName: profileForm.lastName,
      email: profileForm.email
    })
    
    if (success) {
      profileSuccess.value = 'Profile updated successfully!'
    }
  } catch (error: any) {
    profileError.value = error.message || 'Failed to update profile'
  } finally {
    profileLoading.value = false
  }
}

const changePassword = async () => {
  passwordError.value = ''
  passwordSuccess.value = ''

  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    passwordError.value = 'New passwords do not match'
    return
  }

  if (passwordForm.newPassword.length < 6) {
    passwordError.value = 'New password must be at least 6 characters'
    return
  }

  passwordLoading.value = true

  try {
    // TODO: Implement password change API call
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
    passwordSuccess.value = 'Password changed successfully!'
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
  } catch (error: any) {
    passwordError.value = error.message || 'Failed to change password'
  } finally {
    passwordLoading.value = false
  }
}

const confirmDelete = () => {
  const confirmed = confirm(
    'Are you sure you want to delete your account? This action cannot be undone.'
  )
  
  if (confirmed) {
    // TODO: Implement account deletion
    console.log('Account deletion confirmed')
  }
}
</script>

<style scoped>
.profile-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 32px;
  padding: 24px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.profile-avatar-large {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #4f46e5;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 32px;
}

.profile-name {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 4px;
}

.profile-email {
  font-size: 16px;
  color: #6b7280;
  margin-bottom: 8px;
}

.profile-role {
  font-size: 14px;
  color: #4f46e5;
  background-color: #eef2ff;
  padding: 4px 12px;
  border-radius: 16px;
  font-weight: 500;
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.profile-section {
  background: white;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 20px;
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.input {
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.btn-primary {
  background-color: #4f46e5;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background-color: #4338ca;
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
  color: #166534;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
}

.danger-zone {
  border: 1px solid #fecaca !important;
  background: #fef2f2 !important;
}

.danger-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.danger-title {
  font-size: 16px;
  font-weight: 600;
  color: #dc2626;
  margin-bottom: 4px;
}

.danger-description {
  font-size: 14px;
  color: #7f1d1d;
}

.btn-danger {
  background-color: #dc2626;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-danger:hover {
  background-color: #b91c1c;
}

@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .danger-content {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>