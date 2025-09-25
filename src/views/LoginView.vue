<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-background">
        <!-- <div class="background-pattern"></div> -->
        <div class="background-shapes">
          <div class="shape shape-1"></div>
          <div class="shape shape-2"></div>
          <div class="shape shape-3"></div>
        </div>
      </div>
      
      <div class="login-content">
        <div class="login-brand">
          <div class="brand-logo">
            <!-- <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg> -->
            <!-- <i  class="fas fa-trash"></i> -->
            <i class="fa-solid fa-motorcycle motorcycle-icon"></i>
          </div>
          <h1 class="brand-title">CV Pandu Motor</h1>
          <p class="brand-subtitle">Sistem Manajemen Keuangan</p>
        </div>
        <div class="login-form-container">
          <LoginForm />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import LoginForm from '@/components/LoginForm.vue'
</script>

<style scoped>
.login-page {
  width:100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

@media (max-width: 768px) {
  .login-page {
    overflow: auto;
    align-items: flex-start;
    padding: 1rem 0;
  }
}

.login-container {
  position: relative;
  width: 100%;
  max-width: 1200px;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 768px) {
  .login-container {
    height: auto;
    min-height: 100vh;
    align-items: flex-start;
    padding: 2rem 0;
  }
}

.login-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

/* .background-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  background-size: 100px 100px;
  animation: float 20s ease-in-out infinite;
} */

.background-shapes {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 15s ease-in-out infinite;
}

.shape-1 {
  width: 200px;
  height: 200px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 150px;
  height: 150px;
  top: 60%;
  right: 15%;
  animation-delay: 5s;
}

.shape-3 {
  width: 100px;
  height: 100px;
  bottom: 20%;
  left: 20%;
  animation-delay: 10s;
}

.login-content {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 4rem;
  width: 100%;
  max-width: 900px;
  padding: 2rem;
}

.login-brand {
  flex: 1;
  text-align: center;
  color: white;
  animation: slideInLeft 0.8s ease-out;
}

.brand-logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  margin-bottom: 1.5rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.brand-logo svg {
  color: white;
  width: 48px;
  height: 48px;
}

.brand-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.brand-subtitle {
  font-size: 1.125rem;
  opacity: 0.9;
  font-weight: 300;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

/* Animations */
@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  33% {
    transform: translateY(-20px) rotate(120deg);
  }
  66% {
    transform: translateY(10px) rotate(240deg);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .login-content {
    flex-direction: column;
    gap: 2rem;
    padding: 1rem;
  }
  
  .login-brand {
    order: 1;
    margin-bottom: 1rem;
  }
  
  .login-form-container {
    order: 2;
  }
  
  .brand-title {
    font-size: 2rem;
  }
  
  .brand-subtitle {
    font-size: 1rem;
  }
  
  .brand-logo {
    width: 60px;
    height: 60px;
  }
  
  .brand-logo svg {
    width: 36px;
    height: 36px;
  }
}

@media (max-width: 480px) {
  .login-container {
    padding: 1rem;
  }
  
  .brand-title {
    font-size: 1.75rem;
  }
  
  .shape {
    display: none;
  }
}

.motorcycle-icon {
  font-size: 50px;
  color: white;
}
</style>


