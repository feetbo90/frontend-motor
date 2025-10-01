<template>
  <div class="form-field">
    <label :for="id" :class="['form-label', { 'label-error': error }]">{{ label }}   <span v-if="required" class="required">*</span> </label>
    <input :id="id" :type="type || 'text'" :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)" :class="['form-input', { 'has-error': error }]"
      :placeholder="placeholder" :readonly="readonly" :min="min" :max="max" :required="required"  />
      <p v-if="error" class="error-message">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  id: string
  label: string
  type?: string
  placeholder?: string
  modelValue: string | number
  readonly?: boolean
  min?: number
  max?: number
  required?: boolean
  error?: string | null
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

.form-input {
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  background: #fafafa;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  background: white;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input:hover {
  border-color: #d1d5db;
}

.form-input:read-only {
  background-color: var(--gray-200);
  cursor: not-allowed;
}

.form-input:read-only:focus {
  border-color: #e5e7eb;
  box-shadow: none;
}

.required {
  color: red;
  margin-left: 4px;
}
.has-error {
  border-color: red;
}
.label-error{
  color:red !important;
}
.error-message {
  margin-top: 0.5rem;
  color: red;
  font-size: 0.8rem;
}
</style>