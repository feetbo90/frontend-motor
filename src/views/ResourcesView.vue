<template>
    <div class="section-content">
        <div class="content-card">
            <ResourcesForm v-model="sumberDayaData" />
        </div>
    </div>
</template>
<script setup lang="ts">
import ResourcesForm from '@/components/resources-component/ResourcesForm.vue';
import { useDate } from '@/composables/useDate';
import { ref } from 'vue';

const { getCurrentDate } = useDate()
const currentDate = getCurrentDate()

const sumberDayaData = ref({
    jumlahKaryawan: 0,
    formasi: {
        pimpinan: 0,
        kasir: 0,
        administrasi: 0,
        pdl: 0,
        formasiKurang: 0,
    },
    sisaKontrakKantor: 0,
    inventarisMobil: 0,
    nilaiSisaInventaris: 0,
    penyusutanPerBulan: 0,
    tahun:currentDate.year,
    bulan:currentDate.month

})
</script>
