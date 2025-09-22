<template>
  <FormSection title="Piutang & Pembiayaan" description="Input data piutang dan pembiayaan">
    <template #content>
      <FormField id="saldo-piutang-awal" label="Saldo Piutang Awal" type="number" v-model="accountReceivable.saldoAwal"
        placeholder="0" />
      <FormField id="tambahan" label="Tambahan" type="number" v-model="accountReceivable.tambahan" placeholder="0" />
      <FormField id="realisasi-pokok" label="Realisasi Pokok" type="number" v-model="accountReceivable.realisasiPokok"
        placeholder="0" />
      <FormField id="realisasi-bunga-piutang" label="Realisasi Bunga" type="number"
        v-model="accountReceivable.realisasiBunga" placeholder="0" />
      <FormField id="jumlah-angsuran" label="Jumlah Angsuran" type="number" v-model="accountReceivable.jumlahAngsuran"
        placeholder="0" />
      <FormField id="saldo-piutang-akhir" label="Saldo Piutang Akhir" type="number"
        v-model="accountReceivable.saldoAkhir" placeholder="0" />
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

interface AccountReceivableData {
  saldoAwal: number,
  tambahan: number,
  realisasiPokok: number,
  realisasiBunga: number,
  jumlahAngsuran: number,
  saldoAkhir: number
}

interface Props {
  modelValue: AccountReceivableData
}

interface Emits {
  (e: 'update:modelValue', value: AccountReceivableData): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const accountReceivable = computed({
  get: () => props.modelValue,
  set: (value: AccountReceivableData) => emit('update:modelValue', value)
})
</script>