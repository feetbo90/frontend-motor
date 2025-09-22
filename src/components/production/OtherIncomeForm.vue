<template>
  <FormSection title="Pendapatan Lain-lain" description="Input data pendapatan lainnya">
    <template #content>
      <FormField id="penjualan-pk" label="Penjualan PK" type="number" v-model="otherIncomeData.penjualanPK"
        placeholder="0" />
      <FormField id="komisi" label="Komisi" type="number" v-model="otherIncomeData.komisi" placeholder="0" />
      <FormField id="denda-keterlambatan" label="Denda Keterlambatan" type="number"
        v-model="otherIncomeData.dendaKeterlambatan" placeholder="0" />
      <FormField id="diskon-denda" label="Diskon Denda" type="number" v-model="otherIncomeData.diskonDenda"
        placeholder="0" />
      <FormField id="jumlah-pendapatan-lain" label="Jumlah Pendapatan Lainnya" type="number"
        v-model="otherIncomeData.jumlahPendapatanLain" placeholder="0" />
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

interface OtherIncomeData {
  penjualanPK: number,
  komisi: number,
  dendaKeterlambatan: number,
  diskonDenda: number,
  jumlahPendapatanLain: number
}

interface Props {
  modelValue: OtherIncomeData
}

interface Emits {
  (e: 'update:modelValue', value: OtherIncomeData): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const otherIncomeData = computed({
  get: () => props.modelValue,
  set: (value: OtherIncomeData) => emit('update:modelValue', value)
})
</script>