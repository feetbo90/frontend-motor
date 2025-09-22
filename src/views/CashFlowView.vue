<template>
    <div class="section-content">
        <div class="content-card">
            <CashFlowForm v-model="cashFlowData" />
        </div>
    </div>
</template>
<script setup lang="ts">
import CashFlowForm from '@/components/cash-flow/CashFlowForm.vue';
import { ref } from 'vue';

const cashFlowData = ref({
    kasTunai: 0,
    rekeningBank: 0,
    bonKaryawan: 0,
    binPusat: 0,
    bonBiayaOps: 0,
    bonGantung: 0
})
</script>
