<template>
    <div class="section-content">
        <div class="content-card">
            <CashFlowForm v-model="cashFlowData" />
        </div>
    </div>
</template>
<script setup lang="ts">
import CashFlowForm from '@/components/cash-flow/CashFlowForm.vue';
import { useDate } from '@/composables/useDate';
import { ref } from 'vue';

const { getCurrentDate } = useDate()
const currentDate = getCurrentDate()

const cashFlowData = ref({
    kasTunai: 0,
    rekeningBank: 0,
    bonKaryawan: 0,
    bonPusat: 0,
    bonBiayaOps: 0,
    bonGantung: 0,
    jlh_kas_lancar:0,
    jlh_kas_macet:0,
    total_saldo_akhir:0,
    tahun:currentDate.tahun,
    bulan:currentDate.bulan
})
</script>
