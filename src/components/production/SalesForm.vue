<template>
  <FormSection title="Data Penjualan" description="Input data penjualan kontan, kredit, dan leasing">
    <!-- Slot untuk content -->
    <template #content>
      <FormField id="penjualan-kontan" label="Penjualan Kontan" type="number" v-model="salesData.kontan"
        placeholder="0" />
      <FormField id="penjualan-kredit" label="Penjualan Stok Kredit" type="number" v-model="salesData.kredit"
        placeholder="0" />
      <FormField id="penjualan-leasing" label="Penjualan Leasing" type="number" v-model="salesData.leasing"
        placeholder="0" />
    </template>

    <!-- Slot untuk footer -->
    <template #footer>
      <div class="footer-btn">
        <button class="btn btn-outline"> <i class="fas fa-save"></i> Simpan</button>
        <button class="btn btn-reset"><i class="fas fa-times-circle"></i> Reset</button>
      </div>
    </template>
  </FormSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import FormSection from '@/components/FormSection.vue'
import FormField from '@/components/FormField.vue'

interface SalesData {
  kontan: number
  kredit: number
  leasing: number
}

interface Props {
  modelValue: SalesData
}

interface Emits {
  (e: 'update:modelValue', value: SalesData): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const salesData = computed({
  get: () => props.modelValue,
  set: (value: SalesData) => emit('update:modelValue', value)
})
</script>
