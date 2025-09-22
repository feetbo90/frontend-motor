<template>
    <FormSection title="Data Cadangan dan Nilai Sisa"
        description="Input data cadangan PH dan nilai sisa akumulasi penyusutan">
        <template #content>
            <div class="section-form">
                <div class="field-form">
                    <FormField id="cadangan-ph-piutang" label="Cadangan PH Piutang" type="number"
                        v-model="residualValueReserveData.cadanganPHPiutang" placeholder="0" />
                    <FormField id="macet-real" label="Macet Real" type="number"
                        v-model="residualValueReserveData.macetReal" placeholder="0" />
                    <FormField id="surplus-devisit" label="Surplus/Devisit" type="number"
                        v-model="residualValueReserveData.surplusDevisit" placeholder="0" />
                </div>
                <!-- Form Group untuk Cadangan PH Stok dan Keterangan -->
                <div class="form-group">
                    <h4 class="form-group-title">Informasi PH Stok</h4>
                    <div class="form-group-content">
                        <FormField id="cadangan-ph-stok" label="Cadangan PH Stok" type="number"
                            v-model="residualValueReserveData.cadanganPHStok" placeholder="0" />
                        <FormField id="keterangan" label="Keterangan Cadangan PH Stok" type="textarea"
                            v-model="residualValueReserveData.keterangan"
                            placeholder="Masukkan keterangan..." />
                    </div>
                </div>
            </div>
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
import { computed } from 'vue';
import FormSection from '../FormSection.vue';
import FormField from '../FormField.vue';

interface ResidualValueReserveData {
    cadanganPHPiutang: number,
    macetReal: number,
    surplusDevisit: number,
    cadanganPHStok: number,
    keterangan: string
}

interface Props {
    modelValue: ResidualValueReserveData
}

interface Emits {
    (e: 'update:modelValue', value: ResidualValueReserveData): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const residualValueReserveData = computed({
    get: () => props.modelValue,
    set: (value: ResidualValueReserveData) => emit('update:modelValue', value)
})

</script>
<style scoped>
.section-form {
    display: flex;
    flex-direction: column;
}

.field-form {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
}

.form-group {
    margin-top: 1.5rem;
    padding: 1.5rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    /* background-color: #f9fafb; */
    display: flex;
    flex-direction: column;
}

.form-group-title {
    margin: 0 0 1rem 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: #374151;
    border-bottom: 2px solid #e5e7eb;
    padding-bottom: 0.5rem;
}

.form-group-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

@media (min-width: 768px) {
    .form-group-content {
        flex-direction: row;
    }

    .form-group-content .form-field {
        flex: 1;
    }
}
</style>
