<template>
  <div id="app">
    <!-- Tampilkan layout utama jika sudah login -->
    <template v-if="isAuthenticated">
      <AppSidebar />
      <AppNavbar />
      <main class="main-content">
        <router-view />
        <AlertNotification 
        :notifications="notifications" 
        @close="(i: number) => notifications.splice(i, 1)" 
      />
      </main>
     
    </template>

    <!-- Tampilkan halaman login jika belum login -->
    <template v-else>
      <router-view />
    </template>
    <LoadingCard v-if="isGlobalLoading" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppSidebar from './components/AppSidebar.vue'
import AppNavbar from './components/AppNavbar.vue'
import { useAuthStore, initializeAuth } from './stores/auth'
import LoadingCard from './components/LoadingCard.vue'
import { isGlobalLoading } from './stores/globalState'
import { useNotification } from './composables/useNotification'
import AlertNotification from './components/ui/AlertNotification.vue'

const router = useRouter()
const authStore = useAuthStore()
const { notifications } = useNotification()
// Computed property untuk mengecek status authentication
const isAuthenticated = computed(() => {
  return authStore.isLoggedIn.value
})

// Initialize authentication state dan redirect
onMounted(async() => {
  isGlobalLoading.value = true; 
  await initializeAuth()

  // Redirect ke login jika tidak authenticated
  if (!isAuthenticated.value && router.currentRoute.value.path !== '/login') {
    router.push('/login')
  }

  isGlobalLoading.value = false; 
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f8fafc;
  color: #1e293b;
}

#app {
  display: flex;
  min-height: 100vh;
  /* background: blue; */
}

.main-content {
  margin-left: 280px;
  margin-top: 70px;
  display: flex;
  flex: 1;
  background: #f8fafc;
  min-height: calc(100vh - 70px);
}

/* Scrollbar Styling */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Responsive */
@media (max-width: 768px) {
  #app {
    flex-direction: column;
  }

  .main-content {
    margin-left: 0;
    margin-top: 130px;
    min-height: calc(100vh - 130px);
  }

  .sidebar {
    width: 100%;
    max-width: 100%;
    height: 60px;
    position: fixed;
    top: 0;
    z-index: 1000;
  }
}

/* Form Styles */
input,
select,
textarea {
  font-family: inherit;
}

button {
  font-family: inherit;
  cursor: pointer;
}

/* Animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-enter-active {
  animation: fadeIn 0.3s ease-out;
}
</style>