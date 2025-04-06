<script setup lang="ts">
definePageMeta({
  ssr: false,
})
const debugMessages = ref<string[]>([]);

function logDebug(message: string) {
  const timestamp = new Date().toLocaleTimeString();
  const logMessage = `[${timestamp}] ${message}`;
  console.log(logMessage);
  debugMessages.value.push(logMessage);
}

logDebug('init ...');

onMounted(async () => {
  logDebug('onMounted...');
})
</script>

<template>
  <div>
    <ul class="list-unstyled mb-0">
      <li v-for="(message, index) in debugMessages" :key="index" class="mb-1 font-monospace">
        {{ message }}
      </li>
    </ul>
  </div>
</template>