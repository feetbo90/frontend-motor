<template>
  <FormSection title="Sirkulasi Piutang" description="Input data sirkulasi piutang berdasarkan kategori">
    <template #content>
      <FormField id="piutang-lancar" label="Piutang Lancar" type="number" v-model="accountReceivableTurnover.lancar"
        placeholder="0" />
      <FormField id="piutang-kurang-lancar" label="Piutang Kurang Lancar" type="number"
        v-model="accountReceivableTurnover.kurangLancar" placeholder="0" />
      <FormField id="piutang-ragu-ragu" label="Piutang Ragu-ragu" type="number"
        v-model="accountReceivableTurnover.raguRagu" placeholder="0" />
      <FormField id="piutang-macet-baru" label="Piutang Macet Baru" type="number"
        v-model="accountReceivableTurnover.macetBaru" placeholder="0" />
      <FormField id="piutang-macet-lama" label="Piutang Macet Lama" type="number"
        v-model="accountReceivableTurnover.macetLama" placeholder="0" />
      <FormField id="total-piutang" label="Total Piutang" type="number" v-model="accountReceivableTurnover.totalPiutang"
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

interface AccountReceivableTuroverData {
  lancar: number,
  kurangLancar: number,
  raguRagu: number,
  macetBaru: number,
  macetLama: number,
  totalPiutang: number
}

interface Props {
  modelValue: AccountReceivableTuroverData
}

interface Emits {
  (e: 'update:modelValue', value: AccountReceivableTuroverData): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const accountReceivableTurnover = computed({
  get: () => props.modelValue,
  set: (value: AccountReceivableTuroverData) => emit('update:modelValue', value)
})
</script>