<script setup lang="ts">
const errorMessage = ref('111');
onMounted(async () => {  errorMessage.value = '222'})
</script>
<template>
<div> {{ errorMessage }} </div>
</template>