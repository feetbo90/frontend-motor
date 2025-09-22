<template>
  <div class="section-content">
    <div class="content-card">
      <div class="dashboard-cards">
        <DashboardCard title="Total Penjualan" :value="dashboardData.totalPenjualan" label="Total penjualan periode ini"
          icon="fas fa-chart-line" type="primary" />
        <DashboardCard title="Total Beban" :value="dashboardData.totalBeban" label="Total beban periode ini"
          icon="fas fa-credit-card" type="danger" />
        <DashboardCard title="Laba/Rugi" :value="dashboardData.labaRugi" label="Laba bersih periode ini"
          icon="fas fa-chart-pie" type="success" />
        <DashboardCard title="Total Karyawan" :value="dashboardData.totalKaryawan" label="Jumlah karyawan aktif"
          icon="fas fa-users" type="info" />
        <DashboardCard title="Total Piutang" :value="dashboardData.totalPiutang" label="Outstanding piutang"
          icon="fas fa-wallet" type="warning" />
      </div>

      <div class="dashboard-charts">
        <div class="chart-container">
          <h3>Grafik Penjualan vs Beban</h3>
          <Bar :data="barChartData" :options="chartOptions" />
        </div>

        <div class="chart-container">
          <h3>Distribusi Keuangan</h3>
          <Pie :data="pieChartData" :options="pieChartOptions" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { dashboardData } from '@/stores/globalState'
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip
} from 'chart.js'
import { computed } from 'vue'
import { Bar, Pie } from 'vue-chartjs'
import DashboardCard from '../components/DashboardCard.vue'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

const barChartData = computed(() => ({
  labels: ['Penjualan', 'Beban', 'Laba'],
  datasets: [
    {
      label: 'Amount (IDR)',
      data: [
        dashboardData.value.totalPenjualan,
        dashboardData.value.totalBeban,
        dashboardData.value.labaRugi
      ],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(16, 185, 129, 0.8)'
      ],
      borderColor: [
        'rgb(59, 130, 246)',
        'rgb(239, 68, 68)',
        'rgb(16, 185, 129)'
      ],
      borderWidth: 2,
      borderRadius: 8
    }
  ]
}))

const pieChartData = computed(() => ({
  labels: ['Penjualan', 'Beban', 'Piutang'],
  datasets: [
    {
      data: [
        dashboardData.value.totalPenjualan,
        dashboardData.value.totalBeban,
        dashboardData.value.totalPiutang
      ],
      backgroundColor: [
        '#3B82F6',
        '#EF4444',
        '#F59E0B'
      ],
      borderWidth: 0
    }
  ]
}))

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        callback: function (value: any) {
          return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
          }).format(value)
        }
      }
    }
  }
}

const pieChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom' as const,
    }
  }
}
</script>

<style scoped>
.dashboard-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.dashboard-charts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.chart-container {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.chart-container h3 {
  margin: 0 0 1.5rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  text-align: center;
}

@media (max-width: 768px) {
  .dashboard-charts {
    grid-template-columns: 1fr;
  }
}
</style>