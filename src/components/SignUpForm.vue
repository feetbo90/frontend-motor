<template>
  <div class="signup-form">
    <div class="signup-header">
      <h1>Selamat Datang di App</h1>
      <p>Silakan daftarkan ke akun Anda</p>
    </div>

    <form @submit.prevent="handleSubmit" class="form" autocomplete="off">
      <div class="form-group-signup">
        <label for="name">Name</label>
        <input id="name" v-model="formData.name" placeholder="Please insert your name" required
          :class="{ 'error': errors.name }" />
        <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
      </div>
      <div class="form-group-signup">
        <label for="email">Email</label>
        <input id="email" v-model="formData.email" type="email" placeholder="Masukkan email Anda" required
          autocomplete="off" :class="{ 'error': errors.email }" />
        <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
      </div>
      <div class="form-group-signup">
        <label for="password">Password</label>
        <div class="password-input">
          <input id="password" v-model="formData.password" :type="showPassword ? 'text' : 'password'"
            placeholder="Masukkan password Anda" required autocomplete="new-password"
            :class="{ 'error': errors.password }" />
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
      <div class="form-group-signup">
        <FormSelect required id="type" label="Tipe" v-model="formData.type" placeholder="Pilih Tipe"
          :options="optionsType" />
        <span v-if="errors.type" class="error-message">{{ errors.type }}</span>
      </div>
      <button type="submit" class="signup-button" :disabled="isLoading">
        <span v-if="isLoading" class="loading-spinner"></span>
        {{ isLoading ? 'Memproses...' : 'Daftar' }}
      </button>
    </form>

    <div class="signup-footer">
      <p>Sudah punya akun?
        <router-link to="/auth/login" class="register-link">
          Login
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNotification } from '@/composables/useNotification';
import { signupnApi } from '@/services/authService';
import { getEntities } from '@/services/entitiesService';
import type { AxiosError } from 'axios';
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import FormSelect, { type SelectOption } from './FormSelect.vue';

const router = useRouter()

const formData = reactive({
  name: '',
  email: '',
  password: '',
  type: '',
})

const errors = reactive({
  name: '',
  email: '',
  password: '',
  type: ''
})

const showPassword = ref(false)
const isLoading = ref(false)
const optionsType = ref<SelectOption[]>([])
const { notifyError, notifyWarning } = useNotification()

onMounted(async () => {
  fetchEntities()
})

const fetchEntities = async () => {
  try {
    const apiData = await getEntities()//TODO: jangan lupa dari BE harusnya tidak pakai token (authorization)
    const items = Array.isArray(apiData) ? apiData : []
    optionsType.value = items.map((item) => ({
      label: `${item.name} (${item.entity_type})`,
      value: item.id,
      name: item.entity_type
    }))
  } catch (error) {
    console.log(error)
  }
};

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const validateForm = () => {
  errors.email = ''
  errors.password = ''
  errors.type = ''

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

  if (!formData.type) {
    errors.type = 'Type harus diisi'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return;
  isLoading.value = true;
  errors.email = '';
  errors.password = '';
  errors.type = '';
  try {
    const findOption = optionsType.value.find((item) => item.value === formData.type)
    if (!findOption) {
      notifyError({ title: 'Error Message', msg: 'Tipe tidak ditemukan' })
      return
    }
    const response = await signupnApi({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      entity_type: findOption.name as string,
      entity_id: findOption?.value as string
    });
    if (response.user) {
      router.push('/auth/login')
    } else {
      notifyWarning({ title: 'Warning Message', msg: response.message })
    }
  } catch (error) {
    const err = error as AxiosError<{ message?: string }>;
    console.log({ err })
    if (err.status === 400) {
      errors.email = err.response?.data.message ?? 'Terjadi kesalahan saat register'
    }
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
.form-select {
  width: 100%;
  padding: 0.5rem;
  border: none;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 0.875rem;
}

.form-select:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.2);
}

.form-select option {
  background: #4a5568;
  color: white;
}

.signup-form {
  max-width: 450px;
  width: 100%;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.signup-header {
  text-align: left;
  margin-bottom: 2rem;
}

.signup-header h1 {
  color: #1e293b;
  font-size: 1.875rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.signup-header p {
  color: #64748b;
  font-size: 0.875rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group-signup {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group-signup label {
  color: #374151;
  font-weight: 500;
  font-size: 0.875rem;
}

.form-group-signup input {
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.form-group-signup input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-group-signup input.error {
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

.signup-button {
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

.signup-button:hover:not(:disabled) {
  background: #2563eb;
  transform: translateY(-1px);
}

.signup-button:disabled {
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

.signup-footer {
  text-align: center;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.signup-footer p {
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
  .signup-form {
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
