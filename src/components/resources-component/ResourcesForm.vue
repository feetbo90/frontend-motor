<template>
    <div class="sections-grid">
        <FormSection title="Data Sumber Daya Manusia (SDM)"
            description="Informasi jumlah dan formasi karyawan, formasi tenaga, aset dan inventaris">
            <template #content>
                <div class="section-form">
                    <!-- Karyawan Section -->
                    <FormField id="jumlah-karyawan" label="Jumlah Karyawan (orang)" type="number" v-if="!isCabangRole"
                        v-model="resourcesData.jumlahKaryawan" placeholder="0" />
                    <!-- Formasi Tenaga Section -->
                    <div class="form-group" v-if="!isCabangRole">
                        <h4 class="form-group-title">Detail Formasi Tenaga</h4>
                        <p>Breakdown kebutuhan tenaga kerja</p>
                        <div class="form-group-content">
                            <FormField id="pimpinan" label="Pimpinan" type="number"
                                v-model="resourcesData.formasi.pimpinan" placeholder="0" />
                            <FormField id="kasir" label="Kasir" type="number" v-model="resourcesData.formasi.kasir"
                                placeholder="0" />
                            <FormField id="administrasi" label="Administrasi" type="number"
                                v-model="resourcesData.formasi.administrasi" placeholder="0" />
                            <FormField id="pdl" label="PDL" type="number" v-model="resourcesData.formasi.pdl"
                                placeholder="0" />
                            <FormField id="formasi-kurang" label="Formasi Tenaga Kurang (orang)" type="number"
                                v-model="resourcesData.formasi.formasiKurang" placeholder="0" />
                        </div>
                    </div>
                    <!-- Aset dan Inventaris section -->
                    <div class="form-group"  v-if="isCabangRole">
                        <h4 class="form-group-title">Aset dan Inventaris</h4>
                        <p>Data kontrak dan inventaris perusahaan</p>
                        <div class="form-group-content">
                            <div class="section-form">
                                <div class="field-form">
                                    <FormField id="sisa-kontrak-kantor" label="Sisa Kontrak Kantor (bulan)" v-if="isCabangRole"
                                        type="number" v-model="resourcesData.sisaKontrakKantor" placeholder="0" />
                                    <FormField id="inventaris-mobil" label="Inventaris Mobil (unit)" type="number" v-if="isCabangRole"
                                        v-model="resourcesData.inventarisMobil" placeholder="0" />
                                </div>
                                <div class="form-group">
                                    <h4 class="form-group-title">Nilai Sisa Inventaris Pendirian</h4>
                                    <p>Data sisa inventaris dan penyusutan per {{ currentPeriod }}</p>
                                    <div class="form-group-content">
                                        <FormField id="nilai-sisa-inventaris" label="Sisa Inventaris Pendirian" v-if="isCabangRole"
                                            type="number" v-model="resourcesData.nilaiSisaInventaris" placeholder="0" />
                                        <FormField id="penyusutan-per-bulan" :label="`Nilai penyusutan per ${currentPeriod}`" v-if="isCabangRole"
                                            type="number" v-model="resourcesData.penyusutanPerBulan" placeholder="0" />
                                    </div>
                                </div>
                            </div>
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
    </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import FormField from '../FormField.vue';
import FormSection from '../FormSection.vue';
import { currentPeriod } from '@/stores/globalState';
import { useRole } from '@/composables/useRole';

interface ResourcesData {
    jumlahKaryawan: number,
    formasi: {
        pimpinan: number,
        kasir: number,
        administrasi: number,
        pdl: number
        formasiKurang: number,
    },
    sisaKontrakKantor: number,
    inventarisMobil: number,
    nilaiSisaInventaris: number,
    penyusutanPerBulan: number
}

interface Props {
    modelValue: ResourcesData
}

interface Emits {
    (e: 'update:modelValue', value: ResourcesData): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const resourcesData = computed({
    get: () => props.modelValue,
    set: (value: ResourcesData) => emit('update:modelValue', value)
})
// Role-based access control
const { hasRole } = useRole()
const isCabangRole = computed(() => hasRole('cabang'))


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
