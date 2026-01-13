<template>
  <div class="form-field">
    <label :for="id" :class="['form-label', { 'label-error': error }]"
      >{{ label }} <span v-if="required" class="required">*</span>
    </label>
    <input
      :id="id"
      :type="inputType"
      :value="displayValue"
      @input="handleInput"
      v-bind="$attrs"
      :class="['form-input', { 'has-error': error }]"
      :placeholder="placeholder"
      :readonly="readonly"
      :min="min"
      :max="max"
      :required="required"
    />
    <p v-if="error" class="error-message">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

defineOptions({
  inheritAttrs: false,
});

const props = defineProps<{
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  modelValue: string | number;
  readonly?: boolean;
  min?: number;
  max?: number;
  required?: boolean;
  error?: string | null;
  format?: "currency" | "none";
  allowNegative?: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string | number];
}>();

// Format currency
const formatCurrency = (value: number | string): string => {
  let num: number;
  if (typeof value === "string") {
    // If it's already a formatted string, parse it first
    num = value.includes("Rp") ? parseCurrency(value) : parseFloat(value) || 0;
  } else {
    num = isNaN(value) ? 0 : value;
  }
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

// Format number with thousand separators (no currency symbol)
const formatNumber = (value: number | string): string => {
  let num: number;
  if (typeof value === "string") {
    // If it's already a formatted string, parse it first
    num = value.includes(".") ? parseNumber(value) : parseFloat(value) || 0;
  } else {
    num = isNaN(value) ? 0 : value;
  }
  return new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

// Parse number back to number (removes thousand separators)
const parseNumber = (value: string): number => {
  // Remove all dots (thousand separators)
  let cleanValue = value.replace(/\./g, "");
  // If allowNegative is true, keep minus sign at the start, otherwise remove all non-digits
  if (props.allowNegative) {
    const isNegative = cleanValue.startsWith("-");
    cleanValue = cleanValue.replace(/[^\d]/g, "");
    // Return 0 if empty string, otherwise parse as integer with sign
    if (cleanValue === "") return 0;
    return isNegative ? -parseInt(cleanValue, 10) : parseInt(cleanValue, 10);
  } else {
    cleanValue = cleanValue.replace(/[^\d]/g, "");
    // Return 0 if empty string, otherwise parse as integer
    return cleanValue === "" ? 0 : parseInt(cleanValue, 10);
  }
};

// Parse currency back to number
const parseCurrency = (value: string): number => {
  // If allowNegative is true, check for minus sign before removing non-digits
  if (props.allowNegative) {
    // Check if minus exists (could be at start or after currency symbol)
    const isNegative = /-/.test(value);
    // Remove all non-digit characters including currency symbols and separators
    const cleanValue = value.replace(/[^\d]/g, "");
    // Return 0 if empty string, otherwise parse as integer with sign
    if (cleanValue === "") return 0;
    return isNegative ? -parseInt(cleanValue, 10) : parseInt(cleanValue, 10);
  } else {
    // Remove all non-digit characters including currency symbols and separators
    const cleanValue = value.replace(/[^\d]/g, "");
    // Return 0 if empty string, otherwise parse as integer
    return cleanValue === "" ? 0 : parseInt(cleanValue, 10);
  }
};

// Input type based on format
const inputType = computed(() => {
  if ((props.format === "currency" || !props.format) && props.type === "number") {
    return "text";
  }
  return props.type || "text";
});

// Display value based on format
const displayValue = computed(() => {
  if (props.format === "currency" && props.type === "number") {
    return formatCurrency(props.modelValue);
  } else if (!props.format && props.type === "number") {
    return formatNumber(props.modelValue);
  }
  return props.modelValue;
});

// Handle input changes
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const value: string | number = target.value;

  if (props.format === "currency" && props.type === "number") {
    const numericValue = parseCurrency(value as string);
    // Update the display value after a short delay to avoid cursor jumping
    setTimeout(() => {
      target.value = formatCurrency(numericValue);
    }, 0);
    emit("update:modelValue", numericValue);
  } else if (!props.format && props.type === "number") {
    const numericValue = parseNumber(value as string);
    // Update the display value after a short delay to avoid cursor jumping
    setTimeout(() => {
      target.value = formatNumber(numericValue);
    }, 0);
    emit("update:modelValue", numericValue);
  } else {
    emit("update:modelValue", value);
  }
};
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
.label-error {
  color: red !important;
}
.error-message {
  margin-top: 0.5rem;
  color: red;
  font-size: 0.8rem;
}
</style>
