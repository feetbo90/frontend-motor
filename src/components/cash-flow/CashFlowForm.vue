<template>
    <div class="sections-grid">
        <FormSection title="Data Kas & Keuangan" description="Informasi Kas Tunai Dan Rekening Bank">
            <template #content>
                <div class="section-form">
                    <!-- Kas Tunai & Rekning Bank -->
                    <div class="form-group" style="margin-top: 0 !important;">
                        <h4 class="form-group-title">Detail Kas Tunai & Rekening Bank</h4>
                        <p>Informasi Data Kas Tunai & Rekening Bank</p>
                        <div class="form-group-content">
                            <div class="section-form">
                                <div class="field-form">
                                    <FormField id="kas-tunai" label="Kas Tunai" type="number"
                                        v-model="cashFlowData.kasTunai" placeholder="0" />
                                    <FormField id="rekening-bank" label="Rekening Bank" type="number"
                                        v-model="cashFlowData.rekeningBank" placeholder="0" />
                                </div>
                                <div class="calculated-field">
                                    <label>Jumlah Kas Lancar:</label>
                                    <span class="calculated-value">{{ formatCurrency(jumlahKasLancar) }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- BON Kas -->
                    <div class="form-group">
                        <h4 class="form-group-title">BON KAS</h4>
                        <p>Informasi Data berbagai jenis BON kas perusahaan</p>
                        <div class="form-group-content">
                            <div class="section-form">
                                <div class="field-form">
                                    <FormField id="bon-karyawan" label="BON Karyawan" type="number"
                                        v-model="cashFlowData.bonKaryawan" placeholder="0" />
                                    <FormField id="bin-pusat" label="BIN Pusat" type="number"
                                        v-model="cashFlowData.binPusat" placeholder="0" />
                                    <FormField id="bon-biaya-operasional" label="BON Biaya Operasional" type="number"
                                        v-model="cashFlowData.bonBiayaOps" placeholder="0" />
                                    <FormField id="bon-gantung" label="BON Gantung (BON Prive Karyawan)" type="number"
                                        v-model="cashFlowData.bonGantung" placeholder="0" />
                                </div>
                                <div class="calculated-field">
                                    <label>Jumlah Kas Macet:</label>
                                    <span class="calculated-value">{{ formatCurrency(jumlahKasMacet) }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="total-summary">
                        <span class="total-label">Total Saldo Akhir:</span>
                        <span class="total-amount">{{ formatCurrency(totalSaldoAkhir) }}</span>
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
    </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import FormField from '../FormField.vue';
import FormSection from '../FormSection.vue';
import { formatCurrency } from '@/stores/globalState';

interface CashFlowData {
    kasTunai: number,
    rekeningBank: number,
    bonKaryawan: number,
    binPusat: number,
    bonBiayaOps: number,
    bonGantung: number
}

interface Props {
    modelValue: CashFlowData
}

interface Emits {
    (e: 'update:modelValue', value: CashFlowData): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const cashFlowData = computed({
    get: () => props.modelValue,
    set: (value: CashFlowData) => emit('update:modelValue', value)
})

const jumlahKasLancar = computed(() => {
    return Number(cashFlowData.value.kasTunai) + Number(cashFlowData.value.rekeningBank)
})

const jumlahKasMacet = computed(() => {
    return Number(cashFlowData.value.bonKaryawan) +
        Number(cashFlowData.value.binPusat) +
        Number(cashFlowData.value.bonBiayaOps) +
        Number(cashFlowData.value.bonGantung)
})
const totalSaldoAkhir = computed(() => {
    return jumlahKasLancar.value + jumlahKasMacet.value
})

</script>
<style scoped>
.total-summary {
    margin-top:1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-lg);
    background: var(--primary);
    color: white;
    border-radius: var(--radius-md);
    font-size: 1.125rem;
}

.total-label {
    font-weight: 600;
}

.total-amount {
    font-weight: 800;
    font-size: 1.25rem;
}

.calculated-field {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: #f8fafc;
    border-radius: 8px;
    border-left: 4px solid #3b82f6;
    margin-top: 1rem;
    grid-column: 1 / -1;
}

.calculated-field label {
    font-weight: 600;
    color: #374151;
}

.calculated-value {
    font-weight: 700;
    color: #1e293b;
    font-size: 1.125rem;
}

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
    display: flex;
    flex-direction: column;
}

.form-group p {
    margin: 0;
    color: #64748b;
    font-size: 0.875rem;
    border-bottom: 2px solid #e5e7eb;
    padding-bottom: 1rem;
    margin-bottom: 2rem;
}

.form-group-title {
    margin: 0 0 8px 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: #374151;

}

.form-group-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
}

.sections-grid {
    display: grid;
    gap: 2rem;
    margin-bottom: 3rem;
}

.summary-section {
    margin-top: 2rem;
}

.summary-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 3rem;
}

.summary-card {
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    display: flex;
    align-items: center;
    gap: 1rem;
    transition: transform 0.3s ease;
}

.summary-card:hover {
    transform: translateY(-2px);
}

.summary-card .card-icon {
    width: 60px;
    height: 60px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    color: white;
}

.employees .card-icon {
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
}

.shortage .card-icon {
    background: linear-gradient(135deg, #f59e0b, #d97706);
}

.office .card-icon {
    background: linear-gradient(135deg, #10b981, #059669);
}

.vehicle .card-icon {
    background: linear-gradient(135deg, #8b5cf6, #7c3aed);
}

.card-content h4 {
    margin: 0 0 0.5rem 0;
    font-size: 0.875rem;
    font-weight: 500;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.number {
    margin: 0 0 0.25rem 0;
    font-size: 1.5rem;
    font-weight: 700;
    color: #1e293b;
}

.label {
    font-size: 0.75rem;
    color: #94a3b8;
}

.org-chart {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.org-chart h3 {
    margin: 0 0 2rem 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e293b;
    text-align: center;
}

.org-structure {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
}

.org-level {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
    justify-content: center;
}

.org-position {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    padding: 1.5rem;
    border-radius: 12px;
    text-align: center;
    min-width: 120px;
    position: relative;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.org-position i {
    display: block;
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
}

.org-position span {
    display: block;
    font-weight: 500;
    font-size: 0.875rem;
}

.org-position .count {
    position: absolute;
    top: -10px;
    right: -10px;
    background: #ef4444;
    color: white;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
}

@media (max-width: 768px) {
    .org-level {
        flex-direction: column;
        align-items: center;
    }
}
</style>
