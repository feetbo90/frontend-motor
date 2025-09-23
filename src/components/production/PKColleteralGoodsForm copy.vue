<template>
  <FormSection title="Barang PK Jaminan" description="Input data barang PK jaminan">
    <template #content>
      <FormField id="unit-awal-pk" label="Jumlah Unit Awal" type="number" v-model="pkColleteralGoods.unitAwal"
        placeholder="0" />
      <FormField id="pk-tambahan" label="PK Tambahan" type="number" v-model="pkColleteralGoods.pkTambahan"
        placeholder="0" />
      <FormField id="unit-terjual-pk" label="Unit Terjual" type="number" v-model="pkColleteralGoods.unitTerjual"
        placeholder="0" />
      <FormField id="unit-pk" label="Jumlah Unit PK" type="number" v-model="pkColleteralGoods.unitPK" placeholder="0" />
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

interface PkColleteralGoods {
  unitAwal: number,
  pkTambahan: number,
  unitTerjual: number,
  unitPK: number
}

interface Props {
  modelValue: PkColleteralGoods
}

interface Emits {
  (e: 'update:modelValue', value: PkColleteralGoods): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const pkColleteralGoods = computed({
  get: () => props.modelValue,
  set: (value: PkColleteralGoods) => emit('update:modelValue', value)
})
</script>