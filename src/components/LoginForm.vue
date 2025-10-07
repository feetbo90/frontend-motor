<template>
  <div class="login-form">
    <div class="login-header">
      <h1>Selamat Datang di App</h1>
      <p>Silakan masuk ke akun Anda</p>
    </div>

    <form @submit.prevent="handleLogin" class="form">
      <div class="form-group-login">
        <label for="email">Email</label>
        <input id="email" v-model="formData.email" type="email" placeholder="Masukkan email Anda" required
          :class="{ 'error': errors.email }" />
        <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
      </div>

      <div class="form-group-login">
        <label for="password">Password</label>
        <div class="password-input">
          <input id="password" v-model="formData.password" :type="showPassword ? 'text' : 'password'"
            placeholder="Masukkan password Anda" required :class="{ 'error': errors.password }" />
          <button type="button" @click="togglePassword" class="password-toggle" :class="{ 'active': showPassword }">
            <svg v-if="!showPassword" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path
                d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          </button>
        </div>
        <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
      </div>

      <div class="form-options">
        <label class="checkbox-container">
          <input v-model="formData.rememberMe" type="checkbox" />
          <span class="checkmark"></span>
          Ingat saya
        </label>
        <a href="#" class="forgot-password">Lupa password?</a>
      </div>

      <button type="submit" class="login-button" :disabled="isLoading">
        <span v-if="isLoading" class="loading-spinner"></span>
        {{ isLoading ? 'Memproses...' : 'Masuk' }}
      </button>
    </form>

    <div class="login-footer">
      <p>Belum punya akun?
        <router-link to="/auth/signup" class="register-link">
          Daftar di sini
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { loginApi } from '@/services/authService';
import { useAuthStore } from '@/stores/auth';
import type { AxiosError } from 'axios';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()
const authStore = useAuthStore()

const formData = reactive({
  email: '',
  password: '',
  rememberMe: false
})

const errors = reactive({
  email: '',
  password: ''
})

const showPassword = ref(false)
const isLoading = ref(false)

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const validateForm = () => {
  errors.email = ''
  errors.password = ''

  let isValid = true

  if (!formData.email) {
    errors.email = 'Email harus diisi'
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = 'Format email tidak valid'
    isValid = false
  }

  if (!formData.password) {
    errors.password = 'Password harus diisi'
    isValid = false
  } else if (formData.password.length < 6) {
    errors.password = 'Password minimal 6 karakter'
    isValid = false
  }

  return isValid
}

const handleLogin = async () => {
  if (!validateForm()) return;
  isLoading.value = true;
  errors.email = '';
  errors.password = '';
  try {
    const response = await loginApi({
      email: formData.email,
      password: formData.password
    });
  
    authStore.login({
      ...response.user,
      token: response.token,
      refreshToken: response.refreshToken
    });
    
    if (authStore.isAuthenticated)await router.replace('/')

  } catch (error) {
    const err = error as AxiosError<{ message?: string }>;
    if (err.response) {
      if (err.response.status === 401) {
        errors.email = 'Email atau password salah';
        errors.password = 'Email atau password salah';
      } else if (err.response.data && err.response.data.message) {
        errors.email = err.response.data.message;
      } else {
        errors.email = 'Terjadi kesalahan saat login';
      }
    } else {
      errors.email = 'Terjadi kesalahan saat login';
    }
    console.error('Login error:', error);
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
.login-form {
  max-width: 450px;
  width: 100%;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: left;
  margin-bottom: 2rem;
}

.login-header h1 {
  color: #1e293b;
  font-size: 1.875rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.login-header p {
  color: #64748b;
  font-size: 0.875rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group-login {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group-login label {
  color: #374151;
  font-weight: 500;
  font-size: 0.875rem;
}

.form-group-login input {
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.form-group-login input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-group-login input.error {
  border-color: #ef4444;
}

.password-input {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input input {
  width: 100%;
  padding-right: 3rem;
  /* Space for the toggle button */
}

.password-toggle {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: color 0.2s ease;
}

.password-toggle:hover {
  color: #374151;
}

.password-toggle.active {
  color: #3b82f6;
}

.error-message {
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
}

.checkbox-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #374151;
}

.checkbox-container input {
  margin-right: 0.5rem;
  width: auto;
}

.forgot-password {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
}

.forgot-password:hover {
  text-decoration: underline;
}

.login-button {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.875rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.login-button:hover:not(:disabled) {
  background: #2563eb;
  transform: translateY(-1px);
}

.login-button:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  transform: none;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.login-footer {
  text-align: center;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.login-footer p {
  color: #6b7280;
  font-size: 0.875rem;
}

.register-link {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
}

.register-link:hover {
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 480px) {
  .login-form {
    padding: 1.5rem;
    margin: 1rem;
  }

  .form-options {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}
</style>
