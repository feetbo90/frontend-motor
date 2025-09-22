<template>
    <div class="dashboard-card" :class="cardClass">
      <div class="card-icon">
        <i :class="icon"></i>
      </div>
      <div class="card-content">
        <h3>{{ title }}</h3>
        <p class="card-value">{{ formattedValue }}</p>
        <span class="card-label">{{ label }}</span>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  
  const props = defineProps<{
    title: string
    value: number
    label: string
    icon: string
    type: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  }>()
  
  const cardClass = computed(() => `card-${props.type}`)
  
  const formattedValue = computed(() => {
    if (props.type === 'info') {
      return props.value.toString() + ' orang'
    }
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(props.value)
  })
  </script>
  
  <style scoped>
  .dashboard-card {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    display: flex;
    align-items: center;
    gap: 1rem;
    transition: all 0.3s ease;
    border-left: 4px solid #e2e8f0;
  }
  
  .dashboard-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  }
  
  .card-icon {
    width: 60px;
    height: 60px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    color: white;
  }
  
  .card-content h3 {
    margin: 0 0 0.5rem 0;
    font-size: 0.875rem;
    font-weight: 500;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .card-value {
    margin: 0 0 0.25rem 0;
    font-size: 1.5rem;
    font-weight: 700;
    color: #1e293b;
  }
  
  .card-label {
    font-size: 0.75rem;
    color: #94a3b8;
  }
  
  .card-primary {
    border-left-color: #3b82f6;
  }
  .card-primary .card-icon {
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  }
  
  .card-success {
    border-left-color: #10b981;
  }
  .card-success .card-icon {
    background: linear-gradient(135deg, #10b981, #059669);
  }
  
  .card-warning {
    border-left-color: #f59e0b;
  }
  .card-warning .card-icon {
    background: linear-gradient(135deg, #f59e0b, #d97706);
  }
  
  .card-danger {
    border-left-color: #ef4444;
  }
  .card-danger .card-icon {
    background: linear-gradient(135deg, #ef4444, #dc2626);
  }
  
  .card-info {
    border-left-color: #8b5cf6;
  }
  .card-info .card-icon {
    background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  }
  </style>