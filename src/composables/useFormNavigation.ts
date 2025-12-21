import { ref } from "vue";

/**
 * Composable untuk navigasi form dengan keyboard
 * Memungkinkan perpindahan fokus antar input field menggunakan Enter key
 */
export function useFormNavigation() {
  const submitButton = ref<HTMLButtonElement | null>(null);

  /**
   * Memindahkan fokus ke input field berikutnya berdasarkan ID
   * @param nextId - ID dari input field berikutnya
   */
  function focusNextInput(nextId: string) {
    const nextInput = document.getElementById(nextId);
    if (nextInput) {
      nextInput.focus();
      // Untuk input number, pilih semua teks agar mudah diisi ulang
      if (nextInput instanceof HTMLInputElement) {
        nextInput.select();
      }
    }
  }

  /**
   * Memindahkan fokus ke tombol submit
   */
  function focusSubmitButton() {
    if (submitButton.value) {
      submitButton.value.focus();
    }
  }

  return {
    submitButton,
    focusNextInput,
    focusSubmitButton,
  };
}
