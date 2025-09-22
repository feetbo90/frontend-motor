<template>
    <div style="
      border: 1px solid #ddd;
      border-radius: 12px;
      padding: 16px;
      text-align: center;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
      background: white;
    ">
      <h3 style="margin: 0; font-size: 1.1rem;">{{ title }}</h3>
      <p style="font-size: 1.5rem; font-weight: bold; margin: 8px 0 0;">
        {{ value }}
      </p>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    title: string;
    value: string | number;
  }>();
  </script>
  