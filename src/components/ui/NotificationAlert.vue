<script setup lang="ts">

interface Notification {
  id: number
  type?: 'success' | 'warning' | 'error' | 'info'
  title?: string
  message: string
}

interface Props {
  notifications: Notification[]
}

const props = defineProps<Props>()
const emit = defineEmits(['close'])

function getColors(type: string | undefined) {
  switch (type) {
    case 'success':
      return {
        wave: '#4CAF5033',
        iconBg: '#4CAF5033',
        iconColor: '#388E3C',
        titleColor: '#388E3C'
      }
    case 'warning':
      return {
        wave: '#FFA30D3A',
        iconBg: '#FFA30D48',
        iconColor: '#DB970E',
        titleColor: '#DB970E'
      }
    case 'error':
      return {
        wave: '#FF4C4C33',
        iconBg: '#FF4C4C33',
        iconColor: '#C62828',
        titleColor: '#C62828'
      }
    default:
      return {
        wave: '#007BFF33',
        iconBg: '#007BFF33',
        iconColor: '#124fff',
        titleColor: '#124fff'
      }
  }
}
</script>

<template>
  <div class="notification-container">
    <TransitionGroup name="slide" tag="div">
      <div v-for="(notif) in props.notifications" :key="notif.id" class="card"  style="margin-top:5px;">
        <svg class="wave" viewBox="0 0 1440 320">
          <path :fill="getColors(notif.type).wave"
            d="M0,256L11.4,240C22.9,224,46,192,69,192C91.4,192,114,224,137,234.7C160,245,183,235,206,213.3C228.6,192,251,160,274,149.3C297.1,139,320,149,343,181.3C365.7,213,389,267,411,282.7C434.3,299,457,277,480,250.7C502.9,224,526,192,549,181.3C571.4,171,594,181,617,208C640,235,663,277,686,256C708.6,235,731,149,754,122.7C777.1,96,800,128,823,165.3C845.7,203,869,245,891,224C914.3,203,937,117,960,112C982.9,107,1006,181,1029,197.3C1051.4,213,1074,171,1097,144C1120,117,1143,107,1166,133.3C1188.6,160,1211,224,1234,218.7C1257.1,213,1280,139,1303,133.3C1325.7,128,1349,192,1371,192C1394.3,192,1417,128,1429,96L1440,64L1440,320L0,320Z" />
        </svg>

        <!-- Icon -->
        <div class="icon-container" :style="{ backgroundColor: getColors(notif.type).iconBg }">
          <svg v-if="notif.type === 'success'" viewBox="0 0 512 512" class="icon"
            :style="{ color: getColors(notif.type).iconColor }" fill="currentColor" stroke="currentColor">
            <path
              d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L369 209z" />
          </svg>

          <svg v-else-if="notif.type === 'warning'" viewBox="0 0 256 256" class="icon"
            :style="{ color: getColors(notif.type).iconColor }" fill="currentColor" stroke="currentColor">
            <path
              d="M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM120,144V104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,180Z" />
          </svg>

          <svg v-else-if="notif.type === 'error'" viewBox="0 0 512 512"
            :style="{ color: getColors(notif.type).iconColor }" class="icon" fill="currentColor" stroke="currentColor">
            <path
              d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c-9.4 9.4-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0z">
            </path>
          </svg>

          <svg v-else-if="notif.type === 'info'" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor"
            class="icon" :style="{ color: getColors(notif.type).iconColor }">
            <path
              d="M13 7.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-3 3.75a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v4.25h.75a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1 0-1.5h.75V12h-.75a.75.75 0 0 1-.75-.75Z">
            </path>
            <path
              d="M12 1c6.075 0 11 4.925 11 11s-4.925 11-11 11S1 18.075 1 12 5.925 1 12 1ZM2.5 12a9.5 9.5 0 0 0 9.5 9.5 9.5 9.5 0 0 0 9.5-9.5A9.5 9.5 0 0 0 12 2.5 9.5 9.5 0 0 0 2.5 12Z">
            </path>
          </svg>
        </div>

        <!-- Text -->
        <div class="message-text-container">
          <p class="message-text" :style="{ color: getColors(notif.type).titleColor }">
            {{ notif.title }}
          </p>
          <p class="sub-text">{{ notif.message }}</p>
        </div>

        <!-- Close -->
        <svg viewBox="0 0 15 15" class="cross-icon" @click="emit('close', notif.id)">
          <path fill="currentColor"
            d="M11.78 4.03c.22-.22.22-.58 0-.81a.57.57 0 0 0-.81 0L7.5 6.69 4.03 3.22a.57.57 0 0 0-.81 0c-.22.23-.22.59 0 .81L6.69 7.5l-3.47 3.47a.57.57 0 0 0 0 .81c.23.22.59.22.81 0L7.5 8.31l3.47 3.47c.22.22.58.22.81 0 .22-.22.22-.58 0-.81L8.31 7.5l3.47-3.47Z" />
        </svg>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.notification-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 100;
}

.card {
  width: 330px;
  height: 80px;
  border-radius: 8px;
  padding: 10px 15px;
  background-color: #fff;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  position: relative;
  display: flex;
  align-items: center;
  gap: 15px;
  overflow: hidden;
}

.wave {
  position: absolute;
  transform: rotate(90deg);
  left: -31px;
  top: 32px;
  width: 80px;
}

.icon-container {
  width: 35px;
  height: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
}

.icon {
  width: 17px;
  height: 17px;
}

.message-text-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.message-text {
  font-size: 17px;
  font-weight: 700;
  margin: 0;
}

.sub-text {
  font-size: 14px;
  color: #555;
  margin: 0;
}

.cross-icon {
  width: 18px;
  height: 18px;
  color: #555;
  cursor: pointer;
}
/* Animasi masuk/keluar */
.slide-enter-from {
  opacity: 0;
  transform: translateX(100%); /* mulai dari luar layar kanan */
}
.slide-enter-to {
  opacity: 1;
  transform: translateX(0);
}
.slide-leave-from {
  opacity: 1;
  transform: translateX(0);
}
.slide-leave-to {
  opacity: 0;
  transform: translateX(100%); /* keluar ke kanan lagi */
}
.slide-enter-active,
.slide-leave-active {
  transition: all 0.4s ease;
}
</style>
