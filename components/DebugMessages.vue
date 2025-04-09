<template>
  <div v-if="messages.length" class="card mt-4">
    <div class="card-header bg-light d-flex justify-content-between align-items-center">
      <h5 class="card-title mb-0">Debug Information</h5>
      <button @click="$emit('clear')" class="btn btn-outline-secondary btn-sm">
        <DeleteOutlined /> 清空日志
      </button>
    </div>
    <div class="card-body text-start">
      <ul class="list-unstyled mb-0">
        <li v-for="(message, index) in messages" :key="index" class="mb-1 font-monospace">
          {{ message }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  messages: string[]
}>();
defineEmits<{
  (e: 'clear'): void
}>();
</script>
