import { ref } from 'vue'

export type NotificationType = 'success' | 'info' | 'warning' | 'error'

export interface Notification {
  id: number
  type: NotificationType
  title: string
  message: string
}

const notifications = ref<Notification[]>([])
let idCounter = 0 // ✅ id unik untuk setiap notifikasi

export function useNotification() {
  function removeNotification(id: number) {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }

  function notify(type: NotificationType, title: string, message: string, timeout = 4000) {
    const id = ++idCounter
    notifications.value.push({ id, type, title, message })

    if (timeout > 0) {
      setTimeout(() => {
        removeNotification(id) // ✅ hapus notifikasi berdasarkan id, bukan index
      }, timeout)
    }
  }

  return {
    notifications,
    notifySuccess: ({ title, msg }: { title: string; msg: string }) => notify('success', title, msg),
    notifyInfo: ({ title, msg }: { title: string; msg: string }) => notify('info', title, msg),
    notifyWarning: ({ title, msg }: { title: string; msg: string }) => notify('warning', title, msg),
    notifyError: ({ title, msg }: { title: string; msg: string }) => notify('error', title, msg),
    removeNotification, // ✅ bisa dipanggil manual dari tombol close
    clearNotifications: () => (notifications.value = [])
  }
}
