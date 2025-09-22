<template>
  <FormSection title="Sirkulasi Stock dan PK" description="Input data sirkulasi stock">
    <template #content>
      <FormField id="unit-awal" label="Jumlah Unit Awal" type="number" v-model="stockCirculation.unitAwal"
        placeholder="0" />
      <FormField id="pembelian-tambahan" label="Pembelian Tambahan" type="number"
        v-model="stockCirculation.pembelianTambahan" placeholder="0" />
      <FormField id="unit-terjual" label="Unit Terjual" type="number" v-model="stockCirculation.unitTerjual"
        placeholder="0" />
      <FormField id="unit-stok-akhir" label="Jumlah Unit Stok Akhir" type="number"
        v-model="stockCirculation.unitStokAkhir" placeholder="0" />
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

interface StockCirculationData {
  unitAwal: number,
  pembelianTambahan: number,
  unitTerjual: number,
  unitStokAkhir: number
}

interface Props {
  modelValue: StockCirculationData
}

interface Emits {
  (e: 'update:modelValue', value: StockCirculationData): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const stockCirculation = computed({
  get: () => props.modelValue,
  set: (value: StockCirculationData) => emit('update:modelValue', value)
})
</script>