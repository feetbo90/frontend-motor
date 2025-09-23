<template>
    <div class="section-content">
        <div class="content-card">
            <ProfitLostForm v-model="labaRugiData" />
        </div>
    </div>
</template>
<script setup lang="ts">
import ProfitLostForm from '@/components/profit-lost/ProfitLostForm.vue'
import { useDate } from '@/composables/useDate'
import { ref } from 'vue'
const { getCurrentDate } = useDate()
const currentDate = getCurrentDate()

const labaRugiData = ref({
    labaRugiBulan: 0,
    labaRugiKumulatif: 0,
    penarikanLaba: 0,
    jumlahModal: 0,
    tahun:currentDate.tahun,
    bulan:currentDate.bulan
})

</script>
