<template>
    <div class="section-content">
        <div class="content-card">
        <LoadCompnentForm v-model="bebanData" />
        </div>
    </div>
</template>
<script setup lang="ts">
import LoadCompnentForm from '@/components/load-components/LoadComponentForm.vue';
import { bebanData } from '@/stores/globalState';

</script>
<style scoped></style>