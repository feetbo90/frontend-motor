<template>
    <FormSection title="Data Laba Rugi" description="Input data laba rugi dan modal perusahaan">
        <template #content>
            <FormField id="laba-rugi-bulan" :label="`Laba/Rugi Bulan ${currentPeriod}`" type="number"
                v-model="profitLostData.labaRugiBulan" placeholder="0" />
            <FormField id="laba-rugi-kumulatif" label="Jumlah Laba / Rugi Kumulatif" type="number"
                v-model="profitLostData.labaRugiKumulatif" placeholder="0" />
            <FormField id="penarikan-laba" label="Penarikan Laba" type="number" v-model="profitLostData.penarikanLaba"
                placeholder="0" />
            <FormField id="jumlah-modal" label="Jumlah Modal" type="number" v-model="profitLostData.jumlahModal"
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
import FormField from '@/components/FormField.vue'
import FormSection from '@/components/FormSection.vue'
import { currentPeriod } from '@/stores/globalState'
import { computed } from 'vue'

interface ProfitLostData {
    labaRugiBulan: number,
    labaRugiKumulatif: number,
    penarikanLaba: number,
    jumlahModal: number
}

interface Props {
    modelValue: ProfitLostData
}

interface Emits {
    (e: 'update:modelValue', value: ProfitLostData): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const profitLostData = computed({
    get: () => props.modelValue,
    set: (value: ProfitLostData) => emit('update:modelValue', value)
})

</script>
<style scoped></style>