<template>
    <div class="form-section">
      <div class="section-header">
        <h3>{{ title }}</h3>
        <p v-if="description">{{ description }}</p>
      </div>
      
      <div class="section-content">
        <slot name="content"></slot>
      </div>

      <div class="section-footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    title: string
    description?: string
  }>()

  </script>
  
  <style scoped>
  .form-section {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    margin-bottom: 2rem;
    transition: all 0.3s ease;
  }
  
  .form-section:hover {
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  }
  
  .section-header {
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #f1f5f9;
  }
  
  .section-header h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e293b;
  }
  
  .section-header p {
    margin: 0;
    color: #64748b;
    font-size: 0.875rem;
  }
  
  .section-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
  }

  .section-footer {
    margin-top: 2rem;
    padding-top: 1rem;
    border-top: 2px solid #f1f5f9;
    display: flex;
    justify-content: flex-end;
  }

  .save-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    color: white;
    border: none;
    border-radius: 8px;
    padding: 0.75rem 1.5rem;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
  }

  .save-button:hover {
    background: linear-gradient(135deg, #2563eb, #1e40af);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(59, 130, 246, 0.4);
  }

  .save-button:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
  }

  .save-button svg {
    flex-shrink: 0;
  }
  
  </style>