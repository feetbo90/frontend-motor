<template>
  <div class="form-field">
    <label :for="id" class="form-label">{{ label }}</label>
    <select 
      :id="id" 
      :value="modelValue"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
      class="form-select"
      :disabled="disabled"
    >
      <option value="" disabled>{{ placeholder || 'Pilih...' }}</option>
      <option 
        v-for="option in options" 
        :key="option.value" 
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
interface SelectOption {
  value: string | number
  label: string
}

defineProps<{
  id: string
  label: string
  placeholder?: string
  modelValue: string | number
  options: SelectOption[]
  disabled?: boolean
}>()

defineEmits<{
  'update:modelValue': [value: string | number]
}>()
</script>

<style scoped>
.form-field {
  display: flex;
  flex-direction: column;
}

.form-label {
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}

.form-select {
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  background: #fafafa;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.75rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}

.form-select:focus {
  outline: none;
  border-color: #3b82f6;
  background: white;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-select:hover {
  border-color: #d1d5db;
}

.form-select:disabled {
  background-color: var(--gray-200);
  cursor: not-allowed;
  opacity: 0.6;
}

.form-select:disabled:focus {
  border-color: #e5e7eb;
  box-shadow: none;
}

/* Custom styling for options */
.form-select option {
  padding: 0.5rem;
  background: white;
  color: #374151;
}

.form-select option:checked {
  background: #3b82f6;
  color: white;
}
</style>
