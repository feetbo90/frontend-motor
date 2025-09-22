<template>
    <div class="bar-chart">
      <div
        v-for="item in data"
        :key="item.label"
        class="bar-item"
      >
        <span>{{ item.label }}</span>
        <div class="bar">
          <div class="fill" :style="{ width: (item.value / maxValue * 100) + '%' }"></div>
        </div>
        <span class="value">{{ formatNumber(item.value) }}</span>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue';
  
  interface ChartItem {
    label: string;
    value: number;
  }
  
  const props = defineProps<{ data: ChartItem[] }>();
  
  const maxValue = computed(() => Math.max(...props.data.map(d => d.value)));
  
  function formatNumber(num: number) {
    return num.toLocaleString('id-ID');
  }
  </script>
  
  <style scoped>
  .bar-item {
    margin: 0.5rem 0;
  }
  
  .bar {
    background: #ddd;
    height: 20px;
    border-radius: 10px;
    overflow: hidden;
    margin: 0.2rem 0;
  }
  
  .fill {
    background: #4CAF50;
    height: 100%;
    transition: width 0.5s ease-in-out;
  }
  .value {
    font-size: 0.9rem;
    color: #333;
  }
  </style>
  