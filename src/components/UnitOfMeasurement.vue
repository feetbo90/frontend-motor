<template>
    <div class="container">
        <div class="section-header">
            <h2>Tingkat Produksi</h2>
            <p>Analisis rata-rata pembiayaan, penjualan, markup, gaji, beban, dan laba/rugi</p>
        </div>
        <MessageAlert type="warning" title="Perhatian!"
            message="Silakan pastikan filter di menu sidebaryang Anda pilih sudah sesuai agar data yang ditampilkan akurat." />

        <div v-if="loading" class="loading">Loading...</div>

        <div v-else>
            <div v-for="entity in apiData.entityIds" :key="entity.id" class="entity-card">
                <!-- Header Collapsible -->
                <div class="entity-header" @click="toggleCollapse(entity.id)">
                    <span class="entity-name">{{ entity.name }}</span>
                    <span class="arrow" :class="{ rotated: !collapsed[entity.id] }">&#9654;</span>
                </div>

                <!-- Collapsible Content -->
                <transition name="slide-fade">
                    <div v-show="!collapsed[entity.id]" class="entity-content">
                        <!-- Rate Satu Dua Card -->
                        <div class="metric-card">
                            <div class="card-header blue">Rata-rata Pembiayaan & Penjualan / Unit</div>
                            <div class="card-body">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Bulan</th>
                                            <th>Pembiayaan / Unit</th>
                                            <th>Total Pembiayaan</th>
                                            <th>Penjualan / Unit</th>
                                            <th>Total Penjualan</th>
                                            <th>Total Unit Jual</th>
                                            <th>Total Unit</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="item in apiData.rate_satu_dua[entity.name] || []" :key="item.month">
                                            <td>{{ item.month }}/{{ item.year }}</td>
                                            <td>{{ formatCurrency(item.pembiayaan_per_unit) }}</td>
                                            <td>{{ formatCurrency(item.total_pembiayaan) }}</td>
                                            <td>{{ formatCurrency(item.penjualan_per_unit) }}</td>
                                            <td>{{ formatCurrency(item.total_penjualan) }}</td>
                                            <td>{{ formatCurrency(item.total_unit_jual) }}</td>
                                            <td>{{ formatCurrency(item.total_unit) }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <!-- Rate Tiga Card -->
                        <div class="metric-card">
                            <div class="card-header green">Rata-rata Penjualan / Karyawan</div>
                            <div class="card-body">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Bulan</th>
                                            <th>Total Penjualan</th>
                                            <th>Jumlah Karyawan</th>
                                            <th>Penjualan / Karyawan</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="item in apiData.rate_tiga[entity.name] || []" :key="item.month">
                                            <td>{{ item.month }}/{{ item.year }}</td>
                                            <td>{{ formatCurrency(item.total_penjualan) }}</td>
                                            <td>{{ item.jumlah_karyawan }}</td>
                                            <td>{{ formatCurrency(item.penjualan_per_karyawan) }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <!-- Rate Empat Card -->
                        <div class="metric-card">
                            <div class="card-header yellow">Rata-rata Markup / Karyawan</div>
                            <div class="card-body">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Bulan</th>
                                            <th>Total Markup</th>
                                            <th>Jumlah Karyawan</th>
                                            <th>Markup / Karyawan</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="item in apiData.rate_empat[entity.name] || []" :key="item.month">
                                            <td>{{ item.month }}/{{ item.year }}</td>
                                            <td>{{ formatCurrency(item.total_markup) }}</td>
                                            <td>{{ item.jumlah_karyawan }}</td>
                                            <td>{{ formatCurrency(item.rate_empat) }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <!-- Rate Lima Enam Tujuh Card -->
                        <div class="metric-card">
                            <div class="card-header purple">Rata-rata Gaji / Biaya / Beban Tetap / Karyawan</div>
                            <div class="card-body">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Bulan</th>
                                            <th>Gaji / Karyawan</th>
                                            <th>Beban Operasional / Karyawan</th>
                                            <th>Beban Tetap / Karyawan</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="item in apiData.rate_lima_enam_tujuh[entity.name] || []"
                                            :key="item.month">
                                            <td>{{ item.month }}/{{ item.year }}</td>
                                            <td>{{ formatCurrency(item.rate_gaji_per_karyawan) }}</td>
                                            <td>{{ formatCurrency(item.rate_beban_umum_operasional_per_karyawan) }}</td>
                                            <td>{{ formatCurrency(item.rate_penyusutan_aktiva_per_karyawan) }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                </transition>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue';
import { getProductRate } from '@/services/productRateService';
import { useAuthStore } from '@/stores/auth';
import { selectedMonth, selectedYear, isGlobalLoading, formatCurrency } from '@/stores/globalState';
import MessageAlert from './ui/MessageAlert.vue';
import type { entityIds, ProductRateData } from '@/types/productRate';

const authStore = useAuthStore();
const user = authStore.user.value;
const branchId = user?.entity_id;

const apiData = ref<ProductRateData>({
    success: false,
    entity_id: '',
    entityIds: [],
    rate_satu_dua: {},
    rate_tiga: {},
    rate_empat: {},
    rate_lima_enam_tujuh: {}
});
const loading = ref(false);

// Collapsed state per entity
const collapsed = reactive<Record<string, boolean>>({});

const toggleCollapse = (id: string) => {
    collapsed[id] = !collapsed[id];
};

const fetchList = async (year: number | undefined, month: number | undefined) => {
    try {
        loading.value = true;
        const response = await getProductRate({ year, month, branch_id: branchId });
        if (response.success) {
            apiData.value = response ?? {
                entity_id: '',
                entityIds: [],
                rate_satu_dua: {},
                rate_tiga: {},
                rate_empat: {},
                rate_lima_enam_tujuh: {}
            };
        }

        // set all collapsed true by default
        apiData.value.entityIds.forEach((e: entityIds) => {
            if (!(e.id in collapsed)) collapsed[e.id] = true;
        });
    } catch (err) {
        console.error(err);
    } finally {
        loading.value = false;
        isGlobalLoading.value = false;
    }
};

watch([selectedYear, selectedMonth], () => {
    const year = selectedYear.value !== '' ? Number(selectedYear.value) : undefined;
    const month = selectedMonth.value !== '' ? Number(selectedMonth.value) : undefined;
    fetchList(year, month);
});

onMounted(() => {
    if (!authStore.user?.value) return;
    const year = selectedYear.value !== '' ? Number(selectedYear.value) : undefined;
    const month = selectedMonth.value !== '' ? Number(selectedMonth.value) : undefined;
    if (year || month) {
        isGlobalLoading.value = true;
        fetchList(year, month);
    }
});
</script>

<style scoped>
.container {
    width: 100%;
    margin: 0 auto;
}

.section-header {
    text-align: center;
    margin-bottom: 32px;
}

.section-header h2 {
    font-size: 1.875rem;
    font-weight: bold;
    margin-bottom: 8px;
}

.section-header p {
    font-size: 0.875rem;
    color: #6b7280;
}

.loading {
    text-align: center;
    padding: 80px 0;
    color: #6b7280;
    font-weight: 500;
}

.entity-card {
    margin-bottom: 24px;
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
}

.entity-header {
    padding: 16px 24px;
    background-color: #f3f4f6;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 600;
}

.entity-header:hover {
    background-color: #e5e7eb;
}

.entity-name {
    font-size: 1.125rem;
    color: #111827;
}

.arrow {
    transition: transform 0.2s ease;
}

.arrow.rotated {
    transform: rotate(90deg);
}

.entity-content {
    padding: 24px;
    background-color: #fff;
}

.metric-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    margin-bottom: 24px;
    overflow: hidden;
}

.card-header {
    font-weight: 600;
    padding: 12px 16px;
    color: #fff;
}

.card-header.blue {
    background-color: #3b82f6;
}

.card-header.green {
    background-color: #10b981;
}

.card-header.yellow {
    background-color: #f59e0b;
}

.card-header.purple {
    background-color: #8b5cf6;
}

.card-body {
    padding: 20px;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    border: 1px solid #ddd;
    padding: 12px 16px;
}

thead th {
    text-align: left;
    background-color: #f9fafb;
    color: #374151;
}

td {
    text-align: right;
}

td:first-child {
    text-align: left;
}

tbody tr:hover {
    background-color: #f3f4f6;
}

/* Collapse animation */
.slide-fade-enter-active,
.slide-fade-leave-active {
    transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    max-height: 0;
    opacity: 0;
    padding: 0 24px;
}

.slide-fade-enter-to,
.slide-fade-leave-from {
    max-height: 2000px;
    opacity: 1;
    padding: 24px;
}
</style>