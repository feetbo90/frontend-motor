<template>
  <div class="date-selector">
    <label class="form-label">{{ label }}</label>
    <div class="date-inputs">
      <div class="select-wrapper">
        <select 
          :id="`${id}-month`" 
          v-model="selectedMonth" 
          @change="handleChange"
          class="form-select"
        >
          <option value="" disabled>Pilih Bulan</option>
          <option 
            v-for="(month, index) in months" 
            :key="index" 
            :value="index + 1"
          >
            {{ month }}
          </option>
        </select>
        <i class="fas fa-chevron-down select-icon"></i>
      </div>
      
      <div class="select-wrapper">
        <select 
          :id="`${id}-year`" 
          v-model="selectedYear" 
          @change="handleChange"
          class="form-select"
        >
          <option value="" disabled>Pilih Tahun</option>
          <option 
            v-for="year in yearOptions" 
            :key="year" 
            :value="year"
          >
            {{ year }}
          </option>
        </select>
        <i class="fas fa-chevron-down select-icon"></i>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDate } from '@/composables/useDate'
import { ref, watch } from 'vue'

interface DateValue {
  month: number | null
  year: number | null
}

interface Props {
  id: string
  label: string
  modelValue: DateValue
}

interface Emits {
  (e: 'update:modelValue', value: DateValue): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Use date composable
const { monthOptions, getYearOptions } = useDate()
const months = monthOptions.map(option => option.label)
const yearOptions = getYearOptions(5).map(option => option.value)

const selectedMonth = ref<number | null>(props.modelValue.month)
const selectedYear = ref<number | null>(props.modelValue.year)

function handleChange() {
  const newValue: DateValue = {
    month: selectedMonth.value,
    year: selectedYear.value
  }
  emit('update:modelValue', newValue)
}

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  selectedMonth.value = newValue.month
  selectedYear.value = newValue.year
}, { deep: true })
</script>

<style scoped>
.date-selector {
  display: flex;
  flex-direction: column;
}

.form-label {
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}

.date-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.select-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.form-select {
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  background: #fafafa;
  appearance: none;
  cursor: pointer;
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
  color: var(--gray-500);
}

.select-icon {
  position: absolute;
  right: 1rem;
  color: var(--gray-500);
  pointer-events: none;
  font-size: 0.75rem;
}

/* Modern styling enhancements */
.form-select {
  background-image: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border: 2px solid transparent;
  background-clip: padding-box;
  position: relative;
}

.form-select::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 8px;
  z-index: -1;
  margin: -2px;
}

.form-select:focus {
  background: white;
  border-color: #3b82f6;
  box-shadow: 
    0 0 0 3px rgba(59, 130, 246, 0.1),
    0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* Responsive design */
@media (max-width: 640px) {
  .date-inputs {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
}
</style>
