<template>
  <nav class="navbar">
    <div class="navbar-content">
      <div class="navbar-left">
        <div class="page-info">
          <h3>{{ pageTitle }}</h3>
        </div>
      </div>
      
      <div class="navbar-right"  @click.stop="toggleUserMenu">
        <div class="user-info">
          <div class="user-avatar">
            <i class="fas fa-user"></i>
          </div>
          <div class="user-details">
            <span class="user-name">{{ userInfo.name }}</span>
            <span class="user-role">{{ userInfo.role }}</span>
          </div>
          <div class="user-menu">
            <button class="menu-toggle" @click.stop="toggleUserMenu">
              <i class="fas fa-chevron-down"></i>
            </button>
            <div v-if="showUserMenu" class="dropdown-menu">
              <a href="#" class="dropdown-item">
                <i class="fas fa-user-cog"></i>
                Profile
              </a>
              <a href="#" class="dropdown-item">
                <i class="fas fa-cog"></i>
                Settings
              </a>
              <hr class="dropdown-divider">
              <a href="#" class="dropdown-item logout" @click="logout">
                <i class="fas fa-sign-out-alt"></i>
                Logout
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const showUserMenu = ref(false)

// Computed property untuk mendapatkan page title dari route meta
const pageTitle = computed(() => {
  return route.meta?.title as string || 'CV. Pandu Motor'
})

// Helper function untuk format role display
const formatRole = (role: string): string => {
  const roleMap: Record<string, string> = {
    unit: 'Unit',
    cabang: 'Cabang',
    pusat: 'Pusat'
  }
  return roleMap[role] || role
}

// Computed property untuk user info dari auth store
const userInfo = computed(() => {
  const user = authStore.user.value
  if (user) {
    return {
      ...user,
      role: formatRole(user.role)
    }
  }
  return {
    name: 'Admin Pandu Motor',
    role: 'Administrator',
    email: 'admin@pandumotor.com'
  }
})

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const logout = () => {
  authStore.logout()
  router.push('/login')
  showUserMenu.value = false
}

// Close menu when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.user-menu')) {
    showUserMenu.value = false
  }
}

// Add event listener when component mounts
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 280px;
  right: 0;
  height: 70px;
  background: white;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  z-index: 100;
}

.navbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 2rem;
}

.page-info h3 {
  margin: 0;
  color: #1e293b;
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.2;
}

.page-subtitle {
  margin: 0;
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.2;
}

.navbar-right {
  display: flex;
  padding: 0.5rem;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  position: relative;
  cursor: pointer;
}

.navbar-right:hover {
  background: var(--gray-100);
  border-radius: var(--radius);
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.1rem;
}

.user-details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.user-name {
  font-weight: 600;
  color: #1e293b;
  font-size: 0.875rem;
  line-height: 1.2;
}

.user-role {
  color: #64748b;
  font-size: 0.75rem;
  line-height: 1.2;
}

.user-menu {
  position: relative;
}

.menu-toggle {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.menu-toggle:hover {
  background: #f1f5f9;
  color: #1e293b;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  padding: 0.5rem 0;
  margin-top: 0.5rem;
  z-index: 1000;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: #374151;
  text-decoration: none;
  font-size: 0.875rem;
  transition: background-color 0.2s ease;
}

.dropdown-item:hover {
  background: #f8fafc;
  color: #1e293b;
}

.dropdown-item.logout {
  color: #dc2626;
}

.dropdown-item.logout:hover {
  background: #fef2f2;
  color: #dc2626;
}

.dropdown-divider {
  margin: 0.5rem 0;
  border: none;
  border-top: 1px solid #e2e8f0;
}

/* Responsive */
@media (max-width: 768px) {
  .navbar {
    left: 0;
  }
  
  .navbar-content {
    padding: 0 1rem;
  }
  
  .page-info h3 {
    font-size: 1rem;
  }
  
  .page-subtitle {
    display: none;
  }
  
  .user-details {
    display: none;
  }
}
</style>
