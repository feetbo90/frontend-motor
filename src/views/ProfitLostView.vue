<template>
    <div class="section-content">
        <div class="content-card">
            <ProfitLostForm v-model="labaRugiData" />
        </div>
    </div>
</template>
<script setup lang="ts">
import ProfitLostForm from '@/components/profit-lost/ProfitLostForm.vue'
import { ref } from 'vue'

const labaRugiData = ref({
    labaRugiBulan: 0,
    labaRugiKumulatif: 0,
    penarikanLaba: 0,
    jumlahModal: 0
})

</script>
