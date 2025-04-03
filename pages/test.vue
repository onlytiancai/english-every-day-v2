<script setup lang="ts">
const { data } = await useFetch('/api/user')

async function handleFormSubmit() {
  const res = await $fetch('/api/submit', {
    method: 'POST',
    body: {
      // My form data
    }
  })
}
</script>

<template>
  Hello {{data}}.
  <div v-if="data == null">
    No data
  </div>
  <div v-else>
    <form @submit="handleFormSubmit">
      <!-- form input tags -->
    </form>
  </div>
</template>