<template>
    <div v-if="visible" class="alert-container" :class="type">
      <span class="alert-icon">{{ icon }}</span>
      <div class="alert-content">
        <strong>{{ title }}</strong>
        <p>{{ message }}</p>
      </div>
      <!-- <button class="alert-close" @click="closeAlert">&times;</button> -->
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, defineProps } from 'vue';
  
  interface AlertProps {
    title?: string;
    message?: string;
    type?: 'success' | 'warning' | 'error' | 'info';
  }
  
  const props = defineProps<AlertProps>();
  
  const visible = ref(true);
  
  // const closeAlert = () => {
  //   visible.value = false;
  // }
  
  // Default values
  const title = props.title || 'Perhatian!';
  const message = props.message || 'Pastikan filter yang Anda pilih sudah sesuai.';
  const type = props.type || 'warning';
  
  // Icon sesuai tipe
  const iconMap: Record<string, string> = {
    success: '✔️',
    warning: '⚠️',
    error: '❌',
    info: 'ℹ️'
  };
  
  const icon = iconMap[type];
  </script>
  
  <style scoped>
  .alert-container {
    display: flex;
    align-items: flex-start;
    padding: 1rem 1.25rem;
    border-radius: 6px;
    border: 1px solid;
    position: relative;
    margin-bottom: 1rem;
    font-family: Arial, sans-serif;
  }
  
  .alert-container .alert-icon {
    font-size: 1.5rem;
    margin-right: 0.75rem;
    line-height: 1;
  }
  
  .alert-container .alert-content strong {
    display: block;
    margin-bottom: 0.25rem;
    font-size: 1rem;
  }
  
  .alert-container .alert-content p {
    margin: 0;
    font-size: 0.875rem;
    color: #333;
  }
  
  .alert-container .alert-close {
    position: absolute;
    top: 0.25rem;
    right: 0.5rem;
    background: transparent;
    border: none;
    font-size: 1.25rem;
    cursor: pointer;
    line-height: 1;
  }
  
  /* Tipe alert */
  .alert-container.success {
    background-color: #e6f4ea;
    border-color: #34a853;
    color: #1e4620;
  }
  
  .alert-container.warning {
    background-color: #fff4e5;
    border-color: #fbbc04;
    color: #664d03;
  }
  
  .alert-container.error {
    background-color: #fdecea;
    border-color: #ea4335;
    color: #611a15;
  }
  
  .alert-container.info {
    background-color: #e8f0fe;
    border-color: #4285f4;
    color: #1a3c85;
  }
  </style>
  