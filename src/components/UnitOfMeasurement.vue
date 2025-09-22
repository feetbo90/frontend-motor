<template>
    <div class="">
        <div class="section-header">
            <h2>Tingkat Produksi</h2>
            <p>Analisis rata-rata pembiayaan, penjualan, markup, gaji, beban dan laba/rugi</p>
        </div>

        <!-- Rata-rata Per Unit -->
        <div class="metric-card" style="margin-bottom: 2rem;">
            <div class="card-header">
                <i class="fas fa-box"></i>
                <h3>Rata-rata Per Unit</h3>
            </div>
            <div class="metric-values">
                <div class="metric-item">
                    <span class="label">Pembiayaan / Unit:</span>
                    <span class="value">{{ formatCurrency(0) }}</span>
                </div>
                <div class="metric-item">
                    <span class="label">Penjualan / Unit:</span>
                    <span class="value">{{ formatCurrency(0) }}</span>
                </div>
            </div>
        </div>
        <div class="metrics-grid">
            <!-- Rata-rata Per Karyawan -->
            <div class="metric-card">
                <div class="card-header">
                    <i class="fas fa-chalkboard-teacher"></i>
                    <h3>Rata-rata Per Karyawan</h3>
                </div>
                <div class="metric-values">
                    <div class="metric-item">
                        <span class="label">Penjualan / Karyawan:</span>
                        <span class="value">{{ formatCurrency(0) }}</span>
                    </div>
                    <div class="metric-item">
                        <span class="label">Mark up / Karyawan:</span>
                        <span class="value">{{ formatCurrency(0) }}</span>
                    </div>
                    <div class="metric-item">
                        <span class="label">Biaya Operasional / Karyawan:</span>
                        <span class="value">{{ formatCurrency(0) }}</span>
                    </div>
                    <div class="metric-item">
                        <span class="label">Gaji / Karyawan:</span>
                        <span class="value">{{ formatCurrency(0) }}</span>
                    </div>
                    <div class="metric-item">
                        <span class="label">Beban Tetap / Karyawan:</span>
                        <span class="value">{{ formatCurrency(0) }}</span>
                    </div>
                    <div class="metric-item">
                        <span class="label">Laba/Rugi Net / Karyawan:</span>
                        <span class="value">{{ formatCurrency(0) }}</span>
                    </div>
                </div>
            </div>


            <!-- Rata-rata Per Satuan Kerja -->
            <div class="metric-card">
                <div class="card-header">
                    <i class="fas fa-building"></i>
                    <h3>Rata-rata Per Satuan Kerja</h3>
                </div>
                <div class="metric-values">
                    <div class="metric-item">
                        <span class="label">Beban Tetap / Satuan Kerja:</span>
                        <span class="value">{{ 0 }}%</span>
                    </div>
                    <div class="metric-item">
                        <span class="label">Laba/Rugi Net / Satuan Kerja:</span>
                        <span class="value">{{ 0 }}%</span>
                    </div>
                    <div class="metric-item">
                        <span class="label">PH & Penyusutan / Satuan Kerja:</span>
                        <span class="value">{{ 0 }}%</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Rasio Produksi -->
    <div class="ratio-section">
        <div class="section-header">
            <h2>Rasio-rasio Produksi</h2>
            <p>Analisis perbandingan komponen keuangan</p>
        </div>

        <div class="ratio-grid">
            <div class="ratio-card bg-1">
                <div class="ratio-icon">
                    <i class="fas fa-percentage"></i>
                </div>
                <div class="ratio-content">
                    <h4>Rasio Gaji </h4>
                    <p class="ratio-value">{{ 0 }}%</p>
                    <span class="ratio-description">Per Pendapatan</span>
                </div>
            </div>

            <div class="ratio-card bg-2">
                <div class="ratio-icon">
                    <i class="fas fa-chart-line"></i>
                </div>
                <div class="ratio-content">
                    <h4>Rasio Biaya Admin dan operasi</h4>
                    <p class="ratio-value">{{ 0 }}%</p>
                    <span class="ratio-description">Per Pendapatan</span>
                </div>
            </div>

            <div class="ratio-card bg-3">
                <div class="ratio-icon">
                    <i class="fas fa-balance-scale"></i>
                </div>
                <div class="ratio-content">
                    <h4>Rasio Biaya Tetap (Penyusutan )</h4>
                    <p class="ratio-value">{{ 0 }}%</p>
                    <span class="ratio-description">Per Pendapatan</span>
                </div>
            </div>

            <div class="ratio-card bg-4">
                <div class="ratio-icon">
                    <i class="fas fa-trophy"></i>
                </div>
                <div class="ratio-content">
                    <h4>Rasio Biaya Tidak Tetap (Ph.p/stock )</h4>
                    <p class="ratio-value">{{ 0 }}%</p>
                    <span class="ratio-description">Per Pendapatan</span>
                </div>
            </div>

            <div class="ratio-card bg-1">
                <div class="ratio-icon">
                    <i class="fas fa-percentage"></i>
                </div>
                <div class="ratio-content">
                    <h4>Rasio Mark Up </h4>
                    <p class="ratio-value">{{ 0 }}%</p>
                    <span class="ratio-description">Per Jumlah Pendapatan</span>
                </div>
            </div>

            <div class="ratio-card bg-2">
                <div class="ratio-icon">
                    <i class="fas fa-chart-line"></i>
                </div>
                <div class="ratio-content">
                    <h4>Rasio Pendapatan Bunga</h4>
                    <p class="ratio-value">{{ 0 }}%</p>
                    <span class="ratio-description">Per Jumlah Pendapatan</span>
                </div>
            </div>

            <div class="ratio-card bg-3">
                <div class="ratio-icon">
                    <i class="fas fa-balance-scale"></i>
                </div>
                <div class="ratio-content">
                    <h4>Rasio Pendapatan Lainnya</h4>
                    <p class="ratio-value">{{ 0 }}%</p>
                    <span class="ratio-description">Per Jumlah  Pendapatan</span>
                </div>
            </div>

            <div class="ratio-card bg-4">
                <div class="ratio-icon">
                    <i class="fas fa-trophy"></i>
                </div>
                <div class="ratio-content">
                    <h4>Rasio Kn /T Kemacetan</h4>
                    <p class="ratio-value">{{ 0 }}%</p>
                    <span class="ratio-description">Per Pembiayaan</span>
                </div>
            </div>

            <div class="ratio-card bg-1">
                <div class="ratio-icon">
                    <i class="fas fa-percentage"></i>
                </div>
                <div class="ratio-content">
                    <h4>Rasio Mark Up </h4>
                    <p class="ratio-value">{{ 0 }}%</p>
                    <span class="ratio-description">Per Pembiayaan</span>
                </div>
            </div>
            <div class="ratio-card bg-1">
                <div class="ratio-icon">
                    <i class="fas fa-percentage"></i>
                </div>
                <div class="ratio-content">
                    <h4>Rasio Pembiayaan</h4>
                    <p class="ratio-value">{{ 0 }}%</p>
                    <span class="ratio-description">Per Realisasi Pokok</span>
                </div>
            </div>
        </div>
        
    </div>
</template>

<script setup lang="ts">
import { formatCurrency } from '@/stores/globalState';
//   defineProps<{
//     title: string;
//     value: string | number;
//   }>();
</script>
<style scoped>
.metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
}

.metric-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    transition: transform 0.3s ease;
}

.metric-card:hover {
    transform: translateY(-2px);
}

.card-header {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    padding: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.card-header i {
    font-size: 1.25rem;
}

.card-header h3 {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 600;
}

.metric-values {
    padding: 1.5rem;
}

.metric-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 0;
    border-bottom: 1px solid #f1f5f9;
}

.metric-item:last-child {
    border-bottom: none;
}

.metric-item .label {
    color: #64748b;
    font-size: 0.875rem;
}

.metric-item .value {
    font-weight: 600;
    color: #1e293b;
}

.ratio-section {
    margin-bottom: 3rem;
}

.section-header {
    text-align: center;
    margin-bottom: 2rem;
}

.section-header h2 {
    margin: 0 0 0.5rem 0;
    font-size: 1.5rem;
    font-weight: 700;
    color: #1e293b;
}

.section-header p {
    margin: 0;
    color: #64748b;
}

.ratio-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
}

.ratio-card {
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    display: flex;
    align-items: center;
    gap: 1rem;
    transition: transform 0.3s ease;
}

.ratio-card:hover {
    transform: translateY(-2px);
}

.ratio-icon {
    width: 60px;
    height: 60px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    color: white;
}

.bg-1 .ratio-icon {
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
}

.bg-2 .ratio-icon {
    background: linear-gradient(135deg, #10b981, #059669);
}

.bg-3 .ratio-icon {
    background: linear-gradient(135deg, #f59e0b, #d97706);
}

.bg-4 .ratio-icon {
    background: linear-gradient(135deg, #8b5cf6, #7c3aed);
}

.ratio-content h4 {
    margin: 0 0 0.5rem 0;
    font-size: 0.875rem;
    font-weight: 500;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.ratio-value {
    margin: 0 0 0.25rem 0;
    font-size: 1.5rem;
    font-weight: 700;
    color: #1e293b;
}

.ratio-description {
    font-size: 0.75rem;
    color: #94a3b8;
}

</style>