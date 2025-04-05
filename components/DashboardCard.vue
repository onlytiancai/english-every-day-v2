<template>
  <div class="card h-100">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <h6 class="text-muted mb-0">{{ title }}</h6>
        <component :is="icon" class="text-primary fs-4" />
      </div>
      <h3 class="card-title mb-0">{{ value }}</h3>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  value: number;
  icon: string;
}>();
</script>
