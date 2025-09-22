<template>
  <FormSection title="Data Pendapatan" description="Input data mark up dan pendapatan lainnya">
    <template #content>
      <FormField id="markup-kontan" label="Mark Up Penjualan Kontan" type="number" v-model="incomeData.markupKontan"
        placeholder="0" />
      <FormField id="markup-kredit" label="Mark Up Penjualan Kredit" type="number" v-model="incomeData.markupKredit"
        placeholder="0" />
      <FormField id="realisasi-bunga" label="Realisasi Bunga" type="number" v-model="incomeData.realisasiBunga"
        placeholder="0" />
      <FormField id="diskon-bunga" label="Diskon Bunga" type="number" v-model="incomeData.diskonBunga"
        placeholder="0" />
      <FormField id="denda" label="Denda" type="number" v-model="incomeData.denda" placeholder="0" />
      <FormField id="administrasi" label="Administrasi" type="number" v-model="incomeData.administrasi"
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

interface IncomeData {
  markupKontan: number,
  markupKredit: number,
  realisasiBunga: number,
  diskonBunga: number,
  denda: number,
  administrasi: number
}

interface Props {
  modelValue: IncomeData
}

interface Emits {
  (e: 'update:modelValue', value: IncomeData): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const incomeData = computed({
  get: () => props.modelValue,
  set: (value: IncomeData) => emit('update:modelValue', value)
})
</script>