<template>
    <div class="section-content">
        <div class="content-card">
            <ResidualValueReserveForm v-model="cadanganData" />
        </div>
    </div>
</template>
<script setup lang="ts">
import ResidualValueReserveForm from '@/components/residual-value-reserve/ResidualValueReserveForm.vue';
import { useDate } from '@/composables/useDate';
import { ref } from 'vue';

const { getCurrentDate } = useDate()
const currentDate = getCurrentDate()


const cadanganData = ref({
    cadanganPHPiutang: 0,
    macetReal: 0,
    surplusDevisit: 0,
    cadanganPHStok: 0,
    keterangan: '',
    tahun:currentDate.year,
    bulan:currentDate.month
})

</script>
